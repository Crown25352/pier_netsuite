/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/url', 'N/record'],

    function (currentRecord, url, record) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */

        function confirmSendEmail(soIdObj) {

            //call suitelet
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_sl_generate_quote',
                deploymentId: 'customdeploypriority1_generate_quote',
                returnExternalUrl: false,
                params: {
                    'soIdObj': soIdObj
                }
            });
            // If the suitelet generates a PDF or form that should appear for the user, use window.open()
            window.open(suiteletURL);

        }

        function pageInit(scriptContext) {
            var soIdObj = scriptContext.currentRecord.id;
            var trxType = scriptContext.currentRecord.type;
            // console.log('soIdObj client', soIdObj);
            localStorage.removeItem('descData')
            var descData = {};
            $('.NMFCDesc-change').each(function () {
                descData[$(this).val()] = {
                    "Length": $(this).parents().eq(3).find('.Length-change').val(),
                    "Width": $(this).parents().eq(3).find('.Width-change').val(),
                    "Height": $(this).parents().eq(3).find('.Height-change').val()
                }
            })
            localStorage.setItem('descData', JSON.stringify(descData))
            // console.log(descData)
            function getRoot(el) {
                if ($(el).hasClass('calc-child-div')) {
                    return el;
                }
                return getRoot($(el).parent());
            }
            function getMainRoot(el) {
                if ($(el).hasClass('add-clone')) {
                    return el;
                }
                return getMainRoot($(el).parent());
            }
            function getRootPar(el) {
                if ($(el).hasClass('calc-parent-div')) {
                    return el;
                }
                return getRootPar($(el).parent());
            }

            // suggested class for parent div.
            $(document).on('blur', '.form-flexx', function () {
                var tr = getRootPar($(this).parent());
                var objtotalUnits = 0;
                var objtotalPieces = 0;
                var objtotalWeight = 0;
                // debugger;
                var objlengthInInches = Number(tr.find('.Length-change').val());
                var objwidthInInches = Number(tr.find('.Width-change').val());
                var objheightInInches = Number(tr.find('.Height-change').val());
                var objnumUnits = Number(tr.find('.unit-change').val());
                var objweightInlbs = Number(tr.find('.Weight-change').val());

                var objweightUnits = tr.find('.kg-change').val();
                var objlwhunits = tr.find('.wtUnit-change').val();


                if (objlengthInInches && objwidthInInches && objheightInInches && objnumUnits && objweightInlbs && objlwhunits && objweightUnits) {
                    var objlen, objwid, objheight;

                    if (objweightUnits == 'b') {
                        objweightInlbs = objweightInlbs;
                    } else if (objweightUnits == 'c') {
                        objweightInlbs = objweightInlbs * 2.20462262185;   //kg
                        objweightInlbs = objweightInlbs.toFixed(3);
                    } else if (objlwhunits == 'cm') {
                        objlen = objlengthInInches / 2.54;  //cm
                        objwid = objwidthInInches / 2.54;
                        objheight = objheightInInches / 2.54;
                    } else if (objlwhunits == 'm') {
                        objlen = objlengthInInches * 39.37;  //m
                        objwid = objwidthInInches * 39.37;
                        objheight = objheightInInches * 39.37;
                    }
                    if (objlwhunits == 'ft') {
                        objlen = objlengthInInches * 12;  //ft
                        objwid = objwidthInInches * 12;
                        objheight = objheightInInches * 12;
                    } else {
                        objlen = objlengthInInches;
                        objwid = objwidthInInches;
                        objheight = objheightInInches;
                    }

                    var objcubicInches = objlen * objwid * objheight;
                    var objcubicFeet = objcubicInches / 1728;
                    objcubicFeet = objcubicFeet * objnumUnits;
                    var objdensity = objweightInlbs / objcubicFeet;

                    var objSuggestedClass;
                    if (objdensity < 1) {
                        objSuggestedClass = 400;
                    } else if (objdensity >= 1 && objdensity < 2) {
                        objSuggestedClass = 300;
                    } else if (objdensity >= 2 && objdensity < 4) {
                        objSuggestedClass = 250;
                    } else if (objdensity >= 4 && objdensity < 6) {
                        objSuggestedClass = 175;
                    } else if (objdensity >= 6 && objdensity < 8) {
                        objSuggestedClass = 125;
                    } else if (objdensity >= 8 && objdensity < 10) {
                        objSuggestedClass = 100;
                    } else if (objdensity >= 10 && objdensity < 12) {
                        objSuggestedClass = 92.5;
                    } else if (objdensity >= 12 && objdensity < 15) {
                        objSuggestedClass = 85;
                    } else if (objdensity >= 15 && objdensity < 22.5) {
                        objSuggestedClass = 70;
                    } else if (objdensity >= 22.5 && objdensity < 30) {
                        objSuggestedClass = 65;
                    } else if (objdensity >= 30 && objdensity < 35) {
                        objSuggestedClass = 60;
                    } else if (objdensity >= 35 && objdensity < 50) {
                        objSuggestedClass = 55;
                    } else {
                        objSuggestedClass = 50;
                    }
                    //tr.find('.class-change').val((objSuggestedClass));
                    tr.find('.Suggested_Class-change').val((objSuggestedClass));
                }
            });

            $(document).on('blur', '.calc-child', function () {
                var rootDiv = getRoot($(this).parent());
                var mainRootDiv = getMainRoot($(rootDiv).parent());
                var parentPallet = $(mainRootDiv).prev();

                var totalUnits = 0;
                var totalPieces = 0;
                var totalWeight = 0;
                // debugger;
                var lengthInInches = Number($(rootDiv).find('input[data-calc="length-val"]').val());
                var widthInInches = Number($(rootDiv).find('input[data-calc="width-val"]').val());
                var heightInInches = Number($(rootDiv).find('input[data-calc="height-val"]').val());
                var numUnits = Number($(rootDiv).find('input[data-calc="unit-val"]').val());
                var weightInlbs = Number($(rootDiv).find('input[data-calc="weight-val"]').val());

                var weightUnits = $(rootDiv).find('select[data-calc="weight-unit"]').val();
                var lwhunits = $(rootDiv).find('select[data-calc="lwh-unit"]').val();


                if (lengthInInches && widthInInches && heightInInches && numUnits && weightInlbs && lwhunits && weightUnits) {
                    var len, wid, height;

                    if (weightUnits == 'b') {
                        weightInlbs = weightInlbs;
                    } else if (weightUnits == 'c') {
                        weightInlbs = weightInlbs * 2.20462262185;   //kg
                        weightInlbs = weightInlbs.toFixed(3);
                    } else if (lwhunits == 'cm') {
                        len = lengthInInches / 2.54;  //cm
                        wid = widthInInches / 2.54;
                        height = heightInInches / 2.54;
                    } else if (lwhunits == 'm') {
                        len = lengthInInches * 39.37;  //m
                        wid = widthInInches * 39.37;
                        height = heightInInches * 39.37;
                    }
                    if (lwhunits == 'ft') {
                        len = lengthInInches * 12;  //ft
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

                    // rec.setCurrentSublistValue({
                    //     sublistId: 'itemssublist',
                    //     fieldId: 'suggestedclass',
                    //     value: SuggestedClass
                    // });

                    //$(rootDiv).find('.new-class-change').val(SuggestedClass)

                }







                $(mainRootDiv).find('input[data-calc="unit-val"]').each(function (i, elm) {
                    totalUnits += Number($(elm).val());
                })
                $(mainRootDiv).find('input[data-calc="pieces-val"]').each(function (i, elm) {
                    totalPieces += Number($(elm).val());
                })
                $(mainRootDiv).find('input[data-calc="weight-val"]').each(function (i, elm) {
                    let thisRoot = getRoot($(elm).parent());
                    let unit = Number($(thisRoot).find('input[data-calc="unit-val"]').val());
                    let weight = Number($(elm).val());
                    totalWeight += (unit * weight);
                    //let pieces = Number($(rootDiv).find('input[data-calc="unit-val"]').val())
                })

                $(parentPallet).find('.Weight-change').val(totalWeight)
                $(parentPallet).find('.unit-change').val(totalUnits)
                $(parentPallet).find('.Pieces-change').val(totalUnits)
                //$(parentPallet).find('.Pieces-change').val(totalPieces)







                // console.log(totalWeight);
            })

            $(document).on('change', '.custom-select-new', function () {
                //$(this).parents().eq(2)


                $('select.custom-select').find('option').show();
                var selectedCountry = $(this).children('option:selected').val();
                var newArray = new Array();
                var arr = $('select.custom-select').find(':selected'); $('input:text[name=description]').each(function () {
                    newArray.push($(this).val());
                    $.each($('select.custom-select'), function () {
                        var self = this; var selectVal = $(this).val(); $.each(arr, function () {
                            if (selectVal !== $(this).val()) { $(self).find('option[value="' + $(this).val() + '"]').hide() } else { $(self).find('option[value="' + $(this).val() + '"]').show() }
                        });
                    });
                });
                if (newArray.includes(selectedCountry)) {
                    alert('Item is already selected please delete and re-select'); $(this).val($(this).find('option:first').val());
                }
                else {
                    //$(this).parent().parent().parent().find('.form-body').find('input.description-field').val($(this).val());
                    var descData = JSON.parse(localStorage.getItem('descData'))
                    if (descData) {
                        //Height-val-change
                        //Width-val-change
                        //Length-val-change
                        $(this).parents().eq(2).find('.Length-val-change').val(descData[$(this).val()]?.Length)
                        $(this).parents().eq(2).find('.Width-val-change').val(descData[$(this).val()]?.Width)
                        $(this).parents().eq(2).find('.Height-val-change').val(descData[$(this).val()]?.Height)

                    }
                }





            })

            // $(document).on('change', '.NMFC-change', function () {
            //     var testval = $("#" + this.id).val();

            //     if (testval != '') {
            //         if (testval.indexOf('-') != -1) {

            //             var splitObj = testval.split("-");
            //             var firstObjLen = splitObj[0].length;
            //             var secondObjLen = splitObj[1].length;
            //             // console.log('firstObjLen || secondObjLen', firstObjLen + ' || ' + secondObjLen);
            //             if ((splitObj[0].length != 5)) {
            //                 alert('NMFC code length should be equal to 5.')

            //             }
            //             if ((splitObj[1].length != 2)) {
            //                 alert('NMFC Sub code length should be equal to 2.');

            //             }
            //         }
            //         else if ((testval.indexOf('-') == -1)) {
            //             if (testval.length != 5) {
            //                 alert('NMFC code length should be equal to 5.');

            //             }
            //         }
            //         else {
            //             return true;
            //         }
            //     } else {
            //         return true;
            //     }
            // })

            $(document).on('change', '.NMFC-change', function () {
                var parentDiv = getRootPar($(this).parent());
                var nmfc_Val = parentDiv.find('.NMFC-change').val();
                console.log('nmfc_Val', nmfc_Val);

                var nmfc_Description, nmfc_Class;
                (nmfc_Val == '104600') ? (nmfc_Description = 'Iron Helixes / Brackets') && (nmfc_Class = 50)
                    : (nmfc_Val == '104340') ? (nmfc_Description = 'Iron Bars / Rods') && (nmfc_Class = 50)
                    : (nmfc_Val == '133300-02') ? (nmfc_Description = 'Machinery or Machine Parts; Boxed/Crated (Density Less Than 5)') && (nmfc_Class = 250)
                    : (nmfc_Val == '133300-03') ? (nmfc_Description = 'Machinery or Machine Parts; Boxed/Crated(Density 5 But Less Than 10)') && (nmfc_Class = 125)
                    : (nmfc_Val == '133300-04') ? (nmfc_Description = 'Machinery or Machine Parts; Boxed/Crated  (Density 10 but less than 15)') && (nmfc_Class = 85)
                    : (nmfc_Val == '133300-05') ? (nmfc_Description = 'Machinery or Machine Parts; Boxed/Created (Density 15 or Greater)') && (nmfc_Class = 65)
                    : (nmfc_Val == '133300-07') ? (nmfc_Description = 'Machinery or Machine Parts; Palletized (Density Less than 5)') && (nmfc_Class = 400)
                    : (nmfc_Val == '133300-08') ? (nmfc_Description = 'Machinery or Machine Parts; Palletized (Density 5 But Less Than 10)') && (nmfc_Class = 175)
                    : (nmfc_Val == '133300-09') ? (nmfc_Description = 'Machinery or Machine Parts; Palletized (Density10 But Less Than 15)') && (nmfc_Class = 100)
                    : (nmfc_Val == '133300-10') ? (nmfc_Description = 'Machinery or Machine Parts; Palletized (Density 15 or Greater)') && (nmfc_Class = 77.5)
                    : (nmfc_Val == '95190-01') ? (nmfc_Description = 'Hardware (Density Less Than 1)') && (nmfc_Class = 400)
                    : (nmfc_Val == '95190-02') ? (nmfc_Description = 'Hardware (Density 1 But Less Than 2)') && (nmfc_Class = 300)
                    : (nmfc_Val == '95190-03') ? (nmfc_Description = 'Hardware (Density 2 But Less Than 4)') && (nmfc_Class = 250)
                    : (nmfc_Val == '95190-04') ? (nmfc_Description = 'Hardware (Density 4 But Less Than 6)') && (nmfc_Class = 175)
                    : (nmfc_Val == '95190-05') ? (nmfc_Description = 'Hardware (Density 6 But Less Than 8)') && (nmfc_Class = 125)
                    : (nmfc_Val == '95190-06') ? (nmfc_Description = 'Hardware (Density 8 But Less Than 10)') && (nmfc_Class = 100)
                    : (nmfc_Val == '95190-07') ? (nmfc_Description = 'Hardware (Density 10 But less Than 12)') && (nmfc_Class = 92.5)
                    : (nmfc_Val == '95190-08') ? (nmfc_Description = 'Hardware (Density 12 But Less Than 15)') && (nmfc_Class = 85)
                    : (nmfc_Val == '95190-09') ? (nmfc_Description = 'Hardware (Density 15 But Less Than 22.5)') && (nmfc_Class = 70)
                    : (nmfc_Val == '95190-10') ? (nmfc_Description = 'Hardware (Density 22.5 But Less Than 30)') && (nmfc_Class = 65)
                    : (nmfc_Val == '95190-11') ? (nmfc_Description = 'Hardware (Density 30 or Greater)') && (nmfc_Class = 60)
                    : (nmfc_Val == '93490') ? (nmfc_Description = 'Nuts / Bolts') && (nmfc_Class = 50)
                        : '';

                console.log('nmfc_Description', nmfc_Description);
                console.log('nmfc_Class', nmfc_Class);
                parentDiv.find('.NMFCDesc-change').val((nmfc_Description));
                parentDiv.find('.class-change').val((nmfc_Class));
            });
        }

        function saveRecord(scriptContext) {
            var palletObj = scriptContext.currentRecord;
            var trxType = palletObj.getValue({
                fieldId: 'custpage_trx_type_field'
            });
            var transaction_id = palletObj.getValue({
                fieldId: 'custpage_so_id_field'
            });
            var payLoadArr = [];

            var itemDataObj;

            // console.log('soIdObjPallet saverec', soIdObjPallet)

            var completeData = []
            // $('#tdbody_submitter').click(function (e) {
            //     e.preventDefault();

            $('.pallet').each(function (i, mainEl) {
                var abcArr = [{
                    "Unit": $(mainEl).find('.unit-change').val(),
                    "HandlingUnit": $(mainEl).find('.HandlingUnit-change').val(),
                    "Pieces": $(mainEl).find('.Pieces-change').val(),
                    "Weight": $(mainEl).find('.Weight-change').val(),
                    "wghtUnit": $(mainEl).find('.kg-change').val(),
                    "Length": $(mainEl).find('.Length-change').val(),
                    "Width": $(mainEl).find('.Width-change').val(),
                    "Height": $(mainEl).find('.Height-change').val(),
                    "dimUnit": $(mainEl).find('.wtUnit-change').val(),
                    "Class": $(mainEl).find('.class-change').val(),
                    "NMFC": $(mainEl).find('.NMFC-change').val(),
                    "NMFCDesc": $(mainEl).find('.NMFCDesc-change').val(),
                    "IsHazmat": $(mainEl).find('.cls-hazmat').prop('checked'),
                    "IsUsed": $(mainEl).find('.cls-used').prop('checked'),
                    "IsStackable": $(mainEl).find('.cls-stackable').prop('checked'),
                    "IsMachinery": $(mainEl).find('.cls-machinery').prop('checked')

                }];
                $(mainEl).find('.Appended-HTML').each(function (i, el) {
                    let data = {
                        "Unit": $(el).find('.unit-val-change').val(),
                        "HandlingUnit": $(el).find('.newhandlingunit-change').val(),
                        "Pieces": $(el).find('.Pieces-val-change').val(),
                        "Weight": $(el).find('.Weight-val-change').val(),
                        "WeightUnit": $(el).find('.newweightunit-change').val(),
                        "Length": $(el).find('.Length-val-change').val(),
                        "Width": $(el).find('.Width-val-change').val(),
                        "Height": $(el).find('.Height-val-change').val(),
                        "lwhUnit": $(el).find('.newlwhunit-change').val(),
                        "Class": $(el).find('.new-class-change').val(),
                        "NMFC": $(el).find('.NMFC-val-change').val(),
                        "PacakageName": $(el).find('.custom-select-new').val(),
                        "IsHazmat": $(el).find('.new-cls-hazmat').prop('checked'),
                        "IsUsed": $(el).find('.new-cls-used').prop('checked')

                    };
                    abcArr.push(data)
                });
                completeData.push(abcArr);
            });
            // console.log(completeData);

            // });
            itemDataObj = completeData;
            // console.log('itemDataObj 236', itemDataObj);
            var arrLen = itemDataObj.length;

            // console.log('arrLen 239', arrLen);

            var itemsArr = [];
            var enhancedHandlingArr = [];
            var units, weight, Class, handling_unit, length, width, height, pieces, items, SugestedClass, packageFreightClass, sinLwhUnit, weightUnitPackage, packageLwhunit, totalWeightUnit;
            var hazmat, stackable, used, machinery, description, handleunit, objrec;
            var weightPerPackage, quantity, pieces, packagingType, packageLength, packageWidth, packageHeight, packageIsHazardous, packageIsUsed, packageIsMachinery, packageNmfcItemCode, packageNmfcSubCode;
            var handlingUnitType, units, handlingUnitLength, handlingUnitWidth, handlingUnitHeight, isStackable, isMachinery, packages, handlingUnitWeight;

            for (a = 0; a < arrLen; a++) {

                var subArrObj = itemDataObj[a].length;
                // console.log('subArrObj 239', subArrObj);

                if (subArrObj > 1) {  // condition for enhance handling.
                    var multiPack = itemDataObj[a];

                    var pkgArr = [];

                    // console.log('itemDataObj[a] contains many packages', itemDataObj[a]);
                    for (b = 1; b < subArrObj; b++) {
                        // const element = array[b];
                        var mainNmfcMulti, mainSubNmfcMulti;
                        if (multiPack[b].NMFC) {
                            var multinfcObj = multiPack[b].NMFC;
                            if (multinfcObj.indexOf('-') != -1) {
                                var splitmultiPacknfc = multinfcObj.split('-');
                                mainNmfcMulti = splitmultiPacknfc[0];
                                mainSubNmfcMulti = splitmultiPacknfc[1];
                            } else if (multinfcObj.indexOf('-') == -1) {
                                mainNmfcMulti = multinfcObj;
                                mainSubNmfcMulti = null;
                            }
                        } else {
                            mainNmfcMulti = null;
                            mainSubNmfcMulti = null;
                        }
                        var packagesArrs = {
                            packageDesc: multiPack[b].PacakageName,
                            packageFreightClass: multiPack[b].Class,
                            weightPerPackage: multiPack[b].Weight,
                            weightUnitPackage: multiPack[b].WeightUnit,
                            quantity: multiPack[b].Unit,
                            pieces: multiPack[b].Pieces,
                            packagingType: multiPack[b].HandlingUnit,
                            packageLength: multiPack[b].Length,
                            packageWidth: multiPack[b].Width,
                            packageHeight: multiPack[b].Height,
                            packageLwhunit: multiPack[b].lwhUnit,
                            packageIsHazardous: multiPack[b].IsHazmat,
                            packageIsUsed: multiPack[b].IsUsed,
                            packageIsMachinery: multiPack[b].false ?? false,
                            packageNmfcItemCode: mainNmfcMulti,
                            packageNmfcSubCode: mainSubNmfcMulti
                        };
                        pkgArr.push(packagesArrs);
                    }
                    // console.log('multiPack', multiPack);
                    var enhanceItemObj = {
                        handlingUnitType: multiPack[0].HandlingUnit,
                        units: multiPack[0].Unit,
                        handlingUnitLength: multiPack[0].Length,
                        handlingUnitWidth: multiPack[0].Width,
                        handlingUnitHeight: multiPack[0].Height,
                        handlingUnitWeight: multiPack[0].Weight,
                        isStackable: multiPack[0].IsStackable,
                        isMachinery: multiPack[0].IsMachinery,
                        description: multiPack[0].NMFCDesc,
                        packages: pkgArr
                    };
                    enhancedHandlingArr.push(enhanceItemObj);

                }
                else { //condition for single items.

                    var singleItem = itemDataObj[a];
                    var mainNmfcSingle, mainSubNmfcSingle;
                    if (singleItem[0].NMFC) {
                        var nfcObj = singleItem[0].NMFC;
                        if (nfcObj.indexOf('-') != -1) {
                            var splitnfc = nfcObj.split('-');
                            mainNmfcSingle = splitnfc[0];
                            mainSubNmfcSingle = splitnfc[1];
                        } else if (nfcObj.indexOf('-') == -1) {
                            mainNmfcSingle = nfcObj;
                            mainSubNmfcSingle = null;
                        }
                    } else {
                        mainNmfcSingle = null;
                        mainSubNmfcSingle = null;
                    }

                    var itemDataSingle = {
                        description: singleItem[0].NMFCDesc,
                        freightClass: singleItem[0].Class,
                        packagingType: singleItem[0].HandlingUnit,
                        units: singleItem[0].Unit,
                        pieces: singleItem[0].Pieces,
                        totalWeight: singleItem[0].Weight,
                        totalWeightUnit: singleItem[0].wghtUnit,
                        length: singleItem[0].Length,
                        width: singleItem[0].Width,
                        height: singleItem[0].Height,
                        sinLwhUnit: singleItem[0].dimUnit,
                        isStackable: singleItem[0].IsStackable,
                        isHazardous: singleItem[0].IsHazmat,
                        isUsed: singleItem[0].IsUsed,
                        isMachinery: singleItem[0].IsMachinery,
                        nmfcItemCode: mainNmfcSingle,
                        nmfcSubCode: mainSubNmfcSingle

                    };

                    itemsArr.push(itemDataSingle);

                }

            }
            var payoadObj = {
                items: itemsArr,
                enhancedHandlingUnits: enhancedHandlingArr
            };
            payLoadArr.push(itemsArr);
            payLoadArr.push(enhancedHandlingArr);

            var setPayload = JSON.stringify(payoadObj);
            var palletRequest = record.submitFields({
                type: trxType,
                id: transaction_id,
                values: {
                    custbody_p1_assigned_pallet_data: setPayload
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true,
                    ignoreFieldChange: true
                }

            });

            return true;
        }

        function assignPallet(recdIdObj) {
            var currentRcdForm = currentRecord.get();
            // var soIdObj = scriptContext.currentRecord.id;
            // console.log('soIdObj client', soIdObj);
            var windowFeatures = "left=100,top=100,width=600,height=400";
            window.open(url.resolveScript({
                scriptId: 'customscript_assign_pallet_on_items',
                deploymentId: 'customdeploy_assign_pallet_on_items',
                params: {
                    tranID: currentRcdForm.id,
                    tranType: currentRcdForm.type
                }
            }), "_blank");
            // }), "_blank", "popup");
        }

        return {
            confirmSendEmail: confirmSendEmail,
            pageInit: pageInit,
            saveRecord: saveRecord,
            assignPallet: assignPallet

        };

    });