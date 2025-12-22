/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/
define(['N/record', 'N/format', 'N/log'], function (record, format, log) {

    function beforeSubmit(context) {
        try {
            var newRecord = context.newRecord;
            var oldRecord = context.oldRecord;
            var timestamp = new Date();
            var recordChanged = false;
            const newLineCount = newRecord.getLineCount({ sublistId: 'item' });
            const oldLineCount = oldRecord.getLineCount({ sublistId: 'item' });

            /**
            * @DESC Set Changed Date on Line item level
            */
            if (context.type == context.UserEventType.EDIT) {
                const fields = [
                    'item', 
                    'item_display', 
                    'custcolcustline_material_spec', 
                    'povendor', 
                    'createwo', 
                    'custcol_pt_so_request_date', 
                    'expectedshipdate', 
                    'location', 
                    'quantity', 
                    'porate', 
                    'units', 
                    'price', 
                    'amount', 
                    'isclosed', 
                    'commitinventory', 
                    'istaxable', 
                    'class', 
                    'custcol_ns_acs_itemnumber'];

                    const datetimefield = [
                        'custcol_pt_so_request_date', 
                        'expectedshipdate'
                    ];

                    const commitDateCheckFields = [
                        'quantity',
                        'description'
                    ];

                for (var i = 0; i < newLineCount; i++) {
                    var isNewItem = true;
                    for (var j = 0; j < oldLineCount; j++) {
                        if (oldRecord.getSublistValue('item', 'item', j) == newRecord.getSublistValue('item', 'item', i)) {
                            var lineChanged = fields.some(function(field) {
                                const oldValue = oldRecord.getSublistValue({ sublistId: 'item', fieldId: field, line: j });
                                const newValue = newRecord.getSublistValue({ sublistId: 'item', fieldId: field, line: i });
                                
                                if (datetimefield.indexOf(field) > -1) {
                                    var newDate = new Date(newValue);
                                    var oldDate = new Date(oldValue);
                                    if (newDate.getTime() != oldDate.getTime()) log.debug('changed date' + i, oldValue + ' ' + newValue);
                                    return newDate.getTime() != oldDate.getTime();
                                } else {
                                    if (oldValue != newValue) log.debug('change' + field, oldValue + 'j' + j + ':' + newValue + 'i' + i);
                                    return oldValue != newValue;
                                }
                                
                            });

                            var commitLineChanged = commitDateCheckFields.some(function(field) {
                                const oldValue = oldRecord.getSublistValue({ sublistId: 'item', fieldId: field, line: j });
                                const newValue = newRecord.getSublistValue({ sublistId: 'item', fieldId: field, line: i });
                                
                                if (oldValue != newValue) log.debug('change' + field, oldValue + 'j' + j + ':' + newValue + 'i' + i);
                                return oldValue != newValue;
                            });

                            if (lineChanged) {
                                newRecord.setSublistValue('item', 'custcol9', i, timestamp);
                                recordChanged = true;
                            }

                            log.debug('commitLineChanged', commitLineChanged)
                            if (commitLineChanged) {
                                log.debug('commitLineChanged', commitLineChanged)
                                // newRecord.setSublistValue('item', 'custcol_pt_so_commit_date', i, null);
                                newRecord.setValue('custbody_nacs_so_commit_date', null)
                            }

                            isNewItem = false;
                            break;
                        }
                    }

                    if (isNewItem) {
                        newRecord.setSublistValue('item', 'custcol9', i, timestamp);
                        log.debug('2')
                        recordChanged = true;
                    }
                }

                var isPending = oldRecord.getValue('orderstatus') != 'B' || newRecord.getValue('orderstatus') != 'B';
                if (isPending && recordChanged) newRecord.setValue('custbody5', true);
            }

            if (context.type === context.UserEventType.CREATE) {
                for (var i = 0; i < newLineCount; i++) {
                    newRecord.setSublistValue('item', 'custcol9', i, timestamp);
                }
            }
        }
        catch (e) {
            log.debug('Error in BeforeSubmit', e.message);
        }
    }

    function afterSubmit(context) {
        try {
            var newRecord = context.newRecord;
            var oldRecord = context.oldRecord;
            const newLineCount = newRecord.getLineCount({ sublistId: 'item' });
            const oldLineCount = oldRecord.getLineCount({ sublistId: 'item' });
    
            /**
            * @DESC Set Changed Date on Line item level
            */
            if (context.type == context.UserEventType.EDIT) {
                const commitDateCheckFields = [
                    'quantity',
                    'description'
                ];
    
                for (var i = 0; i < newLineCount; i++) {
                    for (var j = 0; j < oldLineCount; j++) {
                        if (oldRecord.getSublistValue('item', 'item', j) == newRecord.getSublistValue('item', 'item', i)) {
    
                            var commitLineChanged = commitDateCheckFields.some(function(field) {
                                const oldValue = oldRecord.getSublistValue({ sublistId: 'item', fieldId: field, line: j });
                                const newValue = newRecord.getSublistValue({ sublistId: 'item', fieldId: field, line: i });
                                
                                if (oldValue != newValue) log.debug('change' + field, oldValue + 'j' + j + ':' + newValue + 'i' + i);
                                return oldValue != newValue;
                            });
    
                            log.debug('commitLineChanged', commitLineChanged)
                            if (commitLineChanged) {
                                log.debug('commitLineChanged', commitLineChanged)
                                // newRecord.setSublistValue('item', 'custcol_pt_so_commit_date', i, null);
                                newRecord.setValue('custbody_nacs_so_commit_date', null)
                            }
                            break;
                        }
                    }
                }
            } else if (context.type == context.UserEventType.CREATE) {
                var reasonCode = newRecord.getValue('custbody_reasoncode_header')
                if (reasonCode) {
                    for (var i = 0; i < newLineCount; i++) {
                        newRecord.setSublistValue('item', 'custcol_reasoncode_line', i, reasonCode);
                    }
                }
            }
    
            newRecord.save();
        } catch (e) {
            log.debug('error - afterSubmit', e.message)
        }
        
    }

    return {
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
}); 