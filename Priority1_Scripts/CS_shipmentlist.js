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

		function resetbutton() {
			var objrec = currentRecord.get();
			var suiteleturl = url.resolveScript({
				scriptId: 'customscript_sl_p1_so_shipmentlist',
				deploymentId: 'customdeploy_sl_p1_so_shipmentlist'

			});
			window.location.replace(suiteleturl);
		}

		function searchButton() {
			var objrec = currentRecord.get();

			var pickupDateFilter = objrec.getValue({
				fieldId: 'pickupdatesearch'
			});
			var pd = new Date(pickupDateFilter);
			// console.log('pd', pd);
			var pmonth = pd.getMonth() + 1;
			var pday = pd.getDate();
			var pyear = pd.getFullYear();
			var pickupDate = pmonth + '/' + pday + '/' + pyear;
			console.log('pickupDate', pickupDate);

			var deliveryDateFilter = objrec.getValue({
				fieldId: 'deliverydatesearch'
			});
			var dd = new Date(deliveryDateFilter);
			// console.log('dd', dd);
			var dmonth = dd.getMonth() + 1;
			var dday = dd.getDate();
			var dyear = dd.getFullYear();
			var deliveryDate = dmonth + '/' + dday + '/' + dyear;
			console.log('deliveryDate', deliveryDate);

			var statusFilter = objrec.getValue({
				fieldId: 'statussearchs'
			});

			var filter_arr = (pickupDateFilter && deliveryDateFilter && statusFilter) ? [
				["custrecord_p1_statuses", "is", statusFilter],
				"AND",
				["custrecord_p1_ps_details", "contains", deliveryDate],
				"AND",
				["custrecord_shipment_pick_date", "contains", pickupDate]
			] : (pickupDateFilter && deliveryDateFilter) ? [
				["custrecord_shipment_pick_date", "contains", pickupDate],
				"AND",
				["custrecord_p1_ps_details", "contains", deliveryDate]
			] : (pickupDateFilter && statusFilter) ? [
				["custrecord_shipment_pick_date", "contains", pickupDate],
				"AND",
				["custrecord_p1_statuses", "is", statusFilter]
			] : (deliveryDateFilter && statusFilter) ? [
				["custrecord_p1_statuses", "is", statusFilter],
				"AND",
				["custrecord_p1_ps_details", "contains", deliveryDate]
			] : statusFilter ? [
				["custrecord_p1_statuses", "is", statusFilter]
			] : pickupDateFilter ? [
				["custrecord_shipment_pick_date", "contains", pickupDate]
			] : deliveryDateFilter ? [
				["custrecord_p1_ps_details", "contains", deliveryDate]
			] : [];

			// console.log('filter_arr', filter_arr);
			// console.log('filter_arr', filter_arr);
			filter_arr = JSON.stringify(filter_arr);

			var suiteUrl = url.resolveScript({
				scriptId: 'customscript_sl_p1_so_shipmentlist',
				deploymentId: 'customdeploy_sl_p1_so_shipmentlist',
				params: {
					'filter_arr': filter_arr
				}
			});

			window.onbeforeunload = null;
			window.location.replace(suiteUrl);
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
			resetbutton: resetbutton,
			searchButton: searchButton
		};
	});