/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/url'], function (record, search, serverWidget, url) {
    function beforeLoad(context) {
        try {
            log.debug('context', context);
            var currentRecord = context.newRecord;
            var form = context.form;
            log.debug('currentRecord', currentRecord);
            var crrForm = currentRecord.getValue({
                fieldId: 'customform'
            });
            var crrFormtext;
            var record_type = currentRecord.type;
            var recdIdObj = currentRecord.id;
            log.debug('record_type', record_type);
            if (crrForm) {
                var custobjRecord = record.load({
                    type: 'custform',
                    id: crrForm,
                    isDynamic: true
                });
                crrFormtext = custobjRecord.getValue({
                    fieldId: 'formname'
                });
            } else {
                var formfieldLookUp = search.lookupFields({
                    type: record_type,
                    id: currentRecord.id,
                    columns: ['customform']
                });
                crrFormtext = formfieldLookUp.customform[0].text;
            }
            // -------- restricting the functionality based on form ---------------------
            if (crrFormtext == 'Priority1 Sales Order Form' || crrFormtext == 'Priority1 Item Fulfillment Form') {

                form.clientScriptModulePath = './CS_P1_assign_pallet.js';

                var priorityship = form.getField({
                    id: 'custbody_p1_shipment_url'
                });
                var priorityquote = form.getField({
                    id: 'custbody_p1_quote_url'
                });
                var quoteField = form.getField({
                    id: 'custbody_p1_quote_id'
                });

                // ------ Setting null value in copy context ----------------------

                if (context.type == context.UserEventType.COPY) {
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_assigned_pallet_data',
                        value: '',
                        ignoreFieldChange: true
                    });
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_quote_url',
                        value: '',
                        ignoreFieldChange: true
                    });
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_shipment_url',
                        value: '',
                        ignoreFieldChange: true
                    });
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_quote_id',
                        value: '',
                        ignoreFieldChange: true
                    });
                }

                // ------------------ Setting null values for CREATE mode only ------------------

                if (context.type == context.UserEventType.CREATE) {
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_assigned_pallet_data',
                        value: '',
                        ignoreFieldChange: true
                    });
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_quote_url',
                        value: '',
                        ignoreFieldChange: true
                    });
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_shipment_url',
                        value: '',
                        ignoreFieldChange: true
                    });
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_quote_id',
                        value: '',
                        ignoreFieldChange: true
                    });
                    context.newRecord.setValue({
                        fieldId: 'custbody_p1_accesorial_services',
                        value: []
                    });
                }

                // ------------------ Hiding fields in EDIT || CREATE || COPY context ---------------
                if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT || context.type == context.UserEventType.COPY) {

                    priorityship.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                    priorityquote.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                    quoteField.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                    // Inline html fields to remove accessorial services. 

                    var servHtml = '<!DOCTYPE html>' +
                        '<html>' +
                        '<body>' +
                        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>' +
                        '<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>' +
                        '<button id="clickMe" style="margin-bottom: 7px ">Remove Accessorial Values</button>' +
                        '<script>' +
                        '$(document).ready(function() {  ' +
                        'var newVal = document.getElementById("row_custbody_accesorial_service3_0");' +
                        '$(\'#row_custbody_p1_accesorial_services3_0\').hide();  ' +
                        '$(\'#row_custbody_p1_accesorial_services4_0\').hide();  ' +
                        '$(\'#row_custbody_p1_accesorial_services5_0\').hide();  ' +
                        '$(\'#row_custbody_p1_accesorial_services14_0\').hide();  ' +
                        '$(\'#row_custbody_p1_accesorial_services15_0\').hide();  ' +
                        '$(\'#row_custbody_p1_accesorial_services16_0\').hide();  ' +
                        '$(\'#nl2\').hide();  ' +
                        '});' +
                        '</script>' +
                        '</body>' +
                        '</html>';

                    var accSerhtmlFld = form.addField({
                        id: 'custpage_html_field',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'Service',
                    });
                    accSerhtmlFld.defaultValue = servHtml;

                    // Inline html fields to remove accessorial services. 
                    var servListHtml = '<!DOCTYPE html>' +
                        '<html>' +
                        '<body>' +
                        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>' +
                        '<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>' +
                        '<h3 style="margin-top: 10px" >Selected Accessorial Services</h3>' +
                        '<ul style= "line-height: 0px" id="listacc"></ul>' +
                        '</body>' +
                        '</html>';

                    var accListSerhtmlFld = form.addField({
                        id: 'custpage_html_list_field',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'Service List',
                        container: 'fg_fieldGroup_6'
                    });
                    accListSerhtmlFld.defaultValue = servListHtml;
                    form.insertField({
                        field: accListSerhtmlFld,
                        nextfield: 'custbody_p1_shipment_url'
                    });
                    accListSerhtmlFld.updateBreakType({
                        breakType: serverWidget.FieldBreakType.STARTCOL
                    });

                    form.insertField({
                        field: accSerhtmlFld,
                        nextfield: 'custpage_html_list_field'
                    });
                }
                // ---------------- logic for VIEW mode ----------------
                else if (context.type == context.UserEventType.VIEW) {

                    // condition to hide button based on Pallet Reference value.
                    var quoteReference = currentRecord.getValue({
                        fieldId: 'custbody_p1_quote_preference'
                    });
                    if (quoteReference == 2 || quoteReference == '')
                        form.addButton({
                            id: 'custpage_assign_appet',
                            label: 'Assign Pallet',
                            functionName: 'assignPallet("' + recdIdObj + ',' + record_type + '")'
                        });

                    var pallet_Fld = currentRecord.getValue({
                        fieldId: 'custbody_p1_assigned_pallet_data'
                    });

                    // Section two - This part of code will add Assigned Pallet subtab' in View mode.
                    if (pallet_Fld) {
                        priorityquote.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.NORMAL
                        });

                        var palletTab = form.addTab({
                            id: 'custpage_pallettabid',
                            label: 'Assigned Pallet Data'
                        });
                        palletTab.helpText = 'Here you will find the assigned pallet data.';

                        form.addSubtab({
                            id: 'custpage_singleitemid',
                            label: 'Standalone Items',
                            tab: 'custpage_pallettabid'
                        });

                        form.addSubtab({
                            id: 'custpage_enhanceitmid',
                            label: 'Enhancehandling items',
                            tab: 'custpage_pallettabid'
                        });

                        var single_sublist = form.addSublist({
                            id: 'custpage_singlesublistid',
                            type: serverWidget.SublistType.INLINEEDITOR,
                            label: 'Standalone Items',
                            tab: 'custpage_pallettabid'
                        });

                        // Single item Sublist Fields.
                        single_sublist.addField({
                            id: 'sr_no_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Item No.'
                        });

                        single_sublist.addField({
                            id: 'handling_unit_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Handling Unit'
                        });

                        single_sublist.addField({
                            id: 'class_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Class'
                        });

                        single_sublist.addField({
                            id: 'pieces_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Pieces'
                        });

                        single_sublist.addField({
                            id: 'dimensions_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Dimensions(LBH)'
                        });

                        single_sublist.addField({
                            id: 'weight_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Weight'
                        });

                        single_sublist.addField({
                            id: 'nmfc_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'NMFC Code'
                        });

                        single_sublist.addField({
                            id: 'description_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Description'
                        });

                        single_sublist.addField({
                            id: 'hazmat_id',
                            type: serverWidget.FieldType.CHECKBOX,
                            label: 'Hazmat'
                        });

                        // Enhancehandling item sublist. 
                        var enhance_sublist = form.addSublist({
                            id: 'custpage_enhancesublistid',
                            type: serverWidget.SublistType.INLINEEDITOR,
                            label: 'Enhanced Handling Units',
                            tab: 'custpage_pallettabid'
                        });

                        // Enhancehandling Sublist Fields.
                        enhance_sublist.addField({
                            id: 'sr_no_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Item Type'
                        });

                        enhance_sublist.addField({
                            id: 'handling_unit_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Handling Unit'
                        });

                        enhance_sublist.addField({
                            id: 'class_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Class'
                        });

                        enhance_sublist.addField({
                            id: 'pieces_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Pieces'
                        });

                        enhance_sublist.addField({
                            id: 'dimensions_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Dimensions(LBH)'
                        });

                        enhance_sublist.addField({
                            id: 'weight_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Weight'
                        });

                        enhance_sublist.addField({
                            id: 'nmfc_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'NMFC Code'
                        });

                        enhance_sublist.addField({
                            id: 'description_id',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Description'
                        });

                        enhance_sublist.addField({
                            id: 'hazmat_id',
                            type: serverWidget.FieldType.CHECKBOX,
                            label: 'Hazmat'
                        });

                        // start adding items in sublist.

                        var prsed_item_arr = JSON.parse(pallet_Fld);

                        // adding single items.
                        var single_item_arr = prsed_item_arr.items;
                        log.debug('single_item_arr', single_item_arr);

                        for (a = 0; a < single_item_arr.length; a++) {

                            var crrIndex = (a + 1);

                            single_sublist.setSublistValue({
                                id: 'sr_no_id',
                                line: a,
                                value: crrIndex.toString()
                            });
                            single_sublist.setSublistValue({
                                id: 'handling_unit_id',
                                line: a,
                                value: single_item_arr[a].packagingType ? single_item_arr[a].packagingType : ' '
                            });

                            single_sublist.setSublistValue({
                                id: 'class_id',
                                line: a,
                                value: single_item_arr[a].freightClass ? single_item_arr[a].freightClass : ' '
                            });

                            single_sublist.setSublistValue({
                                id: 'pieces_id',
                                line: a,
                                value: single_item_arr[a].pieces ? single_item_arr[a].pieces : ' '
                            });

                            var fullDimension_Unit = single_item_arr[a].singleLwhUnit ? single_item_arr[a].singleLwhUnit : single_item_arr[a].sinLwhUnit;
                            single_sublist.setSublistValue({
                                id: 'dimensions_id',
                                line: a,
                                value: single_item_arr[a].length + ' x ' + single_item_arr[a].width + ' x ' + single_item_arr[a].height + ' (' + fullDimension_Unit + ')'
                            });

                            single_sublist.setSublistValue({
                                id: 'weight_id',
                                line: a,
                                value: single_item_arr[a].totalWeight + ' ' + single_item_arr[a].totalWeightUnit
                            });

                            var main_itm_nmfc = single_item_arr[a].nmfcItemCode ? single_item_arr[a].nmfcItemCode : ' ';
                            var sub_itm_nmfc = single_item_arr[a].nmfcSubCode ? '-' + single_item_arr[a].nmfcSubCode : ' ';

                            // if (single_item_arr[a].nmfcItemCode) {
                            //     main_itm_nmfc = single_item_arr[a].nmfcItemCode
                            // } else {
                            //     main_itm_nmfc = '';
                            // }
                            // if (single_item_arr[a].nmfcSubCode) {
                            //     sub_itm_nmfc = '-' + single_item_arr[a].nmfcSubCode
                            // } else {
                            //     sub_itm_nmfc = '';
                            // }
                            if (main_itm_nmfc || sub_itm_nmfc) {
                                single_sublist.setSublistValue({
                                    id: 'nmfc_id',
                                    line: a,
                                    value: main_itm_nmfc + sub_itm_nmfc
                                });
                            }

                            single_sublist.setSublistValue({
                                id: 'description_id',
                                line: a,
                                value: single_item_arr[a].description ? single_item_arr[a].description : ' '
                            });

                            single_sublist.setSublistValue({
                                id: 'hazmat_id',
                                line: a,
                                value: (single_item_arr[a].isHazardous) ? 'T' : 'F'
                            });
                        }

                        // adding enhancehandling items.
                        var enhance_item_arr = prsed_item_arr.enhancedHandlingUnits;
                        var counter = 0;

                        for (b = 0; b < enhance_item_arr.length; b++) {

                            var crrEnhItm = (b + 1);

                            enhance_sublist.setSublistValue({
                                id: 'sr_no_id',
                                line: counter,
                                value: 'Parent ' + crrEnhItm.toString()
                            });

                            enhance_sublist.setSublistValue({
                                id: 'description_id',
                                line: counter,
                                value: enhance_item_arr[b].description
                            });

                            enhance_sublist.setSublistValue({
                                id: 'handling_unit_id',
                                line: counter,
                                value: enhance_item_arr[b].handlingUnitType
                            });

                            var crrEnhPackage = enhance_item_arr[b].packages;
                            var crrLine = 0;
                            var z;

                            log.debug('crrEnhPackage.length', crrEnhPackage.length);

                            for (c = 0; c < crrEnhPackage.length; c++) {

                                if (counter == 0) {
                                    if (c == 0) {
                                        z = 1
                                    }
                                    else {
                                        z = c + 1
                                    }
                                }
                                else {
                                    if (c == 0) {
                                        z = counter + 1
                                    }
                                    else {
                                        z = counter + c + 1
                                    }
                                }

                                var crrPack = (c + 1);

                                enhance_sublist.setSublistValue({
                                    id: 'sr_no_id',
                                    line: z,
                                    value: 'Package ' + crrPack.toString()
                                });

                                enhance_sublist.setSublistValue({
                                    id: 'handling_unit_id',
                                    line: z,
                                    value: crrEnhPackage[c].packagingType
                                });

                                enhance_sublist.setSublistValue({
                                    id: 'class_id',
                                    line: z,
                                    value: crrEnhPackage[c].packageFreightClass
                                });

                                enhance_sublist.setSublistValue({
                                    id: 'pieces_id',
                                    line: z,
                                    value: crrEnhPackage[c].pieces
                                });

                                var crrPkgDimension = crrEnhPackage[c].packageLength + ' x ' + crrEnhPackage[c].packageWidth + ' x ' + crrEnhPackage[c].packageHeight;

                                enhance_sublist.setSublistValue({
                                    id: 'dimensions_id',
                                    line: z,
                                    value: crrPkgDimension + ' (' + crrEnhPackage[c].packageLwhunit + ')'
                                });

                                enhance_sublist.setSublistValue({
                                    id: 'weight_id',
                                    line: z,
                                    value: crrEnhPackage[c].weightPerPackage + ' ' + crrEnhPackage[c].weightUnitPackage
                                });
                                var main_nmfc, sub_nmfc;
                                if (crrEnhPackage[c].packageNmfcItemCode) {
                                    main_nmfc = crrEnhPackage[c].packageNmfcItemCode;
                                } else {
                                    main_nmfc = '';
                                }
                                if (crrEnhPackage[c].packageNmfcSubCode) {
                                    sub_nmfc = '-' + crrEnhPackage[c].packageNmfcSubCode;
                                } else {
                                    sub_nmfc = '';
                                }
                                if (main_nmfc || sub_nmfc) {
                                    enhance_sublist.setSublistValue({
                                        id: 'nmfc_id',
                                        line: z,
                                        value: main_nmfc + sub_nmfc
                                    });
                                }

                                enhance_sublist.setSublistValue({
                                    id: 'description_id',
                                    line: z,
                                    value: crrEnhPackage[c].packageDesc
                                });

                                enhance_sublist.setSublistValue({
                                    id: 'hazmat_id',
                                    line: z,
                                    value: (crrEnhPackage[c].packageIsHazardous) ? 'T' : 'F'
                                });
                            }

                            if (counter == 0) {
                                counter = (crrEnhPackage.length) + 1
                            } else {
                                counter = counter + (crrEnhPackage.length);
                                counter++;
                            }
                        }
                    }
                    else {
                        priorityquote.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });
                    }

                    // ----------------- Shipment Page URL ----------------
                    var ship_Fld = currentRecord.getValue({
                        fieldId: 'custbody_p1_shipment_url'
                    });

                    if (ship_Fld) {
                        var shipTab = form.addTab({
                            id: 'custpage_shiptabid',
                            label: 'Priority1 Shipment'
                        });

                        var shipHtml = '<!DOCTYPE html>' +
                            '<html>' +
                            '<body>' +
                            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>' +
                            '<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>' +
                            '<iframe id="theFrame" height="1000px" width="100%" frameborder="0" scrolling="no" style="border:none;" src="">' +
                            '</iframe>' +
                            '<script>' +
                            'document.getElementById("theFrame").src = "' + ship_Fld + '";' +
                            '$(\'#theFrame\').on(\'load\', function(){' +
                            'var hed = window.frames[\'theFrame\'].contentWindow.document.getElementById(\'div__header\').remove();' +
                            '});' +
                            '</script>' +
                            '</body>' +
                            '</html>';
                        var shipTabFld = form.addField({
                            id: 'custpage_transactionfield',
                            type: serverWidget.FieldType.INLINEHTML,
                            label: 'Transaction History - Coming Soon',
                            container: 'custpage_shiptabid'
                        });
                        shipTabFld.defaultValue = shipHtml;
                        // Hiding Generate Quote field.
                        priorityquote.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });
                        priorityship.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.NORMAL
                        });
                        if (quoteReference == 2 || quoteReference == '')
                            form.removeButton('custpage_assign_appet'); // removing assign pallet button.

                    } else {
                        priorityship.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });
                    }
                }
            }
        }
        catch (er) {
            log.debug('Error in beforeLoad', er);
        }
    }
    function beforeSubmit(context) {
        try {
            // if (context.type == context.UserEventType.DELETE)
            //     return;
            var recordObj = context.newRecord;
            var recdId = recordObj.id;
            var record_type = recordObj.type;
            var crrForm = recordObj.getValue({
                fieldId: 'customform'
            });
            var crrFormtext;
            if (crrForm) {
                var custobjRecord = record.load({
                    type: 'custform',
                    id: crrForm,
                    isDynamic: true
                });
                crrFormtext = custobjRecord.getValue({
                    fieldId: 'formname'
                });
            } else {
                var formfieldLookUp = search.lookupFields({
                    type: record_type,
                    id: recdId,
                    columns: ['customform']
                });
                crrFormtext = formfieldLookUp.customform[0].text;
            }
            if (crrFormtext == 'Priority1 Sales Order Form' || crrFormtext == 'Priority1 Item Fulfillment Form') {

                // ---------- If parcel quote is selected --------------
                var quoteReference = recordObj.getValue({
                    fieldId: 'custbody_p1_quote_preference'
                });
                if (quoteReference == 1) {
                    var numLines = recordObj.getLineCount({
                        sublistId: 'item'
                    });
                    log.debug('numLines', numLines);
                    var itemsDetails = [];

                    for (var i = 0; i < numLines; i++) {
                        var Units = recordObj.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_units',
                            line: i
                        });
                        var weight = recordObj.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_weight',
                            line: i
                        });

                        var weightUnit = recordObj.getSublistText({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_wt_unit',
                            line: i
                        });

                        var length = recordObj.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_length',
                            line: i
                        });

                        var width = recordObj.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_width',
                            line: i
                        });

                        var height = recordObj.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_height',
                            line: i
                        });

                        var lwhUnit = recordObj.getSublistText({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_lwh_unit',
                            line: i
                        });
                        //------------- data to store in the pallet field -------------
                        var dataitems = {
                            "units": Units,
                            "totalWeightUnit": weightUnit,
                            "totalWeight": weight,
                            "sinLwhUnit": lwhUnit,
                            "length": length,
                            "width": width,
                            "height": height
                        };
                        itemsDetails.push(dataitems);
                    }

                    var setPayload = JSON.stringify({
                        items: itemsDetails,
                        enhancedHandlingUnits: []
                    });
                    log.debug('setPayload', setPayload);
                    recordObj.setValue({
                        fieldId: 'custbody_p1_assigned_pallet_data',
                        value: setPayload,
                        ignoreFieldChange: true
                    });
                }
            }
        }
        catch (e) {
            log.debug('Error in Before Submit', e);
        }
    }
    function afterSubmit(context) {
        try {
            if (context.type == context.UserEventType.DELETE)
                return;
            var recordObj = context.newRecord;
            var recdId = recordObj.id;
            var record_type = recordObj.type;
            var crrForm = recordObj.getValue({
                fieldId: 'customform'
            });
            var crrFormtext;
            if (crrForm) {
                var custobjRecord = record.load({
                    type: 'custform',
                    id: crrForm,
                    isDynamic: true
                });
                crrFormtext = custobjRecord.getValue({
                    fieldId: 'formname'
                });
            } else {
                var formfieldLookUp = search.lookupFields({
                    type: record_type,
                    id: recdId,
                    columns: ['customform']
                });
                crrFormtext = formfieldLookUp.customform[0].text;
            }
            if (crrFormtext == 'Priority1 Sales Order Form' || crrFormtext == 'Priority1 Item Fulfillment Form') {
                // Adding the generate Quote link on body field on sales order record.
                var objRecord = record.load({
                    type: record_type,
                    id: recdId,
                    isDynamic: true,
                });
                var quoteReference = objRecord.getValue({
                    fieldId: 'custbody_p1_quote_preference'
                });
                log.debug('quoteReference', quoteReference);

                var sl_url;
                if (quoteReference == 2 || quoteReference == '') {
                    sl_url = url.resolveScript({
                        scriptId: 'customscript_sl_generate_quote',
                        deploymentId: 'customdeploypriority1_generate_quote',
                        returnExternalUrl: false,
                        params: {
                            'soIdObj': recdId,
                            'trx_type': record_type
                        }
                    });

                } else if (quoteReference == 1) {
                    sl_url = url.resolveScript({
                        scriptId: 'customscript_p1_sl_generate_parcel_quote',
                        deploymentId: 'customdeploy_p1_sl_generate_parcel_quote',
                        returnExternalUrl: false,
                        params: {
                            'soIdObj': recdId,
                            'trx_type': record_type
                        }
                    });
                }
                log.debug('sl_url', sl_url);
                objRecord.setValue('custbody_p1_quote_url', sl_url);
                objRecord.save();
            }
        }
        catch (e) {
            log.debug('Error in After Submit', e.message);
        }
    }
    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
}); 