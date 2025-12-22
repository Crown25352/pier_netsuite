/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/format', 'N/cache', 'N/url', 'N/search'],
    function (N_server, record, format, cache, url, search) {
        function onRequest(context) {
            try {
                /***Create a Carrier severice info page***/
                // var carrierServiceInfo = N_server.createForm({
                //     title: ' ',
                //     hideNavBar: true
                // });
                var carriercode = context.request.parameters.carID;
                var cust_rec_id = context.request.parameters.cust_rec_id;
                var palletFieldLookUp = search.lookupFields({
                    type: 'customrecord_p1_priority_quote',
                    id: cust_rec_id,
                    columns: ['custrecord_response_data',]
                });

                /***Parse and set field value using Cache***/
                var response_obj = JSON.parse(palletFieldLookUp.custrecord_response_data);
                var quotes_arr = response_obj.rateQuotes;
                log.debug('carriercode', carriercode);
                log.debug('cust_rec_id', cust_rec_id);

                var index = quotes_arr.findIndex(p => p.id == carriercode);
                var charge_arr = quotes_arr[index].rateQuoteDetail.charges;

                var charge_table = `<!DOCTYPE html>
                    <style>
                        table {
                            font-family: arial, sans-serif;
                            border-collapse: collapse;
                            width: 100%;
                        }
                        td,
                        th {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        tr:nth-child(even) {
                            background-color: #dddddd;
                        }
                    </style>
                <body>
                    <h2>Charges</h2>
                    <table>
                        <tr>
                            <th><b>CODE</b></th>
                            <th><b>DESCRIPTION</b></th>
                            <th><b>AMOUNT</b></th>
                        </tr>`;
                for (var i = 0; i < charge_arr.length; i++) {
                    log.debug('charge_arr[i]', charge_arr[i]);
                    var charge_code = charge_arr[i].code ? charge_arr[i].code : ' ';
                    var carrierDescription = charge_arr[i].description ? charge_arr[i].description : ' ';
                    var carrierTotalAmount = charge_arr[i].amount ? charge_arr[i].amount : ' ';
                    log.debug('carrierDescription || carrierTotalAmount', carrierDescription + ' || ' + carrierTotalAmount);
                    charge_table += `<tr>
                                                <td>${charge_code}</td>
                                                <td>${carrierDescription}</td>
                                                <td>${carrierTotalAmount}</td>
                                            </tr>`;
                }
                charge_table += `</table>
                </body>`
                context.response.write(charge_table);
            } catch (e) {
                log.debug('Error in Carrier Info', e);
            }
        }

        return {
            onRequest: onRequest
        };
    });