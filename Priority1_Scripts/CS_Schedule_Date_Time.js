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
define(['N/search', 'N/currentRecord', 'N/url', 'N/format'],
	function (search, currentRecord, url, format) {
		function BackConfiguration() {

			var suiteletURL = url.resolveScript({
				scriptId: 'customscript_sl_p1_addresses_configurati',
				deploymentId: 'customdeploy_sl_p1_addresses_configurati'
			});

			window.onbeforeunload = null;
			window.open(suiteletURL, '_self');
		}

		function pageInit(scriptContext) {
			// document.getElementById("NS_MENU_ID0-item0").style.display = "none";
			var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
			for (var i = 0; i < elements.length; i++) {
				elements[i].style.display = "none";
			}

			var objrec = scriptContext.currentRecord;
			var currentUrl = document.location.href;
			var url = new URL(currentUrl);
			var setDateCheck = url.searchParams.get("setDate");

			if (setDateCheck == null) {
				var objdate = new Date();
				var formattedDateString = format.parse({
					value: objdate,
					type: format.Type.DATE
				});

				objrec.setValue({
					fieldId: 'custpage_date',
					value: formattedDateString
				});

			}
		}

		function saveRecord(scriptContext) {
			try {

				var recDate, recTime;
				var objRec = scriptContext.currentRecord;

				var getdate = objRec.getValue('custpage_date');
				var Dateget = getdate.getDate();
				var month = getdate.getMonth() + 1;
				var year = getdate.getFullYear();
				var fullDate = month + '/' + Dateget + '/' + year;
				var getTime = objRec.getValue('custpage_time');

				var customrecord_schedule_record_typeSearchObj = search.create({
					type: "customrecord_p1_schedule_record",
					filters:
						[
							["custrecord_date", "on", fullDate]
						],
					columns:
						[
							search.createColumn({ name: "custrecord_date", label: "Date" }),
							search.createColumn({ name: "custrecord125", label: "Time" })
						]
				});
				var searchResultCount = customrecord_schedule_record_typeSearchObj.runPaged().count;
				var saveRcdFlag = true;
				customrecord_schedule_record_typeSearchObj.run().each(function (result) {

					recDate = result.getValue('custrecord_date');
					recTime = result.getValue('custrecord125');


					if (recDate == fullDate && recTime == getTime) {
						alert("Can't schedule again because same time scheduled record found.");
						saveRcdFlag = false;
						return false;
					}
					return true;
				});

				if (!saveRcdFlag) {
					return false;
				}
				else {
					return true;
				}

			}
			catch (e) {
				alert('Error In Save Record: ' + e);
			}
		}
		return {
			BackConfiguration: BackConfiguration,
			pageInit: pageInit,
			saveRecord: saveRecord
		};
	});