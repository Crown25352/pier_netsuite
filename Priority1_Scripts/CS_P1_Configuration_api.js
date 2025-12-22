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
define(['N/search', 'N/currentRecord', 'N/record', 'N/url'],
    function (search, currentRecord, record, url) {

        function pageInit(scriptContext) {
            try {
                // document.getElementById("NS_MENU_ID0-item0").style.display = "none";

                var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = "none";
                }
            } catch (e) {
                alert('Error in PageInit ' + e.message);
            }
        }

        function savechange() {
            try {
                var objrec = currentRecord.get();

                var xapi = objrec.getField({
                    fieldId: 'custfield_xapikey'
                });
                var xApiKeys = objrec.getValue('custfield_xapikey');

                var apiConfigRecord = record.load({
                    type: 'customrecord_p1_api_configurations',
                    id: 1 /// load api configuration custom record
                });
                apiConfigRecord.setValue({
                    fieldId: 'custrecord_xapikey',
                    value: xApiKeys
                });
                apiConfigRecord.save();

                xapi.isDisabled = true;
                var suiteletURL = url.resolveScript({
                    scriptId: 'customscript_sl_p1_configuration_api',
                    deploymentId: 'customdeploy_sl_p1_configuration_api'
                });
                window.onbeforeunload = null;
                window.open(suiteletURL, "_self", false);
            } catch (e) {
                alert('Error in savechange ' + e.message);
            }
        }
        return {
            pageInit: pageInit,
            savechange: savechange
        };
    });