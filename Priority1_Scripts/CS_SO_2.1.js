/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

/*
 * Script Author:		Tung Pei Liu
 * Script Date:			Oct 27, 2025
 * Script Type:			SuiteScript 2.X (Client Script)
 * Script Description:	
 * Last Modified:		(Please put a comment below with details of modification)
 * Comments:				
 */
define(['N/search', 'N/record', 'N/format', 'N/url', 'N/ui/dialog', 'N/currentRecord'], function (search, record, format, url, dialog, currentRecord) {

    function fieldChanged(context) {
        try {
            var rec = currentRecord.get();
            if (context.fieldId == 'custbody_reasoncode_header') {
                log.debug('in here')
                const reasonCode = rec.getValue('custbody_reasoncode_header');
                const lineCount = rec.getLineCount('item');
                for (let i = 0; i < lineCount; i++) {
                    rec.selectLine('item', i);
                    rec.setCurrentSublistValue('item', 'custcol_reasoncode_line', reasonCode);
                    rec.commitLine('item');
                }
            }
        } catch (e) {
            log.debug('Error in field change ', e.message);
        }

    }

    function lineInit (context) {
        try {
            const rec = currentRecord.get();
            const reasonCode = rec.getValue('custbody_reasoncode_header')
            if (reasonCode) {
                rec.setCurrentSublistValue('item', 'custcol_reasoncode_line', reasonCode);
            }
        } catch (e) {
            log.debug('error: lineinit', e.message)
        }
    }


    return {
        fieldChanged: fieldChanged,
        lineInit: lineInit
    };
});