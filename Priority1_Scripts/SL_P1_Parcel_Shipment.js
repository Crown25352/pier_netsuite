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
                    var effDate = pickDeliveryForm.addField({
                        id: 'carriereffectivedate',
                        type: N_server.FieldType.TEXT,
                        label: 'EFFECTIVE DATE',
                        container: 'carrierInfofieldgroup'
                    });
                    effDate.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    var expDate = pickDeliveryForm.addField({
                        id: 'carrierexpirationdate',
                        type: N_server.FieldType.TEXT,
                        label: 'EXPIRATION DATE',
                        container: 'carrierInfofieldgroup'
                    });
                    expDate.updateDisplayType({
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

                    // ----------------------- Pick Up Fields -------------------------------

                    var pickupField = pickDeliveryForm.addFieldGroup({
                        id: 'pickupfieldgroupid',
                        label: 'PICKUP'
                    });
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
                    // --------------------- Destination Fields ----------------------
                    var destinationField = pickDeliveryForm.addFieldGroup({
                        id: 'destinstionfieldgroupid',
                        label: 'DESTINATION'
                    });

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
                    // ---------------------- Setting value from params for Quote details ----------------------

                    quote_Rec_Id ? quote_fld.defaultValue = quote_Rec_Id : '';
                    carCode.defaultValue = (context.request.parameters.cc) ? (context.request.parameters.cc) : '';
                    (context.request.parameters.cN) ? carName.defaultValue = context.request.parameters.cN : '';
                    (context.request.parameters.Tc) ? carCharge.defaultValue = context.request.parameters.Tc : '';
                    (context.request.parameters.sld) ? carServicelevel.defaultValue = context.request.parameters.sld : '';
                    (context.request.parameters.effD) ? effDate.defaultValue = context.request.parameters.effD : '';
                    (context.request.parameters.expnD) ? expDate.defaultValue = context.request.parameters.expnD : '';
                    (context.request.parameters.carID) ? carrier_Id.defaultValue = context.request.parameters.carID : '';
                    // (context.request.parameters.cQn) ? carrier_QuoteNumber.defaultValue = context.request.parameters.cQn : '';

                    // // ------------------------ Setting value for PickUp details --------------------

                    var pickup_city = '', pickup_state = '', pickup_zip = '';
                    if (quote_record.getValue({ fieldId: 'custrecord_pick_city' }))
                        pickup_city = quote_record.getValue({ fieldId: 'custrecord_pick_city' }) + ', ';

                    if (quote_record.getValue({ fieldId: 'custrecord_pick_state' }))
                        pickup_state = quote_record.getValue({ fieldId: 'custrecord_pick_state' }) + ', ';

                    if (quote_record.getValue({ fieldId: 'custrecord_pickup_zip' }))
                        pickup_zip = quote_record.getValue({ fieldId: 'custrecord_pickup_zip' });

                    pickupCityStateZip.defaultValue = pickup_city + pickup_state + pickup_zip;

                    (quote_record.getValue({ fieldId: 'custrecord_pickup_zip' })) ? carfrom.defaultValue = quote_record.getValue({ fieldId: 'custrecord_pickup_zip' }) : '';
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
                    log.debug('item_object 852', item_object);
                    item_object = JSON.parse(item_object);

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
                        itemLiablitySub.addField({
                            id: 'carrier_units',
                            type: N_server.FieldType.TEXT,
                            label: 'Unit(S)'
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
                        // ----------------------Set Stand - alone item sublist--------------
                        if (item_object.items.length > 0)
                            for (v = 0; v < item_object.items.length; v++) {

                                var itmNo_obj = String(v + 1);
                                itemLiablitySub.setSublistValue({
                                    id: 'item_no_id',
                                    line: v,
                                    value: itmNo_obj
                                });

                                itemLiablitySub.setSublistValue({
                                    id: 'carrier_units',
                                    line: v,
                                    value: item_object.items[v].units
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
                            }
                    }

                    // ------------------ Extra Data Fields -------------------------


                    var saveButton = pickDeliveryForm.addSubmitButton({
                        label: 'Dispatch Shipment'
                    });

                    context.response.writePage({
                        pageObject: pickDeliveryForm
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
            // ------------------------------ Post Method ----------------------------------------
            else {
                try {
                    var delimiter = /\u0001/;
                    var quote_recd_id = context.request.parameters.quote_int_id;
                    quote_record = quote_recd_id ? record.load({
                        type: 'customrecord_p1_priority_quote',
                        id: quote_recd_id,
                        // isDynamic: true
                    }) : '';

                    var item_object = quote_record ? JSON.parse(quote_record.getValue('custrecord_p1_item_object')) : '';
                    log.debug('item_object', item_object);
                    // ------------------------- Getting Items Details --------------------
                    var item_arr = []; // Single items array.
                    if (item_object) {
                        var Item_object_array = item_object.items ? item_object.items : '';
                        log.debug('ItemArrLength')
                        for (var i = 0; i < Item_object_array.length; i++) {
                            var current_object = Item_object_array[i];
                            var new_object = {
                                "units": current_object.units ? current_object.units : null,
                                "weightUnit": current_object.totalWeightUnit ? current_object.totalWeightUnit : null,
                                "totalWeight": current_object.totalWeight ? current_object.totalWeight : null,
                                "dimensionUnit": current_object.sinLwhUnit ? current_object.sinLwhUnit : null,
                                "length": current_object.length ? current_object.length : null,
                                "width": current_object.width ? current_object.width : null,
                                "height": current_object.height ? current_object.height : null
                            };
                            item_arr.push(new_object);
                        }
                    }
                    //---------------- Request Body ------------------------------
                    var bodyShipment = JSON.stringify({
                        "originLocation": {
                            "address": {
                                "addressLine1": context.request.parameters.pickup_address ? context.request.parameters.pickup_address : null,
                                "addressLine2": null,
                                "city": quote_record.getValue({ fieldId: 'custrecord_pick_city' }),
                                "state": quote_record.getValue({ fieldId: 'custrecord_pick_state' }),
                                "postalCode": quote_record.getValue({ fieldId: 'custrecord_pickup_zip' }),
                                "country": quote_record.getValue({ fieldId: 'custrecord_country' })
                            },
                            "contact": {
                                "companyName": context.request.parameters.pickup_company ? context.request.parameters.pickup_company : null,
                                "contactName": context.request.parameters.pickup_contact_name ? context.request.parameters.pickup_contact_name : null,
                                "phoneNumber": context.request.parameters.pickup_phone_num ? context.request.parameters.pickup_phone_num : null,
                                "phoneNumberExtension": null,
                                "email": context.request.parameters.pickup_email_info ? context.request.parameters.pickup_email_info : null
                            }
                        },
                        "destinationLocation": {

                            "address": {
                                "addressLine1": context.request.parameters.destination_address ? context.request.parameters.destination_address : null,
                                "addressLine2": null,
                                "city": quote_record.getValue({ fieldId: 'custrecord_dest_city' }),
                                "state": quote_record.getValue({ fieldId: 'custrecord_dest_state' }),
                                "postalCode": quote_record.getValue({ fieldId: 'custrecord_destination_zip' }),
                                "country": quote_record.getValue({ fieldId: 'custrecord_destination_country' })
                            },
                            "contact": {
                                "companyName": context.request.parameters.destination_company ? context.request.parameters.destination_company : null,
                                "contactName": context.request.parameters.destination_contact_name ? context.request.parameters.destination_contact_name : null,
                                "phoneNumber": context.request.parameters.destionation_phone_num ? context.request.parameters.destionation_phone_num : null,
                                "phoneNumberExtension": null,
                                "email": context.request.parameters.destination_email_info ? context.request.parameters.destination_email_info : null
                            }
                        },
                        "lineItems": item_arr,
                        "quoteRateId": context.request.parameters.custpage_carrier_id ? context.request.parameters.custpage_carrier_id : null
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

                    var post_Request = https.post({
                        url: urlEndPoint + '/v2/parcel/shipments/dispatch',
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

                    var response_body = JSON.parse(post_Request.body);
                    log.debug('response_body 605', response_body);
                    // ---------------- checking for any error ----------------------- 
                    if (response_body != '') {
                        var resp = response_body[0];
                        if (resp) {
                            if ("severity" in resp) {
                                var error_msg = JSON.stringify(response_body[0]);
                                log.debug('error_msg', error_msg);
                                throw Error(error_msg);
                            }
                        }
                    }

                    // log.debug('loadClass_obj || totalShipLoad_obj ', loadClass_obj + ' || ' + totalShipLoad_obj);

                    // // ------------- creating shipment record -----------------------
                    var shipment_Record = record.create({
                        type: 'customrecord_p1_shipment_details',
                    });

                    // // -------------- Pickup Fields ---------------------

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
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_shipment_pick_date',
                    //     value: context.request.parameters.pickupdate ? context.request.parameters.pickupdate : '',
                    //     ignoreFieldChange: true
                    // });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_shipment_pick_start',
                    //     value: context.request.parameters.pickupstart ? context.request.parameters.pickupstart : '',
                    //     ignoreFieldChange: true
                    // });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_shipment_pick_end',
                    //     value: context.request.parameters.custpage_pickupend ? context.request.parameters.custpage_pickupend : '',
                    //     ignoreFieldChange: true
                    // });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_ps_details',
                    //     value: context.request.parameters.est_del_date ? context.request.parameters.est_del_date : '',
                    //     ignoreFieldChange: true
                    // });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_shipment_destination_start',
                    //     value: context.request.parameters.destionationstart ? context.request.parameters.destionationstart : '',
                    //     ignoreFieldChange: true
                    // });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_shipment_destination_end',
                    //     value: context.request.parameters.destionationend ? context.request.parameters.destionationend : '',
                    //     ignoreFieldChange: true
                    // });

                    // ------------- Reference record fields ------------------
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_load_classes',
                    //     value: '[' + loadClass_obj + ']',
                    //     ignoreFieldChange: true
                    // });
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
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_if_numbers',
                    //     value: quote_record.getValue({ fieldId: 'custrecord_if_int_id' }) ? quote_record.getValue({ fieldId: 'custrecord_if_int_id' }) : ' ',
                    //     ignoreFieldChange: true
                    // });
                    var jsn_arr = response_body.shipmentIdentifiers;
                    var bol_index = jsn_arr.findIndex(object => {
                        return object.type === 'BILL_OF_LADING';
                    });
                    log.debug('bol_index', bol_index);
                    var bolRef = bol_index != -1 ? response_body.shipmentIdentifiers[bol_index].value : ' ';
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
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_pickupnote',
                    //     value: context.request.parameters.pickup_contact_notes ? context.request.parameters.pickup_contact_notes : ' ',
                    //     ignoreFieldChange: true
                    // });
                    shipment_Record.setValue({
                        fieldId: 'custrecord_ship_response_data',
                        value: post_Request.body,
                        ignoreFieldChange: true
                    });

                    shipment_Record.setValue({
                        fieldId: 'custrecord_p1_quote_rec_id',
                        value: quote_recd_id ? quote_recd_id : '',
                        ignoreFieldChange: true
                    });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_insurance_amt',
                    //     value: context.request.parameters.calculateamount ? context.request.parameters.calculateamount : '',
                    //     ignoreFieldChange: true
                    // });

                    // ----------------- Emergency Contact --------------------
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_emrgcy_cont_name',
                    //     value: context.request.parameters.custpage_emergencycontact ? context.request.parameters.custpage_emergencycontact : ' ',
                    //     ignoreFieldChange: true
                    // });
                    // shipment_Record.setValue({
                    //     fieldId: 'custrecord_p1_emrgcy_cont_no',
                    //     value: context.request.parameters.custpage_emergencyno ? context.request.parameters.custpage_emergencyno : ' ',
                    //     ignoreFieldChange: true
                    // });

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

                    // // ----------------- Setting BOL and Ship record value in custom quote record-----------------
                    quote_record.setValue({
                        fieldId: 'custrecord_bill_of_lading',
                        value: bolRef != -1 ? bolRef : ' ',
                        ignoreFieldChange: true
                    });
                    quote_record.setValue({
                        fieldId: 'custrecord_shippment',
                        value: shipment_recordId ? shipment_recordId : ' ',
                        ignoreFieldChange: true
                    });
                    var quote_recordId = quote_record.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });

                    log.debug('quote_recordId', quote_recordId);
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
                                'custbody_p1_shipment_url': suitelet_url
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