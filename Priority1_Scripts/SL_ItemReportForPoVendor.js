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
		Helper.showList = function(context, form) {
			var searchResults = search.load({
				id: 'customsearch2056'
			})

			var results = {}, tmp = [];
			var pagedData = searchResults.runPaged({pageSize : 1000});
			for (var i = 0; i < pagedData.pageRanges.length; i++) {
				var currentPage = pagedData.fetch(i);
				// and forEach() thru all results
				for (var j = 0; j < currentPage.data.length; j++) {
				// currentPage.data.forEach( function(result) {
					var result = currentPage.data[j];
					var columns = result.columns;

					var itemNumber = result.getValue(columns[0]);
					var itemDes = result.getValue(columns[1]);
					var itemType = result.getValue(columns[2]);
					var onHandQty = result.getValue(columns[3]);
					var onSoQty = result.getValue(columns[4]);
					var onPoQty = result.getValue(columns[5]);
					var docNumber = result.getValue(columns[6]);
					var amount = result.getValue(columns[7]);
					var date = result.getValue(columns[8]);
					var type = result.getValue(columns[9]);
					var vendor = result.getValue(columns[10]);
					var sales3mo = result.getValue(columns[11]);
					var salesLastmo = result.getValue(columns[12]);
					var mtd = result.getValue(columns[13]);
					var avg3 = result.getValue(columns[14]);
					var avg12 = result.getValue(columns[15]);

					if (!results[itemNumber]) {
						results[itemNumber] = {
							itemNumber: itemNumber,
							onHandQty: 0,
							onSoQty: 0,
							onPoQty: 0,
							sales3mo: 0,
							salesLastmo: 0,
							mtd: 0,
							avg3: 0,
							avgCost: 0,
							lastVendor: '',
							lastPo: '',
							avg12: 0
						}
					}
					
					
					if (type == 'SalesOrd') {
						results[itemNumber].onHandQty = onHandQty;
						results[itemNumber].onSoQty = onSoQty;
						results[itemNumber].onPoQty = onPoQty;
						results[itemNumber].sales3mo = sales3mo;
						results[itemNumber].salesLastmo = salesLastmo;
						results[itemNumber].mtd = mtd;
						results[itemNumber].avg3 = avg3;
						results[itemNumber].avgCost = 0;
						results[itemNumber].avg12 = avg12;
					} else {
						results[itemNumber].lastVendor = vendor;
						results[itemNumber].lastPo = docNumber;
					}
				}
			}

			var tabResult = form.addTab('custpage_result_tab', 'Result');

			var sublistResult = form.addSublist({
				id: 'custpage_result_list', 
				label: 'Results', 
				tab: 'custpage_result_tab', 
				type: 'list'
			});

			sublistResult.addButton({
				id: 'custpage_export_csv', 
				label: 'Export CSV', 
				functionName: 'exportCSV()'
			});

			sublistResult.addField({
				id: 'custpage_item', 
				type: 'text', 
				label: 'Item #'
			});

			sublistResult.addField({
				id: 'custpage_on_hand_qty', 
				type: 'text', 
				label: 'On Hand Qty'
			});

			sublistResult.addField({
				id: 'custpage_on_so_qty', 
				type: 'text', 
				label: 'On SO'
			});

			sublistResult.addField({
				id: 'custpage_on_po_qty', 
				type: 'text', 
				label: 'On PO'
			});

			sublistResult.addField({
				id: 'custpage_sales_3_mo', 
				type: 'text', 
				label: 'Sales 3 Mo Ago'
			});
			sublistResult.addField({
				id: 'custpage_sales_last_mo', 
				type: 'text', 
				label: 'Sales Last Month'
			});
			sublistResult.addField({
				id: 'custpage_sales_this_mo', 
				type: 'text', 
				label: 'MTD'
			});
			sublistResult.addField({
				id: 'custpage_3_avg', 
				type: 'text', 
				label: '3 MO AVG'
			});

			sublistResult.addField({
				id: 'custpage_avg_cost', 
				type: 'text', 
				label: 'Avg Cost'
			});

			sublistResult.addField({
				id: 'custpage_last_vendor', 
				type: 'text', 
				label: 'Last Vendor'
			});

			sublistResult.addField({
				id: 'custpage_last_po', 
				type: 'text', 
				label: 'Last PO#'
			});

			sublistResult.addField({
				id: 'custpage_12_avg', 
				type: 'text', 
				label: '12 Month Average'
			});

			var map = [];
			for (var key in results) {
				if (results.hasOwnProperty(key)) {
					map.push(results[key]);
				}
			}

			for (var line = 0; line < map.length; line++) {
				sublistResult.setSublistValue({
					id: 'custpage_item', 
					line: line, 
					value: map[line].itemNumber || ''
				});

				sublistResult.setSublistValue({
					id: 'custpage_on_hand_qty', 
					line: line, 
					value: map[line].onHandQty || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_on_so_qty', 
					line: line, 
					value: map[line].onSoQty || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_on_po_qty', 
					line: line, 
					value: map[line].onPoQty || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_sales_3_mo', 
					line: line, 
					value: map[line].sales3mo || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_sales_last_mo', 
					line: line, 
					value: map[line].salesLastmo || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_sales_this_mo', 
					line: line, 
					value: map[line].mtd || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_3_avg', 
					line: line, 
					value: map[line].avg3 || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_avg_cost', 
					line: line, 
					value: map[line].avgCost || '0'
				});

				sublistResult.setSublistValue({
					id: 'custpage_last_vendor', 
					line: line, 
					value: map[line].lastVendor || '-'
				});

				sublistResult.setSublistValue({
					id: 'custpage_last_po', 
					line: line, 
					value: map[line].lastPo || '-'
				});

				sublistResult.setSublistValue({
					id: 'custpage_12_avg', 
					line: line, 
					value: map[line].avg12 || '0'
				});
			}

			context.response.writePage({pageObject: form});
		}

    	function onRequest(context) {
			try {
				if (context.request.method === "GET") {
					var form = ui.createForm({
						title: 'Item Report For PO Vendor'
					});

					form.clientScriptModulePath = './CS_item_report.js';
					Helper.showList(context, form);
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