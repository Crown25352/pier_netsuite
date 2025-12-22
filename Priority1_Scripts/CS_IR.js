/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */
define(['N/log', 'N/search', 'N/record'],
    function(log, search, record) {
        function pageInit(context) {
            try {
                var currRec = context.currentRecord;
                var fromType = currRec.getValue('transform');
                log.debug('fromType', fromType);
                if (fromType == 'purchord') {
                    var totalLines = currRec.getLineCount({
                        sublistId: 'item'
                    });
                    for (var count = 0; count < totalLines; count++) {
                        if (currRec.getSublistValue('item', 'itemtype', count) == 'InvtPart') {
                            var flag = false;
                            search.create({
                                type: 'inventoryitem',
                                filters: [
                                    ['internalid', 'is', currRec.getSublistValue('item', 'item', count)]
                                ],
                                columns: ['custitem_require_inspection']
                            }).run().each(function(result) {
                                log.debug('flag', result.getValue('custitem_require_inspection') == true)
                                if (result.getValue('custitem_require_inspection') == true) {
                                    flag = true;
                                }
                                return true;
                            })
                            if (flag) {
                                alert('Inspection Required Please Put in Inspection Bin')
                                break;
                            }
                        }
                    }
                }
            } catch (e) {
                log.debug('error', e)
            }
            
        }

        return {
            pageInit: pageInit
        };
    });