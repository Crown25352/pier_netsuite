/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */
define(['N/record', 'N/currentRecord', 'N/search', 'N/log'],
    function(record, currentRecord, search, log) {

        function exportCSV() {
            var currRec = currentRecord.get();
            var lineCnt = currRec.getLineCount('custpage_result_list');
            var headers = {
                itemNum: 'Item #',
                on_hand_qty: "On Hand Qty",
                on_so_qty: "On SO Qty",
                on_po_qty: "On PO Qty",
                sales_3_mo: "Sales 3 Mo Ago",
                sales_last_mo: "Sales Last Month",
                sales_this_mo: "MTD",
                avg_3: "3 MO AVG",
                avg_cost: "Avg Cost",
                last_vendor: "Last Vendor",
                last_po: "Last PO#",
                avg_12: "12 Month Average"
            };

            var itemsFormatted = [];

            for (var i = 0; i < lineCnt; i++) {
                itemsFormatted.push({
                    itemNum: currRec.getSublistValue('custpage_result_list', 'custpage_item', i),
                    on_hand_qty: currRec.getSublistValue('custpage_result_list', 'custpage_on_hand_qty', i),
                    on_so_qty: currRec.getSublistValue('custpage_result_list', 'custpage_on_so_qty', i),
                    on_po_qty: currRec.getSublistValue('custpage_result_list', 'custpage_on_po_qty', i),
                    sales_3_mo: currRec.getSublistValue('custpage_result_list', 'custpage_sales_3_mo', i),
                    sales_last_mo: currRec.getSublistValue('custpage_result_list', 'custpage_sales_last_mo', i),
                    sales_this_mo: currRec.getSublistValue('custpage_result_list', 'custpage_sales_this_mo', i),
                    avg_3: currRec.getSublistValue('custpage_result_list', 'custpage_3_avg', i),
                    avg_cost: currRec.getSublistValue('custpage_result_list', 'custpage_avg_cost', i),
                    last_vendor: currRec.getSublistValue('custpage_result_list', 'custpage_last_vendor', i),
                    last_po: currRec.getSublistValue('custpage_result_list', 'custpage_last_po', i),
                    avg_12: currRec.getSublistValue('custpage_result_list', 'custpage_12_avg', i)
                });
            }

            var fileTitle = 'Item Report'; 
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
        }

        function pageInit() {
            
        }

        return {
            pageInit: pageInit,
            exportCSV: exportCSV
        };
    });