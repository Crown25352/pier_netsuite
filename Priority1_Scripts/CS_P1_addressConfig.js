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

		function config() {

			var objrec = currentRecord.get();

			var suiteleturl = url.resolveScript({
				scriptId: 'customscript_sl_p1_addresses_configurati',
				deploymentId: 'customdeploy_sl_p1_addresses_configurati'

			});

			window.open(suiteleturl, '_self');
		}
		function filter() {
			var objrec = currentRecord.get();
			var addr_search = objrec.getValue('addrsearch');

			var getFilter = 'T'
			var suiteleturl = url.resolveScript({
				scriptId: 'customscript_sl_p1_address_details',
				deploymentId: 'customdeploy_sl_p1_address_details'

			});

			window.onbeforeunload = null;
			window.location.replace(suiteleturl + '&filter=' + getFilter + '&addsearch=' + addr_search);
		}
		function resetadd() {
			var objrec = currentRecord.get();
			var getFilter = 'F';
			var suiteleturl = url.resolveScript({
				scriptId: 'customscript_sl_p1_address_details',
				deploymentId: 'customdeploy_sl_p1_address_details'

			});

			window.onbeforeunload = null;
			window.location.replace(suiteleturl + '&filter=' + getFilter);
		}


		function pageInit(scriptContext) {
			// document.getElementById("NS_MENU_ID0-item0").style.display = "none";
			var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
			for (var i = 0; i < elements.length; i++) {
				elements[i].style.display = "none";
			}

			var currentUrl = document.location.href;
			var url = new URL(currentUrl);
			var defaultName = url.searchParams.get("defaultVal")
			//alert('defaultName');

		}

		return {
			pageInit: pageInit,
			config: config,
			filter: filter,
			resetadd: resetadd
		};
	});