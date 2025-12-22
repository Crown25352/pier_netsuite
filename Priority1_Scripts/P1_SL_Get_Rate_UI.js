/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet 
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/cache', 'N/format/i18n', 'N/file', 'N/url'],
    function (N_server, record, search, cache, format, file, url) {
        function onRequest(context) {
            try {
                var objForm = N_server.createForm({
                    title: 'Parcel Quote'
                });
                var salesorderInfo = objForm.addFieldGroup({
                    id: 'salesorderInfofieldgroup',
                    label: 'sales order info'
                });

                var salesorderIds = objForm.addField({
                    id: 'custpage_salesorderid',
                    type: N_server.FieldType.TEXT,
                    label: 'SO id',
                    container: 'salesorderInfofieldgroup'
                });
                salesorderIds.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });
                /***get sales order id***/
                var soID = context.request.parameters.salesOrderinternalid;
                var cust_rec_id = context.request.parameters.custQuote;

                var palletFieldLookUp = search.lookupFields({
                    type: 'customrecord_p1_priority_quote',
                    id: cust_rec_id,
                    columns: ['custrecord_p1_item_object', 'custrecord_response_data',]
                });
                salesorderIds.defaultValue = soID;

                var htmlCurr = "<!DOCTYPE html>";
                htmlCurr += '<html>';
                htmlCurr += '<p align="center">';
                htmlCurr += '</html>'

                var htmlitems = "<!DOCTYPE html>";
                htmlitems += '<html>';
                htmlitems += '<p align="left">';
                htmlitems += '</html>'

                // ----------------------- Single Item sublist --------------------------------------------------

                var itemLiablitySub = objForm.addSublist({
                    id: 'carrier_info',
                    type: N_server.SublistType.LIST,
                    label: 'Parcel Items',
                });
                itemLiablitySub.addField({
                    id: 'item_no_id',
                    type: N_server.FieldType.TEXT,
                    label: 'Sr. No.'
                });
                itemLiablitySub.addField({
                    id: 'carrier_units',
                    type: N_server.FieldType.TEXT,
                    label: 'Units'
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

                // ----------------------- Setting Value for single item ---------------------

                if (palletFieldLookUp.custrecord_p1_item_object) {

                    var parsed_itm_single_enh = JSON.parse(palletFieldLookUp.custrecord_p1_item_object);

                    log.debug('pallet data items 1535', parsed_itm_single_enh.items);
                    for (v = 0; v < parsed_itm_single_enh.items.length; v++) {

                        var itmNo_obj = String(v + 1);
                        log.debug('itmNo_obj 1557', itmNo_obj);

                        itemLiablitySub.setSublistValue({
                            id: 'item_no_id',
                            line: v,
                            value: itmNo_obj
                        });
                        itemLiablitySub.setSublistValue({
                            id: 'carrier_units',
                            line: v,
                            value: parsed_itm_single_enh.items[v].units ? parsed_itm_single_enh.items[v].units : ' '
                        });
                        var singleItemLwhUnit = parsed_itm_single_enh.items[v].sinLwhUnit ? parsed_itm_single_enh.items[v].sinLwhUnit : ' ';

                        itemLiablitySub.setSublistValue({
                            id: 'carrier_dimension',
                            line: v,
                            value: parsed_itm_single_enh.items[v].length + ' x ' + parsed_itm_single_enh.items[v].width + ' x ' + parsed_itm_single_enh.items[v].height + ' ' + '(' + singleItemLwhUnit + ')'
                        });
                        var singleItemWeightUnit = parsed_itm_single_enh.items[v].totalWeightUnit ? parsed_itm_single_enh.items[v].totalWeightUnit : ' ';

                        itemLiablitySub.setSublistValue({
                            id: 'carrier_weight',
                            line: v,
                            value: parsed_itm_single_enh.items[v].totalWeight + singleItemWeightUnit
                        });
                        var set_nmfc = ''
                        if (parsed_itm_single_enh.items[v].nmfcItemCode) {
                            set_nmfc = parsed_itm_single_enh.items[v].nmfcItemCode;
                        }
                        if (parsed_itm_single_enh.items[v].nmfcSubCode) {
                            set_nmfc += '-' + parsed_itm_single_enh.items[v].nmfcSubCode;
                        }
                        if (set_nmfc != '') {
                            itemLiablitySub.setSublistValue({
                                id: 'carrier_nmfc',
                                line: v,
                                value: set_nmfc ? set_nmfc : ' '
                            });
                        }
                    }
                }

                //-------------------------- CARRIERS SUBLIST -------------------------

                var carrier_fieldgroup = objForm.addFieldGroup({
                    id: 'fieldgroup_carrier',
                    label: 'CARRIERS Services'
                });
                var tab = objForm.addTab({
                    id: 'tabid',
                    label: 'CARRIERS'
                });

                var objsub = objForm.addSublist({
                    id: 'carriersublist',
                    type: N_server.SublistType.STATICLIST,
                    tab: 'tabid',
                    label: 'CARRIERS SERVICES'
                });

                objsub.addField({
                    id: 'selectquotes',
                    type: N_server.FieldType.TEXTAREA,
                    label: 'Select Quotes'
                });

                objsub.addField({
                    id: 'totalcharges',
                    type: N_server.FieldType.TEXTAREA,
                    label: 'Total Charges'
                });
                var carrier_logo = objsub.addField({
                    id: 'carrierlogo',
                    type: N_server.FieldType.INLINEHTML,
                    label: ' '
                });
                carrier_logo.updateDisplaySize({
                    height: 10,
                    width: 10
                });
                objsub.addField({
                    id: 'carriers',
                    type: N_server.FieldType.TEXT,
                    label: 'CARRIERS'
                });

                objsub.addField({
                    id: 'servicelevel',
                    type: N_server.FieldType.TEXT,
                    label: 'service Level Description'
                });
                objsub.addField({
                    id: 'carrier_effective_date',
                    type: N_server.FieldType.TEXT,
                    label: 'Carrier Effective Date'
                });
                objsub.addField({
                    id: 'quote_exp_date',
                    type: N_server.FieldType.TEXT,
                    label: 'Quote Expiration Date'
                });

                // ------------Error Tab -----------------------
                var tab = objForm.addTab({
                    id: 'custpagetabid',
                    label: 'ERRORS'
                });

                var objsub_err = objForm.addSublist({
                    id: 'quotesublistid',
                    type: N_server.SublistType.STATICLIST,
                    tab: 'custpagetabid',
                    label: 'QUOTE RATE ERRORS'
                });

                objsub_err.addField({
                    id: 'access_name',
                    type: N_server.FieldType.TEXT,
                    label: 'Accessorial Service Name'
                });

                objsub_err.addField({
                    id: 'access_code',
                    type: N_server.FieldType.TEXT,
                    label: 'Accessorial Code'
                });

                objsub_err.addField({
                    id: 'service_error',
                    type: N_server.FieldType.TEXT,
                    label: 'Service Level'
                });

                objsub_err.addField({
                    id: 'error_msgs',
                    type: N_server.FieldType.TEXTAREA,
                    label: 'Error Messages'
                });
                /****Code for Setting Carrier sublist value from new quotes Response****/

                var response_data_Obj = JSON.parse(palletFieldLookUp.custrecord_response_data);

                log.debug('response_data_Obj', response_data_Obj);
                var dataObj_parsed = response_data_Obj
                log.debug('dataObj_parsed', dataObj_parsed);
                var dataObj = response_data_Obj.rateQuotes;
                log.debug('dataObj', dataObj);
                var totalChargearr = [];
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

                for (var line = 0; line < dataObj.length; line++) {
                    /****Code for Image add in carrier logo sublist****/

                    var cc = dataObj[line].carrierCode;
                    var cN = dataObj[line].carrierName;
                    /****search for Image add in carrier logo sublist****/
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
                    log.debug('fileObj 604', fileObj);
                    var nofileObj = file.load({
                        id: './Carrier_Priority1/No_image'
                    }).url;

                    /****Getting Values for carrier and sending to Pickup and delivery START****/

                    var Tc = dataObj[line].rateQuoteDetail.total;
                    var sld = dataObj[line].serviceLevelDescription;

                    var effD = dateformat(dataObj[line].effectiveDate)   //Effective Date
                    // var efD = dataObj[line].effectiveDate;
                    // var effM = efD.substring(5, 7);
                    // var effD = efD.substring(8, 10);
                    // var effY = efD.substring(0, 4);
                    // var effD = effM + "/" + effD + "/" + effY;

                    var expnD = dateformat(dataObj[line].expirationDate)   //Expiration Date
                    // var exD = dataObj[line].expirationDate;

                    var pD = dataObj_parsed.rateQuoteRequestDetail.pickupDate;
                    var carID = dataObj[line].id;
                    var expM = pD.substring(5, 7);
                    var expD = pD.substring(8, 10);
                    var expY = pD.substring(0, 4);
                    var pdd = expM + "/" + expD + "/" + expY;
                    /****Getting Url of pickup and delivery****/
                    var carrierPickupDel = url.resolveScript({
                        scriptId: 'customscript_sl_p1_parcel_shipment',
                        deploymentId: 'customdeploy_sl_p1_parcel_shipment',
                        params: {
                            'carID': carID,
                            'crcd': cust_rec_id,
                            'cc': cc,
                            'cN': cN,
                            'Tc': Tc,
                            'sld': sld,
                            'pD': pdd,
                            'effD': effD,
                            'expnD': expnD,
                            'soID': soID
                        }
                    });
                    carrierPickupDel = carrierPickupDel;

                    var html = "<!DOCTYPE html>";
                    html += '<html>';
                    html += '<a href="' + carrierPickupDel + '">SELECT QUOTE</a>';
                    html += '</html>'

                    if (cc == fileName) {
                        var img_html = '<img src="' + fileObj + '" alt="Image" border="0" style="height: 100px; width: 120px; ">';
                        objsub.setSublistValue({
                            id: 'carrierlogo',
                            line: line,
                            value: img_html
                        });
                    } else {
                        var img_html = '<img src="' + nofileObj + '" alt="Image" border="0" style="height: 100px; width: 120px; ">';
                        objsub.setSublistValue({
                            id: 'carrierlogo',
                            line: line,
                            value: img_html
                        });
                    }
                    objsub.setSublistValue({
                        id: 'carriers',
                        line: line,
                        value: dataObj[line].carrierName
                    });

                    objsub.setSublistValue({
                        id: 'servicelevel',
                        line: line,
                        value: dataObj[line].serviceLevelDescription
                    });
                    objsub.setSublistValue({
                        id: 'carrier_effective_date',
                        line: line,
                        value: dateformat(dataObj[line].effectiveDate)
                    });
                    objsub.setSublistValue({
                        id: 'quote_exp_date',
                        line: line,
                        value: dateformat(dataObj[line].expirationDate)
                    });
                    objsub.setSublistValue({
                        id: 'selectquotes',
                        line: line,
                        value: html
                    });

                    var myFormat_totalcharges = format.getCurrencyFormatter({
                        currency: "USD"
                    });
                    var newCur_totalcharges = myFormat_totalcharges.format({
                        number: dataObj[line].rateQuoteDetail.total
                    });

                    /**code of url total charges**/
                    var carrierInfoCharge = url.resolveScript({
                        scriptId: 'customscript_da_sl_carrier_info_charges',
                        deploymentId: 'customdeploy_da_sl_carrier_info_charges',
                        params: {
                            'cust_rec_id': cust_rec_id,
                            'cc': carID
                        }
                    });
                    var PassCarrierInfoChargeURL = carrierInfoCharge;

                    var html_chargesLink = "<!DOCTYPE html>";
                    html_chargesLink += '<html>';
                    html_chargesLink += '<body style="background-color:powderblue">';
                    html_chargesLink += '<a href onclick="myFunction' + line + '()">' + newCur_totalcharges + '</a>';
                    html_chargesLink += '<script>';
                    html_chargesLink += 'function myFunction' + line + '() {';
                    html_chargesLink += 'window.open("' + PassCarrierInfoChargeURL + '","_blank","toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=400,height=600")';
                    html_chargesLink += '}';
                    html_chargesLink += '</script>';
                    html_chargesLink += '</body>';
                    html_chargesLink += '</html>';

                    objsub.setSublistValue({
                        id: 'totalcharges',
                        line: line,
                        value: html_chargesLink
                    });
                }

                // for (var line = 0; line < dataObj_parsed.invalidRateQuotes.length; line++) {
                //     objsub_err.setSublistValue({
                //         id: 'access_name',
                //         line: line,
                //         value: dataObj_parsed.invalidRateQuotes[line].carrierName
                //     });

                //     objsub_err.setSublistValue({
                //         id: 'access_code',
                //         line: line,
                //         value: dataObj_parsed.invalidRateQuotes[line].carrierCode
                //     });

                //     var texterr = dataObj_parsed.invalidRateQuotes[line].errorMessages;
                //     if (texterr.length > 0) {
                //         objsub_err.setSublistValue({
                //             id: 'service_error',
                //             line: line,
                //             value: dataObj_parsed.invalidRateQuotes[line].errorMessages[0]["source"]
                //         });

                //         objsub_err.setSublistValue({
                //             id: 'error_msgs',
                //             line: line,
                //             value: dataObj_parsed.invalidRateQuotes[line].errorMessages[0]["text"]
                //         });
                //     }
                // }
                context.response.writePage({
                    pageObject: objForm
                });

            } catch (e) {
                log.debug('Error in getRAte ', e);
                errorMessage = e.message;
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
                    if (typeof p == 'string') return 'string';
                    else if (p != null && typeof p == 'object') return 'object';
                    else return 'other';
                }
                context.response.write(html);

            }
        }
        function dateformat(expirationDate) {
            var expMonth = expirationDate.substring(5, 7);
            var expDate = expirationDate.substring(8, 10);
            var expYear = expirationDate.substring(0, 4);
            var expDateformat = expMonth + "/" + expDate + "/" + expYear;
            return expDateformat;
        }

        return {
            onRequest: onRequest
        };
    });