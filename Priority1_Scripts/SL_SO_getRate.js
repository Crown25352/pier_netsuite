/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet 
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/cache', 'N/format/i18n', 'N/file', 'N/url'],
    function (N_server, record, search, cache, format, file, url) {
        function onRequest(context) {
            try {
                var objForm = N_server.createForm({
                    title: 'All Quotes'
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

                objForm.clientScriptModulePath = './CS_carrier_and_info_charges.js';


                /***get sales order id***/
                var soID = context.request.parameters.salesOrderinternalid;
                var cust_rec_id = context.request.parameters.custQuote;

                var palletFieldLookUp = search.lookupFields({
                    type: 'customrecord_p1_priority_quote',
                    id: cust_rec_id,
                    columns: ['custrecord_p1_item_object', 'custrecord_response_data']
                });
                log.debug('palletFieldLookUp', palletFieldLookUp);
                log.debug('palletFieldLookUp.custrecord_p1_item_object', palletFieldLookUp.custrecord_p1_item_object);
                log.debug('palletFieldLookUp.custrecord_response_data', palletFieldLookUp.custrecord_response_data);
                // ('palletFieldLookUp.custrecord_p1_item_object', palletFieldLookUp.custrecord_p1_item_object);

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
                    label: 'Single Items',
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
                    id: 'carrier_piece',
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

                // ----------------------- Setting Value for single item ---------------------

                if (palletFieldLookUp.custrecord_p1_item_object) {

                    var parsed_itm_single_enh = JSON.parse(palletFieldLookUp.custrecord_p1_item_object);

                    log.debug('pallet data items 1535', parsed_itm_single_enh.items);
                    for (v = 0; v < parsed_itm_single_enh.items.length; v++) {

                        itemLiablitySub.setSublistValue({
                            id: 'carrier_box',
                            line: v,
                            value: parsed_itm_single_enh.items[v].packagingType ? parsed_itm_single_enh.items[v].packagingType : ' '
                        });
                        var itmNo_obj = String(v + 1);
                        log.debug('itmNo_obj 1557', itmNo_obj);

                        itemLiablitySub.setSublistValue({
                            id: 'item_no_id',
                            line: v,
                            value: itmNo_obj
                        });

                        itemLiablitySub.setSublistValue({
                            id: 'carrier_class',
                            line: v,
                            value: parsed_itm_single_enh.items[v].freightClass ? parsed_itm_single_enh.items[v].freightClass : ' '
                        });

                        itemLiablitySub.setSublistValue({
                            id: 'carrier_piece',
                            line: v,
                            value: parsed_itm_single_enh.items[v].pieces ? parsed_itm_single_enh.items[v].pieces : ' '
                        });
                        var singleItemLwhUnit;
                        if (parsed_itm_single_enh.items[v].lwhUnt != undefined) {
                            singleItemLwhUnit = parsed_itm_single_enh.items[v].lwhUnt
                        } else {
                            singleItemLwhUnit = parsed_itm_single_enh.items[v].sinLwhUnit
                        }
                        itemLiablitySub.setSublistValue({
                            id: 'carrier_dimension',
                            line: v,
                            value: parsed_itm_single_enh.items[v].length + ' x ' + parsed_itm_single_enh.items[v].width + ' x ' + parsed_itm_single_enh.items[v].height + ' ' + '(' + singleItemLwhUnit + ')'
                        });
                        var singleItemWeightUnit;
                        if (parsed_itm_single_enh.items[v].weightUnt != undefined) {
                            singleItemWeightUnit = parsed_itm_single_enh.items[v].weightUnt
                        } else {
                            singleItemWeightUnit = parsed_itm_single_enh.items[v].totalWeightUnit
                        }
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

                        itemLiablitySub.setSublistValue({
                            id: 'carrier_description',
                            line: v,
                            value: parsed_itm_single_enh.items[v].description ? parsed_itm_single_enh.items[v].description : ' '
                        });

                        itemLiablitySub.setSublistValue({
                            id: 'carrier_hazmat',
                            line: v,
                            // value: hazboxObj
                            value: parsed_itm_single_enh.items[v].isHazardous ? ((parsed_itm_single_enh.items[v].isHazardous) ? 'T' : 'F') : 'F'
                        });
                    }
                }

                // ----------------- Adding Sublist for Enhance Items -----------------------

                if (palletFieldLookUp.custrecord_p1_item_object) {
                    // var enh_items = palletFieldLookUp.custrecord_p1_item_object;
                    var itm_object = JSON.parse(palletFieldLookUp.custrecord_p1_item_object);
                    var length = itm_object.enhancedHandlingUnits ? itm_object.enhancedHandlingUnits.length : '';
                    if (length) {
                        var enhanceItemLiablitySub = objForm.addSublist({
                            id: 'carrier_enhance_info',
                            type: N_server.SublistType.LIST,
                            label: 'Enhanced Handling Units',
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

                        // -------------------- Setting Sublist for enhance items ------------------

                        // if (palletFieldLookUp.custbody_p1_assigned_pallet_data) {

                        /****Start code for setting Sublist for Enhance item & Liablity ****/

                        var enhanceJson = JSON.parse(palletFieldLookUp.custrecord_p1_item_object);
                        log.debug('enhanceJson 1922', enhanceJson);

                        log.debug('enhanceJson length 1922', enhanceJson.enhancedHandlingUnits.length);
                        var parsedEnhJson = enhanceJson.enhancedHandlingUnits;
                        var b = 0;
                        log.debug('parsedEnhJson.length 1928', parsedEnhJson.length);
                        for (s = 0; s < parsedEnhJson.length; s++) {
                            if (s != 0) {
                                log.debug('s in if', s)
                                k = b + 1;
                            } else {
                                k = s + b;
                            }
                            log.debug('k 1938', k);
                            enhanceItemLiablitySub.setSublistValue({
                                id: 'carrier_enhance_box',
                                line: k,
                                value: parsedEnhJson[s].handlingUnitType
                            });
                            enhanceItemLiablitySub.setSublistValue({
                                id: 'carrier_enhance_type',
                                line: k,
                                value: 'Parent ' + (s + 1)
                            });

                            enhanceItemLiablitySub.setSublistValue({
                                id: 'carrier_enhance_description',
                                line: k,
                                value: parsedEnhJson[s].description
                            });

                            var parsedPack = parsedEnhJson[s].packages;

                            log.debug('parsedPack 1963', parsedPack);

                            for (h = 0; h < parsedPack.length; h++) {

                                var packLine = h + k + 1;

                                log.debug('packLine 1969', packLine);
                                log.debug('parsedPack[packLine] 1970', parsedPack[h]);
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
                                var en_main_nmfc, en_sub_nmfc;

                                if (parsedPack[h].packageNmfcItemCode) {
                                    en_main_nmfc = parsedPack[h].packageNmfcItemCode;
                                } else {
                                    en_main_nmfc = '';
                                }
                                if (parsedPack[h].packageNmfcSubCode) {
                                    en_sub_nmfc = '-' + parsedPack[h].packageNmfcSubCode;
                                } else {
                                    en_sub_nmfc = '';
                                }
                                if (en_main_nmfc || en_sub_nmfc) {
                                    enhanceItemLiablitySub.setSublistValue({
                                        id: 'carrier_enhance_nmfc',
                                        line: packLine,
                                        value: en_main_nmfc + en_sub_nmfc
                                    });
                                }

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

                                b = packLine
                            }
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
                // carrier_logo.updateDisplaySize({
                //     height: 10,
                //     width: 10
                // });
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

                var data_Obj = palletFieldLookUp.custrecord_response_data;

                var dataObj_parsed = JSON.parse(data_Obj);
                log.debug('dataObj_parsed', dataObj_parsed);

                var dataObj = dataObj_parsed.rateQuotes;
                // log.debug('dataObj', dataObj);
                dataObj.sort((a, b) => a.rateQuoteDetail.total - b.rateQuoteDetail.total);
                // data_Obj.sort((a, b) => {
                //     if (a.rateQuoteDetail.total < b.rateQuoteDetail.total) {
                //         return -1;
                //     }
                // });

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
                    var cQn = dataObj[line].carrierQuoteNumber;


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
                        // log.debug('file_url 595', file_url);
                        return true;
                    });
                    var fileObj, nofileObj;
                    // if (fileName) {
                    //     fileObj = file.load({
                    //         id: './Carrier_Priority1/' + cc
                    //     }).url;
                    // }
                    log.debug('fileObj 604', fileObj);
                    // else {
                    var nofileObj = file.load({
                        id: './Carrier_Priority1/No_image'
                    }).url;
                    // }

                    /****Getting Values for carrier and sending to Pickup and delivery START****/
                    var Cl = fileID;
                    var Tc = dataObj[line].rateQuoteDetail.total;
                    var sld = dataObj[line].serviceLevelDescription;
                    var td = dataObj[line].transitDays + " business days";
                    var pD = dataObj_parsed.rateQuoteRequestDetail.pickupDate;
                    var cLnew = '$' + dataObj[line].totalNewCarrierLiabilityAmount;
                    var cLused = '$' + dataObj[line].totalUsedCarrierLiabilityAmount;
                    var carID = dataObj[line].id;
                    var carDel = dataObj[line].deliveryDate;
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
                            'carID': carID,
                            'crcd': cust_rec_id,
                            'cc': cc,
                            'cN': cN,
                            'cQn': cQn,
                            'Tc': Tc,
                            'sld': sld,
                            'td': td,
                            'pD': pdd,
                            'cLnew': cLnew,
                            'cLused': cLused,
                            'cdel': cdel,
                            'soID': soID
                        }
                    });
                    carrierPickupDel = carrierPickupDel;

                    var html = "<!DOCTYPE html>";
                    html += '<html>';
                    html += '<a href="' + carrierPickupDel + '">SELECT QUOTE</a>';
                    html += '</html>'

                    if (cc == fileName) {
                        var img_html = '<!DOCTYPE html><html><img src="' + fileObj + '" alt="Image" border="0" style="height: 100px; width: 120px; "></html>';
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
                        value: htmlCurr + dataObj[line].carrierName
                    });

                    objsub.setSublistValue({
                        id: 'servicelevel',
                        line: line,
                        value: htmlCurr + dataObj[line].serviceLevelDescription
                    });

                    var expirationDate = dataObj[line].expirationDate;
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
                        value: htmlCurr + dataObj[line].transitDays + " business days"
                    });

                    var estimatedDate = dataObj[line].deliveryDate;
                    var estMonth = estimatedDate.substring(5, 7);
                    var estDate = estimatedDate.substring(8, 10);
                    var estYear = estimatedDate.substring(0, 4);
                    var estDateformat = estMonth + "/" + estDate + "/" + estYear;

                    objsub.setSublistValue({
                        id: 'estimate',
                        line: line,
                        value: htmlCurr + estDateformat
                    });

                    var myFormat_Carrierliablity = format.getCurrencyFormatter({
                        currency: "USD"
                    });
                    var newCur_Carrierliablity = myFormat_Carrierliablity.format({
                        number: dataObj[line].totalNewCarrierLiabilityAmount
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
                        number: dataObj[line].totalUsedCarrierLiabilityAmount
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
                        number: dataObj[line].rateQuoteDetail.total
                    });

                    /**code of url total charges**/
                    var carrierInfoCharge = url.resolveScript({
                        scriptId: 'customscript_da_sl_carrier_info_charges',
                        deploymentId: 'customdeploy_da_sl_carrier_info_charges',
                        params: {
                            'cust_rec_id': cust_rec_id,
                            'carID': carID
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
                        value: htmlCurr + html_chargesLink
                    });
                    var countCharges = dataObj[line].rateQuoteDetail.charges.length;
                    var ccode, cD, cTA;

                    for (var c = 0; c < countCharges; c++) {
                        ccode = dataObj[line].rateQuoteDetail.charges[c].code;
                        cD = dataObj[line].rateQuoteDetail.charges[c].description;
                        cTA = dataObj[line].rateQuoteDetail.charges[c].amount;

                        var totalchargesobj = {
                            CarrierCode: cc,
                            Code: ccode,
                            Description: cD,
                            Amount: cTA
                        };

                        totalChargearr.push(totalchargesobj);
                    }
                }

                for (var line = 0; line < dataObj_parsed.invalidRateQuotes.length; line++) {
                    objsub_err.setSublistValue({
                        id: 'access_name',
                        line: line,
                        value: dataObj_parsed.invalidRateQuotes[line].carrierName
                    });

                    objsub_err.setSublistValue({
                        id: 'access_code',
                        line: line,
                        value: dataObj_parsed.invalidRateQuotes[line].carrierCode
                    });

                    var texterr = dataObj_parsed.invalidRateQuotes[line].errorMessages;
                    if (texterr.length > 0) {
                        objsub_err.setSublistValue({
                            id: 'service_error',
                            line: line,
                            value: dataObj_parsed.invalidRateQuotes[line].errorMessages[0]["source"]
                        });

                        objsub_err.setSublistValue({
                            id: 'error_msgs',
                            line: line,
                            value: dataObj_parsed.invalidRateQuotes[line].errorMessages[0]["text"]
                        });
                    }
                }
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