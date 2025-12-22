/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/cache', 'N/format/i18n', 'N/file', 'N/url'],
    function (N_server, record, search, cache, format, file, url) {
        function onRequest(context) {
            try {
                log.debug('context', context);

                var crcd = context.request.parameters.custRecId;

                var objForm = N_server.createForm({
                    title: 'All Quotes'
                });
                //objForm.clientScriptModulePath = 'SuiteScripts/Priority1_Scripts/DA_CS_testtesttest.js';
                objForm.clientScriptModulePath = './CS_carrier_and_info_charges.js';
                var objsub = objForm.addSublist({
                    id: 'itemsublist',
                    type: N_server.SublistType.STATICLIST,
                    label: 'ITEMS'
                });

                // objsub.addField({
                //     id: 'editquote',
                //     type: N_server.FieldType.TEXT,
                //     label: 'Edit Quote'
                // });

                var priorityRecId = context.request.parameters.custRecId;
                log.debug('priorityRecId', priorityRecId);

                // var Newquoterevert = url.resolveScript({
                //     scriptId: 'customscript_da_sl_testrquotes',
                //     deploymentId: 'customdeploy_da_sl_testrquotes'
                //     // params: ({
                //     // 'custPriorityRecId': priorityRecId
                //     // })
                // });

                // var html_quote = "<!DOCTYPE html>";
                // html_quote += '<html>';
                // html_quote += '<a href="' + Newquoterevert + '&custPriorityRecId=' + priorityRecId + '+&setDate=false">EDIT QUOTE</a>';
                // html_quote += '</html>'

                var htmlCurr = "<!DOCTYPE html>";
                htmlCurr += '<html>';
                htmlCurr += '<p align="center">';
                htmlCurr += '</html>'

                var htmlitems = "<!DOCTYPE html>";
                htmlitems += '<html>';
                htmlitems += '<p align="left">';
                htmlitems += '</html>'

                objsub.addField({
                    id: 'unit',
                    type: N_server.FieldType.TEXT,
                    label: 'UNITS'
                });
                objsub.addField({
                    id: 'package',
                    type: N_server.FieldType.TEXT,
                    label: 'HANDLING UNIT'
                });
                objsub.addField({
                    id: 'class',
                    type: N_server.FieldType.TEXT,
                    label: 'CLASS'
                });

                var itemname = objsub.addField({
                    id: 'itemname',
                    type: N_server.FieldType.SELECT,
                    label: 'Item',
                    source: 'item'
                });
                itemname.updateDisplayType({
                    displayType: N_server.FieldDisplayType.INLINE
                });
                var piece = objsub.addField({
                    id: 'piece',
                    type: N_server.FieldType.TEXT,
                    label: 'Piece(s)'
                });

                var weight = objsub.addField({
                    id: 'weight',
                    type: N_server.FieldType.TEXT,
                    label: 'Weight'
                });

                var dimensions = objsub.addField({
                    id: 'dimensions',
                    type: N_server.FieldType.TEXT,
                    label: 'Dimensions(LWH)'
                });

                var hazValue = objsub.addField({
                    id: 'carrier_hazmat',
                    type: N_server.FieldType.CHECKBOX,
                    label: 'Hazmat check'
                });
                hazValue.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                /****Code for Setting item sublist value from new quotes page****/
                // ---------------- Getting item data ---------------------

                var dl_itm_LookUp = search.lookupFields({
                    type: 'customrecord_p1_priority_quote',
                    id: crcd,
                    columns: ['custrecord_p1_item_object', 'custrecord_response_data']
                });

                log.debug('dl_itm_LookUp', dl_itm_LookUp.custrecord_p1_item_object);

                itemData = dl_itm_LookUp.custrecord_p1_item_object;
                itemData = JSON.parse(itemData);
                log.debug('itemData', itemData);

                var ItemsValue = itemData.items;
                log.debug('ItemsValue', ItemsValue);

                for (var i = 0; i < ItemsValue.length; i++) {
                    objsub.setSublistValue({
                        id: 'unit',
                        line: i,
                        value: htmlCurr + ItemsValue[i].units
                    });
                    objsub.setSublistValue({
                        id: 'package',
                        line: i,
                        value: ItemsValue[i].packagingType
                    });
                    objsub.setSublistValue({
                        id: 'class',
                        line: i,
                        value: htmlCurr + ItemsValue[i].freightClass
                    });

                    objsub.setSublistValue({
                        id: 'piece',
                        line: i,
                        value: htmlCurr + ItemsValue[i].pieces
                    });

                    objsub.setSublistValue({
                        id: 'weight',
                        line: i,
                        value: ItemsValue[i].totalWeight + ItemsValue[i].totalWeightUnit
                    });

                    objsub.setSublistValue({
                        id: 'dimensions',
                        line: i,
                        value: ItemsValue[i].length + ' x ' + ItemsValue[i].width + ' x ' + ItemsValue[i].height + ' ' + '(' + ItemsValue[i].singleLwhUnit + ')'
                    });

                    objsub.setSublistValue({
                        id: 'carrier_hazmat',
                        line: i,
                        value: ItemsValue[i].isHazardous ? 'T' : 'F'
                    });

                    objsub.setSublistValue({
                        id: 'itemname',
                        line: i,
                        value: ItemsValue[i].itemName
                    });
                    // objsub.setSublistValue({
                    //     id: 'editquote',
                    //     line: i,
                    //     value: html_quote
                    // });
                }
                var carrier_fieldgroup = objForm.addFieldGroup({
                    id: 'fieldgroup_carrier',
                    label: 'CARRIERS Services'
                });
                var tab = objForm.addTab({
                    id: 'tabid',
                    label: 'CARRIER'
                });

                var objsub = objForm.addSublist({
                    id: 'carriersublist',
                    type: N_server.SublistType.STATICLIST,
                    tab: 'tabid',
                    label: 'CARRIER SERVICES'
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
                objsub.addField({
                    id: 'carrierlogo',
                    type: N_server.FieldType.IMAGE,
                    label: '  '
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
                    id: 'quote',
                    type: N_server.FieldType.TEXT,
                    label: 'Quote Expiration Date'
                });
                objsub.addField({
                    id: 'transit',
                    type: N_server.FieldType.TEXT,
                    label: 'Transit Days'
                });
                objsub.addField({
                    id: 'estimate',
                    type: N_server.FieldType.TEXT,
                    label: 'Estimated Delivery Date'
                });
                objsub.addField({
                    id: 'carrierd',
                    type: N_server.FieldType.TEXT,
                    label: 'Carrier Liability New'
                });
                objsub.addField({
                    id: 'carrieru',
                    type: N_server.FieldType.TEXT,
                    label: 'Carrier Liability Used'
                });

                var error_fieldgroup = objForm.addFieldGroup({
                    id: 'fieldgroup_error',
                    label: 'QUOTE RATE ERRORS'
                });

                error_fieldgroup.isCollapsible = false;

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
                    label: 'Carrier'
                });

                objsub_err.addField({
                    id: 'access_code',
                    type: N_server.FieldType.TEXT,
                    label: 'Carrier Code'
                });

                objsub_err.addField({
                    id: 'service_error',
                    type: N_server.FieldType.TEXT,
                    label: 'Error Source'
                });

                objsub_err.addField({
                    id: 'error_msgs',
                    type: N_server.FieldType.TEXTAREA,
                    label: 'Error Message'
                });

                /****Cache module from new quotes page****/
                // var typeObjOld = typeof PostValueResponse;
                // log.debug('PostValueResponse 290', typeObjOld);
                // function sortJSON(arr, key, asc = true) {
                //     return arr.sort((a, b) => {
                //         let x = a[key];
                //         let y = b[key];
                //         if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
                //         else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
                //     });
                // }
                // output = sortJSON(PostValueResponse.rateQuoteDetail, "total", false);
                // log.debug('output 300', output);
                PostValueResponse = dl_itm_LookUp.custrecord_response_data;
                // PostValueResponse = JSON.parse(output);
                PostValueResponse = JSON.parse(PostValueResponse);
                log.debug('PostValueResponse 303', PostValueResponse);
                if (PostValueResponse != '') {
                    var resp = PostValueResponse;
                    log.debug('PostValueResponse', PostValueResponse);

                    log.debug('resp', resp);
                    if (resp) {
                        if ("severity" in resp) {
                            var error_msg = JSON.stringify(resp.text);
                            log.debug('error_msg', error_msg);
                            throw Error(error_msg);
                        }
                    }
                }
                var typeObj = typeof PostValueResponse;
                log.debug('PostValueResponse 292', typeObj);

                // data sorting.

                /****Code for Setting Carrier sublist value from new quotes Response****/
                log.debug('PostValueResponse.rateQuotes 310', PostValueResponse.rateQuotes);
                var data = (PostValueResponse.rateQuotes);

                data = data.sort((a, b) => {
                    if (a.rateQuoteDetail.total < b.rateQuoteDetail.total) {
                        return -1;
                    }
                });
                log.debug('data', data);

                (PostValueResponse.rateQuotes) = data
                var totalChargearr = [];
                var folder_id;
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
                // log.debug('folder_id', folder_id);

                for (var line = 0; line < PostValueResponse.rateQuotes.length; line++) {
                    /****Code for Image add in carrier logo sublist****/

                    log.debug('PostValueResponse.rateQuotes[line] 301', PostValueResponse.rateQuotes[line]);
                    var cc = PostValueResponse.rateQuotes[line].carrierCode;

                    var cN = PostValueResponse.rateQuotes[line].carrierName;

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
                    var fileID;
                    var fileName = null;
                    var searchResultCount = fileSearchObj.runPaged().count;
                    fileSearchObj.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        fileID = result.getValue({
                            name: 'internalid'
                        });
                        fileName = result.getValue({
                            name: 'name'
                        });

                        return true;
                    });
                    var fileObj, nofileObj;
                    if (fileName) {
                        fileObj = file.load({
                            id: './Carrier_Priority1/' + cc
                        }).url;
                    }
                    else {
                        nofileObj = file.load({
                            id: './Carrier_Priority1/No_image'
                        }).url;
                    }

                    /****Getting Values for carrier and sending to Pickup and delivery START****/
                    var Cl = fileID;
                    var Tc = PostValueResponse.rateQuotes[line].rateQuoteDetail.total;
                    var sld = PostValueResponse.rateQuotes[line].serviceLevelDescription;
                    var td = PostValueResponse.rateQuotes[line].transitDays + " business days";
                    var pD = PostValueResponse.rateQuoteRequestDetail.pickupDate;
                    var cLnew = '$' + PostValueResponse.rateQuotes[line].totalNewCarrierLiabilityAmount;
                    var cLused = '$' + PostValueResponse.rateQuotes[line].totalUsedCarrierLiabilityAmount;
                    var carID = PostValueResponse.rateQuotes[line].id;
                    var carDel = PostValueResponse.rateQuotes[line].deliveryDate;
                    var carM = carDel.substring(5, 7);
                    var carD = carDel.substring(8, 10);
                    var carY = carDel.substring(0, 4);

                    var cdel = carM + "/" + carD + "/" + carY;

                    var expM = pD.substring(5, 7);
                    var expD = pD.substring(8, 10);
                    var expY = pD.substring(0, 4);

                    var pdd = expM + "/" + expD + "/" + expY;

                    /****Getting Values for carrier and sending to Pickup and delivery END****/

                    /****Getting Url of pickup and delivery****/

                    var carrierPickupDel = url.resolveScript({
                        scriptId: 'customscript_test_dispatch_ui_suitelet',
                        deploymentId: 'customdeploy_test_dispatch_ui_suitelet',
                        params: {
                            // 'carID': carID,
                            'crcd': crcd
                        }
                    });
                    carrierPickupDel = carrierPickupDel + '&cc=' + cc + '&cN=' + cN + '&Tc=' + Tc + '&sld=' + sld + '&td=' + td + '&pD=' + pdd + '&cLnew=' + cLnew + '&cLused=' + cLused + '&carID=' + carID + '&cdel=' + cdel;
                    var html = "<!DOCTYPE html>";
                    html += '<html>';
                    html += '<a href="' + carrierPickupDel + '">SELECT QUOTE</a>';
                    html += '</html>'

                    if (cc == fileName) {
                        objsub.setSublistValue({
                            id: 'carrierlogo',
                            line: line,
                            value: fileObj
                        });
                    } else {
                        objsub.setSublistValue({
                            id: 'carrierlogo',
                            line: line,
                            value: nofileObj
                        });
                    }

                    objsub.setSublistValue({
                        id: 'carriers',
                        line: line,
                        value: htmlCurr + PostValueResponse.rateQuotes[line].carrierName
                    });
                    objsub.setSublistValue({
                        id: 'servicelevel',
                        line: line,
                        value: htmlCurr + PostValueResponse.rateQuotes[line].serviceLevelDescription
                    });

                    var expirationDate = PostValueResponse.rateQuotes[line].expirationDate;
                    var expMonth = expirationDate.substring(5, 7);

                    var expDate = expirationDate.substring(8, 10);

                    var expYear = expirationDate.substring(0, 4);

                    var expDateformat = expMonth + "/" + expDate + "/" + expYear;

                    objsub.setSublistValue({
                        id: 'quote',
                        line: line,
                        value: htmlCurr + expDateformat
                    });
                    objsub.setSublistValue({
                        id: 'transit',
                        line: line,
                        value: htmlCurr + PostValueResponse.rateQuotes[line].transitDays + " business days"
                    });

                    //  log.debug('PostValueResponse.rateQuotes[line] 431',PostValueResponse.rateQuotes[line]);
                    var estimatedDate = PostValueResponse.rateQuotes[line].deliveryDate;
                    log.debug('estimatedDate 432', estimatedDate);
                    var estMonth = estimatedDate.substring(5, 7);

                    var estDate = estimatedDate.substring(8, 10);

                    var estYear = estimatedDate.substring(0, 4);

                    var estDateformat = estMonth + "/" + estDate + "/" + estYear;
                    log.debug('estDateformat 439', estDateformat);

                    objsub.setSublistValue({
                        id: 'estimate',
                        line: line,
                        value: htmlCurr + estDateformat
                    });

                    var myFormat_Carrierliablity = format.getCurrencyFormatter({
                        currency: "USD"
                    });
                    var newCur_Carrierliablity = myFormat_Carrierliablity.format({
                        number: PostValueResponse.rateQuotes[line].totalNewCarrierLiabilityAmount
                    });

                    objsub.setSublistValue({
                        id: 'carrierd',
                        line: line,
                        value: htmlCurr + newCur_Carrierliablity
                    });

                    var myFormat_CarrierliablityUsed = format.getCurrencyFormatter({
                        currency: "USD"
                    });
                    var newCur_CarrierliablityUsed = myFormat_CarrierliablityUsed.format({
                        number: PostValueResponse.rateQuotes[line].totalUsedCarrierLiabilityAmount
                    });

                    objsub.setSublistValue({
                        id: 'carrieru',
                        line: line,
                        value: htmlCurr + newCur_CarrierliablityUsed
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
                        number: PostValueResponse.rateQuotes[line].rateQuoteDetail.total
                    });


                    /**code of url total charges**/

                    var carrierInfoCharge = url.resolveScript({
                        scriptId: 'customscript_da_sl_carrier_info_charges',
                        deploymentId: 'customdeploy_da_sl_carrier_info_charges'

                    });

                    var PassCarrierInfoChargeURL = carrierInfoCharge + '&carID=' + carID + '&cust_rec_id=' + crcd;

                    var html_chargesLink = "<!DOCTYPE html>";
                    html_chargesLink += '<html>';
                    html_chargesLink += '<body style="background-color:powderblue">';
                    html_chargesLink += '<a href onclick="myFunction' + line + '()">' + newCur_totalcharges + '</a>';
                    html_chargesLink += '<script>';
                    html_chargesLink += 'function myFunction' + line + '() {';
                    html_chargesLink += 'window.open("' + PassCarrierInfoChargeURL + '","_blank","toolbar=yes,scrollbars=yes,resizable=yes,top=400,left=500,width=400,height=600")';
                    html_chargesLink += '}';
                    html_chargesLink += '</script>';
                    html_chargesLink += '</body>';
                    html_chargesLink += '</html>';

                    objsub.setSublistValue({
                        id: 'totalcharges',
                        line: line,
                        value: htmlCurr + html_chargesLink
                    });

                    var countCharges = PostValueResponse.rateQuotes[line].rateQuoteDetail.charges.length;

                    var ccode, cD, cTA;

                    for (var c = 0; c < countCharges; c++) {
                        ccode = PostValueResponse.rateQuotes[line].rateQuoteDetail.charges[c].code;

                        cD = PostValueResponse.rateQuotes[line].rateQuoteDetail.charges[c].description;

                        cTA = PostValueResponse.rateQuotes[line].rateQuoteDetail.charges[c].amount;

                        var totalchargesobj = {
                            CarrierCode: cc,
                            Code: ccode,
                            Description: cD,
                            Amount: cTA
                        };
                        totalChargearr.push(totalchargesobj);

                    }
                }

                /****code for second cache setting the data from getRate screen Response to Carrier code charges screen****/

                var carrierCache = cache.getCache({
                    name: 'carriercache',
                    scope: cache.Scope.PUBLIC
                });
                carrierCache.put({
                    key: 'carriercache_data',
                    value: totalChargearr,
                });

                /****End of the code for second cache setting the data from getRate screen Response to Carrier code charges screen****/

                /****code for InvalidRatequotes errors****/

                for (var line = 0; line < PostValueResponse.invalidRateQuotes.length; line++) {
                    objsub_err.setSublistValue({
                        id: 'access_name',
                        line: line,
                        value: PostValueResponse.invalidRateQuotes[line].carrierName
                    });

                    objsub_err.setSublistValue({
                        id: 'access_code',
                        line: line,
                        value: PostValueResponse.invalidRateQuotes[line].carrierCode
                    });

                    var texterr = PostValueResponse.invalidRateQuotes[line].errorMessages;

                    if (texterr.length > 0) {
                        objsub_err.setSublistValue({
                            id: 'service_error',
                            line: line,
                            value: PostValueResponse.invalidRateQuotes[line].errorMessages[0]["source"]
                        });

                        objsub_err.setSublistValue({
                            id: 'error_msgs',
                            line: line,
                            value: PostValueResponse.invalidRateQuotes[line].errorMessages[0]["text"]
                        });
                    }


                }
                context.response.writePage({
                    pageObject: objForm
                });
            } catch (error) {
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

        return {
            onRequest: onRequest
        };
    });