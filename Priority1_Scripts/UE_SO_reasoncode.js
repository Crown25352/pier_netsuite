/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/
define(['N/record', 'N/format', 'N/log'], function (record, format, log) {

    function beforeSubmit(context) {
        try {
            var newRecord = context.newRecord;
            var oldRecord = context.oldRecord;
            const newLineCount = newRecord.getLineCount({ sublistId: 'item' });
            
            if (context.type == context.UserEventType.EDIT) {
    
                //Check Late Days
                for (var i = 0; i < newLineCount ; i++) {
                    var commitDate = newRecord.getSublistValue('item', 'custcol_pt_so_commit_date', i);
                    var oldCommitDate = oldRecord.getSublistValue('item', 'custcol_pt_so_commit_date', i);
                    var shipDate = newRecord.getSublistValue('item', 'custcol_actualshipdate', i);
                    var oldShipDate = oldRecord.getSublistValue('item', 'custcol_actualshipdate', i);
    
                    var diffDays = 0;
                    if (!!commitDate && !!shipDate) {
                        if (commitDate != oldCommitDate || shipDate != oldShipDate) {
                            diffDays = (toUtcDateOnly(shipDate) - toUtcDateOnly(commitDate)) / 86400000;
                            if (diffDays < 0) diffDays = 0;
                            newRecord.setSublistValue('item', 'custcol_latedays', i, diffDays)
                        } else if (newRecord.getSublistValue('item', 'custcol_latedays', i)) {
                            diffDays = newRecord.getSublistValue('item', 'custcol_latedays', i);
                        }
                    }
                    log.debug('diffdays', diffDays);

                    var lateBucket = '';
                    switch (diffDays) {
                        case 0:
                            lateBucket = '';
                            break;
                        case 1:
                        case 2:
                           lateBucket = 1;
                            break;
                        case 3:
                        case 4:
                        case 5:
                           lateBucket = 2;
                            break;
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                            lateBucket = 3;
                            break;
                        default:
                            lateBucket = 4;
                    }
                    newRecord.setSublistValue('item', 'custcol_late_days_bucket', i, lateBucket)
                }
            }
            
        } catch (e) {
            log.debug('error', e.message)
        }
        
    }
    
    function toUtcDateOnly(d) {
        return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }

    return {
        beforeSubmit: beforeSubmit
    }
}); 