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
		Helper.showResult = function(context, params, form) {
			var from = params.custpage_from;
			var to = params.custpage_to;
			var location = params.custpage_location;
			var reasoncode = params.custpage_reasoncode;
			var department = params.custpage_department;

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
					name: 'custcol_custcol_reasoncode_line',
					operator: 'anyof',
					values: [reasoncode]
				}));
			}

			var results = [], prior = '', priorDate, priorEntity, priorItem, priorLoc, iceFlag = true;
			var pagedData = searchResults.runPaged({pageSize : 1000});
			for (var i = 0; i < pagedData.pageRanges.length; i++) {
				var currentPage = pagedData.fetch(i);
		
				for (var j = 0; j < currentPage.data.length; j++) {
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
						reasondes: result.getValue(columns[11]) ? result.getValue(columns[11]) : ' ',
						department: result.getValue(columns[12]) ? result.getText(columns[12]) : ' '
					})
					
				}
		
			}

			var htmlField = form.addField({
				id: 'custpage_html',
				type: ui.FieldType.INLINEHTML,
				label: 'HTML Field'
			});

			htmlField.defaultValue = '<h3 style="color: red;">On Time Percentage: 80%</h3>';

			form.addTab({
				id: 'custpage_tab_1',
				label: 'Tab 1'
			});
			
			var summary1 = form.addField({
				id: 'custpage_tab1',
				type: ui.FieldType.INLINEHTML,
				label: 'This label will not show',
				container: 'custpage_tab_1'
			});

			var content = [['Reabon', 'Matl Fix', 'Suble'], ['30%', '20%', '15%']];
			var opts = {
				firstRowHeader: true
			};
			summary1.defaultValue = createTable(content, opts);

			form.addTab({
				id: 'custpage_tab_2',
				label: 'Tab 2'
			});
			
			var summary2 = form.addField({
				id: 'custpage_tab2',
				type: ui.FieldType.INLINEHTML,
				label: 'This label will not show',
				container: 'custpage_tab_2'
			});

			var content = [['Reabon', 'Matl Fix', 'Suble'], ['30%', '20%', '15%']];
			var opts = {
				firstRowHeader: true
			};
			summary2.defaultValue = createTable(content, opts);

			// form.addFieldGroup({
			// 	id: 'fieldgroup_summary',
			// 	label: 'Summary'
			// })
			
			// var summary = form.addField({
			// 	id: 'custpage_not_in_tab_inlinehtml',
			// 	type: ui.FieldType.INLINEHTML,
			// 	label: 'This label will not show',
			// 	container: 'fieldgroup_summary'
			// });
			
			
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
				label: 'SO Number'
			});

			sublistResult.addField({
				id: 'custpage_item', 
				type: 'text', 
				label: 'Item'
			});

			sublistResult.addField({
				id: 'custpage_trandate', 
				type: 'text', 
				label: 'TranDate'
			});

			sublistResult.addField({
				id: 'custpage_commitdate', 
				type: 'text', 
				label: 'Commit Date'
			});
			
			sublistResult.addField({
				id: 'custpage_shipdate', 
				type: 'text', 
				label: 'Actual Ship Date'
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
				id: 'custpage_reasondes', 
				type: 'text', 
				label: 'Reason Description'
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
					id: 'custpage_commitdate', 
					line: line, 
					value: results[line].commitdate
				});
				sublistResult.setSublistValue({
					id: 'custpage_shipdate', 
					line: line, 
					value: results[line].shipdate
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
					id: 'custpage_reasondes', 
					line: line, 
          			label: "Reason Description", 
					value: results[line].reasondes
				});
				sublistResult.setSublistValue({
					id: 'custpage_department', 
					line: line, 
					source: "department",
          			label: "Department",
					value: results[line].department
				});
			}

			// var sublistSummary = form.addSublist({
			// 	id: 'custpage_summary_list', 
			// 	label: 'Summary', 
			// 	tab: 'custpage_summary_tab', 
			// 	type: 'list'
			// });
			
		}

    	function onRequest(context) {
			try {
				var form = ui.createForm({
					title: 'Late Orders Analysis'
				});

				form.addSubmitButton({label: 'Submit'});
				var fieldgroup = form.addFieldGroup({
					id : 'custpage_formdata',
					label : 'Filters'
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

				if (context.request.method === "POST") {
					var params = context.request.parameters;
					from.defaultValue = params.custpage_from;
					location.defaultValue = params.custpage_location;
					department.defaultValue = params.custpage_department;
					to.defaultValue = params.custpage_to;
					reasonCode.defaultValue = params.custpage_reasoncode;
					
					Helper.showResult(context, params, form);
				}
				context.response.writePage({pageObject: form});

				
			} catch(e) {
				log.error("Error", e);
			}
    	}

		function createTable(content, opts) {
			opts = opts || {};
			var firstRowHeader = !!opts.firstRowHeader;
			var tableStyle = opts.tableStyle || 'border-collapse:collapse;width:100%;';
			var cellStyle = opts.cellStyle || 'border:1px solid #ccc;padding:6px;';

			if (!content || Object.prototype.toString.call(content) !== '[object Array]' || content.length === 0) {
				return '<table style="' + tableStyle + '"></table>';
			}

			function escapeHtml(val) {
				var s = (val === null || val === undefined) ? '' : String(val);
				return s
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');
			}

			var html = [];
			html.push('<table style="', tableStyle, '">');

			for (var r = 0; r < content.length; r++) {
				var row = content[r] || [];
				html.push('<tr>');

				for (var c = 0; c < row.length; c++) {
				var tag = (firstRowHeader && r === 0) ? 'th' : 'td';
				html.push(
					'<', tag, ' style="', cellStyle, '">',
					escapeHtml(row[c]),
					'</', tag, '>'
				);
				}

				html.push('</tr>');
			}

			html.push('</table>');
			return html.join('');
		}
    	return {
      		onRequest: onRequest
    	};
  	}
);