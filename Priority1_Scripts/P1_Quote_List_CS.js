/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope Public
 */
define(['N/url', 'N/https', 'N/xml', 'N/currentRecord', 'N/format', 'N/runtime'], function (url, https, xmlMod, format, currentRecord, runtime) {
    function pageInit(context) {

    }
    function fieldChanged(context) {
        // try {
        var cRec = context.currentRecord;
        var fieldName = context.fieldId;
        log.debug("fieldName", fieldName);

        if (context.fieldId == 'custpage_pickupdatesearch' || context.fieldId == 'custpage_statussearchs') {
            // if (context.fieldId == 'custpage_pickupdatesearch') {
            var myDate;
            var dateField = context.currentRecord.getValue({
                fieldId: 'custpage_pickupdatesearch'
            });
            console.log('dateField', dateField);
            if (dateField) {
                var month = dateField.getMonth();
                console.log('month', month);


                var day = dateField.getDate();
                console.log('day', day)

                var year = dateField.getFullYear();
                console.log('year', year);

                myDate = (month + 1) + '/' + day + '/' + year;
                console.log('myDate', myDate);
            }
            // }

            var statusField = context.currentRecord.getValue({
                fieldId: 'custpage_statussearchs'
            });

            console.log('statusField', statusField);

            var view_suitelet = url.resolveScript({
                scriptId: 'customscript_sl_p1_quotelist',
                deploymentId: 'customdeploy_sl_p1_quotelist',
                params: ({
                    // 'custRecId': recordId,
                    // 'date': myDate,
                    // 'statusObj': statusField
                })

            });

            window.onbeforeunload = null;
            window.location.assign(view_suitelet + '&date=' + myDate + '&statusObj=' + statusField);
            // window.location.assign('https://3330942-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=761&deploy=1&date=' + myDate + '&statusObj=' + statusField);
        }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };
});