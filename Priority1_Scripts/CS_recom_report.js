/**
 *@NApiVersion 2.1
*@NScriptType ClientScript
*/
define(['N/currentRecord', 'N/search', 'N/https', 'N/ui/message', 'N/record', 'N/url'],
    (currentRecord, search, https, message, record, url) => {
        function pageInit(context) {
            // document.querySelector('#tbl_secondarysubmitter')?.style.display = 'none';
        }
        
        function exportCSV() {
            var currRec = currentRecord.get();
            var lineCnt = currRec.getLineCount('custpage_result_list');
            var headers = {
                sku: 'SKU',
                desc: "Description",
                onHand: "Total on Hand",
                needed: "Total Needed",
                onOrder: "Total on Order",
                tobe: "Amount to be Purchased"
            };

            var itemsFormatted = [];

            for (var i = 0; i < lineCnt; i++) {
                itemsFormatted.push({
                    sku: currRec.getSublistValue('custpage_result_list', 'custpage_item', i),
                    desc: currRec.getSublistValue('custpage_result_list', 'custpage_desc', i),
                    onHand: currRec.getSublistValue('custpage_result_list', 'custpage_on_hand_qty', i),
                    needed: currRec.getSublistValue('custpage_result_list', 'custpage_on_so_qty', i),
                    onOrder: currRec.getSublistValue('custpage_result_list', 'custpage_on_po_qty', i),
                    tobe: currRec.getSublistValue('custpage_result_list', 'custpage_needed', i)
                });
            }

            var fileTitle = 'Purchasing - Recommended Purchase Items'; 
            itemsFormatted.unshift(headers);
            var objArray = JSON.stringify(itemsFormatted);
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var csv = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','
                    line += array[i][index];
                }
                csv += line + '\r\n';
            }

            var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, exportedFilenmae);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", exportedFilenmae);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }

            return csv;
        }
        
        function getLineValue(fieldId, line) {
            return document.querySelector(`[id="custpage_result_listrow_${line}_${fieldId}"]`)?.textContent.trim() || '';
        }
        
        return {
            pageInit: pageInit,
            exportCSV: exportCSV
        };
    }
    );