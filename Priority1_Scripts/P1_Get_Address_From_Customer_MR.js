/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/search', 'N/record'], function (runtime, search, record) {
	/**
	 * Marks the beginning of the Map/Reduce process and generates input data.
	 *
	 * @typedef {Object} ObjectRef
	 * @property {number} id - Internal ID of the record instance
	 * @property {string} type - Record type id
	 *
	 * @return {Array|Object|Search|RecordRef} inputSummary
	 * @since 2015.1
	 */
	function getInputData() {
		try {
			/************* Start Get Adress Information ******************/

			var filters = runtime.getCurrentScript().getParameter({ name: 'custscript_filter_parameter' });
			// log.debug('filters', filters);
			//var jsonData = JSON.parse(filters);
			//log.debug('Map/Reduced jsonData', jsonData);

			//var records = jsonData.typeRecord;
			var records = filters;
			log.debug('records', records);

			if (records == 'customer') {
				var customerSearchObj = search.create({
					type: "customer",
					filters:
						[
							["isinactive", "is", "F"],
							"AND",
							["address", "isnotempty", ""],
							"AND",
							["zipcode", "isnotempty", ""]
						],
					columns:
						[
							search.createColumn({
								name: "entityid",
								sort: search.Sort.ASC,
								label: "ID"
							}),
							search.createColumn({ name: "companyname", label: "Company Name" }),
							search.createColumn({ name: "email", label: "Email" }),
							search.createColumn({ name: "phone", label: "Phone" }),
							search.createColumn({ name: "address", label: "Address" }),
							search.createColumn({ name: "address1", label: "Address 1" }),
							search.createColumn({ name: "address2", label: "Address 2" }),
							search.createColumn({ name: "city", label: "City" }),
							search.createColumn({ name: "state", label: "State/Province" }),
							search.createColumn({ name: "statedisplayname", label: "State/Province Display Name" }),
							search.createColumn({ name: "country", label: "Country" }),
							search.createColumn({ name: "countrycode", label: "Country Code" }),
							search.createColumn({ name: "zipcode", label: "Zip Code" }),
							search.createColumn({
								name: "addressinternalid",
								join: "Address",
								label: "Address Internal ID"
							})
						]
				});
				var searchResultCount = customerSearchObj.runPaged().count;
				log.debug("customerSearchObj result count", searchResultCount);
				return customerSearchObj;
			}
			else if (records == 'salesorder' || records == 'purchaseorder' || records == 'invoice' || records == 'vendorBill') {
				var salesorderSearchObj = search.create({
					type: records,
					filters:
						[
							["mainline", "is", "T"],
							"AND",
							["billaddress", "isnotempty", ""],
							"AND",
							["billzip", "isnotempty", ""]
						],
					columns:
						[
							search.createColumn({ name: "entity", label: "Name" }),
							search.createColumn({ name: "billaddress", label: "Billing Address" }),
							search.createColumn({ name: "billaddress1", label: "Billing Address 1" }),
							search.createColumn({ name: "billaddress2", label: "Billing Address 2" }),
							search.createColumn({ name: "billphone", label: "Billing Phone" }),
							search.createColumn({ name: "billcity", label: "Billing City" }),
							search.createColumn({ name: "billcountry", label: "Billing Country" }),
							search.createColumn({ name: "billcountrycode", label: "Billing Country Code" }),
							search.createColumn({ name: "billstate", label: "Billing State/Province" }),
							search.createColumn({ name: "billzip", label: "Billing Zip" }),
							search.createColumn({ name: "email", label: "Email" }),
							search.createColumn({
								name: "internalid",
								join: "billingAddress",
								label: "Internal ID"
							})
						]
				});
				var searchResultCount = salesorderSearchObj.runPaged().count;
				log.debug("salesorderSearchObj result count", searchResultCount);

				return salesorderSearchObj;
			}
			else if (records == 'employee') {
				var employeeSearchObj = search.create({
					type: "employee",
					filters:
						[
							["address", "isnotempty", ""],
							"AND",
							["zipcode", "isnotempty", ""]
						],
					columns:
						[
							search.createColumn({
								name: "entityid",
								sort: search.Sort.ASC,
								label: "Name"
							}),
							search.createColumn({ name: "email", label: "Email" }),
							search.createColumn({ name: "phone", label: "Phone" }),
							search.createColumn({ name: "address", label: "Address" }),
							search.createColumn({ name: "address1", label: "Address 1" }),
							search.createColumn({ name: "address2", label: "Address 2" }),
							search.createColumn({ name: "city", label: "City" }),
							search.createColumn({ name: "statedisplayname", label: "State/Province Display Name" }),
							search.createColumn({ name: "country", label: "Country" }),
							search.createColumn({ name: "countrycode", label: "Country Code" }),
							search.createColumn({
								name: "addressinternalid",
								join: "Address",
								label: "Address Internal ID"
							}),
							search.createColumn({ name: "zipcode", label: "Zip Code" })
						]
				});
				var searchResultCount = employeeSearchObj.runPaged().count;
				log.debug("employeeSearchObj result count", searchResultCount);
				return employeeSearchObj;

			}
			else if (records == 'location') {
				var locationSearchObj = search.create({
					type: "location",
					filters:
						[
							["isinactive", "is", "F"],
							"AND",
							["address", "isnotempty", ""],
							"AND",
							["zip", "isnotempty", ""]
						],
					columns:
						[
							search.createColumn({
								name: "name",
								sort: search.Sort.ASC,
								label: "Name"
							}),
							search.createColumn({ name: "phone", label: "Phone" }),
							search.createColumn({ name: "address1", label: "Address 1" }),
							search.createColumn({ name: "address2", label: "Address 2" }),
							search.createColumn({ name: "city", label: "City" }),
							search.createColumn({ name: "state", label: "State/Province" }),
							search.createColumn({ name: "country", label: "Country" }),
							search.createColumn({ name: "zip", label: "Zip" }),
							search.createColumn({
								name: "address",
								join: "address",
								label: " Address"
							}),
							search.createColumn({
								name: "internalid",
								join: "address",
								label: "Internal ID"
							})
						]
				});
				var searchResultCount = locationSearchObj.runPaged().count;
				log.debug("locationSearchObj result count", searchResultCount);

				return locationSearchObj;

			}
			else if (records == 'vendor') {
				var vendorSearchObj = search.create({
					type: "vendor",
					filters:
						[
							["isinactive", "is", "F"],
							"AND",
							["billaddress", "isnotempty", ""],
							"AND",
							["billingaddress.zipcode", "isnotempty", ""]
						],
					columns:
						[
							search.createColumn({ name: "altname", label: "Name" }),
							search.createColumn({ name: "email", label: "Email" }),
							search.createColumn({ name: "phone", label: "Phone" }),
							search.createColumn({ name: "billaddress", label: "Billing Address" }),
							search.createColumn({ name: "billaddress1", label: "Billing Address 1" }),
							search.createColumn({ name: "billaddress2", label: "Billing Address 2" }),
							search.createColumn({ name: "billphone", label: "Billing Phone" }),
							search.createColumn({ name: "billcity", label: "Billing City" }),
							search.createColumn({ name: "billstate", label: "Billing State/Province" }),
							search.createColumn({ name: "billcountry", label: "Billing Country" }),
							search.createColumn({ name: "billcountrycode", label: "Billing Country Code" }),
							search.createColumn({ name: "billzipcode", label: "Billing Zip" }),
							search.createColumn({
								name: "internalid",
								join: "billingAddress",
								label: "Internal ID"
							})
						]
				});
				var searchResultCount = vendorSearchObj.runPaged().count;
				log.debug("vendorSearchObj result count", searchResultCount);

				return vendorSearchObj;
			}

			/************* End Get Adress Information ******************/
		}
		catch (e) {
			log.debug('Error in get Input function', e.message);
		}

	}
	/**
	 * Executes when the map entry point is triggered and applies to each key/value pair.
	 *
	 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
	 * @since 2015.1
	 */
	function map(mapContext) {

		var value = JSON.parse(mapContext.value)
		log.debug({
			title: 'Map value',
			details: value
		})
		mapContext.write({
			key: value.id,
			value: value
		})
		var recordType = value.recordType;
		// log.debug('recordType',recordType);

		if (recordType == 'customer') {
			var customerId = value.id;

			var companyName = value.values.companyname;
			// log.debug('companyName', companyName);

			var contactName = value.values.altname;
			// log.debug('contactName', contactName);

			var custAddress = value.values.address;
			custAddress = custAddress.replace(/\n/g, " ");

			var custCity = value.values.city;
			var custZipcode = value.values.zipcode;
			var custPhone = value.values.phone;
			var custEmail = value.values.email;
			var custCountry = value.values.country.text;
			var custaddInternal = value.values['addressinternalid.Address'];
			var statedisplayname = value.values.statedisplayname.text;

			var recordInternal, addresscust;
			var customrecord_addresses_tmsSearchObj = search.create({
				type: "customrecord_p1_addresses",
				filters:
					[
						["custrecord_add_int_id_val", "is", custaddInternal]
					],
				columns:
					[
						search.createColumn({ name: "internalid", label: "Internal ID" })
					]
			});
			var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
			log.debug("customrecord_addresses_tmsSearchObj Internal ID", searchResultCount);
			customrecord_addresses_tmsSearchObj.run().each(function (result) {
				// .run().each has a limit of 4,000 results
				recordInternal = result.getValue('internalid');

				return false;
			});

			/****START to create record for customer in custom record****/
			var objcustomer;

			if (searchResultCount > 0) {
				objcustomer = record.load('customrecord_p1_addresses', recordInternal, true);
				log.debug('record load');

				objcustomer.setValue('custrecord_company_name123', companyName);
				objcustomer.setValue('custrecord_address_1', custAddress);
				objcustomer.setValue('name', custAddress);
				objcustomer.setValue('custrecord_contact_name', contactName);
				objcustomer.setValue('custrecordcity', custCity);
				objcustomer.setValue('custrecordstateabbreviation', statedisplayname);
				objcustomer.setValue('custrecord_country_abbreviation', custCountry);
				objcustomer.setValue('custrecordpostal_code', custZipcode);
				objcustomer.setValue('custrecord_email_address', custEmail);
				objcustomer.setValue('custrecord_phonenumber', custPhone);
				objcustomer.setValue('custrecord_add_int_id_val', custaddInternal);
				objcustomer.setValue('custrecord_p1_record_type', recordType);
				objcustomer.save();


			}
			else {
				objcustomer = record.create({
					type: 'customrecord_p1_addresses',
					isDynamic: true
				});

				log.debug('record create');
				objcustomer.setValue('custrecord_company_name123', companyName);
				objcustomer.setValue('custrecord_address_1', custAddress);
				objcustomer.setValue('name', custAddress);
				objcustomer.setValue('custrecord_contact_name', contactName);
				objcustomer.setValue('custrecordcity', custCity);
				objcustomer.setValue('custrecordstateabbreviation', statedisplayname);
				objcustomer.setValue('custrecord_country_abbreviation', custCountry);
				objcustomer.setValue('custrecordpostal_code', custZipcode);
				objcustomer.setValue('custrecord_email_address', custEmail);
				objcustomer.setValue('custrecord_phonenumber', custPhone);
				objcustomer.setValue('custrecord_add_int_id_val', custaddInternal);
				objcustomer.setValue('custrecord_p1_record_type', recordType);
				objcustomer.save();
			}



			/****END to create record for customer in custom record****/


		}
		else if (recordType == 'salesorder' || recordType == 'purchaseorder' || recordType == 'invoice' || recordType == 'vendorBill') {
			var salesBillInternal = value.values['internalid.billingAddress'].value;
			// log.debug('salesBillInternal', salesBillInternal);

			var salesBillName = value.values.entity.text;
			// log.debug('salesBillName', salesBillName);

			var billaddress = value.values.billaddress;
			billaddress = billaddress.replace(/\n/g, " ");

			var billaddress1 = value.values.billaddress1;
			var billaddress2 = value.values.billaddress2;
			var billPhone = value.values.billphone;
			var billCity = value.values.billcity;
			var billCountry = value.values.billcountry.value;
			var billZipcode = value.values.billzip;
			var billEmail = value.values.email;
			var billState = value.values.billstate;

			// var statefullName;
			// var stateSearchObj = search.create({
			// 	type: "state",
			// 	filters:
			// 		[
			// 			["shortname", "is", billState]
			// 		],
			// 	columns:
			// 		[
			// 			search.createColumn({ name: "fullname", label: "Full Name" })
			// 		]
			// });
			// var searchResultCount = stateSearchObj.runPaged().count;
			// log.debug("stateSearchObj result count", searchResultCount);
			// stateSearchObj.run().each(function (result) {
			// 	statefullName = result.getValue("fullname");
			// 	return false;
			// });
			// log.debug("statefullName", statefullName);

			/**** Search for duplicate records START****/

			var recordInternal;
			var customrecord_addresses_tmsSearchObj = search.create({
				type: "customrecord_p1_addresses",
				filters:
					[
						["custrecord_add_int_id_val", "is", salesBillInternal]
					],
				columns:
					[
						search.createColumn({ name: "internalid", label: "Internal ID" })
					]
			});
			var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
			log.debug("customrecord_addresses_tmsSearchObj internal id", searchResultCount);
			customrecord_addresses_tmsSearchObj.run().each(function (result) {
				// .run().each has a limit of 4,000 results
				recordInternal = result.getValue('internalid');
				log.debug('recordInternal', recordInternal);
				// return false;
			});

			/****START to create record for transaction in custom record****/

			var objtransac;

			if (searchResultCount > 0) {
				objtransac = record.load('customrecord_p1_addresses', recordInternal, true);
				log.debug('record load');
				objtransac.setValue('custrecord_company_name123', salesBillName);
				objtransac.setValue('custrecord_complete_address', billaddress);
				objtransac.setValue('custrecord_address_1', billaddress1);
				objtransac.setValue('custrecord_address_2', billaddress2);
				objtransac.setValue('name', salesBillName);
				objtransac.setValue('custrecord_contact_name', salesBillName);
				objtransac.setValue('custrecordcity', billCity);
				objtransac.setValue('custrecordstateabbreviation', billState);
				objtransac.setValue('custrecord_country_abbreviation', billCountry);
				objtransac.setValue('custrecordpostal_code', billZipcode);
				objtransac.setValue('custrecord_email_address', billEmail);
				objtransac.setValue('custrecord_phonenumber', billPhone);
				objtransac.setValue('custrecord_add_int_id_val', salesBillInternal);
				objtransac.setValue('custrecord_p1_record_type', recordType);
				objtransac.save();
			}
			else {
				objtransac = record.create({
					type: 'customrecord_p1_addresses',
					isDynamic: true
				});

				log.debug('record create');
				objtransac.setValue('custrecord_company_name123', salesBillName);
				objtransac.setValue('custrecord_complete_address', billaddress);
				objtransac.setValue('custrecord_address_1', billaddress1);
				objtransac.setValue('custrecord_address_2', billaddress2);
				objtransac.setValue('name', salesBillName);
				objtransac.setValue('custrecord_contact_name', salesBillName);
				objtransac.setValue('custrecordcity', billCity);
				objtransac.setValue('custrecordstateabbreviation', billState);
				objtransac.setValue('custrecord_country_abbreviation', billCountry);
				objtransac.setValue('custrecordpostal_code', billZipcode);
				objtransac.setValue('custrecord_email_address', billEmail);
				objtransac.setValue('custrecord_phonenumber', billPhone);
				objtransac.setValue('custrecord_add_int_id_val', salesBillInternal);
				objtransac.setValue('custrecord_p1_record_type', recordType);
				objtransac.save();
			}

			/****END to create record for transaction in custom record****/

		}
		else if (recordType == 'employee') {
			var BillInternal = value.values['addressinternalid.Address'];
			log.debug('BillInternal', BillInternal);

			var empName = value.values.entityid;
			log.debug('empName', empName);

			var empAddress = value.values.billaddress;
			empAddress = empAddress.replace(/\n/g, " ");

			var empPhone = value.values.phone;
			var empCity = value.values.city;
			var empCountry = value.values.country.text;
			var empZipcode = value.values.zipcode;
			var empEmail = value.values.email;
			var empState = value.values.statedisplayname.text;


			/**** Search for duplicate records START****/

			var recordInternal;
			var customrecord_addresses_tmsSearchObj = search.create({
				type: "customrecord_p1_addresses",
				filters:
					[
						["custrecord_add_int_id_val", "is", BillInternal]
					],
				columns:
					[
						search.createColumn({ name: "internalid", label: "Internal ID" })
					]
			});
			var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
			log.debug("customrecord_addresses_tmsSearchObj internal id", searchResultCount);
			customrecord_addresses_tmsSearchObj.run().each(function (result) {
				// .run().each has a limit of 4,000 results
				recordInternal = result.getValue('internalid');
				log.debug('recordInternal', recordInternal);
				return false;
			});

			/****START to create record for Employee in custom record****/

			var objEmployee;

			if (searchResultCount > 0) {
				objEmployee = record.load('customrecord_p1_addresses', recordInternal, true);
				log.debug('record load');
				objEmployee.setValue('custrecord_company_name123', empName);
				objEmployee.setValue('custrecord_address_1', empAddress);
				objEmployee.setValue('name', empAddress);
				objEmployee.setValue('custrecord_contact_name', empName);
				objEmployee.setValue('custrecordcity', empCity);
				objEmployee.setValue('custrecordstateabbreviation', empState);
				objEmployee.setValue('custrecord_country_abbreviation', empCountry);
				objEmployee.setValue('custrecordpostal_code', empZipcode);
				objEmployee.setValue('custrecord_email_address', empEmail);
				objEmployee.setValue('custrecord_phonenumber', empPhone);
				objEmployee.setValue('custrecord_add_int_id_val', BillInternal);
				objEmployee.setValue('custrecord_p1_record_type', recordType);
				objEmployee.save();
			}
			else {
				objEmployee = record.create({
					type: 'customrecord_p1_addresses',
					isDynamic: true
				});

				log.debug('record create');
				objEmployee.setValue('custrecord_company_name123', empName);
				objEmployee.setValue('custrecord_address_1', empAddress);
				objEmployee.setValue('name', empAddress);
				objEmployee.setValue('custrecord_contact_name', empName);
				objEmployee.setValue('custrecordcity', empCity);
				objEmployee.setValue('custrecordstateabbreviation', empState);
				objEmployee.setValue('custrecord_country_abbreviation', empCountry);
				objEmployee.setValue('custrecordpostal_code', empZipcode);
				objEmployee.setValue('custrecord_email_address', empEmail);
				objEmployee.setValue('custrecord_phonenumber', empPhone);
				objEmployee.setValue('custrecord_add_int_id_val', BillInternal);
				objEmployee.setValue('custrecord_p1_record_type', recordType);
				objEmployee.save();
			}

			/****END to create record for Employee in custom record****/

		}
		else if (recordType == 'location') {
			var addressInternal = value.values['internalid.address'].value;
			// log.debug('addressInternal', addressInternal);

			var LocName = value.values.name;
			// log.debug('LocName', LocName);
			var locAddress = value.values['address.address'];
			locAddress = locAddress.replace(/\n/g, " ");
			var loc_address1 = value.values.address1;
			var loc_address2 = value.values.address2;
			var locPhone = value.values.phone;
			var locCity = value.values.city;
			var locCountry = value.values.country;
			var locZipcode = value.values.zip;
			var locState = value.values.state;

			var statefullName;
			var stateSearchObj = search.create({
				type: "state",
				filters:
					[
						["shortname", "is", locState]
					],
				columns:
					[
						search.createColumn({ name: "fullname", label: "Full Name" })
					]
			});
			var searchResultCount = stateSearchObj.runPaged().count;
			log.debug("stateSearchObj result count", searchResultCount);
			stateSearchObj.run().each(function (result) {
				statefullName = result.getValue("fullname");
				return false;
			});

			log.debug("statefullName", statefullName);


			/**** Search for duplicate records START****/

			var recordInternal;
			var customrecord_addresses_tmsSearchObj = search.create({
				type: "customrecord_p1_addresses",
				filters:
					[
						["custrecord_add_int_id_val", "is", addressInternal]
					],
				columns:
					[
						search.createColumn({ name: "internalid", label: "Internal ID" })
					]
			});
			var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
			log.debug("customrecord_addresses_tmsSearchObj internal id", searchResultCount);
			customrecord_addresses_tmsSearchObj.run().each(function (result) {

				recordInternal = result.getValue('internalid');
				log.debug('recordInternal', recordInternal);
				return false;
			});

			/****START to create record for Location in custom record****/

			var objLocation;

			if (searchResultCount > 0) {
				objLocation = record.load('customrecord_p1_addresses', recordInternal, true);
				log.debug('record load');
				objLocation.setValue('custrecord_company_name123', LocName);

				objLocation.setValue('custrecord_address_1', loc_address1);
				objLocation.setValue('custrecord_address_2', loc_address2);
				objLocation.setValue('custrecord_complete_address', locAddress);
				objLocation.setValue('name', LocName);
				objLocation.setValue('custrecord_contact_name', LocName);
				objLocation.setValue('custrecordcity', locCity);
				objLocation.setValue('custrecordstateabbreviation', statefullName);
				objLocation.setValue('custrecord_country_abbreviation', locCountry);
				objLocation.setValue('custrecordpostal_code', locZipcode);
				objLocation.setValue('custrecord_phonenumber', locPhone);
				objLocation.setValue('custrecord_add_int_id_val', addressInternal);
				objLocation.setValue('custrecord_p1_record_type', recordType);
				objLocation.save();
			}
			else {
				objLocation = record.create({
					type: 'customrecord_p1_addresses',
					isDynamic: true
				});

				log.debug('record create');
				objLocation.setValue('custrecord_company_name123', LocName);
				objLocation.setValue('custrecord_address_1', loc_address1);
				objLocation.setValue('custrecord_address_2', loc_address2);
				objLocation.setValue('custrecord_complete_address', locAddress);
				objLocation.setValue('name', LocName);
				objLocation.setValue('custrecord_contact_name', LocName);
				objLocation.setValue('custrecordcity', locCity);
				objLocation.setValue('custrecordstateabbreviation', statefullName);
				objLocation.setValue('custrecord_country_abbreviation', locCountry);
				objLocation.setValue('custrecordpostal_code', locZipcode);
				objLocation.setValue('custrecord_phonenumber', locPhone);
				objLocation.setValue('custrecord_add_int_id_val', addressInternal);
				objLocation.setValue('custrecord_p1_record_type', recordType);
				objLocation.save();
			}

			/****END to create record for Location in custom record****/
		}
		else if (recordType == 'vendor') {

			var vendorAdd_Id = value.values['internalid.billingAddress'].value;
			// log.debug('Vendor Internal', vendorAdd_Id);

			var vend_CompanyName = value.values.altname;
			var vend_billAddress = value.values.billaddress;
			vend_billAddress = vend_billAddress.replace(/\n/g, " ");
			// log.debug("vend_billAddress", vend_billAddress);
			var vend_address1 = value.values.billaddress1;
			var vend_address2 = value.values.billaddress2;
			var vend_phone = value.values.phone;
			var vend_billPhone = value.values.billphone;
			var vend_email = value.values.email;
			var vend_city = value.values.billcity;
			var vend_stateCode = value.values.billstate.value;
			var vend_country = value.values.billcountry.value;
			var vend_zip = value.values.billzipcode;

			// var vend_State;
			// var stateSearchObj = search.create({
			// 	type: "state",
			// 	filters:
			// 		[
			// 			["shortname", "is", vend_stateCode]
			// 		],
			// 	columns:
			// 		[
			// 			search.createColumn({ name: "fullname", label: "Full Name" })
			// 		]
			// });
			// var searchResultCount = stateSearchObj.runPaged().count;
			// // log.debug("stateSearchObj result count", searchResultCount);
			// stateSearchObj.run().each(function (result) {
			// 	vend_State = result.getValue("fullname");
			// 	return false;
			// });

			/**** Search for duplicate records START****/
			var rec_addressId;
			var customrecord_addresses_tmsSearchObj = search.create({
				type: "customrecord_p1_addresses",
				filters:
					[
						["custrecord_add_int_id_val", "is", vendorAdd_Id]
					],
				columns:
					[
						search.createColumn({ name: "internalid", label: "Internal ID" })
					]
			});
			var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
			log.debug("customrecord_addresses_tmsSearchObj internal id", searchResultCount);
			customrecord_addresses_tmsSearchObj.run().each(function (result) {
				rec_addressId = result.getValue('internalid');
				log.debug('rec_addressId', rec_addressId);
				return false;
			});

			/****START to create record for transaction in custom record****/
			var record_Obj;

			if (searchResultCount > 0) {
				// log.debug("UPDATE RECORD")
				record_Obj = record.load('customrecord_p1_addresses', rec_addressId, true);

				record_Obj.setValue('custrecord_company_name123', vend_CompanyName);
				record_Obj.setValue('custrecord_complete_address', vend_billAddress);
				record_Obj.setValue('custrecord_address_1', vend_address1);
				record_Obj.setValue('custrecord_address_2', vend_address2);
				record_Obj.setValue('name', vend_CompanyName);
				record_Obj.setValue('custrecord_contact_name', vend_CompanyName);
				record_Obj.setValue('custrecordcity', vend_city);
				record_Obj.setValue('custrecordstateabbreviation', vend_stateCode);
				record_Obj.setValue('custrecord_country_abbreviation', vend_country);
				record_Obj.setValue('custrecordpostal_code', vend_zip);
				record_Obj.setValue('custrecord_email_address', vend_email);
				record_Obj.setValue({
					fieldId: 'custrecord_phonenumber',
					value: vend_billPhone ? vend_billPhone : vend_phone,
					ignoreFieldChange: true
				});
				record_Obj.setValue('custrecord_add_int_id_val', vendorAdd_Id);
				record_Obj.setValue('custrecord_p1_record_type', recordType);

				record_Obj.save();
			} else {
				// log.debug("CREATE RECORD")
				record_Obj = record.create({
					type: 'customrecord_p1_addresses',
					isDynamic: true
				});

				record_Obj.setValue('custrecord_company_name123', vend_CompanyName);
				record_Obj.setValue('custrecord_complete_address', vend_billAddress);
				record_Obj.setValue('custrecord_address_1', vend_address1);
				record_Obj.setValue('custrecord_address_2', vend_address2);
				record_Obj.setValue('name', vend_CompanyName);
				record_Obj.setValue('custrecord_contact_name', vend_CompanyName);
				record_Obj.setValue('custrecordcity', vend_city);
				record_Obj.setValue('custrecordstateabbreviation', vend_stateCode);
				record_Obj.setValue('custrecord_country_abbreviation', vend_country);
				record_Obj.setValue('custrecordpostal_code', vend_zip);
				record_Obj.setValue('custrecord_email_address', vend_email);
				record_Obj.setValue({
					fieldId: 'custrecord_phonenumber',
					value: vend_billPhone ? vend_billPhone : vend_phone,
					ignoreFieldChange: true
				});
				record_Obj.setValue('custrecord_add_int_id_val', vendorAdd_Id);
				record_Obj.setValue('custrecord_p1_record_type', recordType);

				record_Obj.save();
			}
		}

	}
	/**
	 * Executes when the reduce entry point is triggered and applies to each group.
	 *
	 * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
	 * @since 2015.1
	 */
	function reduce(reduceContext) {
		var vData = reduceContext.values[0];

	}
	/**
	 * Executes when the summarize entry point is triggered and applies to the result set.
	 *
	 * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
	 * @since 2015.1
	 */
	function summarize(summary) {
		if (summary.inputSummary.error) {
			log.error({
				title: 'Input Error',
				details: summary.inputSummary.error
			});
		}
		summary.mapSummary.errors.iterator().each(function (key, error, executionNo) {
			// log.error({
			// title: 'Map error for key: ' + key + ', execution no. ' + executionNo,
			// details: error
			// });
			return true;
		});
		summary.reduceSummary.errors.iterator().each(function (key, error, executionNo) {
			// log.error({
			// title: 'Reduce error for key: ' + key + ', execution no. ' + executionNo,
			// details: error
			// });
			return true;
		});
	}
	return {
		getInputData: getInputData,
		map: map,
		reduce: reduce,
		summarize: summarize
	};
});