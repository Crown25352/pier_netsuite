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
		const BAL_LOC = 1, EASTLOC = 14, ICE_TYPE = 3;
		var Helper = {};
		Helper.showList = function(context, params, form) {
			var from = params.custpage_from;
			var to = params.custpage_to;

			// var searchResults = search.create({
			// 	type: 'itemfulfillment',
			// 	filters: [
			// 		['location', 'anyof', [BAL_LOC, EASTLOC]],
			// 		'and', ['account', 'is', 212],
			// 		'and', ['mainline', 'is', false]
			// 	],
			// 	columns: ['trandate', 'entity', 'item', 'location', 'custcol_item_ship_type', search.createColumn({
			// 		name: 'tranid',
			// 		sort: search.Sort.ASC
			// 	})]
			// });
			var searchResults = search.load({
				id: 'customsearch2975'
			})

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

			var results = [], prior = '', priorDate, priorEntity, priorItem, priorLoc, iceFlag = true;
			var pagedData = searchResults.runPaged({pageSize : 1000});
			for (var i = 0; i < pagedData.pageRanges.length; i++) {
				var currentPage = pagedData.fetch(i);
		
				// and forEach() thru all results
				for (var j = 0; j < currentPage.data.length; j++) {
				// currentPage.data.forEach( function(result) {
					var result = currentPage.data[j];
					var columns = result.columns;

					var tranid = result.getValue('tranid');
					if (tranid == prior && !iceFlag) continue; 
					if (result.getValue(columns[6]) > 1000) break;

					results.push({
						trandate: result.getValue(columns[0]),
						tranid: result.getValue(columns[1]),
						entity: result.getValue(columns[2]),
						item: result.getValue(columns[3]),
						location: result.getValue(columns[5])
					})
					/*
					var trandate = result.getValue('trandate');
					var entity = result.getText('entity');
					var item = result.getText('item');
					var location = result.getText('location');
					var shipType = result.getValue('custcol_item_ship_type');
					log.debug('item', item);

					if (prior != tranid) {
						if (iceFlag && prior) {
							results.push({
								trandate: priorDate,
								tranid: prior,
								entity: priorEntity,
								item: priorItem,
								location: priorLoc
							});
						}

						prior = tranid;
						priorDate = trandate;
						priorEntity = entity;
						priorItem = item;
						priorLoc = location;
						iceFlag = true;
					}

					if (shipType != ICE_TYPE) {
						iceFlag = false;
					} */
				// });
				}
		
			}

			/*
			if (iceFlag) {
				results.push({
					trandate: priorDate,
					tranid: prior,
					entity: priorEntity,
					item: priorItem,
					location: priorLoc
				});
			} */

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
				id: 'custpage_trandate', 
				type: 'text', 
				label: 'Date Created'
			});
			sublistResult.addField({
				id: 'custpage_tranid', 
				type: 'text', 
				label: 'Document Number'
			});
			sublistResult.addField({
				id: 'custpage_entity', 
				type: 'text', 
				label: 'Name'
			});
			sublistResult.addField({
				id: 'custpage_item', 
				type: 'text', 
				label: 'Item'
			});
			sublistResult.addField({
				id: 'custpage_location', 
				type: 'text', 
				label: 'Location'
			});

			for (var line = 0; line < results.length; line++) {
				sublistResult.setSublistValue({
					id: 'custpage_trandate', 
					line: line, 
					value: results[line].trandate
				});
				sublistResult.setSublistValue({
					id: 'custpage_tranid', 
					line: line, 
					value: results[line].tranid
				});
				sublistResult.setSublistValue({
					id: 'custpage_entity', 
					line: line, 
					value: results[line].entity
				});
				sublistResult.setSublistValue({
					id: 'custpage_item', 
					line: line, 
					value: results[line].item
				});
				sublistResult.setSublistValue({
					id: 'custpage_location', 
					line: line, 
					value: results[line].location
				});
			}

			context.response.writePage({pageObject: form});
		}

    	function onRequest(context) {
			try {
				if (context.request.method === "GET") {
					var form = ui.createForm({
						title: 'Late Orders Analysis'
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

					context.response.writePage(form);
				}
				if (context.request.method === "POST") {
					var params = context.request.parameters;
					var form = ui.createForm({
						title: 'Predict Shipments'
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

					Helper.showList(context, params, form);
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