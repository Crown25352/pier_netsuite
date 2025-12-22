/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/
define(['N/record', 'N/format', 'N/log'], function (record, format, log) {

    function afterSubmit(context) {
        try {
            var newRecord = context.newRecord;
            var oldRecord = context.oldRecord;
            const newLineCount = newRecord.getLineCount({ sublistId: 'item' });
            
            if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {
                log.debug('new-shipdate', newRecord.getText('shippeddate'))
                if (context.type == context.UserEventType.CREATE || oldRecord.getValue('shippeddate') != newRecord.getValue('shippeddate') || context.type == context.UserEventType.EDIT) {
                    var shippedDate = newRecord.getValue('shippeddate');
                    var shipObj = [];
                    for (var i = 0; i < newLineCount; i++) {
                        if (newRecord.getSublistValue('item', 'binitem', i)) {
                            shipObj.push(newRecord.getSublistValue('item', 'item', i));
                        }
                    }
    
                    log.debug('shipobj', shipObj)
                    var soRec = record.load({
                        type: 'salesorder',
                        id: newRecord.getValue('createdfrom')
                    })
    
                    var soLineCount = soRec.getLineCount('item');
                    for (var i = 0; i < soLineCount; i++) {
                        log.debug('line' + i, shipObj.indexOf(soRec.getSublistValue('item', 'item', i)))
                        if (shipObj.indexOf(soRec.getSublistValue('item', 'item', i)) !== -1) {
                            soRec.setSublistValue('item', 'custcol_actualshipdate', i, shippedDate);
                        }
                    }
                    soRec.save()
                }
            }
        } catch (e) {
            log.debug('error', e.message)
        }
        
    }

    return {
        afterSubmit: afterSubmit
    }
}); 