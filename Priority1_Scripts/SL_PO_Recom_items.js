/**
* Copyright (c) 1998-2020 NetSuite, Inc.
* 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
* All Rights Reserved
*
* This software is the confidential and proprietary information of NetSuite, Inc. ("Confidential Information").
* You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license
* you entered into with NetSuite
*
* @NApiVersion 2.1
* @NScriptType Suitelet
* @NModuleScope public
* Script Description: Multiple page Script that allows the user to select restricted domains and scripts and generate and store encrypted
* credentials to integration services in a custom record.
*
*/

define(['N/file', 'N/render', 'N/record', 'N/runtime', 'N/ui/serverWidget', 'N/search'],
  	function(file, render, record, runtime, ui, search) {
		let Helper = {};
		Helper.showList = function(context, form) {
			let searchResults = search.load({
				id: 'customsearch2184'
			})

			let results = [], tmp = []; priorItemNum = '';
			let pagedData = searchResults.runPaged({pageSize : 1000});
			for (let i = 0; i < pagedData.pageRanges.length; i++) {
				let currentPage = pagedData.fetch(i);
				for (let j = 0; j < currentPage.data.length; j++) {
					let result = currentPage.data[j];
					let columns = result.columns;

					let itemNumber = result.getText(columns[0]);
					let itemDes = result.getValue(columns[1]);
					let onHandQty = result.getValue(columns[2]) * 1;
					let onSoQty = result.getValue(columns[3]) * 1;
					let onPoQty = result.getValue(columns[4]) * 1;

					//Limit Description Length less than 100
					itemDes = trimToMax(itemDes, 100, true);

					if (!priorItemNum) {
						results[itemNumber] = {
							itemNumber: itemNumber,
							itemDes: itemDes,
							onHandQty: onHandQty,
							onSoQty: 0,
							onPoQty: onPoQty
						}
						priorItemNum = itemNumber;
					}
					
					
					if (priorItemNum == itemNumber) {
						results[itemNumber].onSoQty += onSoQty;
					} else {
						results[itemNumber] = {
							itemNumber: itemNumber,
							itemDes: itemDes,
							onHandQty: onHandQty,
							onSoQty: onSoQty,
							onPoQty: onPoQty,
						}
						priorItemNum = itemNumber;
					}
				}
			}

			let tabResult = form.addTab('custpage_result_tab', 'Result');

			let sublistResult = form.addSublist({
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
				label: 'SKU'
			});

			sublistResult.addField({
				id: 'custpage_desc', 
				type: 'text', 
				label: 'Description'
			});

			sublistResult.addField({
				id: 'custpage_on_hand_qty', 
				type: 'integer', 
				label: 'Total on Hand'
			});

			sublistResult.addField({
				id: 'custpage_on_so_qty', 
				type: 'integer', 
				label: 'Total Needed'
			});

			sublistResult.addField({
				id: 'custpage_on_po_qty', 
				type: 'integer', 
				label: 'Total On Order'
			});

			sublistResult.addField({
				id: 'custpage_needed', 
				type: 'integer', 
				label: 'Amount to be Pruchased'
			});

			let map = [];
			for (let key in results) {
				if (results.hasOwnProperty(key)) {
					map.push(results[key]);
				}
			}

			for (let line = 0; line < map.length; line++) {
				sublistResult.setSublistValue({
					id: 'custpage_item', 
					line: line, 
					value: map[line].itemNumber || ''
				});

				sublistResult.setSublistValue({
					id: 'custpage_desc', 
					line: line, 
					value: map[line].itemDes || ' '
				});

				let qtyOnHand = map[line].onHandQty || '0';
				sublistResult.setSublistValue({
					id: 'custpage_on_hand_qty', 
					line: line, 
					value: Parse.forceInt(map[line].onHandQty) || '0'
				});

				let qtyOnSo = map[line].onSoQty || '0';
				sublistResult.setSublistValue({
					id: 'custpage_on_so_qty', 
					line: line, 
					value: Parse.forceInt(map[line].onSoQty) || '0'
				});

				let qtyOnPo = map[line].onPoQty || '0';
				sublistResult.setSublistValue({
					id: 'custpage_on_po_qty', 
					line: line, 
					value: Parse.forceInt(map[line].onPoQty) || '0'
				});

				let qtyNeeded = (qtyOnSo - qtyOnHand - qtyOnPo) > 0 ? qtyOnSo - qtyOnHand - qtyOnPo : '0';
				sublistResult.setSublistValue({
					id: 'custpage_needed', 
					line: line, 
					value: Parse.forceInt(qtyNeeded) || '0'
				});
			}

			context.response.writePage({pageObject: form});
		}

    	function onRequest(context) {
			try {
				if (context.request.method === "GET") {
					let form = ui.createForm({
						title: 'Purchasing - Recommended Purchase Items'
					});

					form.clientScriptModulePath = './CS_recom_report.js';
					Helper.showList(context, form);
				}
				
			} catch(e) {
				log.error("Error", e);
			}
    	}

		function trimToMax(value, maxLen, addEllipsis) {
			if (value == null) return '';
			let s = String(value);

			if (!maxLen || maxLen < 0) return s;
			if (s.length <= maxLen) return s;

			if (addEllipsis) {
				if (maxLen <= 3) return s.substring(0, maxLen); // not enough room for "..."
				return s.substring(0, maxLen - 3) + '...';
			}

			return s.substring(0, maxLen);
		}

		const Parse = {
            forceFloat: (stValue) => {
                let flValue = parseFloat(stValue);
                return isNaN(flValue) ? 0.00 : flValue;
            },
        
            forceInt: (stValue) => {
                let intValue = parseInt(stValue);
                return isNaN(intValue) || stValue === Infinity ? 0 : intValue;
            }
        };
		
    	return {
      		onRequest: onRequest
    	};
  	}
);