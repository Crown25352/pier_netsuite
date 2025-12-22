/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/*
 * Script Author:		Chetu India Pvt. Ltd.
 * Script Date:			July 20, 2021
 * Script Type:			SuiteScript 2.X (Client Script)
 * Script Description:	
 * Last Modified:		(Please put a comment below with details of modification)
 * Comments:				
 */
define(['N/search', 'N/record', 'N/format', 'N/url', 'N/ui/dialog', 'N/currentRecord'], function (search, record, format, url, dialog, currentRecord) {

    function pageInit(scriptContext) {

        try {
            var crrRcd = scriptContext.currentRecord;
            var crrForm = crrRcd.getValue('customform');
            var crrFormtext = crrRcd.getText('customform');
            console.log('crrFormtext', crrFormtext);

            if (crrFormtext == 'Priority1 Sales Order Form' || crrFormtext == 'Priority1 Item Fulfillment Form') {

                $(document).ready(function (scriptContext, objrec, record) {
                    $('#clickMe').click(function (e) {
                        e.preventDefault();
                    });
                });
                $('#clickMe').bind('click', { param1: scriptContext }, clearFieldValues);

                function clearFieldValues(event, scriptContext, objrec, record) {
                    var scriptContext = event.data.param1;
                    var accField = scriptContext.currentRecord;
                    console.log('button click function', accField);
                    accField.setValue({
                        fieldId: 'custbody_p1_accesorial_services',
                        value: []
                    });
                }
            }
        } catch (e) {
            alert('Error in PageInit ' + e.message);
        }

    }
    // function validateLine(scriptContext) {
    //     // console.log("validateLine Triggered!");
    //     var crrRcd = scriptContext.currentRecord;
    //     var crrForm = crrRcd.getValue('customform');
    //     var crrFormtext = crrRcd.getText('customform');
    //     if (crrFormtext == 'Priority1 Sales Order Form' || crrFormtext == 'Priority1 Item Fulfillment Form') {


    //         var sublistValue = crrRcd.getCurrentSublistValue({
    //             sublistId: 'item',
    //             fieldId: 'custcol_p1_nmfc'
    //         });
    //         console.log('sublistValue: ', sublistValue);
    //         if (sublistValue != '') {
    //             if (sublistValue.indexOf('-') != -1) {

    //                 var splitObj = sublistValue.split("-");
    //                 var firstObjLen = splitObj[0].length;
    //                 var secondObjLen = splitObj[1].length;
    //                 console.log('firstObjLen || secondObjLen', firstObjLen + ' || ' + secondObjLen);
    //                 if ((splitObj[0].length != 5)) {
    //                     dialog.alert({
    //                         title: 'Error',
    //                         message: 'NMFC code length should be equal to 5.'
    //                     });
    //                 }
    //                 if ((splitObj[1].length != 2)) {
    //                     dialog.alert({
    //                         title: 'Error',
    //                         message: 'NMFC Sub code length should be equal to 2.'
    //                     });
    //                 }
    //             }
    //             else if ((sublistValue.indexOf('-') == -1)) {
    //                 if (sublistValue.length != 5) {
    //                     dialog.alert({
    //                         title: 'Error',
    //                         message: 'NMFC code length should be equal to 5.'
    //                     });
    //                 }
    //             }
    //             else {
    //                 return true;
    //             }
    //         } else {
    //             return true;
    //         }
    //     }
    //     return true; //Return true if the line is valid.
    // }

    function fieldChanged(scriptContext) {
        try {

            var rec = scriptContext.currentRecord;
            var crrForm = rec.getValue('customform');
            var crrFormtext = rec.getText('customform');
            if (crrFormtext == 'Priority1 Sales Order Form' || crrFormtext == 'Priority1 Item Fulfillment Form') {


                if (scriptContext.fieldId == 'custbody_p1_accesorial_services') {
                    var accFldId = rec.getText({
                        fieldId: 'custbody_p1_accesorial_services'
                    });
                    console.log('accFldId 54', accFldId);
                    console.log('accFldId length', accFldId.length);

                    var listFld = document.getElementById("listacc");
                    listFld.innerHTML = '';
                    for (j = 0; j < accFldId.length; j++) {
                        console.log('listFld', listFld);

                        listFld.innerHTML += '<h3>' + accFldId[j] + '</h3><br>'
                    }
                }
                /****Code for suggested class calculation****/
                if (scriptContext.fieldId == 'custcol_p1_wt_unit' || scriptContext.fieldId == 'custcol_p1_height' || scriptContext.fieldId == 'custcol_p1_lwh_unit' || scriptContext.fieldId == 'custcol_p1_length' || scriptContext.fieldId == 'custcol_p1_width' || scriptContext.fieldId == 'custcol_p1_units' || scriptContext.fieldId == 'custcol_p1_weight') {
                    var weightUnits = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_p1_wt_unit'
                    });
                    var lengthInInches = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_p1_length'
                    });
                    var widthInInches = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_p1_width'
                    });

                    var heightInInches = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_p1_height'
                    });

                    var numUnits = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_p1_units'
                    });

                    var weightInlbs = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_p1_weight'
                    });

                    var lwhunits = rec.getCurrentSublistValue({
                        sublistId: 'item',

                        fieldId: 'custcol_p1_lwh_unit'
                    });

                    if (lengthInInches && widthInInches && heightInInches && numUnits && weightInlbs && lwhunits && weightUnits) {
                        var len, wid, height;

                        if (weightUnits == '2') {
                            weightInlbs = weightInlbs * 2.20462262185;
                            weightInlbs = weightInlbs.toFixed(3);
                        } else {
                            weightInlbs = weightInlbs;
                        }
                        if (lwhunits == '2') {
                            len = lengthInInches / 2.54;
                            wid = widthInInches / 2.54;
                            height = heightInInches / 2.54;
                        } else if (lwhunits == '3') {
                            len = lengthInInches * 39.37;
                            wid = widthInInches * 39.37;
                            height = heightInInches * 39.37;
                        } else if (lwhunits == '4') {
                            len = lengthInInches * 12;
                            wid = widthInInches * 12;
                            height = heightInInches * 12;
                        } else {
                            len = lengthInInches;
                            wid = widthInInches;
                            height = heightInInches;
                        }
                        var cubicInches = len * wid * height;
                        var cubicFeet = cubicInches / 1728;

                        cubicFeet = cubicFeet * numUnits;
                        var density = weightInlbs / cubicFeet;

                        var SuggestedClass;
                        if (density < 1) {
                            SuggestedClass = 400;
                        } else if (density >= 1 && density < 2) {
                            SuggestedClass = 300;
                        } else if (density >= 2 && density < 4) {
                            SuggestedClass = 250;
                        } else if (density >= 4 && density < 6) {
                            SuggestedClass = 175;
                        } else if (density >= 6 && density < 8) {
                            SuggestedClass = 125;
                        } else if (density >= 8 && density < 10) {
                            SuggestedClass = 100;
                        } else if (density >= 10 && density < 12) {
                            SuggestedClass = 92.5;
                        } else if (density >= 12 && density < 15) {
                            SuggestedClass = 85;
                        } else if (density >= 15 && density < 22.5) {
                            SuggestedClass = 70;
                        } else if (density >= 22.5 && density < 30) {
                            SuggestedClass = 65;
                        } else if (density >= 30 && density < 35) {
                            SuggestedClass = 60;
                        } else if (density >= 35 && density < 50) {
                            SuggestedClass = 55;
                        } else {
                            SuggestedClass = 50;
                        }
                        log.debug("Suggested class 117");
                        rec.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_suggested_class',
                            value: SuggestedClass
                        });
                        log.debug("Suggested class ended 123");
                    }
                }
                /**** Hazmat validation for sublist START ****/

                var Hazmat = rec.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_p1_hazmat'
                });

                if (scriptContext.fieldId == 'custcol_p1_hazmat') {
                    if (Hazmat == true) {
                        rec.setText({
                            fieldId: 'custbody_p1_accesorial_services',
                            text: 'Hazardous Material'
                        });
                    } else if (Hazmat == false) {
                        rec.setText({
                            fieldId: 'custbody_p1_accesorial_services',
                            text: ''
                        });
                    }
                }
                /**** Hazmat validation for sublist END ****/

                /****Item description****/
                if (scriptContext.fieldId == 'item' || scriptContext.fieldId == 'custcol_p1_height' || scriptContext.fieldId == 'custcol_p1_lwh_unit' || scriptContext.fieldId == 'custcol_p1_length' || scriptContext.fieldId == 'custcol_p1_width' || scriptContext.fieldId == 'custcol_p1_units' || scriptContext.fieldId == 'custcol_p1_weight') {
                    var itemId = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    var itemname, itemDes;
                    var itemSearchObj = search.create({
                        type: "item",
                        filters:
                            [
                                ["internalidnumber", "equalto", itemId]
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "itemid",
                                    sort: search.Sort.ASC,
                                    label: "Name"
                                }),
                                search.createColumn({ name: "itemid", label: "Display Name" }),
                                search.createColumn({ name: "salesdescription", label: "Description" }),
                                search.createColumn({ name: "type", label: "Type" }),
                            ]
                    });
                    var searchResultCount = itemSearchObj.runPaged().count;
                    itemSearchObj.run().each(function (result) {

                        itemDes = result.getValue({
                            name: 'salesdescription'
                        });
                        itemname = result.getValue({
                            name: 'itemid'
                        });

                        return true;
                    });


                    log.debug("itemDes", itemDes);
                    log.debug("itemname", itemname);

                    if (itemDes) {
                        rec.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'description',
                            value: itemDes,
                            ignoreFieldChange: true
                        });
                    }
                    else {
                        rec.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'description',
                            value: itemname,
                            ignoreFieldChange: true
                        });
                    }
                }
            }
        } catch (e) {
            log.debug('Error in field change ', e.message);
        }

    }


    function saveRecord(scriptContext) {
        try {
            var objRec = scriptContext.currentRecord;
            var crrForm = objRec.getValue('customform');
            var crrFormtext = objRec.getText('customform');
            if (crrFormtext == 'Priority1 Sales Order Form' || crrFormtext == 'Priority1 Item Fulfillment Form') {
                var accessservices = objRec.getValue('custbody_p1_accesorial_services');

                var totalLines = objRec.getLineCount({
                    sublistId: 'item'
                });

                /**** Hazmat validation for sublist START ****/
                var flag = false,
                    Hazcheck;
                for (var count = 0; count < totalLines; count++) {
                    Hazcheck = objRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_p1_hazmat',
                        line: count
                    });
                    if (Hazcheck == false) {
                        flag = true;
                    } else {
                        flag = false;
                        break
                    }
                }
                if (accessservices == '56') {
                    if (flag == true) {
                        alert('The Hazmat accessorial has been added but no items have been marked as Hazmat. Please mark at least one item as Hazmat or remove the Hazmat accessorial to continue');

                        return false;
                    }

                }
                /**** Hazmat validation for sublist END ****/

                var quotePref_obj = objRec.getValue('custbody_p1_quote_preference');

                var itmWeight;
                if (quotePref_obj == 1) {
                    for (var i = 0; i < totalLines; i++) {
                        itmWeight = objRec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_p1_weight',
                            line: i
                        });
                        // console.log('itmWeight' + i, itmWeight)

                        if (itmWeight > 150) {
                            alert('Parcel weight exceeds 150lbs, Please do input value less than 150lbs for line item ' + (i + 1));
                            return false;
                        }
                    }
                }


                return true;
            }
            return true;
        } catch (e) {
            log.debug('Error in saveRecord', e.message);
        }

    }
    return {
        pageInit: pageInit,
        // validateLine: validateLine,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
});