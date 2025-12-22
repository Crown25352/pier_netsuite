/**
*@NApiVersion 2.1
*@NScriptType UserEventScript
*/
define(['N/record', 'N/search', 'N/log', 'N/format'], function (record, search, log, format) {

    function beforeSubmit(context) {
        try {
            let irRec = context.newRecord;
            const lineCount = irRec.getLineCount({ sublistId: 'item' });

            if (context.type == context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
                for(let i = 0; i < lineCount; i++) {
                    let itemId = irRec.getSublistValue('item', 'item', i);
                    let itemType = irRec.getSublistValue('item', 'itemtype', i);
                    let searchResult = search.lookupFields({
                        type: search.Type.ITEM,
                        id: itemId,
                        columns: ['custitem_require_inspection']
                    });
                    let flag = searchResult.custitem_require_inspection ? searchResult.custitem_require_inspection : false;
                    if (flag) {
                        var itemRec = record.load({
                            type: 'inventoryitem',
                            id: itemId
                        })
                        var trandate = irRec.getValue('trandate');
                        var dueDate = new Date(trandate.getTime());
                        dueDate.setDate(dueDate.getDate() + 2);
                        
                        var recInspection = record.create({
                            type: 'customrecord_inspection_task'
                        });
                        recInspection.setValue('custrecord_cust_insp_sku', itemId);
                        recInspection.setValue('custrecord_insp_part_desc', itemRec.getValue('displayname'));
                        recInspection.setValue('custrecord_bin_loc', irRec.getSublistValue('item', 'location', i));
                        recInspection.setValue('custrecord_qty', irRec.getSublistValue('item', 'quantity', i));
                        recInspection.setValue('custrecord_inspect_date', irRec.getValue('trandate'));
                        recInspection.setValue('custrecord_inspection_due_date', dueDate);
                        recInspection.setValue('custrecord_inspection_createdfrom', irRec.id);
                        recInspection.setValue('custrecord_insp_status', 1);
                        var id = recInspection.save();
                        log.debug('success', id);
                    }
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