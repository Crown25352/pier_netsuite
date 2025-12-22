/**
 *@NApiVersion 2.1
 *@NModuleScope Public
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/https', 'N/search', 'N/redirect', 'N/url', 'N/record', 'N/cache', 'N/format', 'N/file'],
	function (N_server, https, search, redirect, url, record, cache, format, file) {
		function onRequest(context) {
			if (context.request.method === 'GET') {
				var priorityRecordId = context.request.parameters.quote_id_list;
				log.debug('priorityRecordId', priorityRecordId);
				
				var quoteRecord = record.load({
					type: 'customrecord_p1_priority_quote',
					id: priorityRecordId
				});

				// ---------------- Pickup Fields ----------------------
				var objForm = N_server.createForm({
					title: 'Priority Quote'
				});
				var objFgp = objForm.addFieldGroup({
					id: 'fieldgroupid',
					label: 'PICKUP'
				});
				var pickupDate = objForm.addField({
					id: 'custpage_pdate',
					type: N_server.FieldType.DATE,
					label: 'PICKUP DATE',
					container: 'fieldgroupid'
				}).updateLayoutType({
					layoutType: N_server.FieldLayoutType.STARTROW
				});

				var date_obj = quoteRecord.getValue('custrecord_p1_pickup_date');
				date_obj ? (pickupDate.defaultValue = date_obj) && (pickupDate.updateDisplayType({
					displayType: N_server.FieldDisplayType.DISABLED
				})) : '';
				var pickzip = objForm.addField({
					id: 'custpage_zip',
					type: N_server.FieldType.TEXT,
					label: 'PICKUP Zip',
					container: 'fieldgroupid'
				});
				pickzip.updateLayoutType({
					layoutType: N_server.FieldLayoutType.MIDROW
				});

				pickzip.isMandatory = true;
				pickzip.updateDisplaySize({
					height: 10,
					width: 12
				});
				var pickzip_obj = quoteRecord.getValue('custrecord_pickup_zip');
				pickzip_obj ? (pickzip.defaultValue = pickzip_obj) && (pickzip.updateDisplayType({
					displayType: N_server.FieldDisplayType.DISABLED
				})) : '';

				var countryfield = objForm.addField({
					id: 'custpage_countryp',
					type: N_server.FieldType.TEXT,
					label: 'Country',
					container: 'fieldgroupid'
				});

				countryfield.updateLayoutType({
					layoutType: N_server.FieldLayoutType.ENDROW
				});
				countryfield.updateDisplaySize({
					height: 60,
					width: 15
				});
				var pick_country = quoteRecord.getValue('custrecord_country');
				pick_country ? (countryfield.defaultValue = pick_country) && (countryfield.updateDisplayType({
					displayType: N_server.FieldDisplayType.DISABLED
				})) : '';

				// ---------------- Destination Fields ----------------------
				var objFgd = objForm.addFieldGroup({
					id: 'fieldgroupiddest',
					label: 'DESTINATION'
				});

				var destzip = objForm.addField({
					id: 'custpage_zip_dest',
					type: N_server.FieldType.TEXT,
					label: 'DESTINATION Zip',
					container: 'fieldgroupiddest'
				});
				destzip.updateLayoutType({
					layoutType: N_server.FieldLayoutType.STARTROW
				});

				destzip.isMandatory = true;
				destzip.updateDisplaySize({
					height: 10,
					width: 12
				});
				var shipzip_obj = quoteRecord.getValue('custrecord_destination_zip');
				shipzip_obj ? (destzip.defaultValue = shipzip_obj) && (destzip.updateDisplayType({
					displayType: N_server.FieldDisplayType.DISABLED
				})) : '';

				var countryfieldD = objForm.addField({
					id: 'custpage_countryd',
					type: N_server.FieldType.TEXT,
					label: 'Country',
					container: 'fieldgroupiddest'
				});
				countryfieldD.updateLayoutType({
					layoutType: N_server.FieldLayoutType.MIDROW
				});
				countryfieldD.updateDisplaySize({
					height: 60,
					width: 15
				});
				var ship_country = quoteRecord.getValue('custrecord_destination_country');
				ship_country ? (countryfieldD.defaultValue = ship_country) && (countryfieldD.updateDisplayType({
					displayType: N_server.FieldDisplayType.DISABLED
				})) : '';

				// ------------- Accessorial services -------------------
				var objFgad = objForm.addFieldGroup({
					id: 'fieldgroupaccessdp',
					label: 'ACCESSORIAL SERVICES'
				});
				var accSerMul = objForm.addField({
					id: 'custpage_dd',
					type: N_server.FieldType.INLINEHTML,
					label: 'Accessorial Services',
					container: 'fieldgroupaccessdp'
				});
				var accessorial_service_arr = quoteRecord.getValue('custrecord_accessorial_services') ? (quoteRecord.getValue('custrecord_accessorial_services')).split(',') : '';
				var acc_list = '';
				for (var a = 0; a < accessorial_service_arr.length; a++) {
					var acc_element = accessorial_service_arr[a];
					log.debug('acc_element', acc_element);
					if (acc_element)
						var customrecord_p1_accessorial_servicesSearchObj = search.create({
							type: "customrecord_p1_accessorial_services",
							filters:
								[
									["custrecord_accessorial_services_codes", "is", acc_element]
								],
							columns:
								[
									search.createColumn({
										name: "name",
										sort: search.Sort.ASC,
										label: "Name"
									}),
									search.createColumn({ name: "custrecord_accessorial_services_name", label: "Accesorial Service Name" }),
									search.createColumn({ name: "custrecord_accessorial_services_codes", label: "Acessorial Service Codes" })
								]
						});
					var searchResultCount = customrecord_p1_accessorial_servicesSearchObj.runPaged().count;
					log.debug("customrecord_p1_accessorial_servicesSearchObj result count", searchResultCount);
					customrecord_p1_accessorial_servicesSearchObj.run().each(function (result) {
						// .run().each has a limit of 4,000 results
						acc_list += `<li>${result.getValue('custrecord_accessorial_services_name')}</li>`;
						// return true;
					});
				}
				var acc_html = `<!DOCTYPE html>
			  <html>
			  <body>
			  <h3 style='font-size: 16px;'>Selected Accessorial Services</h3>
			  <ol style='font-size: 14px;'>
				  ${acc_list}
			  </ol> 
			  </body>
			  </html>`;
				accSerMul.defaultValue = acc_html;
				//--------------Shipmant Container ------------------------
				var ship_container = objForm.addFieldGroup({
					id: 'fieldgroup_ship',
					label: 'Shipment'
				});

				var shipView = objForm.addField({
					id: 'custpage_shipid',
					type: N_server.FieldType.INLINEHTML,
					label: 'Shipment',
					container: 'fieldgroup_ship'
				});

				var urlAllshipment = url.resolveScript({
					scriptId: 'customscript_sl_p1_allshipment_details',
					deploymentId: 'customdeploy_sl_p1_allshipment_details'
				});
				var ship_id = quoteRecord.getValue('custrecord_shippment') ? quoteRecord.getValue('custrecord_shippment') : '';

				urlAllshipment = urlAllshipment + '&shipment_id=' + ship_id;
				log.debug('urlAllshipment', urlAllshipment);

				var html = "<!DOCTYPE html>";
				html += '<html>';
				html += '<b><a style="margin-top: 10px; text-decoration: none; border-radius: 5px;  background-color:  #eee;  padding: 14px 28px;  font-size: 14px;  cursor: pointer;  color: orange;  display: inline-block;"  href="' + urlAllshipment + '" target="_blank">VIEW SHIPMENT</a></b>';
				html += '</html>'
				if (ship_id)
					shipView.defaultValue = html;

				var item_object;
				quoteRecord ? item_object = quoteRecord.getValue('custrecord_p1_item_object') : item_object = '';
				// ---------------------- Stand-alone items Item Sublist ------------------------------------
				log.debug('item_object 852', item_object);
				item_object = JSON.parse(item_object);
				log.debug('item_object 851', item_object);
				var tab1 = objForm.addTab({
					id: 'tab1id',
					label: 'Items'
				});
				objForm.addSubtab({
					id: 'subtab1id',
					label: 'Stand-alone Items',
					tab: 'tab1id'
				});
				//---------------- Item Sublist ----------------------------
				if (item_object.items) {
					var itemLiablitySub = objForm.addSublist({
						id: 'carrier_info',
						type: N_server.SublistType.LIST,
						label: 'Stand-alone Items',
						tab: 'subtab1id'
					});
					itemLiablitySub.addField({
						id: 'item_no_id',
						type: N_server.FieldType.TEXT,
						label: 'Sr. No.'
					});
					var handling = itemLiablitySub.addField({
						id: 'carrier_box',
						type: N_server.FieldType.TEXT,
						label: 'HANDLING UNIT'
					});
					handling.updateDisplayType({
						displayType: N_server.FieldDisplayType.INLINE
					});
					itemLiablitySub.addField({
						id: 'carrier_class',
						type: N_server.FieldType.TEXT,
						label: 'CLASS'
					});
					log.debug('test 851', 'item_object');
					itemLiablitySub.addField({
						id: 'carriert_piece',
						type: N_server.FieldType.TEXT,
						label: 'Piece(S)'
					});
					itemLiablitySub.addField({
						id: 'carrier_dimension',
						type: N_server.FieldType.TEXT,
						label: 'Dimensions'
					});
					itemLiablitySub.addField({
						id: 'carrier_weight',
						type: N_server.FieldType.TEXT,
						label: 'Weight'
					});

					itemLiablitySub.addField({
						id: 'carrier_nmfc',
						type: N_server.FieldType.TEXT,
						label: 'NMFC CODE'
					});
					itemLiablitySub.addField({
						id: 'carrier_description',
						type: N_server.FieldType.TEXT,
						label: 'DESCRIPTION'
					});
					log.debug('test 852', 'item_object');
					var hazValue = itemLiablitySub.addField({
						id: 'carrier_hazmat',
						type: N_server.FieldType.CHECKBOX,
						label: 'hazmat check'
					});
					hazValue.updateDisplayType({
						displayType: N_server.FieldDisplayType.DISABLED
					});
					// ---------------------- Set Stan-alone item sublist --------------
					if (item_object.items.length > 0)
						for (v = 0; v < item_object.items.length; v++) {

							var itmNo_obj = String(v + 1);
							itemLiablitySub.setSublistValue({
								id: 'item_no_id',
								line: v,
								value: itmNo_obj
							});

							itemLiablitySub.setSublistValue({
								id: 'carrier_box',
								line: v,
								value: item_object.items[v].packagingType ? item_object.items[v].packagingType : ' '
							});

							itemLiablitySub.setSublistValue({
								id: 'carrier_class',
								line: v,
								value: item_object.items[v].freightClass ? item_object.items[v].freightClass : ' '
							});

							itemLiablitySub.setSublistValue({
								id: 'carriert_piece',
								line: v,
								value: item_object.items[v].pieces ? item_object.items[v].pieces : ' '
							});

							var singleItemLwhUnit = (item_object.items[v].singleLwhUnit) ? (item_object.items[v].singleLwhUnit) : (item_object.items[v].sinLwhUnit);
							itemLiablitySub.setSublistValue({
								id: 'carrier_dimension',
								line: v,
								value: item_object.items[v].length + ' x ' + item_object.items[v].width + ' x ' + item_object.items[v].height + ' ' + '(' + singleItemLwhUnit + ')'
							});

							var singleItemWeightUnit = (item_object.items[v].totalWeightUnit) ? (item_object.items[v].totalWeightUnit) : ' ';
							itemLiablitySub.setSublistValue({
								id: 'carrier_weight',
								line: v,
								value: item_object.items[v].totalWeight + ' ' + singleItemWeightUnit
							});

							var set_nmfc = ' '
							if (item_object.items[v].nmfcItemCode) {
								set_nmfc = item_object.items[v].nmfcItemCode;
								if (item_object.items[v].nmfcSubCode) {
									set_nmfc += '-' + item_object.items[v].nmfcSubCode;
								}
							}

							itemLiablitySub.setSublistValue({
								id: 'carrier_nmfc',
								line: v,
								value: set_nmfc ? set_nmfc : ' '
							});

							itemLiablitySub.setSublistValue({
								id: 'carrier_description',
								line: v,
								value: item_object.items[v].description ? item_object.items[v].description : ' '
							});
							log.debug('test 854', 'item_object');
							itemLiablitySub.setSublistValue({
								id: 'carrier_hazmat',
								line: v,
								// value: hazboxObj
								value: (item_object.items[v].isHazardous) ? 'T' : 'F'
							});
							// if (item_object.items[v].isHazardous)
							//     stand_alone_hazmat_arr.push(v + 1);

						}
				}

				// --------------------- Creating Enhanced Item Sublist --------------------
				var enhancedLength;
				(item_object.enhancedHandlingUnits) ? enhancedLength = (item_object.enhancedHandlingUnits.length) : '';
				if (enhancedLength > 0) {

					objForm.addSubtab({
						id: 'subtab2id',
						label: 'Package Items',
						tab: 'tab1id'
					});
					var enhanceItemLiablitySub = objForm.addSublist({
						id: 'carrier_enhance_info',
						type: N_server.SublistType.LIST,
						label: 'Package',
						tab: 'subtab2id'
					});

					enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_type',
						type: N_server.FieldType.TEXT,
						label: 'Item Type'
					});

					var hazField = enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_hazmat',
						type: N_server.FieldType.CHECKBOX,
						label: 'Hazmat'
					});
					hazField.updateDisplayType({
						displayType: N_server.FieldDisplayType.DISABLED
					});

					var enhancehandling = enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_box',
						type: N_server.FieldType.TEXT,
						label: 'HANDLING UNIT'
					});
					enhancehandling.updateDisplayType({
						displayType: N_server.FieldDisplayType.INLINE
					});
					enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_class',
						type: N_server.FieldType.TEXT,
						label: 'CLASS'
					});
					enhanceItemLiablitySub.addField({
						id: 'carriert_enhance_piece',
						type: N_server.FieldType.TEXT,
						label: 'Piece(S)'
					});
					enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_dimension',
						type: N_server.FieldType.TEXT,
						label: 'Dimensions'
					});
					enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_weight',
						type: N_server.FieldType.TEXT,
						label: 'Weight'
					});

					enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_nmfc',
						type: N_server.FieldType.TEXT,
						label: 'NMFC CODE'
					});
					enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_description',
						type: N_server.FieldType.TEXT,
						label: 'DESCRIPTION'
					});
					var enhanceHazValue = enhanceItemLiablitySub.addField({
						id: 'carrier_enhance_hazmat_check',
						type: N_server.FieldType.TEXT,
						label: 'hazmat check'
					});
					enhanceHazValue.updateDisplayType({
						displayType: N_server.FieldDisplayType.HIDDEN
					});

					// ----------------- Data set for enhanced package item ----------------
					var enhance_hazmat_flag = false;
					if (item_object.enhancedHandlingUnits) {
						log.debug('item_object.enhancedHandlingUnits', item_object.enhancedHandlingUnits);

						var s, k, h, b = 0;
						for (s = 0; s < item_object.enhancedHandlingUnits.length; s++) {
							if (s != 0) {
								k = b + 1;
							} else {
								k = s + b;
							}

							enhanceItemLiablitySub.setSublistValue({
								id: 'carrier_enhance_box',
								line: k,
								value: item_object.enhancedHandlingUnits[s].handlingUnitType
							});
							enhanceItemLiablitySub.setSublistValue({
								id: 'carrier_enhance_type',
								line: k,
								value: 'Parent ' + (s + 1)
							});

							enhanceItemLiablitySub.setSublistValue({
								id: 'carrier_enhance_description',
								line: k,
								value: item_object.enhancedHandlingUnits[s].description
							});

							var parsedPack = item_object.enhancedHandlingUnits[s].packages;
							log.debug('parsedPack packages', parsedPack);

							for (h = 0; h < parsedPack.length; h++) {
								var packLine = h + k + 1;

								enhanceItemLiablitySub.setSublistValue({
									id: 'carrier_enhance_box',
									line: packLine,
									value: parsedPack[h].packagingType
								});

								enhanceItemLiablitySub.setSublistValue({
									id: 'carrier_enhance_type',
									line: packLine,
									value: 'Package ' + (h + 1)
								});

								enhanceItemLiablitySub.setSublistValue({
									id: 'carriert_enhance_piece',
									line: packLine,
									value: parsedPack[h].pieces
								});

								enhanceItemLiablitySub.setSublistValue({
									id: 'carrier_enhance_class',
									line: packLine,
									value: parsedPack[h].packageFreightClass
								});

								enhanceItemLiablitySub.setSublistValue({
									id: 'carrier_enhance_dimension',
									line: packLine,
									value: parsedPack[h].packageLength + ' x ' + parsedPack[h].packageWidth + ' x ' + parsedPack[h].packageHeight + ' ' + '(' + parsedPack[h].packageLwhunit + ')'
								});

								enhanceItemLiablitySub.setSublistValue({
									id: 'carrier_enhance_weight',
									line: packLine,
									value: parsedPack[h].weightPerPackage + ' ' + parsedPack[h].weightUnitPackage
								});

								// var en_nmfc;
								// ((parsedPack[h].packageNmfcItemCode) && (parsedPack[h].packageNmfcSubCode)) ? en_nmfc = ((parsedPack[h].packageNmfcItemCode) + '-' + (parsedPack[h].packageNmfcSubCode)) : (parsedPack[h].packageNmfcItemCode) ? en_nmfc = (parsedPack[h].packageNmfcItemCode) : en_nmfc = ' ';


								// enhanceItemLiablitySub.setSublistValue({
								//     id: 'carrier_enhance_nmfc',
								//     line: packLine,
								//     value: en_nmfc
								// });

								enhanceItemLiablitySub.setSublistValue({
									id: 'carrier_enhance_description',
									line: packLine,
									value: parsedPack[h].packageDesc
								});

								enhanceItemLiablitySub.setSublistValue({
									id: 'carrier_enhance_hazmat',
									line: packLine,
									value: (parsedPack[h].packageIsHazardous) ? 'T' : 'F'
								});

								// if (parsedPack[h].packageIsHazardous)
								//     enhance_hazmat_flag = true;

								b = packLine
							}
						}
					}
				}

				// -------------------- Creating Carrier Sublist --------------------------
				var shipmenRec_obj = quoteRecord.getValue('custrecord_shippment');
				var respData_obj = quoteRecord.getValue('custrecord_response_data');
				respData_obj ? respData_obj = JSON.parse(respData_obj) : '';
				if (respData_obj) {
					//  if (respData_obj && !ship_id) {
					objForm.addSubtab({
						id: 'custpage_carrieritmid',
						label: 'Carrier',
						tab: 'tab1id'
					});
					var carrierSublist = objForm.addSublist({
						id: 'custpage_carriersublist',
						type: N_server.SublistType.STATICLIST,
						label: 'Carrier',
						tab: 'tab1id'
					});

					carrierSublist.addField({
						id: 'custpage_select_quotes',
						type: N_server.FieldType.TEXTAREA,
						label: 'SELECT QUOTES'
					});

					carrierSublist.addField({
						id: 'custpage_total_charges',
						type: N_server.FieldType.TEXT,
						label: 'TOTAL CHARGES'
					});

					carrierSublist.addField({
						id: 'carrierlogo',
						type: N_server.FieldType.TEXTAREA,
						label: 'Carrier Logo'
					});

					carrierSublist.addField({
						id: 'custpage_carriers',
						type: N_server.FieldType.TEXT,
						label: 'CARRIERS'
					});

					carrierSublist.addField({
						id: 'custpage_service_level_description',
						type: N_server.FieldType.TEXT,
						label: 'SERVICE LEVEL DESCRIPTION'
					});

					carrierSublist.addField({
						id: 'custpage_quote_expaeriation_date',
						type: N_server.FieldType.DATE,
						label: 'QUOTE EXPIRATION DATE'
					});

					carrierSublist.addField({
						id: 'custpage_transit_days',
						type: N_server.FieldType.TEXT,
						label: 'TRANSIT DAYS'
					});
					carrierSublist.addField({
						id: 'custpage_estimated_delevery_date',
						type: N_server.FieldType.DATE,
						label: 'ESTIMATED DELIVERY DATE'
					});

					carrierSublist.addField({
						id: 'custpage_carrier_liability_new',
						type: N_server.FieldType.TEXT,
						label: 'CARRIER LIABILITY NEW'
					});
					carrierSublist.addField({
						id: 'custpage_carrier_liability_used',
						type: N_server.FieldType.TEXT,
						label: 'CARRIER LIABILITY USED'
					});

					var k_count = 0;
					var rateQuotesObj = respData_obj.rateQuotes;

					var currentDate = new Date();
					log.debug('currentDate', currentDate);
					var folder_id = '';
					var folderSearchObj = search.create({
						type: "folder",
						filters:
							[
								["name", "is", "Carrier_Priority1"]
							],
						columns:
							[
								search.createColumn({ name: "internalid", label: "Internal ID" })
							]
					});
					var searchResultCount = folderSearchObj.runPaged().count;
					log.debug("folderSearchObj result count", searchResultCount);
					folderSearchObj.run().each(function (result) {
						folder_id = result.getValue({ name: "internalid", label: "Internal ID" });
						return true;
					});

					for (var k = 0; k < rateQuotesObj.length; k++) {
						var ed = rateQuotesObj[k].expirationDate;
						log.debug('exp_date 1456', ed);
						var exp_date = dateFormat(ed);
						log.debug('exp_date 1456', exp_date);
						var comp_obj = compareDate(new Date(exp_date), new Date());

						//  if (comp_obj == true) {
						var cN = rateQuotesObj[k].carrierName
						// log.debug('cN', cN);
						var Tc = rateQuotesObj[k].rateQuoteDetail.total;

						var sld = rateQuotesObj[k].serviceLevelDescription;
						// log.debug('sld', sld);

						var quoteExpirationDate = rateQuotesObj[k].expirationDate;
						// log.debug('quoteExpirationDate', quoteExpirationDate);

						var totalCharges = '$' + rateQuotesObj[k].rateQuoteDetail.total;
						// log.debug('totalCharges', totalCharges);

						var td = rateQuotesObj[k].transitDays
						// log.debug('td', td);

						var del_d = rateQuotesObj[k].deliveryDate;
						var cdel = dateFormat(del_d);
						var pD = respData_obj.rateQuoteRequestDetail.pickupDate;
						var pdd = dateFormat(pD);
						var carID = rateQuotesObj[k].id;

						var estimatedDeliveryDate = rateQuotesObj[k].deliveryDate;
						log.debug('estimatedDeliveryDate', estimatedDeliveryDate);

						var cLnew = '$' + rateQuotesObj[k].totalNewCarrierLiabilityAmount;
						log.debug('cLnew', cLnew);

						var cLused = '$' + rateQuotesObj[k].totalUsedCarrierLiabilityAmount;
						log.debug('cLused', cLused);

						var cc = rateQuotesObj[k].carrierCode
						log.debug('cc', cc);

						log.debug('folder_id', folder_id);
						var fileSearchObj = search.create({
							type: "file",
							filters: [
								["name", "haskeywords", cc],
								"AND",
								["folder", "anyof", folder_id]
							],
							columns: [
								search.createColumn({
									name: "name",
									sort: search.Sort.ASC,
									label: "Name"
								}),
								search.createColumn({
									name: "folder",
									label: "Folder"
								}),
								search.createColumn({
									name: "documentsize",
									label: "Size (KB)"
								}),
								search.createColumn({
									name: "url",
									label: "URL"
								}),
							]
						});
						var fileID, fileObj;
						var fileName = null;
						var searchResultCount = fileSearchObj.runPaged().count;
						fileSearchObj.run().each(function (result) {
							fileID = result.getValue({
								name: 'internalid'
							});
							fileName = result.getValue({
								name: 'name'
							});
							fileObj = result.getValue({
								name: 'url'
							});
							return true;
						});
						var nofileObj = file.load({
							id: './Carrier_Priority1/No_image'
						}).url;
						// crcd = priorityRecordId;
						var carrierPickupDel = url.resolveScript({
							scriptId: 'customscript_test_dispatch_ui_suitelet',
							deploymentId: 'customdeploy_test_dispatch_ui_suitelet',
							params: {
								// 'carID': carID,
								'crcd': priorityRecordId
							}
						});
						carrierPickupDel = carrierPickupDel + '&cc=' + cc + '&cN=' + cN + '&Tc=' + Tc + '&sld=' + sld + '&td=' + td + '&pD=' + pdd + '&cLnew=' + cLnew + '&cLused=' + cLused + '&carID=' + carID + '&cdel=' + cdel;

						var html = "<!DOCTYPE html>";
						html += '<html>';
						html += '<a href="' + carrierPickupDel + '">SELECT QUOTE</a>';
						html += '</html>';
						log.debug('k_count 1558', k_count);
						var expDate = new Date(ed);
						// var curDate = new Date("2024-02-22T15:12:42.044Z");

						carrierSublist.setSublistValue({
							id: 'custpage_select_quotes',
							line: k_count,
							value: shipmenRec_obj ? ' ' : currentDate > expDate ? "EXPIRED" : html
						});

						carrierSublist.setSublistValue({
							id: 'custpage_quote_expaeriation_date',
							line: k_count,
							value: exp_date
						});

						carrierSublist.setSublistValue({
							id: 'custpage_total_charges',
							line: k_count,
							value: totalCharges
						});

						if (cc == fileName) {
							var img_html = '<img src="' + fileObj + '" alt="Image" border="0" style="height: 100px; width: 120px; ">';
							carrierSublist.setSublistValue({
								id: 'carrierlogo',
								line: k_count,
								value: img_html
							});
						} else {
							var img_html = '<img src="' + nofileObj + '" alt="Image" border="0" style="height: 100px; width: 120px; ">';
							carrierSublist.setSublistValue({
								id: 'carrierlogo',
								line: k_count,
								value: img_html
							});
						}
						carrierSublist.setSublistValue({
							id: 'custpage_carriers',
							line: k_count,
							value: cN
						});

						carrierSublist.setSublistValue({
							id: 'custpage_service_level_description',
							line: k_count,
							value: sld
						});

						carrierSublist.setSublistValue({
							id: 'custpage_transit_days',
							line: k_count,
							value: td
						});

						carrierSublist.setSublistValue({
							id: 'custpage_estimated_delevery_date',
							line: k_count,
							value: cdel
						});

						carrierSublist.setSublistValue({
							id: 'custpage_carrier_liability_new',
							line: k_count,
							value: cLnew
						});

						carrierSublist.setSublistValue({
							id: 'custpage_carrier_liability_used',
							line: k_count,
							value: cLused
						});

						k_count++;
						//  } else {
						//      k_count = (k_count - 1)
						//  }

					}
				}

				context.response.writePage({
					pageObject: objForm
				});

			}
		}
		function dateFormat(estimatedDate) {
			// var dateret = (ed.getMonth() + 1) + "/" + ed.getDate() + "/" + ed.getFullYear();
			var estMonth = estimatedDate.substring(5, 7);

			var estDate = estimatedDate.substring(8, 10);

			var estYear = estimatedDate.substring(0, 4);

			var estDateformat = estMonth + "/" + estDate + "/" + estYear;
			return estDateformat;
		}
		function compareDate(date1, date2) {
			if (date1 > date2) return true;
		}

		return {
			onRequest: onRequest
		};
	});