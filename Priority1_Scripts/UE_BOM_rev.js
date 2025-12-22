/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/
define(['N/record', 'N/format', 'N/log', 'N/search'], function (record, format, log, search) {

    function beforeSubmit(context) {
        try {
            log.debug('start UE script')
            var revRecord = context.newRecord;
            const lineCount = revRecord.getLineCount({ sublistId: 'component'});
            var timestamp = format.parse(new Date(), format.Type.DATETIMETZ);
            var bomRecord = record.load({
                type: 'bom',
                id: revRecord.getValue('billofmaterials')
            });
            if (!bomRecord) return;

            var itemId = bomRecord.getValue('restricttoassemblies');
            if (!itemId) return;
            /**
            * @DESC Set Changed Date on Line item level
            */
            if (context.type == context.UserEventType.EDIT) {
                log.debug('itemid', itemId)
                search.create({
                    type: "salesorder",
                    filters:
                    [
                        ["type","anyof","SalesOrd"], 
                        "AND", 
                        ["mainline","is","F"], 
                        "AND", 
                        ["status","anyof",["SalesOrd:B", "SalesOrd:D"]],
                        "AND", 
                        ["item","is",itemId]
                    ],
                    columns:
                    [
                        search.createColumn({name: "internalid", summary: search.Summary.GROUP})
                    ]
                    }).run().each(function (result) {
                        log.debug('id', result.getValue({ name: 'internalid', summary: search.Summary.GROUP }))
                        // record.submitFields({
                        //     type: record.Type.SALES_ORDER,
                        //     id: result.getValue({ name: 'internalid', summary: search.Summary.GROUP }),
                        //     values: {
                        //         'custbody_nacs_so_commit_date': timestamp
                        //     }
                        // });

                        // var soRec = record.load({
                        //     type: 'salesorder',
                        //     id: result.getValue({ name: 'internalid', summary: search.Summary.GROUP })
                        // })

                        // soRec.setValue('custbody_nacs_so_commit_date', null);
                        // soRec.save();

                        var soRec = record.load({
                            type: 'salesorder',
                            id: result.getValue({ name: 'internalid', summary: search.Summary.GROUP })
                        });

                        var lineCount = soRec.getLineCount('item');
                        for (var i = 0; i < lineCount; i++) {
                            if (soRec.getSublistValue('item', 'item', i) == itemId) {
                                soRec.setSublistValue('item', 'custcol_pt_so_commit_date', i, null)
                            }
                        }
                        soRec.save();
                        return true;
                    });
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