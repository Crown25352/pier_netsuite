/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/cache', 'N/format', 'N/file', 'N/url'],
	function (N_server, record, search, cache, format, file, url) {
		function onRequest(context) {
			if (context.request.method === 'GET') {
				try {



					var objFormShipmentList = N_server.createForm({
						title: 'Quote List'
					});
					//****start to add filter field****//

					// objFormShipmentList.clientScriptModulePath = './CS_shipmentlist.js';

					var catchDate = context.request.parameters.date;
					log.debug('catchDate', catchDate);

					var catchStatus = context.request.parameters.statusObj;
					log.debug('catchStatus', catchStatus);

					objFormShipmentList.clientScriptModulePath = './P1_Quote_List_CS.js';

					var pickupDateSearch = objFormShipmentList.addField({
						id: 'custpage_pickupdatesearch',
						type: N_server.FieldType.DATE,
						label: 'PICKUP DATE'
					});

					if (catchDate == 'undefined' || catchDate == '' || catchDate == null) {
						log.debug('catchDate undefined', catchDate);
						catchDate = ''

					} else {
						var set_catchDate = formatDate(catchDate);
						log.debug('set_catchDate', set_catchDate);
						pickupDateSearch.defaultValue = set_catchDate;

					}
					var statusSearch = objFormShipmentList.addField({
						id: 'custpage_statussearchs',
						type: N_server.FieldType.TEXT,
						label: 'STATUS'
					});

					// statusSearch.addSelectOption({
					// value: '1',
					// text: ''
					// });
					// statusSearch.addSelectOption({
					// value: '2',
					// text: 'Dispatched'
					// });


					if (catchStatus) {
						statusSearch.defaultValue = catchStatus;
					}
					// else
					// {
					// statusSearch.defaultValue = "";
					// }


					//****end to add filter field****//

					//*****start to add sublist ****//

					var objsubShipment = objFormShipmentList.addSublist({
						id: 'custfield_shipmentlist',
						type: N_server.SublistType.STATICLIST,
						label: 'QUOTES'
					});
					objsubShipment.addField({
						id: 'custfield_view',
						type: N_server.FieldType.INLINEHTML,
						label: 'VIEW'
					});
					objsubShipment.addField({
						id: 'custfield_quoteid',
						type: N_server.FieldType.TEXT,
						label: 'Quote Id'
					});
					objsubShipment.addField({
						id: 'custfield_pickupzip',
						type: N_server.FieldType.TEXT,
						label: 'PICKUP ZIP'
					});
					objsubShipment.addField({
						id: 'custfield_destinationzip',
						type: N_server.FieldType.TEXT,
						label: 'DESTINATION ZIP'
					});
					objsubShipment.addField({
						id: 'custfield_bol_ref',
						type: N_server.FieldType.DATE,
						label: 'PICK UP DATE'
					});
					objsubShipment.addField({
						id: 'custfield_status',
						type: N_server.FieldType.TEXT,
						label: 'STATUS'
					});
					//*****End to add sublist ****//
					var quoteId, pickupZip, destinationZip, quoteStatus, pickupDate, custRecInternalId;

					var lineNumberIs = 0, i = 0;
					var useFilters;
					if (catchDate == '' && catchStatus) {
						useFilters = [
							["custrecord_p1_status", "is", catchStatus]
						]
					}
					else if (catchDate != '' && catchStatus == '') {
						var set_catchDate = formatDate(catchDate);
						log.debug('date condtion 1', set_catchDate);
						var new_date = set_catchDate.toString();
						useFilters = [
							["custrecord_p1_pickup_date", "on", set_catchDate]
						]
					}
					else if (catchDate && catchStatus) {
						var set_catchDate = formatDate(catchDate);
						var new_date = set_catchDate.toString();

						useFilters = [
							["custrecord_p1_pickup_date", "on", new_date],
							"AND",
							["custrecord_shippment.custrecord_p1_statuses", "is", catchStatus]
						]

					} else if (catchDate == '' && catchStatus == '') {
						useFilters = []
					}

					log.debug('useFilters 141', useFilters);


					var customrecord_priority_quoteSearchObj = search.create({
						type: "customrecord_p1_priority_quote",
						filters: useFilters,
						columns:
							[
								search.createColumn({ name: "internalid", label: "Internal ID" }),
								search.createColumn({ name: "custrecord_p1_quote_id", label: "P1 Quote ID" }),
								search.createColumn({ name: "custrecord_pickup_zip", label: "PICKUP ZIP" }),
								search.createColumn({ name: "custrecord_destination_zip", label: "DESTINATION ZIP" }),
								search.createColumn({ name: "custrecord_p1_pickup_date", label: " PICKUP DATE" }),
								search.createColumn({
									name: "custrecord_p1_statuses",
									join: "CUSTRECORD_SHIPPMENT",
									label: "STATUS"
								})
							]
					});
					// var searchResultCount = customrecord_priority_quoteSearchObj.runPaged().count;
					// log.debug("customrecord_priority_quoteSearchObj result count", searchResultCount);
					var searchresult = customrecord_priority_quoteSearchObj.run()
					var searchresultRange = searchresult.getRange({
						start: 0,
						end: 1000
					});
					// log.debug('searchresultRange 175', searchresultRange);
					while (i < searchresultRange.length) {
						// for (var i = 0; i < searchresultRange.length; i++) {

						quoteId = searchresultRange[i].getValue({
							name: "custrecord_p1_quote_id"
						});
						// log.debug('quoteId', quoteId);

						custRecInternalId = searchresultRange[i].getValue({
							name: "internalid"
						});
						// log.debug('custRecInternalId', custRecInternalId);

						pickupZip = searchresultRange[i].getValue({
							name: "custrecord_pickup_zip"
						});
						// log.debug('pickupZip', pickupZip);

						destinationZip = searchresultRange[i].getValue({
							name: "custrecord_destination_zip"
						});

						quoteStatus = searchresultRange[i].getValue({
							name: "custrecord_p1_statuses",
							join: "CUSTRECORD_SHIPPMENT"
						});

						pickupDate = searchresultRange[i].getValue({
							name: "custrecord_p1_pickup_date"
						});
						// log.debug('pickupDate', pickupDate);

						/***start set value of sublist***/
						var urlAllshipment = url.resolveScript({
							scriptId: 'customscript_sl_p1_quote_view',
							deploymentId: 'customdeploy_sl_p1_quote_view'
						});

						urlAllshipment = urlAllshipment + '&quote_id_list=' + custRecInternalId;

						var html = "<!DOCTYPE html>";
						html += '<html>';
						html += '<a href="' + urlAllshipment + '">VIEW</a>';
						html += '</html>'
						// log.debug('urlAllshipment 224', urlAllshipment);
						// log.debug('referenceNumber_ 225', referenceNumber_);
						objsubShipment.setSublistValue({
							id: 'custfield_view',
							line: lineNumberIs,
							value: html
						});
						objsubShipment.setSublistValue({
							id: 'custfield_quoteid',
							line: lineNumberIs,
							value: quoteId ? quoteId : ' '
						});

						objsubShipment.setSublistValue({
							id: 'custfield_pickupzip',
							line: lineNumberIs,
							value: pickupZip ? pickupZip : ' '
						});

						objsubShipment.setSublistValue({
							id: 'custfield_destinationzip',
							line: lineNumberIs,
							value: destinationZip ? destinationZip : ' '
						});

						objsubShipment.setSublistValue({
							id: 'custfield_bol_ref',
							line: lineNumberIs,
							value: pickupDate ? pickupDate : ' '
						});

						objsubShipment.setSublistValue({
							id: 'custfield_status',
							line: lineNumberIs,
							value: quoteStatus ? quoteStatus : ' '
						});

						// ***End set value of sublist from shipment list***// 
						lineNumberIs++, i++;

						if (i == 1000) {
							i = 0;
							searchresultRange = searchresult.getRange({
								start: lineNumberIs,
								end: lineNumberIs + 1000
							});
							// log.debug("lineNumberIs : " + lineNumberIs, "NEXT searchresultRange :- " + searchresultRange.length + " || TOTAL searchResultCount :- " + searchResultCount);

						}
					}
					context.response.writePage({
						pageObject: objFormShipmentList
					});
				} catch (error) {
					log.debug('errorn', error);
					errorMessage = error.message;
					log.debug('Error in API function', errorMessage);
					var html;
					var type_obj = getType(errorMessage);
					log.debug('type_obj', type_obj);
					if (type_obj == 'object') {
						html = `
                    <!DOCTYPE html><html>
                    <head>    
                        <link href=”https://system.netsuite.com/core/media/media.nl?id=1234&_xt=.css” rel=”stylesheet” media=”print” /> 
                        <style>
                        pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; font-size: 20px;}
                        .string { color: green; }
                        .number { color: darkorange; }
                        .boolean { color: blue; }
                        .null { color: magenta; }
                        .key { color: red; }
                        </style>
                    </head>
                        <body>
                        <script>
                        function output(inp) {
                            document.body.appendChild(document.createElement('pre')).innerHTML = inp;
                        }
                        function syntaxHighlight(json) {
                            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                                var cls = 'number';
                                if (/^"/.test(match)) {
                                    if (/:$/.test(match)) {
                                        cls = 'key';
                                    } else {
                                        cls = 'string';
                                    }
                                } else if (/true|false/.test(match)) {
                                    cls = 'boolean';
                                } else if (/null/.test(match)) {
                                    cls = 'null';
                                }
                                return '<span class="' + cls + '">' + match + '</span>';
                            });
                        }
                
                        var obj = ${errorMessage};
                        var str = JSON.stringify(obj, undefined, 4);
                        output(syntaxHighlight(str));
                        </script>
                        </body>
                            </html>`;
					}
					else {
						html = `<!DOCTYPE html>
                            <html>
                            <body>    
                            <h1>Error</h1>    
                            <p><span style="color:red;font-weight:bold">${errorMessage}</span><span style="color:darkolivegreen;font-weight:bold"></span></p>    
                            </body>
                            </html>`;
					}
					function getType(p) {
						// if (Array.isArray(p)) return 'array';
						if (typeof p == 'string') return 'string';
						else if (p != null && typeof p == 'object') return 'object';
						else return 'other';
					}
					context.response.write(html);
				}
			}


		}
		function formatDate(dateObj) {
			var date_split = dateObj.split('/');
			var month = date_split[0];
			var date = date_split[1];
			// var crr_date = new Date();
			// var crr_year = crr_date.getFullYear();
			// var str_crr_year = crr_year.toString();
			// var slice_str_crr_year = str_crr_year.slice(0, -2);
			// log.debug('slice_str_crr_year', slice_str_crr_year);
			var year = date_split[2];
			var final_date = month + '/' + date + '/' + year;
			return final_date;
		}
		return {
			onRequest: onRequest
		};
	});