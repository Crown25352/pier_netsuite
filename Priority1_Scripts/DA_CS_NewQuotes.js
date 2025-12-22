/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/*
 * Script Author:		Chetu India Pvt. Ltd.
 * Script Date:			October 10, 2021
 * Script Type:			SuiteScript 2.X (Client Script)
 * Script Description:	
 * Last Modified:		(Please put a comment below with details of modification)
 * Comments:				
 */
define(['N/search', 'N/record', 'N/format', 'N/url', 'N/ui/dialog', 'N/currentRecord'],
    function (search, record, format, url, dialog, currentRecord) {

        function pageInit(scriptContext) {
            try {
                // document.getElementById("NS_MENU_ID0-item0").style.display = "none";
                var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = "none";
                }
                // document.getElementById("clickMe").onclick = clearFieldValues();
                var buttonObj = document.getElementById("clickMe");
                console.log('buttonObj');
                buttonObj

                var objrec = scriptContext.currentRecord;
                var currentUrl = document.location.href;
                var url = new URL(currentUrl);
                var setDateCheck = url.searchParams.get("setDate");

                if (setDateCheck == null) {
                    var objdate = new Date();
                    console.log('objdate', objdate);
                    var formattedDateString = format.parse({
                        value: objdate,
                        type: format.Type.DATE
                    });
                    console.log('formattedDateString', formattedDateString);

                    objrec.setValue({
                        fieldId: 'custpage_pdate',
                        value: formattedDateString
                    });

                }


                $(document).ready(function (scriptContext, objrec, record) {
                    $('#clickMe').click(function (e) {
                        e.preventDefault();
                    });
                    // $("a").on('click', function (event) {
                    //     event.preventDefault();
                    //     alert('Picked: ' + $(this).parent('td').parent('tr').id.slice(4));
                    // });
                    // console.log('objrec pageinit', objrec);
                    // $('#clickMe').click({param1: scriptContext}, clearFieldValues);
                    // $('#clickMe').bind('click', {param1: scriptContext}, clearFieldValues);
                    // $('#clickMe').click({param1: scriptContext }function (scriptContext, objrec, record) {
                    //     var accField = scriptContext.currentRecord;
                    //     console.log('button click objrec',objrec);
                    //     clearFieldValues(scriptContext, objrec, record);
                    //     // accField.setValue({
                    //     //     fieldId: 'custpage_dd',
                    //     //     value: []
                    //     //     // ignoreFieldChange: true
                    //     // });
                    //     // clearFieldValues(scriptContext);
                    // });
                });
                $('#clickMe').bind('click', { param1: scriptContext }, clearFieldValues);
                // var btn = document.getElementById("clickMe");
                // btn.addEventListener("click", clearFieldValues(scriptContext));
                // buttonObj.onclick = clearFieldValues(scriptContext);
                function clearFieldValues(event, scriptContext, objrec, record) {
                    var scriptContext = event.data.param1;
                    var accField = scriptContext.currentRecord;
                    console.log('button click function', accField);
                    accField.setValue({
                        fieldId: 'custpage_dd',
                        value: []
                        // ignoreFieldChange: true
                    });
                }
            } catch (e) {
                alert('Error in PageInit ' + e.message);
            }

        }
        function validateLine(scriptContext) {
            // console.log("validateLine Triggered!");
            var crrRcd = scriptContext.currentRecord;
            var sublistValue = crrRcd.getCurrentSublistValue({
                sublistId: 'itemssublist',
                fieldId: 'nmfc'
            });
            console.log('sublistValue: ', sublistValue);
            if (sublistValue != '') {
                if (sublistValue.indexOf('-') != -1) {

                    var splitObj = sublistValue.split("-");
                    var firstObjLen = splitObj[0].length;
                    var secondObjLen = splitObj[1].length;
                    console.log('firstObjLen || secondObjLen', firstObjLen + ' || ' + secondObjLen);
                    if ((splitObj[0].length != 5)) {
                        dialog.alert({
                            title: 'Error',
                            message: 'NMFC code length should be equal to 5.'
                        });
                    }
                    if ((splitObj[1].length != 2)) {
                        dialog.alert({
                            title: 'Error',
                            message: 'NMFC Sub code length should be equal to 2.'
                        });
                    }
                }
                else if ((sublistValue.indexOf('-') == -1)) {
                    if (sublistValue.length != 5) {
                        dialog.alert({
                            title: 'Error',
                            message: 'NMFC code length should be equal to 5.'
                        });
                    }
                }
                else {
                    return true;
                }
            } else {
                return true;
            }


            return true; //Return true if the line is valid.
        }

        function fieldChanged(scriptContext) {
            try {
                var rec = scriptContext.currentRecord;
                if (scriptContext.fieldId == 'custpage_dd') {
                    var accFldId = rec.getText({
                        fieldId: 'custpage_dd'
                    });
                    // var fieldidname = objRecord.getText({
                    //     fieldId: 'item'
                    // });
                    console.log('accFldId 54', accFldId);
                    console.log('accFldId length', accFldId.length);
                    rec.setValue({
                        fieldId: 'custpage_acc_services',
                        value: accFldId
                    });

                    var listFld = document.getElementById("listacc");
                    listFld.innerHTML = '';
                    for (j = 0; j < accFldId.length; j++) {
                        console.log('listFld', listFld);

                        listFld.innerHTML += '<h3>' + accFldId[j] + '</h3><br>'
                    }
                }

                /**** Code for Zip code fieldChange ****/

                // if (scriptContext.fieldId == 'custpage_address' || scriptContext.fieldId == 'custpage_address_dest') {

                if (scriptContext.fieldId == 'custpage_address') {
                    var addInternalId = rec.getValue({
                        fieldId: 'custpage_address'
                    });
                    if (addInternalId) {
                        var AddressObj = record.load({
                            type: 'customrecord_p1_addresses',
                            id: addInternalId
                        });
                        var zipCode = AddressObj.getValue("custrecordpostal_code");
                        var addCountryP = AddressObj.getValue
                            ({ fieldId: 'custrecord_country_abbreviation' });

                        // console.log('addCountryP', addCountryP);

                        var pickCountry = (addCountryP == 'Canada' || addCountryP == 'CA') ? 'CA'
                            : (addCountryP == 'Puerto Rico' || addCountryP == 'PR') ? 'PR'
                                : (addCountryP == 'Mexico' || addCountryP == 'MX') ? 'MX'
                                    : 'US';
                        console.log('pickCountry', pickCountry);

                        rec.setValue({
                            fieldId: 'custpage_zip',
                            value: zipCode
                        });
                        rec.setValue({
                            fieldId: 'custpage_countryp',
                            value: pickCountry
                        });
                    }
                }

                if (scriptContext.fieldId == 'custpage_address_dest') {
                    var addInternalId = rec.getValue({
                        fieldId: 'custpage_address_dest'
                    });
                    if (addInternalId) {
                        var AddressObj = record.load({
                            type: 'customrecord_p1_addresses',
                            id: addInternalId
                        });
                        var zipCode = AddressObj.getValue("custrecordpostal_code");
                        var addCountryD = AddressObj.getValue
                            ({ fieldId: 'custrecord_country_abbreviation' });

                        var destCountry = (addCountryD == 'Canada' || addCountryD == 'CA') ? 'CA'
                            : (addCountryD == 'Puerto Rico' || addCountryD == 'PR') ? 'PR'
                                : (addCountryD == 'Mexico' || addCountryD == 'MX') ? 'MX'
                                    : 'US';
                        console.log('destCountry', destCountry);

                        rec.setValue({
                            fieldId: 'custpage_zip_dest',
                            value: zipCode,
                            ignoreFieldChange: true
                        });
                        rec.setValue({
                            fieldId: 'custpage_countryd',
                            value: destCountry,
                            ignoreFieldChange: true
                        });
                    }
                }
                // }

                /****Code for suggested class calculation****/


                if (scriptContext.fieldId == 'items_a') {
                    var itemType_;
                    var customrecord_api_configurationsSearchObj = search.create({
                        type: "customrecord_p1_api_configurations",
                        filters: [
                            ["internalidnumber", "equalto", "1"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_item_type",
                                label: "Item Type"
                            })
                        ]
                    });

                    var searchResultCount = customrecord_api_configurationsSearchObj.runPaged().count;
                    log.debug("customrecord_api_configurationsSearchObj result count", searchResultCount);
                    var itemType_ = "item";
                    customrecord_api_configurationsSearchObj.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        itemType_ = result.getValue({
                            name: "custrecord_item_type"
                        });

                        return true;
                    });

                    var itemId = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'items_a'
                    });
                    console.log('itemId', itemId);
                    console.log('itemType_', itemType_);
                    if (itemId) {

                        var itemObj = record.load({
                            type: itemType_,
                            id: itemId,
                            isDynamic: false,
                        });

                        var itemDes = itemObj.getValue({
                            fieldId: 'description'
                        });
                        var itemname = itemObj.getValue({
                            fieldId: 'invt_dispname'
                        });
                        var itemnameObj = itemObj.getValue({
                            fieldId: 'itemid'
                        });
                        console.log('itemDes', itemDes);
                        console.log('itemname', itemname);
                        if (itemDes) {
                            rec.setCurrentSublistValue({
                                sublistId: 'itemssublist',
                                fieldId: 'description',
                                value: itemDes
                            });
                        } else if (itemname) {
                            rec.setCurrentSublistValue({
                                sublistId: 'itemssublist',
                                fieldId: 'description',
                                value: itemname
                            });
                        } else if (itemnameObj) {
                            rec.setCurrentSublistValue({
                                sublistId: 'itemssublist',
                                fieldId: 'description',
                                value: itemnameObj
                            });
                        }
                    }


                }



                if (scriptContext.fieldId == 'height1' || scriptContext.fieldId == 'custpage_size' || scriptContext.fieldId == 'length1' || scriptContext.fieldId == 'width1' || scriptContext.fieldId == 'units' || scriptContext.fieldId == 'weight') {
                    var lengthInInches = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'length1'
                    });

                    var widthInInches = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'width1'
                    });
                    var heightInInches = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'height1'
                    });
                    var numUnits = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'units'
                    });
                    var weightInlbs = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'weight'
                    });

                    var weightUnits = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'custpage_weight'
                    });

                    var lwhunits = rec.getCurrentSublistValue({
                        sublistId: 'itemssublist',
                        fieldId: 'custpage_size'
                    });

                    if (lengthInInches && widthInInches && heightInInches && numUnits && weightInlbs && lwhunits && weightUnits) {
                        var len, wid, height;

                        if (weightUnits == 'b') {
                            weightInlbs = weightInlbs;
                        } else if (weightUnits == 'c') {
                            weightInlbs = weightInlbs * 2.20462262185;
                            weightInlbs = weightInlbs.toFixed(3);
                        } else if (lwhunits == 'cm') {
                            len = lengthInInches / 2.54;
                            wid = widthInInches / 2.54;
                            height = heightInInches / 2.54;
                        } else if (lwhunits == 'm') {
                            len = lengthInInches * 39.37;
                            wid = widthInInches * 39.37;
                            height = heightInInches * 39.37;
                        }
                        if (lwhunits == 'ft') {
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

                        rec.setCurrentSublistValue({
                            sublistId: 'itemssublist',
                            fieldId: 'suggestedclass',
                            value: SuggestedClass
                        });
                    }

                    /****Code for Inventory Item populating Description****/

                    //***start add saved search for item mapping***//

                    // var itemType_;
                    // var customrecord_api_configurationsSearchObj = search.create({
                    //     type: "customrecord_p1_api_configurations",
                    //     filters: [
                    //         ["internalidnumber", "equalto", "1"]
                    //     ],
                    //     columns: [
                    //         search.createColumn({
                    //             name: "custrecord_item_type",
                    //             label: "Item Type"
                    //         })
                    //     ]
                    // });

                    // var searchResultCount = customrecord_api_configurationsSearchObj.runPaged().count;
                    // log.debug("customrecord_api_configurationsSearchObj result count", searchResultCount);
                    // var itemType_ = "item";
                    // customrecord_api_configurationsSearchObj.run().each(function (result) {
                    //     // .run().each has a limit of 4,000 results
                    //     itemType_ = result.getValue({
                    //         name: "custrecord_item_type"
                    //     });

                    //     return true;
                    // });

                    // var itemId = rec.getCurrentSublistValue({
                    //     sublistId: 'itemssublist',
                    //     fieldId: 'items_a'
                    // });
                    // console.log('itemId', itemId);
                    // console.log('itemType_', itemType_);
                    // if (itemId) {

                    //     var itemObj = record.load({
                    //         type: itemType_,
                    //         id: itemId,
                    //         isDynamic: false,
                    //     });

                    //     var itemDes = itemObj.getValue({
                    //         fieldId: 'description'
                    //     });
                    //     var itemname = itemObj.getValue({
                    //         fieldId: 'invt_dispname'
                    //     });
                    //     var itemnameObj = itemObj.getValue({
                    //         fieldId: 'itemid'
                    //     });
                    //     console.log('itemDes', itemDes);
                    //     console.log('itemname', itemname);
                    //     if (itemDes) {
                    //         rec.setCurrentSublistValue({
                    //             sublistId: 'itemssublist',
                    //             fieldId: 'description',
                    //             value: itemDes
                    //         });
                    //     } else if (itemname) {
                    //         rec.setCurrentSublistValue({
                    //             sublistId: 'itemssublist',
                    //             fieldId: 'description',
                    //             value: itemname
                    //         });
                    //     } else if (itemnameObj) {
                    //         rec.setCurrentSublistValue({
                    //             sublistId: 'itemssublist',
                    //             fieldId: 'description',
                    //             value: itemnameObj
                    //         });
                    //     }
                    // }
                }

                /**** Hazmat validation for sublist START ****/

                var Hazmat = rec.getCurrentSublistValue({
                    sublistId: 'itemssublist',
                    fieldId: 'hazmat'
                });

                if (scriptContext.fieldId == 'hazmat') {
                    if (Hazmat == true) {
                        rec.setText({
                            fieldId: 'custpage_dd',
                            text: 'Hazardous Material'
                        });
                    } else if (Hazmat == false) {
                        rec.setText({
                            fieldId: 'custpage_dd',
                            text: ''
                        });
                    }
                }

                /**** Hazmat validation for sublist END ****/

            } catch (e) {
                alert('Error in field change ' + e.message);
            }

        }
        // validate field.
        function validateField(scriptContext) {
            // var currentRecord = context.currentRecord;

            var rec = scriptContext.currentRecord;

            if (scriptContext.fieldId == 'custpage_pdate') {
                var pickupDate = rec.getValue({
                    fieldId: 'custpage_pdate'
                });
                if (pickupDate) {


                    var fldDate = pickupDate.getDate();
                    var fldMonth = pickupDate.getMonth();
                    var fldYear = pickupDate.getFullYear();

                    var dateObj = new Date();


                    var crrDate = dateObj.getDate();
                    var crrMonth = dateObj.getMonth();
                    var crrYear = dateObj.getFullYear();

                    var flgchk = true;

                    if (fldYear == crrYear) {

                        if (fldMonth > crrMonth) {

                            return true;

                        } else if (fldMonth == crrMonth) {

                            if (fldDate >= crrDate) {

                                return true;
                            }
                            else {
                                // alert('Pickup Date Can not be older.');
                                // var crrDatObj = crrMonth + '/' + crrDate + '/' + crrYear
                                // console.log('crrDatObj',crrDatObj);
                                dialog.alert({
                                    title: 'Error',
                                    message: 'Pickup Date Can not be older.'
                                });
                                rec.setValue({
                                    fieldId: 'custpage_pdate',
                                    value: dateObj,
                                    ignoreFieldChange: true
                                });
                                return false;

                            }
                        } else {
                            return false;
                        }

                    } else if (fldYear < crrYear) {
                        // alert('Pickup Date Can not be older.');
                        dialog.alert({
                            title: 'Error',
                            message: 'Pickup Date Can not be older.'
                        });
                        rec.setValue({
                            fieldId: 'custpage_pdate',
                            value: dateObj,
                            ignoreFieldChange: true
                        });
                        return false;
                    } else {
                        return true;
                    }


                }
            }
            // code for zip validation.

            if (scriptContext.fieldId == 'custpage_zip') {
                var zipFld = rec.getValue({
                    fieldId: 'custpage_zip'
                });


                var zip_is_nan = isNaN(zipFld);

                if (zip_is_nan == true || zipFld.length != 5) {
                    dialog.alert({
                        title: 'Error',
                        message: 'Kindly Input Proper Pickup Zip Code.'
                    });
                    // rec.setValue({
                    //     fieldId: 'custpage_zip',
                    //     value: ''
                    // });
                    return true;
                }

            }
            if (scriptContext.fieldId == 'custpage_zip_dest') {
                var destzipFld = rec.getValue({
                    fieldId: 'custpage_zip_dest'
                });
                var dst_zip_is_nan = isNaN(destzipFld);

                if (dst_zip_is_nan == true || destzipFld.length != 5) {
                    dialog.alert({
                        title: 'Error',
                        message: 'Kindly Input Proper Destination Zip Code.'
                    });
                    // rec.getValue({
                    //     fieldId: 'custpage_zip_dest',
                    //     value: ''
                    // });
                    return true;
                }

            }
            return true;
        }

        function saveRecord(scriptContext) {

            var objRec = scriptContext.currentRecord;
            var pickupzip = objRec.getValue({
                fieldId: 'custpage_zip'
            });
            var destZip = objRec.getValue({
                fieldId: 'custpage_zip_dest'
            });
            var accessservices = objRec.getValue('custpage_dd');

            var totalLines = objRec.getLineCount({
                sublistId: 'itemssublist'
            });

            if (pickupzip == '') {
                alert('Pickup Zip Code must be at least 5 characters');
                return false;
            } else if (destZip == '') {
                alert('Destination Zip Code must be at least 5 characters');
                return false;
            }
            for (var count = 0; count < totalLines; count++) {

                var classValue = objRec.getSublistValue({
                    sublistId: 'itemssublist',
                    fieldId: 'class1',
                    line: count
                });


                if (classValue == 'a') {
                    alert("Please select the applicable freight class");
                    return false;
                }
            }
            /**** Hazmat validation for sublist START ****/
            var flag = false,
                Hazcheck;
            for (var count = 0; count < totalLines; count++) {
                Hazcheck = objRec.getSublistValue({
                    sublistId: 'itemssublist',
                    fieldId: 'hazmat',
                    line: count
                });

                if (Hazcheck == false) {
                    flag = true;

                } else {
                    flag = false;
                    break;
                }
            }
            if (accessservices == 'HAZM') {
                if (flag == true) {
                    alert('The Hazmat accessorial has been added but no items have been marked as Hazmat. Please mark at least one item as Hazmat or remove the Hazmat accessorial to continue');

                    return false;
                }


            }
            /**** Hazmat validation for sublist END ****/

            return true;
        }
        ///////////////////////////////
        return {
            pageInit: pageInit,
            validateLine: validateLine,
            fieldChanged: fieldChanged,
            validateField: validateField,
            saveRecord: saveRecord
        };
    });