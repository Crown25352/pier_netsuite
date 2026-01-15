/**
*@NApiVersion 2.1
*@NScriptType UserEventScript
*/
define(['N/record', 'N/search', 'N/log', 'N/runtime'], function (record, search, log, runtime) {

    const ID_OF_DANIEL = 1159;
    const ID_OF_AMY = 371397;
    function beforeSubmit(context) {
        try {
            let oldRec = context.oldRecord;
            let newRec = context.newRecord;
            let userObj = runtime.getCurrentUser();
            if (context.type == context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
                //PO by Amy should be approved by Daniel
                if (oldRec.getValue('orderstatus') == 'A' && newRec.getValue('orderstatus') != 'A' && newRec.getValue('recordcreatedby') == ID_OF_AMY) {
                    if (userObj.id != ID_OF_DANIEL) newRec.setValue('supervisorapproval', false);
                }
            }
        }
        catch (e) {
            log.debug('Error in BeforeSubmit', e.message);
        }
    }

    return {
        beforeSubmit: beforeSubmit
    }
}); 