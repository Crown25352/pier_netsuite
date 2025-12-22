/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/record', 'N/format', 'N/cache', 'N/file', 'N/url', 'N/search', 'N/https', 'N/redirect', 'N/format', 'N/format/i18n', 'N/runtime'],
    function (N_server, record, format, cache, file, url, search, https, redirect, format, format, runtime) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {

            if (context.request.method === 'GET') {

                try {
                    var quote_Rec_Id = context.request.parameters.crcd; // quote record ID
                    var quote_record;
                    log.debug('quote_Rec_Id', quote_Rec_Id);

                    quote_Rec_Id ? quote_record = record.load({
                        type: 'customrecord_p1_priority_quote',
                        id: quote_Rec_Id,
                        // isDynamic: true
                    }) : quote_record = '';

                    quote_record ? item_object = quote_record.getValue('custrecord_p1_item_object') : item_object = '';

                    var recId = quote_record.getValue('custrecord_so_int_id');
                    var recType = quote_record.getValue('custrecord_p1_trx_record_type');
                    var bol_Notes;
                    if (recType == 'salesorder') {
                        var fieldLookUp = search.lookupFields({
                            type: recType,
                            id: recId,
                            columns: ['custbody_if_bol_notes']
                        });

                        fieldLookUp ? bol_Notes = fieldLookUp.custbody_if_bol_notes : '';
                    }
                    log.debug('bol_Notes', bol_Notes);

                    // --------- UI forquote_fld.defaultValue = quoteRecId; Dispatch Screen -----------------------

                    var pickDeliveryForm = N_server.createForm({
                        title: 'Pickup & Delivery'
                    });
                    pickDeliveryForm.clientScriptModulePath = './CS_pickup_and_del_screen.js';

                    var carrierInfo = pickDeliveryForm.addFieldGroup({
                        id: 'carrierInfofieldgroup',
                        label: 'SELECT QUOTE'
                    });
                    var carCharge = pickDeliveryForm.addField({
                        id: 'carriertotalcharges',
                        type: N_server.FieldType.TEXT,
                        label: 'TOTAL CHARGES',
                        container: 'carrierInfofieldgroup'
                    });

                    carCharge.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var quote_fld = pickDeliveryForm.addField({
                        id: 'quote_int_id',
                        type: N_server.FieldType.TEXT,
                        label: 'Quote Record',
                        container: 'carrierInfofieldgroup'
                    });
                    quote_fld.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    var carName = pickDeliveryForm.addField({
                        id: 'carriername',
                        type: N_server.FieldType.TEXT,
                        label: 'CARRIER NAME',
                        container: 'carrierInfofieldgroup'
                    });
                    carName.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var carCode = pickDeliveryForm.addField({
                        id: 'carriercode',
                        type: N_server.FieldType.TEXT,
                        label: 'CARRIER CODE',
                        container: 'carrierInfofieldgroup'
                    });
                    carCode.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var carServicelevel = pickDeliveryForm.addField({
                        id: 'carrier_serviceleveldesc',
                        type: N_server.FieldType.TEXT,
                        label: 'SERVICE LEVEL DESCRIPTION',
                        container: 'carrierInfofieldgroup'
                    });
                    carServicelevel.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var carfrom = pickDeliveryForm.addField({
                        id: 'carrierpickupfrom',
                        type: N_server.FieldType.TEXT,
                        label: 'FROM',
                        container: 'carrierInfofieldgroup'
                    });
                    carfrom.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var carto = pickDeliveryForm.addField({
                        id: 'carrierpickupto',
                        type: N_server.FieldType.TEXT,
                        label: 'TO',
                        container: 'carrierInfofieldgroup'
                    });
                    carto.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var carDate = pickDeliveryForm.addField({
                        id: 'carrierpickupdate',
                        type: N_server.FieldType.TEXT,
                        label: 'PICKUP DATE',
                        container: 'carrierInfofieldgroup'
                    });
                    carDate.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var estimate_date_fld = pickDeliveryForm.addField({
                        id: 'est_del_date',
                        type: N_server.FieldType.TEXT,
                        label: 'Estimate Delivery Date',
                        container: 'carrierInfofieldgroup'
                    });
                    estimate_date_fld.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var cartransistday = pickDeliveryForm.addField({
                        id: 'carriertransistdays',
                        type: N_server.FieldType.TEXT,
                        label: 'TRANSIT DAYS',
                        container: 'carrierInfofieldgroup'
                    });
                    cartransistday.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var carlibilitynew = pickDeliveryForm.addField({
                        id: 'carrierlibilitynew',
                        type: N_server.FieldType.TEXT,
                        label: 'CARRIER LIABILITY NEW',
                        container: 'carrierInfofieldgroup'
                    });
                    carlibilitynew.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var carlibilityUsed = pickDeliveryForm.addField({
                        id: 'carrierlibilityused',
                        type: N_server.FieldType.TEXT,
                        label: 'CARRIER LIABILITY USED',
                        container: 'carrierInfofieldgroup'
                    });
                    carlibilityUsed.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    var carrier_Id = pickDeliveryForm.addField({
                        id: 'custpage_carrier_id',
                        type: N_server.FieldType.TEXT,
                        label: 'Carrier ID'
                    });
                    carrier_Id.updateDisplayType({
                        displayType: N_server.FieldDisplayType.HIDDEN
                    });
                    var carrier_QuoteNumber = pickDeliveryForm.addField({
                        id: 'custpage_carrier_qoute_no',
                        type: N_server.FieldType.TEXT,
                        label: 'Carrier Quote Number'
                    });
                    carrier_QuoteNumber.updateDisplayType({
                        displayType: N_server.FieldDisplayType.HIDDEN
                    });

                    // var salesOrderIdField = pickDeliveryForm.addField({
                    //     id: 'salesorderidfieldid',
                    //     type: N_server.FieldType.TEXT,
                    //     label: 'Sales Order ID',
                    //     container: 'carrierInfofieldgroup'
                    // });
                    // salesOrderIdField.updateDisplayType({
                    //     displayType: N_server.FieldDisplayType.HIDDEN
                    // });

                    // ----------------------- Pick Up Fields -------------------------------

                    var pickupField = pickDeliveryForm.addFieldGroup({
                        id: 'pickupfieldgroupid',
                        label: 'PICKUP'
                    });
                    var pickupDate = pickDeliveryForm.addField({
                        id: 'pickupdate',
                        type: N_server.FieldType.DATE,
                        label: 'PICKUP DATE',
                        container: 'pickupfieldgroupid'
                    });
                    pickupDate.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    var pickupFrom = pickDeliveryForm.addField({
                        id: 'pickupstart',
                        type: N_server.FieldType.SELECT,
                        label: 'PICKUP START',
                        container: 'pickupfieldgroupid'

                    });
                    pickupFrom.addSelectOption({
                        value: '8:00 AM',
                        text: '8:00 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '8:30 AM',
                        text: '8:30 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '9:00 AM',
                        text: '9:00 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '9:30 AM',
                        text: '9:30 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '10:00 AM',
                        text: '10:00 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '10:30 AM',
                        text: '10:30 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '11:00 AM',
                        text: '11:00 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '11:30 AM',
                        text: '11:30 AM'
                    });
                    pickupFrom.addSelectOption({
                        value: '12:00 PM',
                        text: '12:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '12:30 PM',
                        text: '12:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '1:00 PM',
                        text: '1:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '1:30 PM',
                        text: '1:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '2:00 PM',
                        text: '2:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '2:30 PM',
                        text: '2:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '3:00 PM',
                        text: '3:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '3:30 PM',
                        text: '3:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '4:00 PM',
                        text: '4:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '4:30 PM',
                        text: '4:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '5:00 PM',
                        text: '5:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '5:30 PM',
                        text: '5:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '6:00 PM',
                        text: '6:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '6:30 PM',
                        text: '6:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '7:00 PM',
                        text: '7:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '7:30 PM',
                        text: '7:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '8:00 PM',
                        text: '8:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '8:30 PM',
                        text: '8:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '9:00 PM',
                        text: '9:00 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '9:30 PM',
                        text: '9:30 PM'
                    });
                    pickupFrom.addSelectOption({
                        value: '10:00 PM',
                        text: '10:00 PM'
                    });
                    var pickupTo = pickDeliveryForm.addField({
                        id: 'custpage_pickupend',
                        type: N_server.FieldType.SELECT,
                        label: 'PICKUP END',
                        container: 'pickupfieldgroupid'
                    });
                    pickupTo.addSelectOption({
                        value: '8:00 AM',
                        text: '8:00 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '8:30 AM',
                        text: '8:30 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '9:00 AM',
                        text: '9:00 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '9:30 AM',
                        text: '9:30 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '10:00 AM',
                        text: '10:00 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '10:30 AM',
                        text: '10:30 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '11:00 AM',
                        text: '11:00 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '11:30 AM',
                        text: '11:30 AM'
                    });
                    pickupTo.addSelectOption({
                        value: '12:00 PM',
                        text: '12:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '12:30 PM',
                        text: '12:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '1:00 PM',
                        text: '1:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '1:30 PM',
                        text: '1:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '2:00 PM',
                        text: '2:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '2:30 PM',
                        text: '2:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '3:00 PM',
                        text: '3:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '3:30 PM',
                        text: '3:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '4:00 PM',
                        text: '4:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '4:30 PM',
                        text: '4:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '5:00 PM',
                        text: '5:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '5:30 PM',
                        text: '5:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '6:00 PM',
                        text: '6:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '6:30 PM',
                        text: '6:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '7:00 PM',
                        text: '7:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '7:30 PM',
                        text: '7:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '8:00 PM',
                        text: '8:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '8:30 PM',
                        text: '8:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '9:00 PM',
                        text: '9:00 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '9:30 PM',
                        text: '9:30 PM'
                    });
                    pickupTo.addSelectOption({
                        value: '10:00 PM',
                        text: '10:00 PM'
                    });
                    pickupTo.defaultValue = '5:00 PM';

                    var pickupcAddressCompany = pickDeliveryForm.addField({
                        id: 'pickup_company',
                        type: N_server.FieldType.TEXT,
                        label: 'COMPANY NAME',
                        container: 'pickupfieldgroupid'
                    });
                    pickupcAddressCompany.isMandatory = true;
                    pickupcAddressCompany.updateBreakType({
                        breakType: N_server.FieldBreakType.STARTCOL
                    });

                    var pickupAdress1 = pickDeliveryForm.addField({
                        id: 'pickup_address',
                        type: N_server.FieldType.TEXT,
                        label: 'ADDRESS LINE1',
                        container: 'pickupfieldgroupid'

                    });
                    pickupAdress1.isMandatory = true;
                    var pickupAdress2 = pickDeliveryForm.addField({
                        id: 'pickup_address2',
                        type: N_server.FieldType.TEXT,
                        label: 'ADDRESS LINE2',
                        container: 'pickupfieldgroupid'

                    });

                    var pickup_country = pickDeliveryForm.addField({
                        id: 'pickup_country',
                        type: N_server.FieldType.TEXT,
                        label: 'Pickup Country',
                        container: 'pickupfieldgroupid'
                    }).updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    var pickupCityStateZip = pickDeliveryForm.addField({
                        id: 'pickup_city_state_zip',
                        type: N_server.FieldType.TEXT,
                        label: 'City/State/Zip',
                        container: 'pickupfieldgroupid'

                    });
                    pickupCityStateZip.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    var pickupPhoneNum = pickDeliveryForm.addField({
                        id: 'pickup_phone_num',
                        type: N_server.FieldType.TEXT,
                        label: 'PHONE NUMBER',
                        container: 'pickupfieldgroupid'
                    });
                    pickupPhoneNum.isMandatory = true;
                    pickupPhoneNum.updateBreakType({
                        breakType: N_server.FieldBreakType.STARTCOL
                    });
                    var pickupContactName = pickDeliveryForm.addField({
                        id: 'pickup_contact_name',
                        type: N_server.FieldType.TEXT,
                        label: 'CONTACT NAME',
                        container: 'pickupfieldgroupid'

                    });
                    var pickupEmailinfo = pickDeliveryForm.addField({
                        id: 'pickup_email_info',
                        type: N_server.FieldType.EMAIL,
                        label: 'EMAIL ADDRESS',
                        container: 'pickupfieldgroupid'

                    });
                    var pickupContactNotes = pickDeliveryForm.addField({
                        id: 'pickup_contact_notes',
                        type: N_server.FieldType.TEXT,
                        label: 'NOTES',
                        container: 'pickupfieldgroupid'
                    }).defaultValue = bol_Notes;

                    // --------------------- Destination Fields ----------------------
                    var destinationField = pickDeliveryForm.addFieldGroup({
                        id: 'destinstionfieldgroupid',
                        label: 'DESTINATION'
                    });

                    var destinationStart = pickDeliveryForm.addField({
                        id: 'destionationstart',
                        type: N_server.FieldType.SELECT,
                        label: 'DESTINATION START',
                        container: 'destinstionfieldgroupid'

                    });
                    destinationStart.addSelectOption({
                        value: '8:00 AM',
                        text: '8:00 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '8:30 AM',
                        text: '8:30 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '9:00 AM',
                        text: '9:00 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '9:30 AM',
                        text: '9:30 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '10:00 AM',
                        text: '10:00 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '10:30 AM',
                        text: '10:30 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '11:00 AM',
                        text: '11:00 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '11:30 AM',
                        text: '11:30 AM'
                    });
                    destinationStart.addSelectOption({
                        value: '12:00 PM',
                        text: '12:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '12:30 PM',
                        text: '12:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '1:00 PM',
                        text: '1:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '1:30 PM',
                        text: '1:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '2:00 PM',
                        text: '2:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '2:30 PM',
                        text: '2:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '3:00 PM',
                        text: '3:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '3:30 PM',
                        text: '3:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '4:00 PM',
                        text: '4:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '4:30 PM',
                        text: '4:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '5:00 PM',
                        text: '5:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '5:30 PM',
                        text: '5:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '6:00 PM',
                        text: '6:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '6:30 PM',
                        text: '6:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '7:00 PM',
                        text: '7:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '7:30 PM',
                        text: '7:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '8:00 PM',
                        text: '8:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '8:30 PM',
                        text: '8:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '9:00 PM',
                        text: '9:00 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '9:30 PM',
                        text: '9:30 PM'
                    });
                    destinationStart.addSelectOption({
                        value: '10:00 PM',
                        text: '10:00 PM'
                    });
                    var destinationEnd = pickDeliveryForm.addField({
                        id: 'destionationend',
                        type: N_server.FieldType.SELECT,
                        label: 'DESTINATION END',
                        container: 'destinstionfieldgroupid'

                    });
                    destinationEnd.addSelectOption({
                        value: '8:00 AM',
                        text: '8:00 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '8:30 AM',
                        text: '8:30 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '9:00 AM',
                        text: '9:00 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '9:30 AM',
                        text: '9:30 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '10:00 AM',
                        text: '10:00 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '10:30 AM',
                        text: '10:30 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '11:00 AM',
                        text: '11:00 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '11:30 AM',
                        text: '11:30 AM'
                    });
                    destinationEnd.addSelectOption({
                        value: '12:00 PM',
                        text: '12:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '12:30 PM',
                        text: '12:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '1:00 PM',
                        text: '1:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '1:30 PM',
                        text: '1:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '2:00 PM',
                        text: '2:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '2:30 PM',
                        text: '2:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '3:00 PM',
                        text: '3:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '3:30 PM',
                        text: '3:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '4:00 PM',
                        text: '4:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '4:30 PM',
                        text: '4:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '5:00 PM',
                        text: '5:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '5:30 PM',
                        text: '5:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '6:00 PM',
                        text: '6:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '6:30 PM',
                        text: '6:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '7:00 PM',
                        text: '7:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '7:30 PM',
                        text: '7:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '8:00 PM',
                        text: '8:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '8:30 PM',
                        text: '8:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '9:00 PM',
                        text: '9:00 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '9:30 PM',
                        text: '9:30 PM'
                    });
                    destinationEnd.addSelectOption({
                        value: '10:00 PM',
                        text: '10:00 PM'
                    });

                    destinationEnd.defaultValue = '5:00 PM';

                    /***Add DESTINATION Adrress Field ***/
                    var destionationAdress = pickDeliveryForm.addFieldGroup({
                        id: 'destinationaddress',
                        label: 'Destination Address'
                    });
                    var destinationAddressCompany = pickDeliveryForm.addField({
                        id: 'destination_company',
                        type: N_server.FieldType.TEXT,
                        label: 'COMPANY NAME',
                        container: 'destinstionfieldgroupid'
                    });
                    destinationAddressCompany.isMandatory = true;
                    destinationAddressCompany.updateBreakType({
                        breakType: N_server.FieldBreakType.STARTCOL
                    });

                    var destinationAdress1 = pickDeliveryForm.addField({
                        id: 'destination_address',
                        type: N_server.FieldType.TEXT,
                        label: 'ADDRESS LINE1',
                        container: 'destinstionfieldgroupid'
                    });
                    destinationAdress1.isMandatory = true;
                    var destinationAdress2 = pickDeliveryForm.addField({
                        id: 'destination_address2',
                        type: N_server.FieldType.TEXT,
                        label: 'ADDRESS LINE2',
                        container: 'destinstionfieldgroupid'

                    });
                    var dest_country = pickDeliveryForm.addField({
                        id: 'dest_country',
                        type: N_server.FieldType.TEXT,
                        label: 'Destination Country',
                        container: 'destinstionfieldgroupid'

                    });
                    dest_country.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var destionationCityStateZip = pickDeliveryForm.addField({
                        id: 'des_city_state_zip',
                        type: N_server.FieldType.TEXT,
                        label: 'City/State/Zip',
                        container: 'destinstionfieldgroupid'

                    });
                    destionationCityStateZip.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    /***Add DESTINATION Contact information***/

                    var destinationPhoneNum = pickDeliveryForm.addField({
                        id: 'destionation_phone_num',
                        type: N_server.FieldType.TEXT,
                        label: 'PHONE NUMBER',
                        container: 'destinstionfieldgroupid'
                    });
                    destinationPhoneNum.isMandatory = true;
                    destinationPhoneNum.updateBreakType({
                        breakType: N_server.FieldBreakType.STARTCOL
                    });

                    var destinationContactName = pickDeliveryForm.addField({
                        id: 'destination_contact_name',
                        type: N_server.FieldType.TEXT,
                        label: 'CONTACT NAME',
                        container: 'destinstionfieldgroupid'

                    });
                    var destinationEmailinfo = pickDeliveryForm.addField({
                        id: 'destination_email_info',
                        type: N_server.FieldType.EMAIL,
                        label: 'EMAIL ADDRESS',
                        container: 'destinstionfieldgroupid'

                    });
                    var destinationContactNotes = pickDeliveryForm.addField({
                        id: 'destination_contact_notes',
                        type: N_server.FieldType.TEXT,
                        label: 'NOTES',
                        container: 'destinstionfieldgroupid'

                    });

                    // ---------------------- Setting value from params for Quote details ----------------------

                    quote_Rec_Id ? quote_fld.defaultValue = quote_Rec_Id : '';
                    // carCode.defaultValue = (context.request.parameters.cc) ? (context.request.parameters.cc) : '';
                    (context.request.parameters.cc) ? carCode.defaultValue = context.request.parameters.cc : '';
                    (context.request.parameters.cN) ? carName.defaultValue = context.request.parameters.cN : '';
                    (context.request.parameters.Tc) ? carCharge.defaultValue = context.request.parameters.Tc : '';
                    (context.request.parameters.sld) ? carServicelevel.defaultValue = context.request.parameters.sld : '';
                    (context.request.parameters.td) ? cartransistday.defaultValue = context.request.parameters.td : '';
                    (context.request.parameters.pD) ? (pickupDate.defaultValue = context.request.parameters.pD) && (carDate.defaultValue = context.request.parameters.pD) : '';
                    (context.request.parameters.cLnew) ? carlibilitynew.defaultValue = context.request.parameters.cLnew : '';
                    (context.request.parameters.cLused) ? carlibilityUsed.defaultValue = context.request.parameters.cLused : '';
                    (context.request.parameters.cdel) ? estimate_date_fld.defaultValue = context.request.parameters.cdel : '';
                    (context.request.parameters.carID) ? carrier_Id.defaultValue = context.request.parameters.carID : '';
                    (context.request.parameters.cQn) ? carrier_QuoteNumber.defaultValue = context.request.parameters.cQn : '';

                    // ------------------------ Setting value for PickUp details --------------------

                    var pickup_city = '', pickup_state = '', pickup_zip = '';
                    if (quote_record.getValue({ fieldId: 'custrecord_pick_city' }))
                        pickup_city = quote_record.getValue({ fieldId: 'custrecord_pick_city' }) + ', ';

                    if (quote_record.getValue({ fieldId: 'custrecord_pick_state' }))
                        pickup_state = quote_record.getValue({ fieldId: 'custrecord_pick_state' }) + ', ';

                    if (quote_record.getValue({ fieldId: 'custrecord_pickup_zip' }))
                        pickup_zip = quote_record.getValue({ fieldId: 'custrecord_pickup_zip' });

                    pickupCityStateZip.defaultValue = pickup_city + pickup_state + pickup_zip;

                    (quote_record.getValue({ fieldId: 'custrecord_pickup_zip' })) ? carfrom.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pickup_zip' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_open' })) ? pickupFrom.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_open' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_close' })) ? pickupTo.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_close' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_company' })) ? pickupcAddressCompany.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_company' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_addr_1' })) ? pickupAdress1.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_addr_1' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_addr_2' })) ? pickupAdress2.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_addr_2' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_country' })) ? pickup_country.defaultValue = quote_record.getValue({ fieldId: 'custrecord_country' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_phone' })) ? pickupPhoneNum.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_phone' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_contact' })) ? pickupContactName.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_contact' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_pick_email' })) ? pickupEmailinfo.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pick_email' }) : '';

                    // ---------------------- seting values for destination fields --------------------------

                    var dest_city = '', dest_state = '', dest_zip = '';
                    if (quote_record.getValue({ fieldId: 'custrecord_dest_city' }))
                        dest_city = quote_record.getValue({ fieldId: 'custrecord_dest_city' }) + ', ';

                    if (quote_record.getValue({ fieldId: 'custrecord_dest_state' }))
                        dest_state = quote_record.getValue({ fieldId: 'custrecord_dest_state' }) + ', ';

                    if (quote_record.getValue({ fieldId: 'custrecord_destination_zip' }))
                        dest_zip = quote_record.getValue({ fieldId: 'custrecord_destination_zip' });

                    destionationCityStateZip.defaultValue = dest_city + dest_state + dest_zip;

                    (quote_record.getValue({ fieldId: 'custrecord_destination_zip' })) ? carto.defaultValue = quote_record.getValue({ fieldId: 'custrecord_destination_zip' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_destination_country' })) ? dest_country.defaultValue = quote_record.getValue({ fieldId: 'custrecord_destination_country' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_dest_company' })) ? destinationAddressCompany.defaultValue = quote_record.getValue({ fieldId: 'custrecord_dest_company' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_dest_addr_1' })) ? destinationAdress1.defaultValue = quote_record.getValue({ fieldId: 'custrecord_dest_addr_1' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_dest_addr_2' })) ? destinationAdress2.defaultValue = quote_record.getValue({ fieldId: 'custrecord_dest_addr_2' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_dest_phone' })) ? destinationPhoneNum.defaultValue = quote_record.getValue({ fieldId: 'custrecord_dest_phone' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_dest_contact' })) ? destinationContactName.defaultValue = quote_record.getValue({ fieldId: 'custrecord_dest_contact' }) : '';
                    (quote_record.getValue({ fieldId: 'custrecord_dest_email' })) ? destinationEmailinfo.defaultValue = quote_record.getValue({ fieldId: 'custrecord_dest_email' }) : '';
                    // (quote_record.getValue({ fieldId: 'custrecord_so_int_id' })) ? salesOrderIdField.defaultValue = quote_record.getValue({ fieldId: 'custrecord_so_int_id' }) : '';

                    // ---------------------- Stand-alone items Item Sublist ------------------------------------
                    var loadClasses_obj = [], totalShipLoad_obj = 0;

                    // log.debug('item_object 852', item_object);
                    item_object = JSON.parse(item_object);

                    var stand_alone_hazmat_arr = [];
                    if (item_object.items) {
                        var itemLiablitySub = pickDeliveryForm.addSublist({
                            id: 'carrier_info',
                            type: N_server.SublistType.LIST,
                            label: 'Stand-alone Items',
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
                                    value: item_object.items[v].packagingType
                                });

                                itemLiablitySub.setSublistValue({
                                    id: 'carrier_class',
                                    line: v,
                                    value: item_object.items[v].freightClass
                                });

                                itemLiablitySub.setSublistValue({
                                    id: 'carriert_piece',
                                    line: v,
                                    value: item_object.items[v].pieces
                                });

                                var singleItemLwhUnit = (item_object.items[v].sinLwhUnit) ? (item_object.items[v].sinLwhUnit) : (item_object.items[v].singleLwhUnit);

                                itemLiablitySub.setSublistValue({
                                    id: 'carrier_dimension',
                                    line: v,
                                    value: item_object.items[v].length + ' x ' + item_object.items[v].width + ' x ' + item_object.items[v].height + ' ' + '(' + singleItemLwhUnit + ')'
                                });

                                var singleItemWeightUnit = (item_object.items[v].totalWeightUnit) ? (item_object.items[v].totalWeightUnit) : '';

                                itemLiablitySub.setSublistValue({
                                    id: 'carrier_weight',
                                    line: v,
                                    value: item_object.items[v].totalWeight + ' ' + singleItemWeightUnit
                                });

                                var set_nmfc = ''
                                if (item_object.items[v].nmfcItemCode) {
                                    set_nmfc = item_object.items[v].nmfcItemCode;
                                    if (item_object.items[v].nmfcSubCode) {
                                        set_nmfc += '-' + item_object.items[v].nmfcSubCode;
                                    }
                                }
                                log.debug('set_nmfc', set_nmfc);

                                itemLiablitySub.setSublistValue({
                                    id: 'carrier_nmfc',
                                    line: v,
                                    value: set_nmfc ? set_nmfc : ' '
                                });

                                itemLiablitySub.setSublistValue({
                                    id: 'carrier_description',
                                    line: v,
                                    value: item_object.items[v].description
                                });

                                itemLiablitySub.setSublistValue({
                                    id: 'carrier_hazmat',
                                    line: v,
                                    // value: hazboxObj
                                    value: (item_object.items[v].isHazardous) ? 'T' : 'F'
                                });
                                if (item_object.items[v].isHazardous)
                                    stand_alone_hazmat_arr.push(v + 1);

                            }
                    }
                    // --------------------- Creating stand-alone Hazmat Sublist --------------------
                    if (stand_alone_hazmat_arr.length > 0) {
                        var hazmatSub = pickDeliveryForm.addSublist({
                            id: 'hazmat_info',
                            type: N_server.SublistType.INLINEEDITOR,
                            label: 'Stand-alone Hazmat Information'

                        });
                        var itm_no = hazmatSub.addField({
                            id: 'itm_sr_no',
                            type: N_server.FieldType.TEXT,
                            label: 'ITEM NO.'
                        });
                        itm_no.isMandatory = true;
                        var properName = hazmatSub.addField({
                            id: 'propername',
                            type: N_server.FieldType.TEXT,
                            label: 'PROPER NAME'
                        });
                        properName.isMandatory = true;
                        var piecespack = hazmatSub.addField({
                            id: 'piecespackage',
                            type: N_server.FieldType.SELECT,
                            label: 'PIECES PACKAGING'
                        });
                        piecespack.isMandatory = true;
                        piecespack.addSelectOption({
                            value: '',
                            text: ''
                        });
                        piecespack.addSelectOption({
                            value: 'Bag',
                            text: 'Bag'
                        });
                        piecespack.addSelectOption({
                            value: 'Bale',
                            text: 'Bale'
                        });
                        piecespack.addSelectOption({
                            value: 'Box',
                            text: 'Box'
                        });

                        piecespack.addSelectOption({
                            value: 'Bucket',
                            text: 'Bucket'
                        });
                        piecespack.addSelectOption({
                            value: 'Bundle',
                            text: 'Bundle'
                        });
                        piecespack.addSelectOption({
                            value: 'Can',
                            text: 'Can'
                        });
                        piecespack.addSelectOption({
                            value: 'Carton',
                            text: 'Carton'
                        });
                        piecespack.addSelectOption({
                            value: 'Case',
                            text: 'Case'
                        });
                        piecespack.addSelectOption({
                            value: 'Coil',
                            text: 'Coil'
                        });
                        piecespack.addSelectOption({
                            value: 'Crate',
                            text: 'Crate'
                        });
                        piecespack.addSelectOption({
                            value: 'Cylinder',
                            text: 'Cylinder'
                        });
                        piecespack.addSelectOption({
                            value: 'Drums',
                            text: 'Drums'
                        });
                        piecespack.addSelectOption({
                            value: 'Pail',
                            text: 'Pail'
                        });
                        piecespack.addSelectOption({
                            value: 'Pieces',
                            text: 'Pieces'
                        });
                        piecespack.addSelectOption({
                            value: 'Pallet',
                            text: 'Pallet'
                        });
                        piecespack.addSelectOption({
                            value: 'Reel',
                            text: 'Reel'
                        });
                        piecespack.addSelectOption({
                            value: 'Roll',
                            text: 'Roll'
                        });
                        piecespack.addSelectOption({
                            value: 'Skid',
                            text: 'Skid'
                        });
                        piecespack.addSelectOption({
                            value: 'Tube',
                            text: 'Tube'
                        });
                        piecespack.addSelectOption({
                            value: 'Tote',
                            text: 'Tote'
                        });
                        piecespack.addSelectOption({
                            value: 'Each',
                            text: 'Each'
                        });
                        piecespack.addSelectOption({
                            value: 'Flat',
                            text: 'Flat'
                        });
                        piecespack.addSelectOption({
                            value: 'Loose',
                            text: 'Loose'
                        });

                        var grouppack = hazmatSub.addField({
                            id: 'group',
                            type: N_server.FieldType.SELECT,
                            label: 'GROUP'
                        });
                        grouppack.isMandatory = true;
                        grouppack.addSelectOption({
                            value: '',
                            text: ''
                        });

                        grouppack.addSelectOption({
                            value: 'I',
                            text: 'I'
                        });
                        grouppack.addSelectOption({
                            value: 'II',
                            text: 'II'
                        });
                        grouppack.addSelectOption({
                            value: 'III',
                            text: 'III'
                        });
                        grouppack.addSelectOption({
                            value: 'NA',
                            text: 'NA'
                        });

                        var hazmatClass = hazmatSub.addField({
                            id: 'hazmatclass',
                            type: N_server.FieldType.SELECT,
                            label: 'CLASS'
                        });
                        hazmatClass.isMandatory = true;
                        hazmatClass.addSelectOption({
                            value: '',
                            text: ''
                        });
                        hazmatClass.addSelectOption({
                            value: '1',
                            text: '1'
                        });
                        hazmatClass.addSelectOption({
                            value: '1.1',
                            text: '1.1'
                        });
                        hazmatClass.addSelectOption({
                            value: '1.2',
                            text: '1.2'
                        });
                        hazmatClass.addSelectOption({
                            value: '1.3',
                            text: '1.3'
                        });
                        hazmatClass.addSelectOption({
                            value: '1.4',
                            text: '1.4'
                        });
                        hazmatClass.addSelectOption({
                            value: '1.5',
                            text: '1.5'
                        });
                        hazmatClass.addSelectOption({
                            value: '1.6',
                            text: '1.6'
                        });
                        hazmatClass.addSelectOption({
                            value: '2',
                            text: '2'
                        });
                        hazmatClass.addSelectOption({
                            value: '2.1',
                            text: '2.1'
                        });
                        hazmatClass.addSelectOption({
                            value: '2.2',
                            text: '2.2'
                        });
                        hazmatClass.addSelectOption({
                            value: '2.3',
                            text: '2.3'
                        });
                        hazmatClass.addSelectOption({
                            value: '3',
                            text: '3'
                        });
                        hazmatClass.addSelectOption({
                            value: '3(6.1;8)',
                            text: '3(6.1;8)'
                        });
                        hazmatClass.addSelectOption({
                            value: '3(8)',
                            text: '3(8)'
                        });
                        hazmatClass.addSelectOption({
                            value: '4',
                            text: '4'
                        });
                        hazmatClass.addSelectOption({
                            value: '4.1',
                            text: '4.1'
                        });
                        hazmatClass.addSelectOption({
                            value: '4.2',
                            text: '4.2'
                        });
                        hazmatClass.addSelectOption({
                            value: '4.3',
                            text: '4.3'
                        });
                        hazmatClass.addSelectOption({
                            value: '4.3(6.1)',
                            text: '4.3(6.1)'
                        });
                        hazmatClass.addSelectOption({
                            value: '5',
                            text: '5'
                        });
                        hazmatClass.addSelectOption({
                            value: '5.1',
                            text: '5.1'
                        });
                        hazmatClass.addSelectOption({
                            value: '5.1(6.1)',
                            text: '5.1(6.1)'
                        });
                        hazmatClass.addSelectOption({
                            value: '5.1(6.1,8)',
                            text: '5.1(6.1,8)'
                        });
                        hazmatClass.addSelectOption({
                            value: '5.1(8)',
                            text: '5.1(8)'
                        });
                        hazmatClass.addSelectOption({
                            value: '5.2',
                            text: '5.2'
                        });
                        hazmatClass.addSelectOption({
                            value: '5.2(8)',
                            text: '5.2(8))'
                        });
                        hazmatClass.addSelectOption({
                            value: '6',
                            text: '6'
                        });
                        hazmatClass.addSelectOption({
                            value: '6.1',
                            text: '6.1'
                        });
                        hazmatClass.addSelectOption({
                            value: '6.1(3)',
                            text: '6.1(3)'
                        });
                        hazmatClass.addSelectOption({
                            value: '6.1(8)',
                            text: '6.1(3)'
                        });
                        hazmatClass.addSelectOption({
                            value: '6.1(8,3)',
                            text: '6.1(8,3)'
                        });
                        hazmatClass.addSelectOption({
                            value: '6.2',
                            text: '6.2'
                        });
                        hazmatClass.addSelectOption({
                            value: '7',
                            text: '7'
                        });
                        hazmatClass.addSelectOption({
                            value: '8',
                            text: '8'
                        });
                        hazmatClass.addSelectOption({
                            value: '8(3)',
                            text: '8(3)'
                        });
                        hazmatClass.addSelectOption({
                            value: '8(5.1)',
                            text: '8(5.1)'
                        });
                        hazmatClass.addSelectOption({
                            value: '8(6.1)',
                            text: '8(6.1)'
                        });
                        hazmatClass.addSelectOption({
                            value: '9',
                            text: '9'
                        });

                        var unno = hazmatSub.addField({
                            id: 'unno',
                            type: N_server.FieldType.TEXT,
                            label: 'UN/NA NUMBER'
                        });

                        unno.isMandatory = true;

                    }
                    var package_hazmat_arr = [];
                    // --------------------- Creating Enhanced Item Sublist --------------------
                    var enhance_iten_length = item_object.enhancedHandlingUnits ? item_object.enhancedHandlingUnits.length : '';
                    log.debug('enhance_iten_length', enhance_iten_length);
                    if (enhance_iten_length > 0) {
                        var enhanceItemLiablitySub = pickDeliveryForm.addSublist({
                            id: 'carrier_enhance_info',
                            type: N_server.SublistType.LIST,
                            label: 'Package',
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

                                    var en_nmfc;
                                    ((parsedPack[h].packageNmfcItemCode) && (parsedPack[h].packageNmfcSubCode)) ? en_nmfc = ((parsedPack[h].packageNmfcItemCode) + '-' + (parsedPack[h].packageNmfcSubCode)) : (parsedPack[h].packageNmfcItemCode) ? en_nmfc = (parsedPack[h].packageNmfcItemCode) : en_nmfc = ' ';
                                    // if (parsedPack[h].packageNmfcItemCode) {
                                    //     en_nmfc = parsedPack[h].packageNmfcItemCode;
                                    // }
                                    // if (parsedPack[h].packageNmfcSubCode) {
                                    //     en_nmfc += '-' + parsedPack[h].packageNmfcSubCode;
                                    // }
                                    // if (en_nmfc) {
                                    enhanceItemLiablitySub.setSublistValue({
                                        id: 'carrier_enhance_nmfc',
                                        line: packLine,
                                        value: en_nmfc
                                    });
                                    // }

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

                                    if (parsedPack[h].packageIsHazardous)
                                        enhance_hazmat_flag = true;

                                    b = packLine
                                }
                            }

                        }
                    }
                    // --------------------- Creating Enhanced Hazmat Sublist --------------------
                    if (enhance_hazmat_flag) {
                        var enhanceHandlingHazmatSub = pickDeliveryForm.addSublist({
                            id: 'enhanncehazmat_info',
                            type: N_server.SublistType.INLINEEDITOR,
                            label: 'Package Hazmat Information'
                        });

                        // hazmat identification fields Parent

                        var enhanceHandlinggrouppackParent = enhanceHandlingHazmatSub.addField({
                            id: 'enhanncegroup_parent',
                            type: N_server.FieldType.SELECT,
                            label: 'PARENT'
                        });
                        enhanceHandlinggrouppackParent.isMandatory = true;
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 0,
                            text: '1'
                        });

                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 1,
                            text: '2'
                        });
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 2,
                            text: '3'
                        });
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 3,
                            text: '4'
                        });
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 4,
                            text: '5'
                        });
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 5,
                            text: '6'
                        });
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 6,
                            text: '7'
                        });
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 7,
                            text: '8'
                        });
                        enhanceHandlinggrouppackParent.addSelectOption({
                            value: 8,
                            text: '9'
                        });

                        // hazmat identification field child.

                        var enhanceHandlinggrouppackChild = enhanceHandlingHazmatSub.addField({
                            id: 'enhanncegroup_package',
                            type: N_server.FieldType.SELECT,
                            label: 'Package'
                        });
                        enhanceHandlinggrouppackChild.isMandatory = true;
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 0,
                            text: '1'
                        });

                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 1,
                            text: '2'
                        });
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 2,
                            text: '3'
                        });
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 3,
                            text: '4'
                        });
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 4,
                            text: '5'
                        });
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 5,
                            text: '6'
                        });
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 6,
                            text: '7'
                        });
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 7,
                            text: '8'
                        });
                        enhanceHandlinggrouppackChild.addSelectOption({
                            value: 8,
                            text: '9'
                        });

                        var enhanceHandlingproperName = enhanceHandlingHazmatSub.addField({
                            id: 'enhanncepropername',
                            type: N_server.FieldType.TEXT,
                            label: 'PROPER NAME'
                        });
                        enhanceHandlingproperName.isMandatory = true;
                        var enhanceHandlingpiecespack = enhanceHandlingHazmatSub.addField({
                            id: 'enhanncepiecespackage',
                            type: N_server.FieldType.SELECT,
                            label: 'PIECES PACKAGING'
                        });
                        enhanceHandlingpiecespack.isMandatory = true;
                        enhanceHandlingpiecespack.addSelectOption({
                            value: '',
                            text: ''
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Bag',
                            text: 'Bag'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Bale',
                            text: 'Bale'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Box',
                            text: 'Box'
                        });

                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Bucket',
                            text: 'Bucket'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Bundle',
                            text: 'Bundle'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Can',
                            text: 'Can'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Carton',
                            text: 'Carton'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Case',
                            text: 'Case'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Coil',
                            text: 'Coil'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Crate',
                            text: 'Crate'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Cylinder',
                            text: 'Cylinder'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Drums',
                            text: 'Drums'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Pail',
                            text: 'Pail'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Pieces',
                            text: 'Pieces'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Pallet',
                            text: 'Pallet'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Reel',
                            text: 'Reel'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Roll',
                            text: 'Roll'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Skid',
                            text: 'Skid'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Tube',
                            text: 'Tube'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Tote',
                            text: 'Tote'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Each',
                            text: 'Each'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Flat',
                            text: 'Flat'
                        });
                        enhanceHandlingpiecespack.addSelectOption({
                            value: 'Loose',
                            text: 'Loose'
                        });

                        var enhanceHandlinggrouppack = enhanceHandlingHazmatSub.addField({
                            id: 'enhanncegroup',
                            type: N_server.FieldType.SELECT,
                            label: 'GROUP'
                        });
                        enhanceHandlinggrouppack.isMandatory = true;
                        enhanceHandlinggrouppack.addSelectOption({
                            value: '',
                            text: ''
                        });

                        enhanceHandlinggrouppack.addSelectOption({
                            value: 'I',
                            text: 'I'
                        });
                        enhanceHandlinggrouppack.addSelectOption({
                            value: 'II',
                            text: 'II'
                        });
                        enhanceHandlinggrouppack.addSelectOption({
                            value: 'III',
                            text: 'III'
                        });
                        enhanceHandlinggrouppack.addSelectOption({
                            value: 'NA',
                            text: 'NA'
                        });

                        var enhanceHandlinghazmatClass = enhanceHandlingHazmatSub.addField({
                            id: 'enhanncehazmatclass',
                            type: N_server.FieldType.SELECT,
                            label: 'CLASS'
                        });
                        enhanceHandlinghazmatClass.isMandatory = true;
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '',
                            text: ''
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '1',
                            text: '1'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '1.1',
                            text: '1.1'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '1.2',
                            text: '1.2'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '1.3',
                            text: '1.3'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '1.4',
                            text: '1.4'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '1.5',
                            text: '1.5'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '1.6',
                            text: '1.6'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '2',
                            text: '2'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '2.1',
                            text: '2.1'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '2.2',
                            text: '2.2'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '2.3',
                            text: '2.3'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '3',
                            text: '3'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '3(6.1;8)',
                            text: '3(6.1;8)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '3(8)',
                            text: '3(8)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '4',
                            text: '4'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '4.1',
                            text: '4.1'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '4.2',
                            text: '4.2'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '4.3',
                            text: '4.3'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '4.3(6.1)',
                            text: '4.3(6.1)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '5',
                            text: '5'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '5.1',
                            text: '5.1'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '5.1(6.1)',
                            text: '5.1(6.1)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '5.1(6.1,8)',
                            text: '5.1(6.1,8)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '5.1(8)',
                            text: '5.1(8)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '5.2',
                            text: '5.2'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '5.2(8)',
                            text: '5.2(8))'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '6',
                            text: '6'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '6.1',
                            text: '6.1'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '6.1(3)',
                            text: '6.1(3)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '6.1(8)',
                            text: '6.1(3)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '6.1(8,3)',
                            text: '6.1(8,3)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '6.2',
                            text: '6.2'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '7',
                            text: '7'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '8',
                            text: '8'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '8(3)',
                            text: '8(3)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '8(5.1)',
                            text: '8(5.1)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '8(6.1)',
                            text: '8(6.1)'
                        });
                        enhanceHandlinghazmatClass.addSelectOption({
                            value: '9',
                            text: '9'
                        });

                        var enhanceHandlingunno = enhanceHandlingHazmatSub.addField({
                            id: 'enhunno',
                            type: N_server.FieldType.TEXT,
                            label: 'UN/NA NUMBER'
                        });

                        enhanceHandlingunno.isMandatory = true;
                        // var enhanceHandlingemergencycontact = enhanceHandlingHazmatSub.addField({
                        //     id: 'enhannceemergencycontact',
                        //     type: N_server.FieldType.TEXT,
                        //     label: 'EMERGENCY CONTACT'
                        // });
                        // enhanceHandlingemergencycontact.isMandatory = true;

                        // var enhanceHandlingemergencyno = enhanceHandlingHazmatSub.addField({
                        //     id: 'enhannceemergencyno',
                        //     type: N_server.FieldType.TEXT,
                        //     label: 'EMERGENCY PHONE NUMBER'
                        // });
                        // enhanceHandlingemergencyno.isMandatory = true;

                        var enhanceIdFld = enhanceHandlingHazmatSub.addField({
                            id: 'enhan_identity_fld',
                            type: N_server.FieldType.TEXT,
                            label: 'Id NO. NUMBER'
                        });
                        enhanceIdFld.updateDisplayType({
                            displayType: N_server.FieldDisplayType.HIDDEN
                        });

                    }
                    // -------------------- Creating Emergency Contact Sublist ----------------------
                    if ((stand_alone_hazmat_arr.length > 0) || enhance_hazmat_flag == true) {
                        var emergency_contact_sublist = pickDeliveryForm.addFieldGroup({
                            id: 'emergency_contact_info',
                            label: 'EMERGENCY CONTACT INFORMATION'
                        });
                        var emergency_contact = pickDeliveryForm.addField({
                            id: 'custpage_emergencycontact',
                            type: N_server.FieldType.TEXT,
                            label: 'EMERGENCY CONTACT',
                            container: 'emergency_contact_info'
                        });
                        var emergency_no = pickDeliveryForm.addField({
                            id: 'custpage_emergencyno',
                            type: N_server.FieldType.TEXT,
                            label: 'EMERGENCY PHONE NUMBER',
                            container: 'emergency_contact_info'
                        });
                        emergency_contact.isMandatory = true;
                        emergency_no.isMandatory = true;
                    }
                    // ----------------- Creating Reference Sublist -----------------------

                    var referenceSub = pickDeliveryForm.addSublist({
                        id: 'reference_info',
                        type: N_server.SublistType.INLINEEDITOR,
                        label: 'Reference Numbers',
                        tab: 'tabid'
                    });

                    var refType = referenceSub.addField({
                        id: 'custpagereferencetype',
                        type: N_server.FieldType.SELECT,
                        label: 'REFERENCE TYPE'
                    });

                    refType.addSelectOption({
                        value: 'BILL_OF_LADING',
                        text: 'BOL'
                    });
                    refType.addSelectOption({
                        value: 'PICKUP',
                        text: 'Customer Pickup'
                    });
                    refType.addSelectOption({
                        value: 'CUSTOMER_REFERENCE',
                        text: 'IF NUMBER'
                    });
                    refType.addSelectOption({
                        value: 'PURCHASE_ORDER',
                        text: 'PO'
                    });
                    refType.addSelectOption({
                        value: 'PRO',
                        text: 'PRO'
                    });
                    refType.addSelectOption({
                        value: 'SALES_ORDER ',
                        text: 'SALES ORDER'
                    });

                    referenceSub.addField({
                        id: 'referenceno',
                        type: N_server.FieldType.TEXT,
                        label: 'REFERENCE NUMBER'
                    });

                    // ------------------- Freight Insurance Field Group --------------------

                    var itemLiabilityField = pickDeliveryForm.addFieldGroup({
                        id: 'itemLiabilityfieldid',
                        label: 'FREIGHT INSURANCE'
                    });
                    var freightInsurance = pickDeliveryForm.addField({
                        id: 'freightinsurance',
                        type: N_server.FieldType.CHECKBOX,
                        label: 'I am waiving freight insurance',
                        container: 'itemLiabilityfieldid'
                    });
                    var calculateAmount = pickDeliveryForm.addField({
                        id: 'calculateamount',
                        type: N_server.FieldType.INTEGER,
                        label: 'Freight Insurance',
                        container: 'itemLiabilityfieldid'
                    });

                    // ------------------ Extra Data Fields -------------------------

                    // var quote_int_id = pickDeliveryForm.addField({
                    //     id: 'custpage_quote_int_id',
                    //     type: N_server.FieldType.TEXT,
                    //     label: 'Quote Internal ID'
                    // });
                    // quote_int_id.defaultValue = quote_Rec_Id ? quote_Rec_Id : '';

                    var saveButton = pickDeliveryForm.addSubmitButton({
                        label: 'Dispatch Shipment'
                    });

                    context.response.writePage({
                        pageObject: pickDeliveryForm
                    });

                } catch (error) {
                    errorMessage = error.message;
                    log.debug('Error in GET API function', errorMessage);
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
            // ------------------------------ Post Method ----------------------------------------
            else {
                try {

                    var delimiter = /\u0001/;
                    var quote_recd_id = context.request.parameters.quote_int_id;
                    var carrierName_Obj = context.request.parameters.carriername;
                    // log.debug('carrierName_Obj', carrierName_Obj);
                    var carrierName_Arr = carrierName_Obj.split(" ");
                    var carrierName = carrierName_Arr[0];
                    log.debug('carrierName', carrierName);

                    quote_record = quote_recd_id ? record.load({
                        type: 'customrecord_p1_priority_quote',
                        id: quote_recd_id,
                        // isDynamic: true
                    }) : '';

                    item_object = quote_record ? JSON.parse(quote_record.getValue('custrecord_p1_item_object')) : '';
                    log.debug('item_object', item_object);
                    // ------------------------- Getting Items Details --------------------
                    var loadClass_obj = [], totalShipLoad_obj = 0;

                    var item_arr = []; // Single items array.
                    var enh_item_arr = []; // Enhance item Array.
                    if (item_object) {

                        // ******************* Creating Item Array and enhance handling arrays ********************
                        var pickItemArr;
                        // var parsedArr = item_object;
                        var retItemArrLen = item_object.items.length;
                        var retEnhanArrLen = (item_object.enhancedHandlingUnits) ? item_object.enhancedHandlingUnits.length : '';

                        // This condition will run for single items in enhanced array
                        if (retItemArrLen == 0) {
                            item_arr = [];
                        } else {
                            for (s = 0; s < retItemArrLen; s++) {
                                // const element = array[s];
                                var itmObj = item_object.items[s];

                                // log.debug('itmObj 2216', itmObj);
                                if (itmObj.isHazardous == true) {
                                    var enhpackpropervalue, enhhazmatclassvalue, enhunnovalue, enhgroupvalue, itmMchId;
                                    var hazsinglelineCount = context.request.getLineCount({ group: 'hazmat_info' });
                                    log.debug('hazsinglelineCount 2207', hazsinglelineCount);
                                    for (x = 0; x < hazsinglelineCount; x++) {
                                        // const element = array[x];
                                        log.debug('x 2210', x);
                                        itmMchId = context.request.getSublistValue({
                                            group: 'hazmat_info',
                                            name: 'itm_sr_no',
                                            line: x
                                        });
                                        log.debug('itmMchId 2214', itmMchId + ' || ' + (s + 1));
                                        if (itmMchId == (s + 1)) {

                                            enhpackpropervalue = context.request.getSublistValue({
                                                group: 'hazmat_info',
                                                name: 'propername',
                                                line: x
                                            });

                                            enhhazmatclassvalue = context.request.getSublistValue({
                                                group: 'hazmat_info',
                                                name: 'hazmatclass',
                                                line: x
                                            });

                                            enhunnovalue = context.request.getSublistValue({
                                                group: 'hazmat_info',
                                                name: 'unno',
                                                line: x
                                            });

                                            enhgroupvalue = context.request.getSublistValue({
                                                group: 'hazmat_info',
                                                name: 'group',
                                                line: x
                                            });

                                            log.debug('2359 s || x', s + ' || ' + x);
                                        }
                                    }


                                    pickItemArr = {
                                        freightClass: itmObj.freightClass,
                                        packagingType: itmObj.packagingType,
                                        units: itmObj.units,
                                        pieces: itmObj.pieces,
                                        totalWeight: itmObj.totalWeight,
                                        length: itmObj.length,
                                        width: itmObj.width,
                                        height: itmObj.height,
                                        description: itmObj.description,
                                        isStackable: itmObj.isStackable,
                                        isHazardous: itmObj.isHazardous,
                                        isUsed: itmObj.isUsed,
                                        nmfcItemCode: itmObj.nmfcItemCode,
                                        nmfcSubCode: itmObj.nmfcSubCode,
                                        hazmatDetail: {
                                            identificationNumber: enhunnovalue,
                                            properShippingName: enhpackpropervalue,
                                            hazardClass: enhhazmatclassvalue,
                                            packingGroup: enhgroupvalue
                                        }
                                    };

                                } else {
                                    pickItemArr = {
                                        freightClass: itmObj.freightClass,
                                        packagingType: itmObj.packagingType,
                                        units: itmObj.units,
                                        pieces: itmObj.pieces,
                                        totalWeight: itmObj.totalWeight,
                                        length: itmObj.length,
                                        width: itmObj.width,
                                        height: itmObj.height,
                                        description: itmObj.description,
                                        isStackable: itmObj.isStackable,
                                        isHazardous: itmObj.isHazardous,
                                        isUsed: itmObj.isUsed,
                                        nmfcItemCode: itmObj.nmfcItemCode,
                                        nmfcSubCode: itmObj.nmfcSubCode
                                    };
                                }

                                loadClass_obj.push(itmObj.freightClass);
                                var standalone_weight = Number(itmObj.totalWeight);
                                totalShipLoad_obj += standalone_weight;

                                item_arr.push(pickItemArr);
                                log.debug('itemDataArr in for loop', item_arr);
                            }
                        }
                        // This condition will run for Enhanced items in enhanced array
                        for (h = 0; h < retEnhanArrLen; h++) {
                            // const element = array[h];
                            var enhItemObj = item_object.enhancedHandlingUnits[h];
                            var pkgsObj = [];
                            var crrPkgLen = enhItemObj.packages.length;
                            log.debug('crrPkgLen 1596', crrPkgLen);
                            for (u = 0; u < crrPkgLen; u++) {
                                // const element = array[u];
                                var crrIndexPkg = enhItemObj.packages[u];
                                var hazOption = crrIndexPkg.packageIsHazardous;

                                // Hazmat = true

                                if (hazOption == true) {
                                    var hazLineVal = ((h * 10) + u);
                                    log.debug('hazLineVal', hazLineVal);
                                    var hazlineCount = context.request.getLineCount({ group: 'enhanncehazmat_info' });
                                    log.debug('hazlineCount 2367', hazlineCount);
                                    for (z = 0; z < hazlineCount; z++) {
                                        var hazLineNumber = context.request.getSublistValue({
                                            group: 'enhanncehazmat_info',
                                            name: 'enhan_identity_fld',
                                            line: z
                                        });
                                        log.debug('hazLineVal line hazLineNumber 2349', hazLineNumber);

                                        if (hazLineNumber == hazLineVal) {
                                            var enhpackpropervalue = context.request.getSublistValue({
                                                group: 'enhanncehazmat_info',
                                                name: 'enhanncepropername',
                                                line: z
                                            });

                                            var enhhazmatclassvalue = context.request.getSublistValue({
                                                group: 'enhanncehazmat_info',
                                                name: 'enhanncehazmatclass',
                                                line: z
                                            });

                                            var enhunnovalue = context.request.getSublistValue({
                                                group: 'enhanncehazmat_info',
                                                name: 'enhunno',
                                                line: z
                                            });

                                            var enhgroupvalue = context.request.getSublistValue({
                                                group: 'enhanncehazmat_info',
                                                name: 'enhanncegroup',
                                                line: z
                                            });
                                        }
                                    }

                                    var crrPkgJsonObj = {
                                        packageFreightClass: crrIndexPkg.packageFreightClass,
                                        weightPerPackage: crrIndexPkg.weightPerPackage,
                                        quantity: crrIndexPkg.quantity,
                                        pieces: crrIndexPkg.pieces,
                                        packagingType: crrIndexPkg.packagingType,
                                        packageLength: crrIndexPkg.packageLength,
                                        packageWidth: crrIndexPkg.packageWidth,
                                        packageHeight: crrIndexPkg.packageHeight,
                                        packageIsHazardous: crrIndexPkg.packageIsHazardous,
                                        packageIsUsed: crrIndexPkg.packageIsUsed,
                                        packageIsMachinery: crrIndexPkg.packageIsMachinery,
                                        packageNmfcItemCode: crrIndexPkg.packageNmfcItemCode,
                                        packageNmfcSubCode: crrIndexPkg.packageNmfcSubCode,
                                        description: crrIndexPkg.packageDesc,
                                        hazmatDetail: {
                                            identificationNumber: enhunnovalue,
                                            properShippingName: enhpackpropervalue,
                                            hazardClass: enhhazmatclassvalue,
                                            packingGroup: enhgroupvalue
                                        }
                                    };
                                    pkgsObj.push(crrPkgJsonObj);
                                }
                                else {
                                    var crrPkgJsonObj = {
                                        packageFreightClass: crrIndexPkg.packageFreightClass,
                                        weightPerPackage: crrIndexPkg.weightPerPackage,
                                        quantity: crrIndexPkg.quantity,
                                        pieces: crrIndexPkg.pieces,
                                        packagingType: crrIndexPkg.packagingType,
                                        packageLength: crrIndexPkg.packageLength,
                                        packageWidth: crrIndexPkg.packageWidth,
                                        packageHeight: crrIndexPkg.packageHeight,
                                        packageIsHazardous: crrIndexPkg.packageIsHazardous,
                                        packageIsUsed: crrIndexPkg.packageIsUsed,
                                        packageIsMachinery: crrIndexPkg.packageIsMachinery,
                                        packageNmfcItemCode: crrIndexPkg.packageNmfcItemCode,
                                        packageNmfcSubCode: crrIndexPkg.packageNmfcSubCode,
                                        description: crrIndexPkg.packageDesc,
                                    };
                                    pkgsObj.push(crrPkgJsonObj);
                                }

                                loadClass_obj.push(crrIndexPkg.packageFreightClass);
                                var enhance_weight = Number(crrIndexPkg.weightPerPackage);
                                totalShipLoad_obj += enhance_weight;

                            }
                            var enhObj = {
                                handlingUnitType: enhItemObj.handlingUnitType,
                                units: enhItemObj.units,
                                handlingUnitLength: enhItemObj.handlingUnitLength,
                                handlingUnitWidth: enhItemObj.handlingUnitWidth,
                                handlingUnitHeight: enhItemObj.handlingUnitHeight,
                                description: enhItemObj.description,
                                isStackable: enhItemObj.isStackable,
                                isMachinery: enhItemObj.isMachinery,
                                packages: pkgsObj
                            }
                            enh_item_arr.push(enhObj);
                        }
                    }
                    var emergency_contact_val = context.request.parameters.emergencyno ? context.request.parameters.emergencyno : null;
                    if (emergency_contact_val)
                        emergency_contact_val = emergency_contact_val.replace(/\D/g, '');

                    // ------------------- Shipment Identifier sublist -------------------
                    var refLinesCount = context.request.getLineCount({
                        group: 'reference_info'
                    });

                    var shipmentIdentifiers = [];
                    if (refLinesCount > 0)
                        for (var reflines = 0; reflines < refLinesCount; reflines++) {
                            var type = context.request.getSublistValue({
                                group: 'reference_info',
                                name: 'custpagereferencetype',
                                line: reflines
                            });

                            var refvalue = context.request.getSublistValue({
                                group: 'reference_info',
                                name: 'referenceno',
                                line: reflines
                            });

                            var shipment = {
                                "type": type,
                                "value": refvalue,
                                "primaryForType": false
                            };
                            shipmentIdentifiers.push(shipment);
                        }

                    //---------------- Request Body ------------------------------
                    var bodyShipment = JSON.stringify({
                        "originLocation": {
                            "address": {
                                "addressLine1": context.request.parameters.pickup_address ? context.request.parameters.pickup_address : null,
                                "addressLine2": context.request.parameters.pickup_address2 ? context.request.parameters.pickup_address2 : null,
                                "city": quote_record.getValue({ fieldId: 'custrecord_pick_city' }),
                                "state": quote_record.getValue({ fieldId: 'custrecord_pick_state' }),
                                "postalCode": quote_record.getValue({ fieldId: 'custrecord_pickup_zip' }),
                                "country": quote_record.getValue({ fieldId: 'custrecord_country' })
                            },
                            "contact": {
                                "companyName": context.request.parameters.pickup_company ? context.request.parameters.pickup_company : null,
                                "contactName": context.request.parameters.pickup_contact_name ? context.request.parameters.pickup_contact_name : null,
                                "phoneNumber": context.request.parameters.pickup_phone_num ? context.request.parameters.pickup_phone_num : null,
                                "email": context.request.parameters.pickup_email_info ? context.request.parameters.pickup_email_info : null
                            }
                        },
                        "destinationLocation": {
                            "address": {
                                "addressLine1": context.request.parameters.destination_address ? context.request.parameters.destination_address : null,
                                "addressLine2": context.request.parameters.destination_address2 ? context.request.parameters.destination_address2 : null,
                                "city": quote_record.getValue({ fieldId: 'custrecord_dest_city' }),
                                "state": quote_record.getValue({ fieldId: 'custrecord_dest_state' }),
                                "postalCode": quote_record.getValue({ fieldId: 'custrecord_destination_zip' }),
                                "country": quote_record.getValue({ fieldId: 'custrecord_destination_country' })
                            },
                            "contact": {
                                "companyName": context.request.parameters.destination_company ? context.request.parameters.destination_company : null,
                                "contactName": context.request.parameters.destination_contact_name ? context.request.parameters.destination_contact_name : null,
                                "phoneNumber": context.request.parameters.destionation_phone_num ? context.request.parameters.destionation_phone_num : null,
                                "email": context.request.parameters.destination_email_info ? context.request.parameters.destination_email_info : null
                            }
                        },
                        "lineItems": item_arr,
                        "enhancedHandlingUnits": enh_item_arr,
                        "pickupWindow": {
                            "date": context.request.parameters.pickupdate ? context.request.parameters.pickupdate : null,
                            "startTime": context.request.parameters.pickupstart ? context.request.parameters.pickupstart : null,
                            "endTime": context.request.parameters.custpage_pickupend ? context.request.parameters.custpage_pickupend : null
                        },
                        "deliveryWindow": {
                            "date": context.request.parameters.est_del_date ? context.request.parameters.est_del_date : null,
                            "startTime": context.request.parameters.destionationstart ? context.request.parameters.destionationstart : null,
                            "endTime": context.request.parameters.destionationend ? context.request.parameters.destionationend : null
                        },
                        "shipmentIdentifiers": shipmentIdentifiers,

                        "shipmentEmergencyContact": {
                            "name": context.request.parameters.custpage_emergencycontact ? context.request.parameters.custpage_emergencycontact : null,
                            "phoneNumber": context.request.parameters.custpage_emergencyno ? context.request.parameters.custpage_emergencyno : null //"615-654-3215"
                        },
                        "pickupNote": context.request.parameters.pickup_contact_notes ? context.request.parameters.pickup_contact_notes : null,
                        "quoteId": context.request.parameters.custpage_carrier_id ? context.request.parameters.custpage_carrier_id : null,
                        "insuranceAmount": context.request.parameters.calculateamount ? context.request.parameters.calculateamount : null
                    });
                    log.debug('bodyShipment', bodyShipment);

                    // -------------------- API Call ------------------

                    var fieldLookUp = search.lookupFields({
                        type: "customrecord_p1_api_configurations",
                        id: 1,
                        columns: ['custrecord_endpointurl', 'custrecord_xapikey']
                    });
                    var urlEndPoint = fieldLookUp.custrecord_endpointurl;
                    var xApiKey = fieldLookUp.custrecord_xapikey;

                    var postRequest = https.post({
                        url: urlEndPoint + '/v2/ltl/shipments/dispatch',
                        headers: {
                            "X-API-KEY": xApiKey,
                            "Connection": "keep-alive",
                            "Access-Control-Allow-Origin": "*",
                            "Accept": "*/*",
                            "Accept-Encoding": "gzip, deflate, br",
                            "Content-Type": "application/json"
                        },
                        body: bodyShipment
                    });

                    var response_body = JSON.parse(postRequest.body);
                    // ---------------- checking for any error ----------------------- 
                    if (response_body != '') {
                        log.debug('response_body', response_body);

                        var errors = response_body.errors;
                        // log.debug('errors', errors);
                        if (errors) {
                            errors = JSON.stringify(errors);
                            // errors = JSON.stringify(errors);
                            errors = errors.replace(/,/g, '\n');
                            throw new Error(errors);
                        }

                        var resp = response_body[0];
                        if (resp) {
                            if ("severity" in resp) {
                                var error_msg = JSON.stringify(response_body[0]);
                                log.debug('error_msg', error_msg);
                                throw Error(error_msg);
                            }
                        }
                    }

                    log.debug('loadClass_obj || totalShipLoad_obj ', loadClass_obj + ' || ' + totalShipLoad_obj);

                    // ------------- creating shipment record -----------------------
                    var shipment_Record = record.create({
                        type: 'customrecord_p1_shipment_details',
                    });

                    // -------------- Pickup Fields ---------------------
                    shipment_Record.setValue({
                        fieldId: 'custrecord_company_name',
                        value: context.request.parameters.pickup_company ? context.request.parameters.pickup_company : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_address_line_1',
                        value: context.request.parameters.pickup_address ? context.request.parameters.pickup_address : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_address_line_2',
                        value: context.request.parameters.pickup_address2 ? context.request.parameters.pickup_address2 : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_city_state_zip',
                        value: quote_record.getValue({ fieldId: 'custrecord_pick_city' }) + ', ' + quote_record.getValue({ fieldId: 'custrecord_pick_state' }) + ', ' + quote_record.getValue({ fieldId: 'custrecord_pickup_zip' }),
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_contact_phone',
                        value: context.request.parameters.pickup_phone_num ? context.request.parameters.pickup_phone_num : '',
                        ignoreFieldChange: true
                    });

                    // ------------------ Destination Fields -----------------------
                    shipment_Record.setValue({
                        fieldId: 'custrecord_delivery_company_name',
                        value: context.request.parameters.destination_company ? context.request.parameters.destination_company : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_delivery_address_line_1',
                        value: context.request.parameters.destination_address ? context.request.parameters.destination_address : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_delivery_address_line_2',
                        value: context.request.parameters.destination_address2 ? context.request.parameters.destination_address2 : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_delivery_city_state_zip',
                        value: quote_record.getValue({ fieldId: 'custrecord_dest_city' }) + ', ' + quote_record.getValue({ fieldId: 'custrecord_dest_state' }) + ', ' + quote_record.getValue({ fieldId: 'custrecord_destination_zip' }),
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_delivery_contact_phone',
                        value: context.request.parameters.destionation_phone_num ? context.request.parameters.destionation_phone_num : '',
                        ignoreFieldChange: true
                    });
                    // ----------------- Schedule Fields ---------------------
                    shipment_Record.setValue({
                        fieldId: 'custrecord_shipment_pick_date',
                        value: context.request.parameters.pickupdate ? context.request.parameters.pickupdate : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_shipment_pick_start',
                        value: context.request.parameters.pickupstart ? context.request.parameters.pickupstart : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_shipment_pick_end',
                        value: context.request.parameters.custpage_pickupend ? context.request.parameters.custpage_pickupend : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_ps_details',
                        value: context.request.parameters.est_del_date ? context.request.parameters.est_del_date : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_shipment_destination_start',
                        value: context.request.parameters.destionationstart ? context.request.parameters.destionationstart : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_shipment_destination_end',
                        value: context.request.parameters.destionationend ? context.request.parameters.destionationend : '',
                        ignoreFieldChange: true
                    });

                    // ------------- Reference record fields ------------------
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_load_classes',
                        value: '[' + loadClass_obj + ']',
                        ignoreFieldChange: true
                    });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_total_shipment_load',
                    //     value: quote_record.getValue({ fieldId: 'custrecord_so_int_id' }) ? quote_record.getValue({ fieldId: 'custrecord_so_int_id' }) : '',
                    //     ignoreFieldChange: true
                    // });

                    shipment_Record.setValue({
                        fieldId: 'custrecord_details_so_number',
                        value: quote_record.getValue({ fieldId: 'custrecord_so_int_id' }) ? quote_record.getValue({ fieldId: 'custrecord_so_int_id' }) : ' ',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_if_numbers',
                        value: quote_record.getValue({ fieldId: 'custrecord_if_int_id' }) ? quote_record.getValue({ fieldId: 'custrecord_if_int_id' }) : ' ',
                        ignoreFieldChange: true
                    });

                    var jsn_arr = response_body.shipmentIdentifiers;
                    var pro_index = jsn_arr.findIndex(object => {
                        return object.type === 'PRO';
                    });
                    var proRef;
                    if (pro_index != -1) {
                        proRef = response_body.shipmentIdentifiers[pro_index].value;
                    }

                    var bol_index = jsn_arr.findIndex(object => {
                        return object.type === 'BILL_OF_LADING';
                    });
                    // log.debug('bol_index', bol_index);
                    var bolRef = response_body.shipmentIdentifiers[bol_index].value;
                    shipment_Record.setValue({
                        fieldId: 'custrecord_bol_number',
                        value: bolRef,
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_carrier_quote_no',
                        value: context.request.parameters.custpage_carrier_id ? context.request.parameters.custpage_carrier_id : ' ',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_pickupnote',
                        value: context.request.parameters.pickup_contact_notes ? context.request.parameters.pickup_contact_notes : ' ',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_ship_response_data',
                        value: postRequest.body,
                        ignoreFieldChange: true
                    });

                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_quote_rec_id',
                        value: quote_recd_id ? quote_recd_id : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_insurance_amt',
                        value: context.request.parameters.calculateamount ? context.request.parameters.calculateamount : '',
                        ignoreFieldChange: true
                    });

                    // ----------------- Emergency Contact --------------------
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_emrgcy_cont_name',
                        value: context.request.parameters.custpage_emergencycontact ? context.request.parameters.custpage_emergencycontact : '',
                        ignoreFieldChange: true
                    });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_emrgcy_cont_no',
                        value: context.request.parameters.custpage_emergencyno ? context.request.parameters.custpage_emergencyno : '',
                        ignoreFieldChange: true
                    });

                    // ---------------------- Carrier Details ---------------------------
                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_carrier',
                        value: context.request.parameters.carriername ? context.request.parameters.carriername : '',
                        ignoreFieldChange: true
                    });

                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_carrier_code_all_sh',
                        value: context.request.parameters.carriercode ? context.request.parameters.carriercode : '',
                        ignoreFieldChange: true
                    });

                    var shipment_recordId = shipment_Record.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });

                    log.debug('shipment_recordId', shipment_recordId);

                    // ----------------- Setting BOL and Ship record value in custom quote record-----------------
                    quote_record.setValue({
                        fieldId: 'custrecord_bill_of_lading',
                        value: bolRef ? bolRef : '',
                        ignoreFieldChange: true
                    });
                    quote_record.setValue({
                        fieldId: 'custrecord_shippment',
                        value: shipment_recordId ? shipment_recordId : '',
                        ignoreFieldChange: true
                    });
                    var quote_recordId = quote_record.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                    log.debug('quote_recordId', quote_recordId);

                    //---
                    var shipMethodId;
                    var shipitemSearchObj = search.create({
                        type: "shipitem",
                        filters:
                            [
                                ["itemid", "contains", carrierName]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "internalid", label: "Internal ID" })
                            ]
                    });
                    var searchResultCount = shipitemSearchObj.runPaged().count;
                    log.debug("shipitemSearchObj result count", searchResultCount);

                    if (searchResultCount > 0) {
                        log.debug('Ship Method Exist');
                        shipitemSearchObj.run().each(function (result) {
                            shipMethodId = result.getValue('internalid')
                        });
                    } else {
                        log.debug('Ship Method Create');
                        var ship_Record = record.create({
                            type: record.Type.SHIP_ITEM
                        });

                        ship_Record.setValue({
                            fieldId: 'itemid',
                            value: carrierName_Obj
                        });
                        ship_Record.setValue({
                            fieldId: 'displayname',
                            value: carrierName_Obj
                        });
                        ship_Record.setValue({
                            fieldId: 'description',
                            value: carrierName_Obj
                        });
                        ship_Record.setValue({
                            fieldId: 'subsidiary',
                            value: 4
                        });
                        ship_Record.setValue({
                            fieldId: 'account',
                            value: 108
                        });
                        ship_Record.setValue({
                            fieldId: 'taxschedule',
                            value: 1
                        });

                        var shipMethodId = ship_Record.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                    }
                    log.debug('shipMethod Id', shipMethodId);
                    //----

                    var record_type = quote_record.getValue({ fieldId: 'custrecord_p1_trx_record_type' });
                    // if (quote_record.getValue({ fieldId: 'custrecord_p1_so_checkbox' })) {
                    //     record_type = 'salesorder';
                    var record_id = quote_record.getValue({ fieldId: 'custrecord_so_int_id' });
                    // }
                    var accID = runtime.accountId;
                    accID = accID.toLowerCase();

                    var comDomain = url.resolveDomain({
                        hostType: url.HostType.APPLICATION,
                        accountId: accID
                    });

                    var shipment_suitelet_url = url.resolveScript({
                        scriptId: 'customscript_sl_p1_allshipment_details',
                        deploymentId: 'customdeploy_sl_p1_allshipment_details',
                        // returnExternalUrl: true
                        params: {
                            'shipment_id': shipment_recordId
                        }
                    });

                    var suitelet_url = "https://" + comDomain + shipment_suitelet_url;
                    record_type ? (
                        record.submitFields({
                            type: record_type,
                            id: record_id,
                            values: {
                                'custbody_p1_shipment_url': suitelet_url,
                                'custbody_acs_tracking_number': proRef,
                                'shipcarrier': 'nonups',
                                'shipmethod': shipMethodId
                            }
                        }) &&
                        redirect.toRecord({
                            type: record_type,
                            id: record_id
                        })) : redirect.toSuitelet({
                            scriptId: 'customscript_sl_p1_allshipment_details',
                            deploymentId: 'customdeploy_sl_p1_allshipment_details',
                            parameters: {
                                shipment_id: shipment_recordId
                            }
                        });

                } catch (error) {
                    errorMessage = error.message;
                    log.debug('Error in GET API function', error);
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
        return {
            onRequest: onRequest
        };

    });