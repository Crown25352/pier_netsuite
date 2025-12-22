/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/url', 'N/https', 'N/redirect'],
	function (N_server, record, search, url, https, redirect) {
		function onRequest(context) {

			try {
				if (context.request.method == 'GET') {

					var addressinternalid;
					var objFormAddressDetails = N_server.createForm({
						title: 'ADDRESS DETAILS'
					});
					var companyName = objFormAddressDetails.addField({
						id: 'comapanyname',
						type: N_server.FieldType.TEXT,
						label: 'Company Name'
					});
					var conatctName = objFormAddressDetails.addField({
						id: 'contactname',
						type: N_server.FieldType.TEXT,
						label: 'Contact Name'
					});
					var emailAddress = objFormAddressDetails.addField({
						id: 'email',
						type: N_server.FieldType.TEXT,
						label: 'Email Address'
					});
					var phone = objFormAddressDetails.addField({
						id: 'phone',
						type: N_server.FieldType.TEXT,
						label: 'Phone'
					});
					var address = objFormAddressDetails.addField({
						id: 'address',
						type: N_server.FieldType.TEXT,
						label: 'Address'
					});
					var address1 = objFormAddressDetails.addField({
						id: 'address1',
						type: N_server.FieldType.TEXT,
						label: 'Address1'
					});
					var address2 = objFormAddressDetails.addField({
						id: 'address2',
						type: N_server.FieldType.TEXT,
						label: 'Address2'
					});
					var locations = objFormAddressDetails.addField({
						id: 'locations',
						type: N_server.FieldType.TEXT,
						label: 'CITY'
					});
					var state = objFormAddressDetails.addField({
						id: 'custpage_state',
						type: N_server.FieldType.TEXT,
						label: 'State Abbreviation'
					});
					var country = objFormAddressDetails.addField({
						id: 'custpage_country',
						type: N_server.FieldType.TEXT,
						label: 'Country Abbreviation'
					});
					var postalCode = objFormAddressDetails.addField({
						id: 'custpage_postalcode',
						type: N_server.FieldType.TEXT,
						label: 'Postal Code'
					});

					var opentime = objFormAddressDetails.addField({
						id: 'opens',
						type: N_server.FieldType.SELECT,
						label: 'Open'
					});
					opentime.addSelectOption({
						value: ' ',
						text: ' '
					});
					opentime.addSelectOption({
						value: '8:00 AM',
						text: '8:00 AM'
					});
					opentime.addSelectOption({
						value: '8:30 AM',
						text: '8:30 AM'
					});
					opentime.addSelectOption({
						value: '9:00 AM',
						text: '9:00 AM'
					});
					opentime.addSelectOption({
						value: '9:30 AM',
						text: '9:30 AM'
					});
					opentime.addSelectOption({
						value: '10:00 AM',
						text: '10:00 AM'
					});
					opentime.addSelectOption({
						value: '10:30 AM',
						text: '10:30 AM'
					});
					opentime.addSelectOption({
						value: '11:00 AM',
						text: '11:00 AM'
					});
					opentime.addSelectOption({
						value: '11:30 AM',
						text: '11:30 AM'
					});
					opentime.addSelectOption({
						value: '12:00 PM',
						text: '12:00 PM'
					});
					opentime.addSelectOption({
						value: '12:30 PM',
						text: '12:30 PM'
					});
					opentime.addSelectOption({
						value: '1:00 PM',
						text: '1:00 PM'
					});
					opentime.addSelectOption({
						value: '1:30 PM',
						text: '1:30 PM'
					});
					opentime.addSelectOption({
						value: '2:00 PM',
						text: '2:00 PM'
					});
					opentime.addSelectOption({
						value: '2:30 PM',
						text: '2:30 PM'
					});
					opentime.addSelectOption({
						value: '3:00 PM',
						text: '3:00 PM'
					});
					opentime.addSelectOption({
						value: '3:30 PM',
						text: '3:30 PM'
					});
					opentime.addSelectOption({
						value: '4:00 PM',
						text: '4:00 PM'
					});
					opentime.addSelectOption({
						value: '4:30 PM',
						text: '4:30 PM'
					});
					opentime.addSelectOption({
						value: '5:00 PM',
						text: '5:00 PM'
					});
					opentime.addSelectOption({
						value: '5:30 PM',
						text: '5:30 PM'
					});
					opentime.addSelectOption({
						value: '6:00 PM',
						text: '6:00 PM'
					});
					opentime.addSelectOption({
						value: '6:30 PM',
						text: '6:30 PM'
					});
					opentime.addSelectOption({
						value: '7:00 PM',
						text: '7:00 PM'
					});
					opentime.addSelectOption({
						value: '7:30 PM',
						text: '7:30 PM'
					});
					opentime.addSelectOption({
						value: '8:00 PM',
						text: '8:00 PM'
					});
					opentime.addSelectOption({
						value: '8:30 PM',
						text: '8:30 PM'
					});
					opentime.addSelectOption({
						value: '9:00 PM',
						text: '9:00 PM'
					});
					opentime.addSelectOption({
						value: '9:30 PM',
						text: '9:30 PM'
					});
					opentime.addSelectOption({
						value: '10:00 PM',
						text: '10:00 PM'
					});
					opentime.defaultValue = '8:00 AM';

					var closeTime = objFormAddressDetails.addField({
						id: 'closes',
						type: N_server.FieldType.SELECT,
						label: 'Close'
					});
					closeTime.addSelectOption({
						value: ' ',
						text: ' '
					});
					closeTime.addSelectOption({
						value: '8:00 AM',
						text: '8:00 AM'
					});
					closeTime.addSelectOption({
						value: '8:30 AM',
						text: '8:30 AM'
					});
					closeTime.addSelectOption({
						value: '9:00 AM',
						text: '9:00 AM'
					});
					closeTime.addSelectOption({
						value: '9:30 AM',
						text: '9:30 AM'
					});
					closeTime.addSelectOption({
						value: '10:00 AM',
						text: '10:00 AM'
					});
					closeTime.addSelectOption({
						value: '10:30 AM',
						text: '10:30 AM'
					});
					closeTime.addSelectOption({
						value: '11:00 AM',
						text: '11:00 AM'
					});
					closeTime.addSelectOption({
						value: '11:30 AM',
						text: '11:30 AM'
					});
					closeTime.addSelectOption({
						value: '12:00 PM',
						text: '12:00 PM'
					});
					closeTime.addSelectOption({
						value: '12:30 PM',
						text: '12:30 PM'
					});
					closeTime.addSelectOption({
						value: '1:00 PM',
						text: '1:00 PM'
					});
					closeTime.addSelectOption({
						value: '1:30 PM',
						text: '1:30 PM'
					});
					closeTime.addSelectOption({
						value: '2:00 PM',
						text: '2:00 PM'
					});
					closeTime.addSelectOption({
						value: '2:30 PM',
						text: '2:30 PM'
					});
					closeTime.addSelectOption({
						value: '3:00 PM',
						text: '3:00 PM'
					});
					closeTime.addSelectOption({
						value: '3:30 PM',
						text: '3:30 PM'
					});
					closeTime.addSelectOption({
						value: '4:00 PM',
						text: '4:00 PM'
					});
					closeTime.addSelectOption({
						value: '4:30 PM',
						text: '4:30 PM'
					});
					closeTime.addSelectOption({
						value: '5:00 PM',
						text: '5:00 PM'
					});
					closeTime.addSelectOption({
						value: '5:30 PM',
						text: '5:30 PM'
					});
					closeTime.addSelectOption({
						value: '6:00 PM',
						text: '6:00 PM'
					});
					closeTime.addSelectOption({
						value: '6:30 PM',
						text: '6:30 PM'
					});
					closeTime.addSelectOption({
						value: '7:00 PM',
						text: '7:00 PM'
					});
					closeTime.addSelectOption({
						value: '7:30 PM',
						text: '7:30 PM'
					});
					closeTime.addSelectOption({
						value: '8:00 PM',
						text: '8:00 PM'
					});
					closeTime.addSelectOption({
						value: '8:30 PM',
						text: '8:30 PM'
					});
					closeTime.addSelectOption({
						value: '9:00 PM',
						text: '9:00 PM'
					});
					closeTime.addSelectOption({
						value: '9:30 PM',
						text: '9:30 PM'
					});
					closeTime.addSelectOption({
						value: '10:00 PM',
						text: '10:00 PM'
					});
					closeTime.defaultValue = '5:00 PM';

					var pickupaccesorial = objFormAddressDetails.addField({
						id: 'pickupaccesorial',
						type: N_server.FieldType.MULTISELECT,
						label: 'Pickup ACCESSORIALS'
					});
					var customlist_pickup_accesorial_serviceSearchObj = search.create({
						type: "customlist_p1_pickup_accesorial",
						filters: [],
						columns: [
							search.createColumn({
								name: "name",
								sort: search.Sort.ASC,
								label: "Name"
							})
						]
					});
					var searchResultCount = customlist_pickup_accesorial_serviceSearchObj.runPaged().count;
					customlist_pickup_accesorial_serviceSearchObj.run().each(function (result) {
						pickupaccesorial.addSelectOption({
							value: result.getValue('name'),
							text: result.getValue('name')
						});
						return true;
					});
					var deliveryaccesorial = objFormAddressDetails.addField({
						id: 'deliveryaccesorial',
						type: N_server.FieldType.MULTISELECT,
						label: 'Delivery ACCESSORIALS'
					});
					var customlist_delivery_accesorial_pickupSearchObj = search.create({
						type: "customlist_p1_delivery_accesorial",
						filters: [],
						columns: [
							search.createColumn({
								name: "name",
								sort: search.Sort.ASC,
								label: "Name"
							})
						]
					});
					var searchResultCount = customlist_delivery_accesorial_pickupSearchObj.runPaged().count;
					customlist_delivery_accesorial_pickupSearchObj.run().each(function (result) {
						// .run().each has a limit of 4,000 results
						deliveryaccesorial.addSelectOption({
							value: result.getValue('name'),
							text: result.getValue('name')
						});
						return true;
					});

					var notes = objFormAddressDetails.addField({
						id: 'notes',
						type: N_server.FieldType.TEXT,
						label: 'Notes'
					});
					var ext = objFormAddressDetails.addField({
						id: 'ext',
						type: N_server.FieldType.TEXT,
						label: 'Ext'
					});
					var internalidnumbers = objFormAddressDetails.addField({
						id: 'addid',
						type: N_server.FieldType.TEXT,
						label: 'internal'
					});
					internalidnumbers.updateDisplayType({
						displayType: N_server.FieldDisplayType.HIDDEN
					});
					/****Set Update code ****/
					addressinternalid = context.request.parameters.ids;
					internalidnumbers.defaultValue = addressinternalid;

					var comapanyname_, contactname_, address_, address1_, address2_, city_, stateabbrevation_, countryabbrevation_, postalcode_,
						emailaddress_, phoneNumber_, opens_, closes_, pickupaccesorial_, deliveryaccesorial_, notes_, ext_;

					var customrecord_addresses_tmsSearchObj = search.create({
						type: "customrecord_p1_addresses",
						filters: [
							["internalidnumber", "equalto", addressinternalid]
						],
						columns: [
							search.createColumn({
								name: "custrecord_company_name123",
								label: "Company name"
							}),
							search.createColumn({
								name: "custrecord_contact_name",
								label: " Contact name"
							}),
							search.createColumn({
								name: "custrecord_email_address",
								label: "Email Address"
							}),
							search.createColumn({
								name: "custrecord_phonenumber",
								label: " Phone Number"
							}),
							search.createColumn({
								name: "custrecord_complete_address",
								label: "Address"
							}),
							search.createColumn({
								name: "custrecord_address_1",
								label: "Address 1"
							}),
							search.createColumn({
								name: "custrecord_address_2",
								label: "Address 2"
							}),
							search.createColumn({
								name: "custrecordcity",
								label: "City"
							}),
							search.createColumn({
								name: "custrecordstateabbreviation",
								label: "StateAbbreviation"
							}),
							search.createColumn({
								name: "custrecord_country_abbreviation",
								label: "Country Abbreviation"
							}),
							search.createColumn({
								name: "custrecordpostal_code",
								label: " Postal Code"
							}),
							search.createColumn({
								name: "custrecord_open",
								label: "Open"
							}),
							search.createColumn({
								name: "custrecord_close",
								label: "Close"
							}),
							search.createColumn({
								name: "custrecord_pickupaccessorials",
								label: "PICKUP ACCESSORIALS"
							}),
							search.createColumn({
								name: "custrecord_deliveryaccessorials",
								label: "DELIVERY ACCESSORIALS"
							}),
							search.createColumn({
								name: "custrecord_notes",
								label: "Notes"
							}),
							search.createColumn({
								name: "custrecord_ext",
								label: "Ext."
							})
						]
					});
					var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
					customrecord_addresses_tmsSearchObj.run().each(function (result) {
						comapanyname_ = result.getValue({
							name: "custrecord_company_name123"
						});
						contactname_ = result.getValue({
							name: "custrecord_contact_name"
						});
						emailaddress_ = result.getValue({
							name: "custrecord_email_address"
						});
						phoneNumber_ = result.getValue({
							name: "custrecord_phonenumber"
						});
						address_ = result.getValue({
							name: "custrecord_complete_address"
						});
						address1_ = result.getValue({
							name: "custrecord_address_1"
						});
						address2_ = result.getValue({
							name: "custrecord_address_2"
						});
						city_ = result.getValue({
							name: "custrecordcity"
						});
						stateabbrevation_ = result.getValue({
							name: "custrecordstateabbreviation"
						});
						countryabbrevation_ = result.getValue({
							name: "custrecord_country_abbreviation"
						});
						postalcode_ = result.getValue({
							name: "custrecordpostal_code"
						});
						opens_ = result.getValue({
							name: "custrecord_open"
						});
						closes_ = result.getValue({
							name: "custrecord_close"
						});
						pickupaccesorial_ = result.getValue({
							name: "custrecord_pickupaccessorials"
						});
						deliveryaccesorial_ = result.getValue({
							name: "custrecord_deliveryaccessorials"
						});
						notes_ = result.getValue({
							name: "custrecord_notes"
						});
						ext_ = result.getValue({
							name: "custrecord_ext"
						});
					});


					companyName.defaultValue = comapanyname_;
					conatctName.defaultValue = contactname_;
					emailAddress.defaultValue = emailaddress_;
					phone.defaultValue = phoneNumber_;
					address.defaultValue = address_;
					address1.defaultValue = address1_;
					address2.defaultValue = address2_;
					locations.defaultValue = city_;
					state.defaultValue = stateabbrevation_;
					country.defaultValue = countryabbrevation_;
					postalCode.defaultValue = postalcode_;
					opentime.defaultValue = opens_;
					closeTime.defaultValue = closes_;
					pickupaccesorial.defaultValue = pickupaccesorial_;
					deliveryaccesorial.defaultValue = deliveryaccesorial_;
					notes.defaultValue = notes_;
					ext.defaultValue = ext_;

					objFormAddressDetails.addSubmitButton({
						label: 'Update'
					});

					context.response.writePage({
						pageObject: objFormAddressDetails
					});
				} else {
					var internalidsadd = context.request.parameters.addid;
					var companyName_record = context.request.parameters.comapanyname;
					var contactname_record = context.request.parameters.contactname;
					var email_record = context.request.parameters.email;
					var phone_record = context.request.parameters.phone;
					var address_record = context.request.parameters.address;
					var address1_record = context.request.parameters.address1;
					var address2_record = context.request.parameters.address2;
					var location_record = context.request.parameters.locations;
					var state_record = context.request.parameters.custpage_state;
					var country_record = context.request.parameters.custpage_country;
					var postalcode_record = context.request.parameters.custpage_postalcode;
					var open_record = context.request.parameters.opens;
					var close_record = context.request.parameters.closes;
					var pickupaccesorial_record = context.request.parameters.pickupaccesorial;
					var deliveryaccesorial_record = context.request.parameters.deliveryaccesorial;
					var notes_record = context.request.parameters.notes;
					var ext_record = context.request.parameters.ext;

					var addressrecord = record.load({
						type: 'customrecord_p1_addresses',
						id: internalidsadd,
					});
					addressrecord.setValue({
						fieldId: 'custrecord_company_name123',
						value: companyName_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_contact_name',
						value: contactname_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_email_address',
						value: email_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_phonenumber',
						value: phone_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_complete_address',
						value: address_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_address_1',
						value: address1_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_address_2',
						value: address2_record
					});
					addressrecord.setValue({
						fieldId: 'custrecordcity',
						value: location_record
					});
					addressrecord.setValue({
						fieldId: 'custrecordstateabbreviation',
						value: state_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_country_abbreviation',
						value: country_record
					});
					addressrecord.setValue({
						fieldId: 'custrecordpostal_code',
						value: postalcode_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_open',
						value: open_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_close',
						value: close_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_pickupaccessorials',
						value: pickupaccesorial_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_deliveryaccessorials',
						value: deliveryaccesorial_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_notes',
						value: notes_record
					});
					addressrecord.setValue({
						fieldId: 'custrecord_ext',
						value: ext_record
					});
					addressrecord.save();
					
					var suiteletURL = url.resolveScript({
						scriptId: 'customscript_sl_p1_address_details',
						deploymentId: 'customdeploy_sl_p1_address_details'
					});
					redirect.redirect({
						url: suiteletURL
					});
				}
			} catch (e) {
				log.debug('Error in objFormAddressDetails ', e);
			}

		}

		return {
			onRequest: onRequest
		};
	});