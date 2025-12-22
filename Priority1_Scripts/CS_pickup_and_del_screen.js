/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

/*
 * Script Author:		Chetu India Pvt. Ltd.
 * Script Date:			Dec10, 2021
 * Script Type:			SuiteScript 2.X (Client Script)
 * Script Description:	
 * Last Modified:		(Please put a comment below with details of modification)
 * Comments:				
 */
define(['N/search', 'N/currentRecord'],
    function (search, currentRecord) {
        function pageInit(scriptContext) {
            // document.getElementById("NS_MENU_ID0-item0").style.display = "none";
            var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "none";
            }
        }

        function fieldChanged(scriptContext) {
            var objrec = scriptContext.currentRecord;
            var check = objrec.getValue({
                fieldId: 'freightinsurance'
            });


            if (scriptContext.fieldId == 'freightinsurance') {
                var calamt = objrec.getField({
                    fieldId: 'calculateamount'
                });

                if (check == true) {
                    calamt.isDisabled = true;
                    objrec.setValue('calculateamount', "0");
                } else {
                    calamt.isDisabled = false;
                }
            }
            /***Code for Pickup Phone Number***/
            var pickupPhone = objrec.getValue({
                fieldId: 'pickup_phone_num'
            });

            var Pickcount = 0;
            if (pickupPhone >= 1) ++Pickcount;

            while (pickupPhone / 10 >= 1) {
                pickupPhone /= 10;
                ++Pickcount;
            }
            if (scriptContext.fieldId == 'pickup_phone_num' && objrec.getValue('pickup_phone_num')) {
                if (Pickcount > 10 || Pickcount <= 9) {
                    alert('Please Enter Valid Phone Number');
                    objrec.setValue('pickup_phone_num', "");
                }
            }
            /***Code for Destination Phone Number***/
            var destinationPhone = objrec.getValue({
                fieldId: 'destionation_phone_num'
            });
            var Destcount = 0;
            if (destinationPhone >= 1) ++Destcount;

            while (destinationPhone / 10 >= 1) {
                destinationPhone /= 10;
                ++Destcount;
            }

            if (scriptContext.fieldId == 'destionation_phone_num' && objrec.getValue('destionation_phone_num')) {
                if (Destcount > 10 || Destcount <= 9) {
                    alert('Please Enter Valid Phone Number');
                    objrec.setValue('destionation_phone_num', "");
                }
            }

            if (scriptContext.fieldId == 'emergencyno') {
                var emergencyhazno = objrec.getCurrentSublistValue({
                    sublistId: 'hazmat_info',
                    fieldId: 'emergencyno'
                });

                var emergencyPhonecount = 0;
                if (emergencyhazno >= 1) ++emergencyPhonecount;

                while (emergencyhazno / 10 >= 1) {
                    emergencyhazno /= 10;
                    ++emergencyPhonecount;
                }

                if (emergencyPhonecount > 10 || emergencyPhonecount <= 9) {
                    alert('Please Enter ten digits Phone Number');
                }

            }
            if (scriptContext.sublistId == 'enhanncehazmat_info') {


                // code for line identity
                var currentRecord = scriptContext.currentRecord;
                var currIndex = currentRecord.getCurrentSublistIndex({
                    sublistId: 'enhanncehazmat_info'
                });
                console.log('currIndex', currIndex);
                var parentValue = currentRecord.getCurrentSublistValue({
                    sublistId: 'enhanncehazmat_info',
                    fieldId: 'enhanncegroup_parent'
                });
                console.log('parentValue', parentValue);
                var childValue = currentRecord.getCurrentSublistValue({
                    sublistId: 'enhanncehazmat_info',
                    fieldId: 'enhanncegroup_package'
                });
                console.log('childValue', childValue);
                var valforId = ((parentValue.toString()) + (childValue.toString()));
                console.log('valforId', valforId);
                var numValId = Number(valforId);
                console.log('numValId 114', numValId);
                currentRecord.setCurrentSublistValue({
                    sublistId: 'enhanncehazmat_info',
                    fieldId: 'enhan_identity_fld',
                    value: numValId,
                    ignoreFieldChange: true,
                    forceSyncSourcing: true
                });
            }

        }

        function saveRecord(scriptContext) {
            var objrec = scriptContext.currentRecord;
            var check = objrec.getValue({
                fieldId: 'freightinsurance'
            });

            // if (scriptContext.fieldId == 'pickup_address') {

            var pickAddcheck = objrec.getValue({
                fieldId: 'pickup_address'
            });
            console.log('(pickAddcheck)', (pickAddcheck));
            if ((pickAddcheck.length) > 50) {
                alert('Pickup Address Line 1 Length should be less then 50 Characters');
                var resultPick = pickAddcheck.slice(0, 49);
                objrec.setValue({
                    fieldId: 'pickup_address',
                    value: resultPick
                    // ignoreFieldChange: true
                });
            }
            // }

            // if (scriptContext.fieldId == 'destination_address') {

            var destAddcheck = objrec.getValue({
                fieldId: 'destination_address'
            });
            console.log('(destAddcheck)', (destAddcheck));
            if ((destAddcheck.length) > 50) {
                alert('Destination Address Line 1 Length should be less then 50 Characters');
                var result = destAddcheck.slice(0, 49);
                objrec.setValue({
                    fieldId: 'destination_address',
                    value: result
                    // ignoreFieldChange: true
                });
            }

            // }
            var calamt = objrec.getValue({
                fieldId: 'calculateamount'
            });

            if (check == false) {
                if (calamt == '') {
                    alert('Please Enter Amount for Freight Insurance');
                    return false;
                }
            }
            var numLines = objrec.getLineCount({
                sublistId: 'hazmat_info'
            });
            console.log('numLines one', numLines);

            if (numLines == -1) {
                // alert('Please enter details for Hazmat Items');
                // return false;
                numLines = 0;
            }

            var lines = objrec.getLineCount({
                sublistId: 'carrier_info'
            });
            var hazValue, count = 0,
                falsecount = 0;
            for (var i = 0; i < lines; i++) {
                hazValue = objrec.getSublistValue({
                    sublistId: 'carrier_info',
                    fieldId: 'carrier_hazmat',
                    line: i
                });
                console.log('hazValue', hazValue);
                if (hazValue == true) {
                    count++;

                }
                // else if (hazValue == 'F') {

                //     if (numLines == -1) {
                //         return true;
                //     }

                // }
            }
            console.log('numLines', numLines);
            console.log('count', count);
            if (numLines > count) {
                alert('only ' + count + ' Hazmat Item is there, Please Remove another Item');
                return false;
            } else if (numLines < count) {
                alert(+count + ' Hazmat Item is there, Please Complete the Hazmat details');
                return false;
            } else if (numLines == count) {
                return true;
            }


            return true;
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };
    });