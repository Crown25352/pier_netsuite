/**
* @NApiVersion 2.x
* @NScriptType Suitelet
* @Desc IF Summary Dash
*/

define(['N/https', 'N/record', 'N/render', 'N/search', 'N/compress', 'N/runtime', 'N/url', 'N/file'],
    function callbackFunction(https, record, render, search, compress, runtime, url, file) {
        const GIFT_CERTS = ["Gift Card ($25)", "Gift Card ($50)", "Gift Card ($75)", "Gift Card ($100)", "Gift Card ($150)", "Gift Card ($200)", "Gift Card (Any Amount)"];
        const LOCS = {
            'Baltimore': 1,
            'Neesvigs': 2,
            'CA Bakery': 12,
            'Eastern MD': 14,
            'SLC, Utah': 13,
            'RealCold - West': 18,
        }

        const FULLY_PAID_STATUS = 1;
        const UNDER_PAID_STATUS = 3;
        const MULTI_FORM = 210;
        const SINGLE_FORM = 207;

        function getFunction(context) {
            var contentRequest = https.get({
                url: "https://3951061-sb1.app.netsuite.com/core/media/media.nl?id=795656&c=3951061_SB1&h=fzmQyX0mzHQugj91YycS_ssm9RTUzdliOzvydtsaqa4Mlq8e&_xt=.html"
            }); // production
            // var contentRequest = https.get({
            //     url: "https://3296489-sb1.app.netsuite.com/core/media/media.nl?id=11983&c=3296489_SB1&h=400b62f9f410ceff8028&_xt=.html"
            // }); // sandbox
            var contentDocument = contentRequest.body;
            context.response.write(contentDocument);
        }

        function postFunction(context) {
            try {
                var params = context.request.parameters;
                var getIFRecords = params.getIFRecords;
                var exportPackList = params.exportPackList;

                if (getIFRecords) {
                    var shipdatefrom = params.shipdatefrom;
                    var shipdateto = params.shipdateto;

                    var schId1 = "customsearch_so_srch_if";

                    var searchResults = search.load({
                        id: schId1
                    })
                    
                    if (shipdatefrom) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_nacs_so_exp_ship_date',
                            operator: search.Operator.ONORAFTER,
                            values: [shipdatefrom]
                        }));
                    }

                    if (shipdateto) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_nacs_so_exp_ship_date',
                            operator: search.Operator.ONORBEFORE,
                            values: [shipdateto]
                        }));
                    }
                    var data = [];

                    var resultSet = searchResults.run();

                    var currentRange = resultSet.getRange({
                        start : 0,
                        end : 1000
                    });
                    var i = 0;  // iterator for all search results
                    var j = 0;  // iterator for current result range 0..999

                    while (j < currentRange.length) {
                        var result = currentRange[j];
                        var columns = result.columns;

                        var docNum = result.getValue(columns[0]);
                        var item = result.getText(columns[1]);
                        var itemDes = result.getValue(columns[2]);
                        var expShipDate = result.getValue(columns[3]) ? result.getValue(columns[3]) : ' ';
                        var qty = result.getValue(columns[9]) ? result.getValue(columns[9]) : 0;
                        var availQty = result.getValue(columns[10]) ? result.getValue(columns[10]) : 0;
                        var location = result.getText(columns[5]) ? result.getText(columns[5]) : ' ';
                        var lineId = result.getValue(columns[8]) ? result.getValue(columns[8]) : ' ';
                        
                        data.push({
                            soid: result.id,
                            docNum: docNum,
                            lineId: lineId,
                            item: item,
                            itemDes: itemDes,
                            expShipDate: expShipDate,
                            qty: qty,
                            availQty: availQty,
                            location: location
                        })

                        i++; j++; 
                        if (j == 1000) {   // check if it reaches 1000
                            j = 0;          // reset j an reload the next portion
                            currentRange = resultSet.getRange({
                                start : i,
                                end : i + 1000
                            });
                        }
                    }
                    context.response.write(JSON.stringify(data));
                }

                if (exportPackList) {
                    var soIds = JSON.parse(params.so);
                    var res = context.response;
                    
                    const TEMPLATE_FILE_ID = 795668;
                    var templateContent = file.load({ id: TEMPLATE_FILE_ID }).getContents();
                    var zip = compress.createArchiver({ type: compress.Type.ZIP });

                    var soNumbers = Object.keys(soIds).sort(); // stable order

                    for (var i = 0; i < soNumbers.length; i++) {
                        var soNumber = soNumbers[i];          // e.g. "SO1234"
                        var linesMap = soIds[soNumber];       // e.g. { "23": 2, "24": 1 }

                        // Build lines array (optional convenience)
                        var lineIds = Object.keys(linesMap);
                        var lines = [];
                        for (var j = 0; j < lineIds.length; j++) {
                            var lineId = lineIds[j];

                            lines[lineId] = Number(linesMap[lineId] || 0);
                        }

                        // Call your picking list routine (you said other part is OK)
                        var pdfFile = createPickingList(soNumber, lines, templateContent);
                        pdfFile.name = 'PickingTicket_SO_' + soNumber + '.pdf';
                        zip.add({ file: pdfFile });
                    }

                    // Finalize ZIP file
                    var zipName = 'PickingTickets_' + isoDate() + '.zip';
                    var zipFile = zip.archive({ name: zipName });

                    // Helpful for browser/AJAX filename
                    res.addHeader({
                    name: 'Content-Disposition',
                    value: 'attachment; filename="' + zipName + '"'
                    });

                    // Return ZIP as download
                    res.writeFile(zipFile, true);
                }
            } catch(e) {
                log.error("Error", e);
            }
        }

        function createPickingList(soId, lines, templFile) {
            var renderer = render.create();
            var soRec = record.load({
                type: 'salesorder',
                id: soId
            })
            renderer.addRecord({
                templateName: 'record',
                record: soRec
            });
            log.debug('line', lines)
            renderer.addCustomDataSource({
                format: render.DataSource.OBJECT,
                alias: "pick",
                data: {selectedLineQty: lines}
            });
    
            // stContent = stContent.replace('{{total_weight}}', totalWeight)
            //             .replace('{{gift_msg}}', stGiftMsg)
            //             .replace('{{has_gift_cert}}', hasGiftCert);

            renderer.templateContent = templFile;
            return renderer.renderAsPdf();
        }

        function isoDate() {
            // YYYY-MM-DD
            var d = new Date();
            var yyyy = d.getFullYear();
            var mm = String(d.getMonth() + 1);
            var dd = String(d.getDate());
            if (mm.length < 2) mm = '0' + mm;
            if (dd.length < 2) dd = '0' + dd;
            return yyyy + '-' + mm + '-' + dd;
        }

        function onRequestFxn(context) {
            if (context.request.method === "GET") {
                getFunction(context)
            }
            else {
                postFunction(context)
            }
        }
        return {
            onRequest: onRequestFxn
        };
});