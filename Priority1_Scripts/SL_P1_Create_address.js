/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/redirect', 'N/url'],
    function(N_server, search, record, redirect, url) {
        function onRequest(context) {
            try {

                /***Start to Create a api form ***/
                var objFormAddressCreate = N_server.createForm({
                    title: 'CREATE ADDRESS'
                });
                objFormAddressCreate.clientScriptModulePath = './CS_P1_addressValidation.js';
                var companyName = objFormAddressCreate.addField({
                    id: 'custfield_companyname',
                    type: N_server.FieldType.TEXT,
                    label: 'Company name'
                });
                companyName.isMandatory = true;

                objFormAddressCreate.addField({
                    id: 'custfield_contactname',
                    type: N_server.FieldType.TEXT,
                    label: 'Contact name'
                });
                var address1 = objFormAddressCreate.addField({
                    id: 'custfield_address1',
                    type: N_server.FieldType.TEXT,
                    label: 'Address 1'
                });
                address1.isMandatory = true;
                objFormAddressCreate.addField({
                    id: 'custfield_address2',
                    type: N_server.FieldType.TEXT,
                    label: 'Address 2'
                });
                var city = objFormAddressCreate.addField({
                    id: 'custfield_city',
                    type: N_server.FieldType.TEXT,
                    label: 'City'
                });
                city.isMandatory = true;

                var StateAbbreviationUS = objFormAddressCreate.addField({
                    id: 'custpage_state_abbrevation',
                    type: N_server.FieldType.SELECT,
                    label: 'StateAbbreviation'
                });
                StateAbbreviationUS.isMandatory = true;

                StateAbbreviationUS.addSelectOption({
                    value: ' ',
                    text: ' '
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Alabama',
                    text: 'Alabama'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Alaska',
                    text: 'Alaska'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Arizona',
                    text: 'Arizona'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Arkansas',
                    text: 'Arkansas'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'California',
                    text: 'California'
                });

                StateAbbreviationUS.addSelectOption({
                    value: 'Colorado',
                    text: 'Colorado'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Connecticut',
                    text: 'Connecticut'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Delaware',
                    text: 'Delaware'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'District of Columbia',
                    text: 'District of Columbia'
                });

                StateAbbreviationUS.addSelectOption({
                    value: 'District of Columbia',
                    text: 'District of Columbia'
                });

                StateAbbreviationUS.addSelectOption({
                    value: 'Florida',
                    text: 'Florida'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Georgia',
                    text: 'Georgia'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Hawaii',
                    text: 'Hawaii'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Idaho',
                    text: 'Idaho'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Illinois',
                    text: 'Illinois'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Indiana',
                    text: 'Indiana'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Iowa',
                    text: 'Iowa'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Kansas',
                    text: 'Kansas'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Kentucky',
                    text: 'Kentucky'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Lousiana',
                    text: 'Lousiana'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Maine',
                    text: 'Maine'
                });

                StateAbbreviationUS.addSelectOption({
                    value: 'Maryland',
                    text: 'Maryland'
                });

                StateAbbreviationUS.addSelectOption({
                    value: 'Massachusetts',
                    text: 'Massachusetts'
                });

                StateAbbreviationUS.addSelectOption({
                    value: 'Michigan',
                    text: 'Michigan'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Minnesota',
                    text: 'Minnesota'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Mississippi',
                    text: 'Mississippi'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Missouri',
                    text: 'Missouri'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Montana',
                    text: 'Montana'
                });

                StateAbbreviationUS.addSelectOption({
                    value: 'Nebraska',
                    text: 'Nebraska'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Nevada',
                    text: 'Nevada'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'New Hampshire',
                    text: 'New Hampshire'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'New Jersey',
                    text: 'New Jersey'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'New Mexico',
                    text: 'New Mexico'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'New York',
                    text: 'New York'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'North Carolina',
                    text: 'North Carolina'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Ohio',
                    text: 'Ohio'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Oklahoma',
                    text: 'Oklahoma'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Oregon',
                    text: 'Oregon'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Pennsylvania',
                    text: 'Pennsylvania'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Rhode Island',
                    text: 'Rhode Island'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'South Carolina',
                    text: 'South Carolina'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'South Dakota',
                    text: 'South Dakota'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Tennessee',
                    text: 'Tennessee'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Texas',
                    text: 'Texas'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Utah',
                    text: 'Utah'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Vermont',
                    text: 'Vermont'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Virginia',
                    text: 'Virginia'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Washington',
                    text: 'Washington'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'West Virginia',
                    text: 'West Virginia'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Wisconsin',
                    text: 'Wisconsin'
                });
                StateAbbreviationUS.addSelectOption({
                    value: 'Wyoming',
                    text: 'Wyoming'
                });

                //for canada 
                var StateAbbreviation_CAN = objFormAddressCreate.addField({
                    id: 'state_can',
                    type: N_server.FieldType.SELECT,
                    label: 'StateAbbreviation'
                });
                StateAbbreviation_CAN.isMandatory = true;
                StateAbbreviation_CAN.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: '',
                    text: ''
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Alberta',
                    text: 'Alberta'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'British Columbia',
                    text: 'British Columbia'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Manitoba',
                    text: 'Manitoba'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'New Brunswick',
                    text: 'New Brunswick'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Newfoundland and Labrador',
                    text: 'Newfoundland and Labrador'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Nova Scotia',
                    text: 'Nova Scotia'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Northwest Territories',
                    text: 'Northwest Territories'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Nunavut',
                    text: 'Nunavut'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Ontario',
                    text: 'Ontario'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Prince Edward Island',
                    text: 'Prince Edward Island'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Quebec',
                    text: 'Quebec'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Saskatchewan',
                    text: 'Saskatchewan'
                });
                StateAbbreviation_CAN.addSelectOption({
                    value: 'Yukon',
                    text: 'Yukon'
                });
                var countryAbbrevation = objFormAddressCreate.addField({
                    id: 'custfield_country_abbrevation',
                    type: N_server.FieldType.SELECT,
                    label: 'Country Abbreviation'
                });
                countryAbbrevation.addSelectOption({
                    value: ' ',
                    text: ' '
                });
                countryAbbrevation.addSelectOption({
                    value: 'United State',
                    text: 'United State'
                });
                countryAbbrevation.addSelectOption({
                    value: 'Canada',
                    text: 'Canada'
                });
                countryAbbrevation.addSelectOption({
                    value: 'Mexico',
                    text: 'Mexico'
                });
                countryAbbrevation.addSelectOption({
                    value: 'Puerto Rico',
                    text: 'Puerto Rico'
                });
                countryAbbrevation.isMandatory = true;
                var postalCode = objFormAddressCreate.addField({
                    id: 'custfield_postal_code',
                    type: N_server.FieldType.TEXT,
                    label: 'Postal Code'
                });
                postalCode.isMandatory = true;

                objFormAddressCreate.addField({
                    id: 'custfield_email_address',
                    type: N_server.FieldType.TEXT,
                    label: 'Email Address'
                });
                var phoneNumber = objFormAddressCreate.addField({
                    id: 'custfield_phone',
                    type: N_server.FieldType.TEXT,
                    label: 'Phone Number'
                });
                phoneNumber.isMandatory = true;

                objFormAddressCreate.addField({
                    id: 'custfield_ext',
                    type: N_server.FieldType.TEXT,
                    label: 'Ext.'
                });
                var opentime = objFormAddressCreate.addField({
                    id: 'custfield_open',
                    type: N_server.FieldType.SELECT,
                    label: 'Open'
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
                opentime.defaultValue = '08:00 AM';
                var closeTime = objFormAddressCreate.addField({
                    id: 'custfield_close',
                    type: N_server.FieldType.SELECT,
                    label: 'Close'
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
                var pickupAccesorial = objFormAddressCreate.addField({
                    id: 'custfield_pickupaccessorials',
                    type: N_server.FieldType.MULTISELECT,
                    label: 'PICKUP ACCESSORIALS'
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
                customlist_pickup_accesorial_serviceSearchObj.run().each(function(result) {
                    pickupAccesorial.addSelectOption({
                        value: result.getValue('name'),
                        text: result.getValue('name')
                    });
                    return true;
                });
                var destinationAccessorial = objFormAddressCreate.addField({
                    id: 'custfield_deliveryaccessorials',
                    type: N_server.FieldType.MULTISELECT,
                    label: 'DELIVERY ACCESSORIALS'
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
                log.debug("customlist_delivery_accesorial_pickupSearchObj result count", searchResultCount);
                customlist_delivery_accesorial_pickupSearchObj.run().each(function(result) {
                    destinationAccessorial.addSelectOption({
                        value: result.getValue('name'),
                        text: result.getValue('name')
                    });
                    return true;
                });

                objFormAddressCreate.addField({
                    id: 'custfield_notes',
                    type: N_server.FieldType.TEXT,
                    label: 'Notes'
                });
                if (context.request.method == 'GET') {

                    objFormAddressCreate.addSubmitButton({
                        label: 'Create' /// add Edit button
                    });
                }

                /***End to set Value in Api Config Custom Record***/
                else {
                    var companyName_ = context.request.parameters.custfield_companyname;
                    var contactName_ = context.request.parameters.custfield_contactname;
                    var address1 = context.request.parameters.custfield_address1;
                    var address2 = context.request.parameters.custfield_address2;
                    var city_ = context.request.parameters.custfield_city;
                    var state_Abbrevation_ = context.request.parameters.custpage_state_abbrevation;
                    var country_Abbrevation_ = context.request.parameters.custfield_country_abbrevation;
                    var postal_code_ = context.request.parameters.custfield_postal_code;
                    var email_address_ = context.request.parameters.custfield_email_address;
                    var phone_ = context.request.parameters.custfield_phone;
                    var ext_ = context.request.parameters.custfield_ext;
                    var open_ = context.request.parameters.custfield_open;
                    var close_ = context.request.parameters.custfield_close;
                    var pickupAccesorial_ = context.request.parameters.custfield_pickupaccessorials;
                    var deliveryAccesorial_ = context.request.parameters.custfield_deliveryaccessorials;
                    var notes_ = context.request.parameters.custfield_notes;

                    var addressMappingRecord = record.create({
                        type: 'customrecord_p1_addresses'
                    });

                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_company_name123',
                        value: companyName_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_contact_name',
                        value: contactName_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_address_1',
                        value: address1
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'name',
                        value: address1
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_address_2',
                        value: address2
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecordcity',
                        value: city_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecordstateabbreviation',
                        value: state_Abbrevation_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_country_abbreviation',
                        value: country_Abbrevation_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecordpostal_code',
                        value: postal_code_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_email_address',
                        value: email_address_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_phonenumber',
                        value: phone_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_ext',
                        value: ext_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_open',
                        value: open_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_close',
                        value: close_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_pickupaccessorials',
                        value: pickupAccesorial_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_deliveryaccessorials',
                        value: deliveryAccesorial_
                    });
                    addressMappingRecord.setValue({
                        fieldId: 'custrecord_notes',
                        value: notes_
                    });
                    addressMappingRecord.save();
                    var suiteletURLaddress = url.resolveScript({
                        scriptId: 'customscript_sl_p1_address_details',
                        deploymentId: 'customdeploy_sl_p1_address_details'
                    });
                    redirect.redirect({
                        url: suiteletURLaddress
                    });
                }
                context.response.writePage({
                    pageObject: objFormAddressCreate
                });
            } catch (e) {
                log.debug('Error in configuration Api ', e);
            }

            /***ENd to Create a api form ***/

        }

        return {
            onRequest: onRequest
        };
    });