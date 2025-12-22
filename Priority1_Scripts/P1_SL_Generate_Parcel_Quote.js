/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/
// This sample shows how to fetch search results into a PDF file.
define(['N/render', 'N/search', 'N/https', 'N/record', 'N/redirect', 'N/url', 'N/runtime'], function (render, search, https, record, redirect, url, runtime) {
    function onRequest(context) {
        try {
            var transaction_id = context.request.parameters.soIdObj;
            var transaction_type = context.request.parameters.trx_type;
            var trx_obj = record.load({
                type: transaction_type,
                id: transaction_id
            });
            // var item_lookup = search.lookupFields({
            //     type: transaction_type,
            //     id: transaction_id,
            //     columns: ['custbody_p1_assigned_pallet_data']
            // });
            var pallet_item_data = JSON.parse(trx_obj.getValue('custbody_p1_assigned_pallet_data')).items;  // item data.

            if (pallet_item_data) {
                var pickDate = trx_obj.getValue('trandate'); // Pickup Date.
                log.debug('pickDate', pickDate);
                // var item_data = JSON.parse(palletFieldObj);

                var subsidiary = (transaction_type == 'salesorder') ? trx_obj.getValue('location') : trx_obj.getValue('custbody_p1_pickup_location');
                var locrec = record.load({
                    type: record.Type.LOCATION,
                    id: subsidiary,
                    isDynamic: true,
                });
                var subrec = locrec.getSubrecord({
                    fieldId: 'mainaddress'
                });

                var PickZip = subrec.getValue({
                    fieldId: 'zip'
                });
                log.debug('PickZip', PickZip);
                var replaced = PickZip.replace(/\D/g, '');
                PickZip = replaced.slice(0, 5);
                var pick_company = locrec.getValue('name');
                var pick_contact = locrec.getValue('name');
                var pick_addr1 = subrec.getValue('addr1');
                var pick_addr2 = subrec.getValue('addr2');
                var pick_phone = subrec.getValue('addrphone');
                var pick_email = locrec.getValue('email');
                var pick_city = subrec.getValue('city');
                var pick_state = subrec.getText('state');
                var pick_country = subrec.getValue('country');
                log.debug('pick_country', pick_country);
                // pick_open = pik_Record.getValue('custrecord_open');
                // pick_close = pik_Record.getValue('custrecord_close');

                // ------------- Destination Values -----------------

                var custSales = trx_obj.getValue('entity'); // Customer ID.

                var objRecord1 = record.load({
                    type: record.Type.CUSTOMER,
                    id: custSales,
                    isDynamic: true,
                });
                // billzip = PickZip;
                var shipzip = objRecord1.getValue('shipzip');
                var shipreplaced = shipzip.replace(/\D/g, '');
                shipzip = shipreplaced.slice(0, 5);

                var dest_company = objRecord1.getValue('shipaddressee');
                var dest_contact = objRecord1.getValue('shipaddressee');
                var dest_addr1 = objRecord1.getValue('shipaddr1');
                var dest_addr2 = objRecord1.getValue('shipaddr2');
                var dest_phone = objRecord1.getValue('phone');
                var dest_email = objRecord1.getValue('email');
                var dest_city = objRecord1.getValue('shipcity');
                var dest_state = objRecord1.getText('shipstate');
                var dest_country = objRecord1.getText('shipcountry');
                // log.debug('dest_country', dest_country);

                // creating item array.
                var item_data = [];
                for (var i = 0; i < pallet_item_data.length; i++) {
                    var current_item = pallet_item_data[i];
                    var current_item_boj = {
                        "units": current_item.units,
                        "weightUnit": current_item.totalWeightUnit,
                        "totalWeight": current_item.totalWeight,
                        "dimensionUnit": current_item.sinLwhUnit,
                        "length": current_item.length,
                        "width": current_item.width,
                        "height": current_item.height
                    }
                    item_data.push(current_item_boj);
                }

                // -------------- Calling Parcel Quote API -------------
                var parcel_quote_req_body = JSON.stringify({
                    "originZipCode": PickZip,
                    "originCountryCode": pick_country,
                    "destinationZipCode": shipzip,
                    "destinationCountryCode": dest_country,
                    "quoteItems": item_data,
                    "parcelOptions": [
                        "AdditionalHandling",
                        "SignatureRequired"
                    ],
                    "apiConfiguration": {
                        "timeout": 45
                    }
                });

                log.debug('parcel_quote_req_body', parcel_quote_req_body);
                // ------------- Getting URL and KEY ------------
                var fieldLookUp = search.lookupFields({
                    type: "customrecord_p1_api_configurations",
                    id: 1,
                    columns: ['custrecord_endpointurl', 'custrecord_xapikey']
                });
                var xApiKey = fieldLookUp.custrecord_xapikey;
                var urlEndPoint = fieldLookUp.custrecord_endpointurl;
                log.debug('xApiKey || urlEndPoint', xApiKey + ' || ' + urlEndPoint);
                log.debug('fieldLookUp', fieldLookUp);

                var postRequest = https.post({
                    url: urlEndPoint + '/v2/parcel/quotes/rates',
                    headers: {
                        "X-API-KEY": xApiKey,
                        "Content-Type": "application/json",
                        "accept": "application/json"
                    },
                    body: parcel_quote_req_body
                });

                log.debug('postRequest.body', postRequest);
                var jsonresponse = JSON.parse(postRequest.body);
                log.debug('jsonrequest', jsonresponse);

                // Error codes.
                var err_code_arr = [400, 402, 403, 404, 405, 406, 408, 409, 410, 411, 413, 414, 415, 417, 426, 500, 501, 502, 503, 504, 505];

                if (err_code_arr.indexOf(postRequest.code) != -1) {
                    var error_msg = JSON.stringify(jsonresponse);
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
                    value: (trx_obj.getValue('custbody_p1_assigned_pallet_data')),
                    ignoreFieldChange: true
                });

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
                    value: jsonresponse.id
                });

                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_destination_zip',
                    value: shipzip,
                    ignoreFieldChange: true
                });
                // if (transaction_type == 'salesorder') {
                // custom_Quote_Record.setValue({
                //     fieldId: 'custrecord_p1_so_checkbox',
                //     value: true
                // });
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_so_int_id',
                    value: transaction_id,
                    ignoreFieldChange: true
                });
                
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_p1_trx_record_type',
                    value: transaction_type
                });
                // }
                custom_Quote_Record.setValue({
                    fieldId: 'custrecord_p1_priority_quote_type',
                    value: 'Parcel Quotes'
                });

                var cust_rec_id = custom_Quote_Record.save();
                log.debug('cust_rec_id', cust_rec_id);

                trx_obj.setValue({
                    fieldId: 'custbody_p1_quote_id',
                    value: cust_rec_id,
                    // ignoreFieldChange: true
                });

                var crr_trx_rec = trx_obj.save();
                log.debug('crr_trx_rec', crr_trx_rec);

                /****END CALL for Priority Get Rate API****/

                /**** Start code for calling All quote suitelet Page ****/

                var suitletURL = url.resolveScript({
                    scriptId: 'customscript_p1_sl_get_rate_ui',
                    deploymentId: 'customdeploy_p1_sl_get_rate_ui',
                    params: {
                        quotesid: jsonresponse.id,
                        trx_int_id: transaction_id,
                        custQuote: cust_rec_id,
                    }

                });
                var accID = runtime.accountId;
                accID = accID.toLowerCase();

                var comDomain = url.resolveDomain({
                    hostType: url.HostType.APPLICATION,
                    accountId: accID
                });
                var suitelet_url = "https://" + comDomain + suitletURL;
                redirect.redirect({
                    url: suitelet_url
                });

            }
            // response.writeFile(newfile, false);
        } catch (error) {
            log.debug('error', error);
        }
    }
    return {
        onRequest: onRequest
    };
});