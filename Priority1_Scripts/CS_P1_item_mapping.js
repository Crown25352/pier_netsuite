/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/*
 * Script Author:		Chetu India Pvt. Ltd.
 * Script Date:			Jan 22, 2022
 * Script Type:			SuiteScript 2.X (Client Script)
 * Script Description:	
 * Last Modified:		(Please put a comment below with details of modification)
 * Comments:				
 */
define(['N/search', 'N/record', 'N/format', 'N/url'],
    function (search, record, format, url) {

        function pageInit(scriptContext) {
            try {
                // document.getElementById("NS_MENU_ID0-item0").style.display = "none";

                var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = "none";
                }

                var objrec = scriptContext.currentRecord;
                var itemType;
                var Selecteditem_;
                var customrecord_api_configurationsSearchObj = search.create({
                    type: "customrecord_p1_api_configurations",
                    filters: [
                        ["internalidnumber", "equalto", "1"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_item_type",
                            label: "Item Type"
                        })
                    ]
                });
                var searchResultCount = customrecord_api_configurationsSearchObj.runPaged().count;
                customrecord_api_configurationsSearchObj.run().each(function (result) {
                    Selecteditem_ = result.getValue({
                        name: "custrecord_item_type"
                    });
                    objrec.setValue('custfield_itemtype', Selecteditem_);
                    return true;
                });
            } catch (e) {
                alert('Error in PageInit ' + e.message);
            }
        }

        function saveRecord(scriptContext) {
            try {
                alert('Do you want to Change the Item Type??');
                return true;
            } catch (e) {
                alert('Error in saveRecord ' + e.message);
            }
        }

        function Edits() {
            try {
                var suiteletURL = url.resolveScript({
                    scriptId: 'customscript_sl_p1_items_mapping',
                    deploymentId: 'customdeploy_sl_p1_items_mapping'
                });

                window.onbeforeunload = null;
                window.open(suiteletURL, "_self");
            } catch (e) {
                alert('Error in Edits ' + e.message);
            }
        }
        return {
            pageInit: pageInit,
            saveRecord: saveRecord,
            Edits: Edits
        };
    });