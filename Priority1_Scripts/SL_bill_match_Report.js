/**
* Copyright (c) 1998-2020 NetSuite, Inc.
* 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
* All Rights Reserved
*
* This software is the confidential and proprietary information of NetSuite, Inc. ("Confidential Information").
* You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license
* you entered into with NetSuite
*
* @NApiVersion 2.x
* @NScriptType Suitelet
* @NModuleScope public
* Script Description: Multiple page Script that allows the user to select restricted domains and scripts and generate and store encrypted
* credentials to integration services in a custom record.
*
*/

define(['N/file', 'N/render', 'N/record', 'N/runtime', 'N/ui/serverWidget', 'N/search'],
  	function(file, render, record, runtime, ui, search) {
		var Helper = {};
		Helper.showList = function(context, params, form) {
			var from = params.custpage_from;
			var to = params.custpage_to;
			var vendor = params.custpage_vendor;
			log.debug('param', params);
			log.debug('form', form);

			var searchResults = search.load({
				id: 'customsearch2047'
			});

			if (from) {
				searchResults.filters.push(search.createFilter({
					name: 'trandate',
					operator: search.Operator.ONORAFTER,
					values: [from]
				}));
			}

			if (to) {
				searchResults.filters.push(search.createFilter({
					name: 'trandate',
					operator: search.Operator.ONORBEFORE,
					values: [to]
				}));
			}

			if (vendor) {
				searchResults.filters.push(search.createFilter({
					name: 'entity',
					operator: search.Operator.IS,
					values: [vendor]
				}));
			}

			var resultSet = searchResults.run();
			var currentRange = resultSet.getRange({
				start : 0,
				end : 1000
			});
			
			var i = 0;  // iterator for all search results
			var j = 0;  // iterator for current result range 0..999
			var results = [], priorLineId = 0, lineId = '', vendor = '', priorVendor = '', po_number = '',priorPOnum = '', item = '', priorItem = '', receipt_qty = '', priorReceiptQty = '', billed_qty = '',priorBilledQty = '', variance_qty = '', priorVarianceQty = '', unbilled_qty = '',priorUnbilledQty = '', overbilled_qty = '',priorOverBilledQty = '', bill_numbers = '', receipt_numbers = ''; 
			log.debug('result count', currentRange.length);
			while (j < currentRange.length) {
				var result = currentRange[j];
				var columns = result.columns;
				
				lineId = result.getValue(columns[2])
				vendor = result.getValue(columns[0]) ? result.getValue(columns[0]) : '- None -';
				po_number = result.getValue(columns[1]) ? result.getValue(columns[1]) : '- None -';
				item = result.getText(columns[3]) ? result.getText(columns[3]) : '- None -';
				receipt_qty = result.getValue(columns[4]) || '0';
				billed_qty = result.getValue(columns[5]) || '0';
				variance_qty = String (receipt_qty - billed_qty);
				unbilled_qty = (variance_qty > 0) ? variance_qty : '0';
				overbilled_qty = (variance_qty < 0) ? String (variance_qty * -1) : '0';
				var bills = result.getValue(columns[6]) ? result.getValue(columns[6]) : '';
				var bill_type = result.getValue(columns[7]);

				if (item != '') {
					if (lineId != priorLineId) {
						if (priorLineId != '') {
							results.push({
								custpage_vendor: priorVendor,
								custpage_po_number: priorPOnum,
								custpage_item: priorItem,
								custpage_receipt_qty: priorReceiptQty,
								custpage_billed_qty: priorBilledQty,
								custpage_variance_qty: priorVarianceQty,
								custpage_unbilled_qty: priorUnbilledQty,
								custpage_overbilled_qty: priorOverBilledQty,
								custpage_bill_numbers: bill_numbers ? bill_numbers.slice(0, -2) : '- NONE -',
								custpage_receipt_numbers: receipt_numbers ? receipt_numbers.slice(0, -2) : '- NONE -'
							});
						}
						priorLineId = lineId;

						priorVendor = vendor;
						priorPOnum = po_number;
						priorItem = item;
						priorReceiptQty = receipt_qty;
						priorBilledQty = billed_qty;
						priorVarianceQty = variance_qty;
						priorUnbilledQty = unbilled_qty;
						priorOverBilledQty = overbilled_qty;
						bill_numbers = '';
						receipt_numbers = '';
					}

					if (bills != '' && bill_type == 'ItemRcpt') {
						receipt_numbers += bills + ', ';
					}

					if (bills != '' && bill_type == 'VendBill') {
						bill_numbers += bills + ', ';
					}
				}
				

				i++; j++;
				if (j == 1000) {   // check if it reaches 1000
					j = 0;          // reset j an reload the next portion
					currentRange = resultSet.getRange({
						start : i,
						end : i + 1000
					});
				}
			}
			log.debug('result', results[0])
			log.debug('result1', results[1])
			// results.push({
			// 	custpage_shipments: cnt,
			// 	custpage_qty: itemCnt,
			// });
			
			var tabResult = form.addTab('custpage_result_tab', 'Result');

			var sublistResult = form.addSublist({
				id: 'custpage_result_list', 
				label: 'Results', 
				tab: 'custpage_result_tab', 
				type: 'list'
			});

			sublistResult.addField({
				id: 'custpage_vendor', 
				type: 'text', 
				label: 'Vendor'
			});

			sublistResult.addField({
				id: 'custpage_po_number', 
				type: 'text', 
				label: 'PO #'
			});

			sublistResult.addField({
				id: 'custpage_item', 
				type: 'text', 
				label: 'ITEM'
			});

			sublistResult.addField({
				id: 'custpage_receipt_qty', 
				type: 'FLOAT', 
				label: 'Receipt Qty'
			});

			sublistResult.addField({
				id: 'custpage_billed_qty', 
				type: 'FLOAT', 
				label: 'Billed Qty'
			});

			sublistResult.addField({
				id: 'custpage_variance_qty', 
				type: 'FLOAT', 
				label: 'Variance Qty(R-B)'
			});

			sublistResult.addField({
				id: 'custpage_unbilled_qty', 
				type: 'FLOAT', 
				label: 'Unbilled Qty'
			});

			sublistResult.addField({
				id: 'custpage_overbilled_qty', 
				type: 'FLOAT', 
				label: 'Overbilled Qty'
			});

			sublistResult.addField({
				id: 'custpage_bill_numbers', 
				type: 'text', 
				label: 'Bill Numbers'
			});

			sublistResult.addField({
				id: 'custpage_receipt_numbers', 
				type: 'text', 
				label: 'Receipt Numbers'
			});

			var line = 0;
			for(var i = 0; i < results.length; i++) {
				result = results[i];
				sublistResult.setSublistValue({
					id: 'custpage_vendor', 
					line: i, 
					value: result.custpage_vendor
				});

				sublistResult.setSublistValue({
					id: 'custpage_po_number', 
					line: i, 
					value: result.custpage_po_number
				});

				sublistResult.setSublistValue({
					id: 'custpage_item', 
					line: i, 
					value: result.custpage_item
				});

				sublistResult.setSublistValue({
					id: 'custpage_receipt_qty', 
					line: i, 
					value: result.custpage_receipt_qty
				});

				sublistResult.setSublistValue({
					id: 'custpage_billed_qty', 
					line: i, 
					value: result.custpage_billed_qty
				});

				sublistResult.setSublistValue({
					id: 'custpage_variance_qty', 
					line: i, 
					value: result.custpage_variance_qty
				});

				sublistResult.setSublistValue({
					id: 'custpage_unbilled_qty', 
					line: i, 
					value: result.custpage_unbilled_qty
				});

				sublistResult.setSublistValue({
					id: 'custpage_overbilled_qty', 
					line: i, 
					value: result.custpage_overbilled_qty
				});

				sublistResult.setSublistValue({
					id: 'custpage_bill_numbers', 
					line: i, 
					value: result.custpage_bill_numbers
				});

				sublistResult.setSublistValue({
					id: 'custpage_receipt_numbers', 
					line: i, 
					value: result.custpage_receipt_numbers
				});
			}
			
			context.response.writePage({pageObject: form});
		}

    	function onRequest(context) {
			try {
				if (context.request.method === "GET") {
					var form = ui.createForm({
						title: 'Match Bill ↔ Receipt'
					});
					form.addSubmitButton({label: 'Submit'});
					var fieldgroup = form.addFieldGroup({
						id : 'custpage_formdata',
						label : 'Criterias'
					});
					var from = form.addField({
						id: 'custpage_from',
						type: ui.FieldType.DATE,
						label: 'Date From',
						container: 'custpage_formdata'
					});
					var to = form.addField({
						id: 'custpage_to',
						type: ui.FieldType.DATE,
						label: 'Date To',
						container: 'custpage_formdata'
					});
					var vendor = form.addField({
						id: 'custpage_vendor',
						type: ui.FieldType.SELECT,
						label: 'Vendor',
						source: 'vendor',
						container: 'custpage_formdata'
					}); 

					context.response.writePage(form);
				}
				if (context.request.method === "POST") {
					var params = context.request.parameters;
					var form = ui.createForm({
						title: 'Match Bill ↔ Receipt'
					});
					form.addSubmitButton({label: 'Submit'});
					var fieldgroup = form.addFieldGroup({
						id : 'custpage_formdata',
						label : 'Form Data'
					});
					
					var from = form.addField({
						id: 'custpage_from',
						type: ui.FieldType.DATE,
						label: 'Date From',
						container: 'custpage_formdata'
					});
					from.defaultValue = params.custpage_from;

					var to = form.addField({
						id: 'custpage_to',
						type: ui.FieldType.DATE,
						label: 'Date To',
						container: 'custpage_formdata'
					});
					to.defaultValue = params.custpage_to;
					
					var vendor = form.addField({
						id: 'custpage_vendor',
						type: ui.FieldType.SELECT,
						label: 'Vendor',
						source: 'vendor',
						container: 'custpage_formdata'
					}); 
					vendor.defaultValue = params.custpage_vendor;

					Helper.showList(context, params, form);

					// context.response.writePage({pageObject: form});
				}
				
			} catch(e) {
				log.error("Error", e);
			}
    	}
    	return {
      		onRequest: onRequest
    	};
  	}
);