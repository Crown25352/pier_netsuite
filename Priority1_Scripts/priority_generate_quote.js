/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/
define(['N/record', 'N/ui/serverWidget', 'N/search', 'N/redirect', 'N/url', 'N/https', 'N/runtime', 'N/cache', 'N/redirect'], function (record, serverWidget, search, redirect, url, https, runtime, cache, redirect) {
    function onRequest(scriptContext) {
        var billzip, shipzip;
        try {
            var transaction_int_id = scriptContext.request.parameters.soIdObj;
            var trx_type = scriptContext.request.parameters.trx_type;
            var objRecsale = record.load({
                type: trx_type,
                id: transaction_int_id,
                isDynamic: false,
            });
            var palletFieldObj = objRecsale.getValue({
                fieldId: 'custbody_p1_assigned_pallet_data'
            });

            /****Pulled up the From address information from the customer subsidiary record****/

            if (palletFieldObj) {
                var enhancedHandlingUnits = [];
                var itemsDetails = [];
                var updatedJson = JSON.parse(palletFieldObj);
                var dataitemsObj = updatedJson.items;
                var enhanceObj = updatedJson.enhancedHandlingUnits;

                for (var c = 0; c < enhanceObj.length; c++) {

                    var packArr = [];
                    var enhancePackage = enhanceObj[c].packages;

                    for (b = 0; b < enhancePackage.length; b++) {
                        var packageObj = {
                            packageFreightClass: enhancePackage[b].packageFreightClass,
                            weightPerPackage: enhancePackage[b].weightPerPackage,
                            weightUnitPackage: enhancePackage[b].weightUnitPackage,
                            quantity: enhancePackage[b].quantity,
                            pieces: enhancePackage[b].pieces,
                            packagingType: enhancePackage[b].packagingType,
                            packageLength: enhancePackage[b].packageLength,
                            packageWidth: enhancePackage[b].packageWidth,
                            packageHeight: enhancePackage[b].packageHeight,
                            packageLwhunit: enhancePackage[b].packageLwhunit,
                            packageIsHazardous: enhancePackage[b].packageIsHazardous,
                            packageIsUsed: enhancePackage[b].packageIsUsed,
                            packageIsMachinery: enhancePackage[b].packageIsMachinery,
                            packageNmfcItemCode: enhancePackage[b].packageNmfcItemCode,
                            packageNmfcSubCode: enhancePackage[b].packageNmfcSubCode
                        };

                        packArr.push(packageObj);
                    }

                    var pallet_dataitems = {
                        handlingUnitType: enhanceObj[c].handlingUnitType,
                        units: enhanceObj[c].units,
                        handlingUnitLength: enhanceObj[c].handlingUnitLength,
                        handlingUnitWidth: enhanceObj[c].handlingUnitWidth,
                        handlingUnitHeight: enhanceObj[c].handlingUnitHeight,
                        isStackable: enhanceObj[c].isStackable,
                        isMachinery: enhanceObj[c].isMachinery,
                        packages: packArr
                    };

                    enhancedHandlingUnits.push(pallet_dataitems);
                }

                if (dataitemsObj.length == 0) {
                    itemsDetails = [];
                } else {

                    for (a = 0; a < dataitemsObj.length; a++) {

                        var dataitems = {
                            description: dataitemsObj[a].description,
                            freightClass: dataitemsObj[a].freightClass,
                            packagingType: dataitemsObj[a].packagingType,
                            units: dataitemsObj[a].units,
                            pieces: dataitemsObj[a].pieces,
                            totalWeight: dataitemsObj[a].totalWeight,
                            totalWeightUnit: dataitemsObj[a].totalWeightUnit,
                            length: dataitemsObj[a].length,
                            width: dataitemsObj[a].width,
                            height: dataitemsObj[a].height,
                            singleLwhUnit: dataitemsObj[a].sinLwhUnit,
                            isStackable: dataitemsObj[a].isStackable,
                            isHazardous: dataitemsObj[a].isHazardous,
                            isUsed: dataitemsObj[a].isUsed,
                            isMachinery: dataitemsObj[a].isMachinery,
                            nmfcItemCode: dataitemsObj[a].nmfcItemCode,
                            nmfcSubCode: dataitemsObj[a].nmfcSubCode
                        };

                        itemsDetails.push(dataitems);

                    }
                }

                callapi(transaction_int_id, itemsDetails, enhancedHandlingUnits, palletFieldObj, trx_type);
            }

        } catch (error) {
            errorMessage = error.message;
            log.debug('Error in API function', error);

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
            scriptContext.response.write(html);
        }

        function callapi(transaction_int_id, itemsDetails, enhancedHandlingUnits, palletFieldObj, record_type) {
            try {
                var objRecsale = record.load({
                    type: record_type,
                    id: transaction_int_id
                });

                // ---------------- Getting Pickup Date Details -----------------
                var pickDate = objRecsale.getValue('trandate'); // Pickup Date
                log.debug('pickDate', pickDate);

                // ---------------- Getting Pickup & Destination Details -----------------
                var pick_company, pick_contact, pick_addr1, pick_addr2, pick_phone, pick_email, pick_city, pick_state, pick_open, pick_close, pick_country;
                var dest_company, dest_contact, dest_addr1, dest_addr2, dest_phone, dest_email, dest_city, dest_state, dest_open, dest_close, dest_country;

                // --------------- Pickup Address ---------------------------
                var subsidiary = (record_type == 'salesorder') ? objRecsale.getValue('location') : objRecsale.getValue('custbody_p1_pickup_location');

                var locrec = record.load({
                    type: record.Type.LOCATION,
                    id: subsidiary,
                    isDynamic: true,
                });
                var subrec = locrec.getSubrecord({
                    fieldId: 'mainaddress'
                });
                // log.debug('subrec', subrec);

                pick_country = subrec.getValue('country');
                log.debug('pick_country', pick_country);

                var PickZip;
                if (pick_country == 'CA') {
                    PickZip = subrec.getValue({
                        fieldId: 'zip'
                    });
                } else {
                    PickZip = subrec.getValue({
                        fieldId: 'zip'
                    });
                    var replaced = PickZip.replace(/\D/g, '');
                    PickZip = replaced.slice(0, 5);
                }
                log.debug('PickZip', PickZip);

                // var PickZip = subrec.getValue({
                //     fieldId: 'zip'
                // });
                // log.debug('PickZip', PickZip);
                // var replaced = PickZip.replace(/\D/g, '');
                // PickZip = replaced.slice(0, 5);

                pick_company = locrec.getValue('name');
                pick_contact = locrec.getValue('name');
                pick_addr1 = subrec.getValue('addr1');
                pick_addr2 = subrec.getValue('addr2');
                pick_phone = subrec.getValue('addrphone');
                pick_email = locrec.getValue('email');
                pick_city = subrec.getValue('city');
                pick_state = subrec.getValue('state');
                log.debug('pick_state 1', pick_state);
                pick_state = state_Code(pick_state);
                log.debug('pick_state 2', pick_state);
                // pick_open = pik_Record.getValue('custrecord_open');
                // pick_close = pik_Record.getValue('custrecord_close');

                // ------------- Destination Values -----------------

                var custSales = objRecsale.getValue('entity'); // Customer ID.

                var objRecord1 = record.load({
                    type: record.Type.CUSTOMER,
                    id: custSales,
                    isDynamic: true,
                });

                var shippingAddress = objRecsale.getSubrecord({
                    fieldId: 'shippingaddress'
                });
                dest_country = shippingAddress.getValue('country');
                log.debug('dest_country', dest_country);

                var shipzip;
                if (dest_country == 'CA') {
                    shipzip = shippingAddress.getValue('zip');
                } else {
                    shipzip = shippingAddress.getValue('zip');
                    var shipreplaced = shipzip.replace(/\D/g, '');
                    shipzip = shipreplaced.slice(0, 5);
                }
                log.debug('shipzip', shipzip);

                // // var shipzip = objRecord1.getValue('shipzip');
                // // var shipreplaced = shipzip.replace(/\D/g, '');
                // // shipzip = shipreplaced.slice(0, 5);

                dest_company = shippingAddress.getValue('addressee');
                dest_contact = shippingAddress.getValue('addressee');
                dest_addr1 = shippingAddress.getValue('addr1');
                dest_addr2 = shippingAddress.getValue('addr2');
                dest_phone = shippingAddress.getValue('addrphone') ? shippingAddress.getValue('addrphone') : objRecord1.getValue('phone');
                dest_email = objRecord1.getValue('email');
                dest_city = shippingAddress.getValue('city');
                dest_state = shippingAddress.getValue('state');
                log.debug('dest_state 1', dest_state);
                dest_state = state_Code(dest_state);
                log.debug('dest_state 2', dest_state);

                /****START code for data to send ****/

                var datatoSend = [];
                var datatoProceed = {
                    pickDate: pickDate,
                    billzip: PickZip,
                    shipzip: shipzip,
                    custInternalid: custSales
                };
                datatoSend.push(datatoProceed);

                /****END code for data to send ****/

                var So_Ns_no = objRecsale.getValue('tranid');

                /****Start code for Accessorial Services****/

                var accessorialServices = objRecsale.getValue('custbody_p1_accesorial_services');
                log.debug('accessorialServices', accessorialServices);
                var access_code = [];
                var acc_fld = ' ';

                if (accessorialServices[0]) {

                    for (var count = 0; count < accessorialServices.length; count++) {

                        var accessorialSearchObj = search.create({
                            type: "customrecord_p1_accessorial_services",
                            filters: ["internalid", "is", accessorialServices[count]],
                            columns: [
                                search.createColumn({
                                    name: "custrecord_accessorial_services_codes",
                                    label: "ACESSORIAL SERVICE CODES"
                                })
                            ]
                        });

                        var accesscode;
                        accessorialSearchObj.run().each(function (result) {
                            accesscode = result.getValue('custrecord_accessorial_services_codes');
                            return true;
                        });
                        var data = {
                            "code": accesscode
                        }
                        // if (count = 0) {
                        //     acc_fld = accesscode;
                        // } else {
                        acc_fld += accesscode + ',';
                        // }

                        access_code.push(data);
                    }
                }
                /****END code for Accessorial Services****/

                /****START CALL for Priority Get Rate API****/
                // This part will run in case of assigned pallet record.

                if (enhancedHandlingUnits.length > 0 && itemsDetails.length > 0) {
                    log.debug('itemsDetails and Enhancehandlingunits exist', "Scenario 1");
                    var bodyPriority = JSON.stringify({
                        "originCity": pick_city,
                        "originStateAbbreviation": pick_state,
                        "originZipCode": PickZip,
                        "originCountryCode": pick_country,
                        "destinationCity": dest_city,
                        "destinationStateAbbreviation": dest_state,
                        "destinationZipCode": shipzip,
                        "destinationCountryCode": dest_country,
                        "pickupDate": pickDate,
                        "items": itemsDetails,
                        "enhancedHandlingUnits": enhancedHandlingUnits,
                        "accessorialServices": access_code
                    });
                }

                // This part will run in case of Sales Order.

                else if (enhancedHandlingUnits.length == 0 && itemsDetails.length > 0) {
                    log.debug('Only item exist', "Scenario 2");
                    var bodyPriority = JSON.stringify({
                        "originCity": pick_city,
                        "originStateAbbreviation": pick_state,
                        "originZipCode": PickZip,
                        "originCountryCode": pick_country,
                        "destinationCity": dest_city,
                        "destinationStateAbbreviation": dest_state,
                        "destinationZipCode": shipzip,
                        "destinationCountryCode": dest_country,
                        "pickupDate": pickDate,
                        "items": itemsDetails,
                        "accessorialServices": access_code
                    });
                }

                else if (enhancedHandlingUnits.length > 0 && itemsDetails.length == 0) {
                    log.debug('Only Pallet exist', "Scenario 3");

                    var bodyPriority = JSON.stringify({
                        "originCity": pick_city,
                        "originStateAbbreviation": pick_state,
                        "originZipCode": PickZip,
                        "originCountryCode": pick_country,
                        "destinationCity": dest_city,
                        "destinationStateAbbreviation": dest_state,
                        "destinationZipCode": shipzip,
                        "destinationCountryCode": dest_country,
                        "pickupDate": pickDate,
                        "items": [],
                        "enhancedHandlingUnits": enhancedHandlingUnits,
                        "accessorialServices": access_code
                    });
                }

                log.debug('bodyPriority', bodyPriority);

                var fieldLookUp = search.lookupFields({
                    type: "customrecord_p1_api_configurations",
                    id: 1,
                    columns: ['custrecord_endpointurl', 'custrecord_xapikey']
                });
                var urlEndPoint = fieldLookUp.custrecord_endpointurl;
                var xApiKey_ = fieldLookUp.custrecord_xapikey;
                log.debug('fieldLookUp', fieldLookUp);

                var postRequest = https.post({
                    url: urlEndPoint + '/v2/ltl/quotes/rates',
                    headers: {
                        "X-API-KEY": xApiKey_,
                        "Content-Type": "application/json"
                    },
                    body: bodyPriority
                });

                log.debug('postRequest', postRequest.body);


                var jsonrequest = JSON.parse(postRequest.body);
                log.debug('jsonrequest', jsonrequest);

                // Error codes.
                var err_code_arr = [400, 402, 403, 404, 405, 406, 408, 409, 410, 411, 413, 414, 415, 417, 426, 500, 501, 502, 503, 504, 505];

                if (err_code_arr.indexOf(postRequest.code) != -1) {
                    var error_msg = JSON.stringify(jsonrequest);
                    throw Error(error_msg);
                }

                // -------------------- Creating Quote Record ---------------------------------

                var custom_Quote_Record = record.create({
                    type: 'customrecord_p1_priority_quote',
                    isDynamic: true
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_p1_pickup_date',
                    value: pickDate,
                    ignoreFieldChange: true
                });

                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_response_data',
                    value: postRequest.body
                });

                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_p1_item_object',
                    value: palletFieldObj,
                    ignoreFieldChange: true
                });

                log.debug('access_code', acc_fld);
                if (acc_fld.length > 0) {
                    custom_Quote_Record.setValue({
                        fieldId: 'custrecord_accessorial_services',
                        value: acc_fld,
                        ignoreFieldChange: true
                    });
                }

                // ------------- Setting Pickup Details ----------------
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_company',
                    value: pick_company
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_contact',
                    value: pick_contact
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_addr_1',
                    value: pick_addr1
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_addr_2',
                    value: pick_addr2
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_phone',
                    value: pick_phone
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_email',
                    value: pick_email
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_city',
                    value: pick_city
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pick_state',
                    value: pick_state
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_country',
                    value: pick_country
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_pickup_zip',
                    value: PickZip,
                    ignoreFieldChange: true
                });
                // ------------- Setting Destination Detsils ----------------


                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_company',
                    value: dest_company
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_contact',
                    value: dest_contact
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_addr_1',
                    value: dest_addr1
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_addr_2',
                    value: dest_addr2
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_phone',
                    value: dest_phone
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_email',
                    value: dest_email
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_city',
                    value: dest_city
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_dest_state',
                    value: dest_state
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_destination_country',
                    value: dest_country
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_p1_quote_id',
                    value: jsonrequest.id
                });
                // custom_Quote_Record.setValue({
                //     fieldId: 'custrecord_dest_close',
                //     value: dest_close
                // }); transaction_int_id
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_destination_zip',
                    value: shipzip,
                    ignoreFieldChange: true
                });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_p1_trx_record_type',
                    value: record_type
                });
                // if (record_type == 'salesorder') {
                //     custom_Quote_Record.setValue({
                //         fieldId: 'custrecord_p1_so_checkbox',
                //         value: true
                //     });
                // } else if (record_type == 'itemfulfillment') {
                //     custom_Quote_Record.setValue({
                //         fieldId: 'custrecord_p1_if_checkbox',
                //         value: true
                //     });
                // }
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_so_int_id',
                    value: transaction_int_id,
                    ignoreFieldChange: true
                });
                var cust_rec_id = custom_Quote_Record.save();
                log.debug('cust_rec_id', cust_rec_id);

                objRecsale.setValue({
                    fieldId: 'custbody_p1_quote_id',
                    value: cust_rec_id,
                    // ignoreFieldChange: true
                });
                objRecsale.save();

                var quotesid = jsonrequest.id;

                /****END CALL for Priority Get Rate API****/

                /**** Start code for calling All quote suitelet Page ****/

                var suitletURL = url.resolveScript({
                    scriptId: 'customscript_sl_so_getrate',
                    deploymentId: 'customdeploy_sl_so_getrate',
                    params: {
                        quotesid: quotesid,
                        trx_int_id: transaction_int_id,
                        custQuote: cust_rec_id,
                    }

                });
                var accID = runtime.accountId;
                accID = accID.toLowerCase();

                var comDomain = url.resolveDomain({
                    hostType: url.HostType.APPLICATION,
                    accountId: accID
                });

                // var slurl = "https://" + comDomain + suitletURL + '&quotesid=' + quotesid + '&salesOrderinternalid=' + transaction_int_id + '&custQuote=' + cust_rec_id + '&So_Ns_no=NS-' + So_Ns_no;
                var suitelet_url = "https://" + comDomain + suitletURL;
                redirect.redirect({
                    url: suitelet_url
                });
            }
            catch (error) {
                errorMessage = error.message;
                log.debug('Error in API function', error);

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
                scriptContext.response.write(html);
            }
        }
    }

    function state_Code(str1) {
        var state_Code;
        var stateSearchObj = search.create({
            type: "state",
            filters:
                [
                    ["fullname", "is", str1]
                ],
            columns:
                [
                    search.createColumn({ name: "shortname", label: "Short Name" })
                ]
        });
        stateSearchObj.run().each(function (result) {
            state_Code = result.getValue('shortname');
        });

        var State_Code = state_Code ? state_Code : str1;
        return State_Code;
    }

    return {
        onRequest: onRequest,
        state_Code: state_Code
    };
});