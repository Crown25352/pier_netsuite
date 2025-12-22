define(['N/record', 'N/search', 'N/ui/dialog', 'N/log', 'N/currentRecord'], function (record, search, dialog, log, currentRecord) {
    /**
    *@NApiVersion 2.0
    *@NScriptType ClientScript
    */

    function pageInit(context) {
        // var currentRecord = context.currentRecord;

        // var firstName = currentRecord.getValue({
        //     fieldId: 'firstname'
        // });
        // log.debug({
        //     title: 'Customer First Name',
        //     details: firstName
        // });

        // dialog.alert({
        //     title: 'Announcement',
        //     message: 'You are viewing ' + firstName
        // });
        // currentRecord.setValue({
        //     fieldId: 'comments',
        //     value: 'Use this area for any customer comments.'
        // });
    }
    function fieldChanged(context) {
        var rec = context.currentRecord;

        if (context.fieldId == 'custpage_pdate') {
            var pickupDate = rec.getValue({
                fieldId: 'custpage_pdate'
            });
            var fldDate = pickupDate.getDate();
            var fldMonth = pickupDate.getMonth();
            var fldYear = pickupDate.getFullYear();

            console.log('pickupDate', fldDate + ' | ' + fldMonth + '|' + fldYear);
            var dateObj = new Date();
            console.log('dateObj', dateObj);

            var crrDate = dateObj.getDate();
            var crrMonth = dateObj.getMonth();
            var crrYear = dateObj.getFullYear();

            if (fldYear >= crrYear) {
                if (fldMonth > crrMonth) {
                    return true;
                } else if (fldMonth == crrMonth) {
                    if (fldDate >= crrDate) {
                        return true;
                    }
                    else {
                        alert('Pickup Date Can not be older.');
                        return false;
                    }
                }

            } else {
                alert('Pickup Date Can not be older.');
                return false;
            }

            //     dialog.alert({
            //         title: 'Job Title Change',
            //         message: 'Job Title has changed to ' + jobTitle
            //     });
            // }
        }
    }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    }

});