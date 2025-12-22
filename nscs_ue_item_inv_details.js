/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/runtime', 'N/log','N/search','N/ui/serverWidget'], (runtime, log,search,serverWidget) => {
    function beforeLoad(scriptContext) {
        try {
            const recCurrent = scriptContext.newRecord;
            const objForm = scriptContext.form;
            const stStatus = recCurrent.getValue({
                fieldId: 'status'
            });
            const stSuiteletLinkParam = runtime.getCurrentScript().getParameter({
                name: 'custscript_suiteletlink'
            });
            const suiteletURL = '\"' + stSuiteletLinkParam + '\"';
            //if (stStatus === 'Pending Fulfillment') {
				
				var lineCount = recCurrent.getLineCount({
									sublistId: 'item'
								});
				var itemArr = [];
				for (var i = 0; i < lineCount; i++) {
					var item = recCurrent.getSublistValue({
									sublistId: 'item',
									fieldId: 'item',
									line: i
								});
					itemArr.push(item);
				}
				var itemInvDetailsJson=runSearchAndFetchResult(itemArr)
				var invDetailsJSONField=objForm.addField({
					id: 'custpage_iteminvdetails',
					type: serverWidget.FieldType.LONGTEXT,
					label: 'Item inventory details'
				});
				/*invDetailsJSONField.updateDisplayType({
					displayType : serverWidget.FieldDisplayType.HIDDEN
				});*/
				invDetailsJSONField.defaultValue =itemInvDetailsJson;
           
        } catch(error) {
            log.error({
                title: 'beforeLoad_addButton',
                details: error.message
            });
        }
    }
	 function runSearchAndFetchResult(itemArr) {
        var mySearch = search.load({
            id: 'customsearch_item_inv_srch'
        });
        mySearch.filters = [
            search.createFilter({
                name: "internalid",
                operator: search.Operator.ANYOF,
                values: itemArr
            }),
			search.createFilter({
                name: "quantityonhand",
                operator: "greaterthan",
                values: 0,
				join:"binOnHand"
            })
        ];

        var searchResult = mySearch.run().getRange({
            start: 0,
            end: 999
        });
        var itemInvDetailsJson = {};
        var htmlTable = '';
        for (var i = 0; i < searchResult.length; i++) {
            var itemName = searchResult[i].getValue({
                name: "itemid"
            });
            var invNumber = searchResult[i].getText({
                name: "inventorynumber",
                join: "inventoryNumberBinOnHand"
            });
            var quantityonhand = searchResult[i].getValue({
                name: "quantityonhand",
                join: "binOnHand"
            });
            var binNumber = searchResult[i].getText({
                name: "binnumber",
                join: "binOnHand"
            });
			if(invNumber)
			{
				quantityonhand = searchResult[i].getValue({
					name: "quantityonhand",
					join: "inventoryNumberBinOnHand"
				});
				binNumber = searchResult[i].getText({
					name: "binnumber",
					join: "inventoryNumberBinOnHand"
				});
				if(quantityonhand<=0){
					continue;
				}
			}
            if (itemInvDetailsJson[itemName] != undefined) {
				htmlTable=itemInvDetailsJson[itemName];
				var duplicateDetails=invNumber + ',' + binNumber + ',' + quantityonhand + '|';
				if(invNumber){
					if(htmlTable.indexOf(duplicateDetails)!=-1)
					{
						continue;
					}
				}
                htmlTable += invNumber + ',' + binNumber + ',' + quantityonhand + '|';
							
                itemInvDetailsJson[itemName]=htmlTable;
               //log.debug("inside If "+itemName, htmlTable);
            } else if (invNumber || binNumber) {
                htmlTable = invNumber + ',' + binNumber + ',' + quantityonhand + '|';
				
                itemInvDetailsJson[itemName]=htmlTable;
              // log.debug("inside else "+itemName, htmlTable);
            }
            //log.debug("htmlTable",htmlTable);
            //log.debug(itemName, "invNumber " + invNumber + " binNumber " + binNumber + " quantityonhand " + quantityonhand);
        }
		itemInvDetailsJson=JSON.stringify(itemInvDetailsJson);
        log.debug("searchResult", JSON.stringify(itemInvDetailsJson));
        return itemInvDetailsJson;
    }
    return {
        beforeLoad: beforeLoad
    };
}); 

        