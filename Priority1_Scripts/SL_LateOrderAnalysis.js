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
			var location = params.custpage_location;
			var reasoncode = params.custpage_reasoncode;
			var department = params.custpage_department;

			log.debug('reasoncode', reasoncode)
			
			var searchResults = search.load({
				id: 'customsearch2180'
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

			if (location) {
				searchResults.filters.push(search.createFilter({
					name: 'location',
					operator: 'anyof',
					values: [location]
				}));
			}

			if (department) {
				searchResults.filters.push(search.createFilter({
					name: 'department',
					operator: 'anyof',
					values: [department]
				}));
			}

			if (reasoncode) {
				searchResults.filters.push(search.createFilter({
					name: 'custcol_reasoncode_line',
					operator: 'anyof',
					values: [reasoncode]
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
						id: result.id,
						docnum: result.getValue(columns[0]) ? result.getValue(columns[0]) : ' ',
						lineid: result.getValue(columns[1]) ? result.getValue(columns[1]) : ' ',
						trandate: result.getValue(columns[2]) ? result.getValue(columns[2]) : ' ',
						item: result.getValue(columns[3]) ? result.getValue(columns[3]) : ' ',
						itemdes: result.getValue(columns[4]) ? result.getValue(columns[4]) : ' ',
						latedays: result.getValue(columns[5]) ? result.getValue(columns[5]) : ' ',
						commitdate: result.getValue(columns[6]) ? result.getValue(columns[6]) : ' ',
						shipdate: result.getValue(columns[7]) ? result.getValue(columns[7]) : ' ',
						latebucket: result.getValue(columns[8]) ? result.getText(columns[8]) : ' ',
						location: result.getValue(columns[9]) ? result.getText(columns[9]) : ' ',
						reasoncode: result.getValue(columns[10]) ? result.getText(columns[10]) : ' ',
						department: result.getValue(columns[11]) ? result.getText(columns[11]) : ' '
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
				id: 'custpage_docnum', 
				type: 'text', 
				label: 'Document Number'
			});
			sublistResult.addField({
				id: 'custpage_trandate', 
				type: 'text', 
				label: 'Date'
			});
			sublistResult.addField({
				id: 'custpage_item', 
				type: 'text', 
				label: 'Item'
			});
			sublistResult.addField({
				id: 'custpage_latedays', 
				type: 'text', 
				label: 'Late Days'
			});
			sublistResult.addField({
				id: 'custpage_latebucket', 
				type: 'text', 
				label: 'Late Days Bucket'
			});
			sublistResult.addField({
				id: 'custpage_location', 
				type: 'text', 
				label: 'Location'
			});
			sublistResult.addField({
				id: 'custpage_reasoncode', 
				type: 'text', 
				label: 'Reason Code'
			});
			sublistResult.addField({
				id: 'custpage_department', 
				type: 'text', 
				label: 'Department'
			});

			for (var line = 0; line < results.length; line++) {
				sublistResult.setSublistValue({
					id: 'custpage_trandate', 
					line: line, 
					value: results[line].trandate
				});
				sublistResult.setSublistValue({
					id: 'custpage_docnum', 
					line: line, 
					value: results[line].docnum
				});
				sublistResult.setSublistValue({
					id: 'custpage_item', 
					line: line, 
					value: results[line].item + ' ' + results[line].itemdes
				});
				sublistResult.setSublistValue({
					id: 'custpage_latedays', 
					line: line, 
					value: results[line].latedays
				});
				sublistResult.setSublistValue({
					id: 'custpage_latebucket', 
					line: line, 
					source: "customlist_late_days_buckets",
          			label: "Late Days Bucket", 
					value: results[line].latebucket
				});
				sublistResult.setSublistValue({
					id: 'custpage_location', 
					line: line, 
					source: "location",
          			label: "Location", 
					value: results[line].location
				});
				sublistResult.setSublistValue({
					id: 'custpage_reasoncode', 
					line: line, 
					source: "customrecord_reason_code",
          			label: "Reason Code", 
					value: results[line].reasoncode
				});
				sublistResult.setSublistValue({
					id: 'custpage_department', 
					line: line, 
					source: "department",
          			label: "Department",
					value: results[line].department
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
					var location = form.addField({
						id: 'custpage_location',
						type: ui.FieldType.SELECT,
						label: 'location',
						source: 'Location',
						container: 'custpage_formdata'
					});
					var department = form.addField({
						id: 'custpage_department',
						type: ui.FieldType.SELECT,
						source: 'department',
						label: 'Department',
						container: 'custpage_formdata'
					});
					var to = form.addField({
						id: 'custpage_to',
						type: ui.FieldType.DATE,
						label: 'Date To',
						container: 'custpage_formdata'
					});
					var reasonCode = form.addField({
						id: 'custpage_reasoncode',
						type: ui.FieldType.SELECT,
						source: 'customrecord_reason_code',
						label: 'Reason Code',
						container: 'custpage_formdata'
					});
					context.response.writePage(form);
				}
				if (context.request.method === "POST") {
					var params = context.request.parameters;
					var form = ui.createForm({
						title: 'Late Orders Analysis'
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

					var location = form.addField({
						id: 'custpage_location',
						type: ui.FieldType.SELECT,
						label: 'Location',
						source: 'location',
						container: 'custpage_formdata'
					});
					location.defaultValue = params.custpage_location;

					var department = form.addField({
						id: 'custpage_department',
						type: ui.FieldType.SELECT,
						label: 'Department',
						source: 'department',
						container: 'custpage_formdata'
					});
					department.defaultValue = params.custpage_department;

					var to = form.addField({
						id: 'custpage_to',
						type: ui.FieldType.DATE,
						label: 'Date To',
						container: 'custpage_formdata'
					});
					to.defaultValue = params.custpage_to;

					var reasonCode = form.addField({
						id: 'custpage_reasoncode',
						type: ui.FieldType.SELECT,
						label: 'Reason Code',
						source: 'customrecord_reason_code',
						container: 'custpage_formdata'
					});
					reasonCode.defaultValue = params.custpage_reasoncode;
					
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