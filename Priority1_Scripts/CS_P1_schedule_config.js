/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/*
 * Script Author:                Chetu India Pvt. Ltd.
 * Script Date:                   Jan 03, 2022
 * Script Type:                   SuiteScript 2.X (Client Script)
 * Script Description:        
 * Last Modified:                 (Please put a comment below with details of modification)
 * Comments:                                                     
 */
define(['N/search', 'N/currentRecord', 'N/url'],
    function (search, currentRecord, url) {

        function schedule() {
            var suiteleturl = url.resolveScript({
                scriptId: 'customscript_sl_schedule_date_time',
                deploymentId: 'customdeploy_sl_schedule_date_time'
            });

            window.open(suiteleturl, '_self');
        }

        function pageInit(scriptContext) {
            // document.getElementById("NS_MENU_ID0-item0").style.display = "none";
            var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "none";
            }
        }

        return {
            pageInit: pageInit,
            schedule: schedule
        };
    });