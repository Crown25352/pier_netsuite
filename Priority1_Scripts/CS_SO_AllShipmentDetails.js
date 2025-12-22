/**
* @NApiVersion 2.x
* @NScriptType ClientScript
* @NModuleScope SameAccount
*/

/*
* Script Author: Chetu India Pvt. Ltd.
* Script Date: Jan 03, 2022
* Script Type: SuiteScript 2.X (Client Script)
* Script Description:
* Last Modified: (Please put a comment below with details of modification)
* Comments:
*/
define(['N/search', 'N/currentRecord', 'N/url', 'N/https', 'N/record'],
    function (search, currentRecord, url, https, record) {

        function UpdateTracking(sales_order_) {
            var objrec = currentRecord.get();
            var suiteleturl = url.resolveScript({
                scriptId: 'customscript_sl_newquotes_allshipment_de',
                deploymentId: 'customdeploy_sl_newquotes_allshipment_de'

            });
            location.reload(suiteleturl);
        }
        function fetchStatus(bolId, ship_id) {
            console.log('bolId' + 'bolId');
            var fieldLookUp = search.lookupFields({
                type: "customrecord_p1_api_configurations",
                id: 1,
                columns: ['custrecord_endpointurl', 'custrecord_xapikey']
            });
            var urlEndPoint = fieldLookUp.custrecord_endpointurl;
            var xApiKey = fieldLookUp.custrecord_xapikey;
            console.log('urlEndPoint || xApiKey' + urlEndPoint + ' || ' + xApiKey);
            console.log('bolId' + bolId);
            var status_req_body = JSON.stringify({
                "identifierType": "BILL_OF_LADING",
                "identifierValue": bolId
            });
            var shipment_response = https.post({
                url: urlEndPoint + '/v2/ltl/shipments/status',
                headers: {
                    "X-API-KEY": xApiKey,
                    "Connection": "keep-alive",
                    "Access-Control-Allow-Origin": "*",
                    "Accept": "*///*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Content-Type": "application/json"
                },
                body: status_req_body
            });
            // console.log('shipment_response' + shipment_response);
            var jsonrequestTracking = JSON.parse(shipment_response.body);
            console.log('jsonrequestTracking' + jsonrequestTracking);

            // console.log('shipment_response' + JSON.stringify(shipment_response.body));
            var identifier_obj = jsonrequestTracking.shipments[0].shipmentIdentifiers;
            var tracking_obj = jsonrequestTracking.shipments[0].trackingStatuses;

            var otherId = record.submitFields({
                type: 'customrecord_p1_shipment_details',
                id: ship_id,
                values: {
                    'custrecord_p1_statuses': jsonrequestTracking.shipments[0] ? jsonrequestTracking.shipments[0].status : '',
                    'custrecord_p1_track_status': JSON.stringify(tracking_obj),
                    'custrecord_p1_ship_identifiers': JSON.stringify(identifier_obj)
                }
            });

            window.location.reload();
        }

        function UpdateDocument(sales_order_) {
            var objrec = currentRecord.get();

            var suiteleturl = url.resolveScript({
                scriptId: 'customscript_sl_newquotes_allshipment_de',
                deploymentId: 'customdeploy_sl_newquotes_allshipment_de'

            });
            location.reload(suiteleturl);
        }

        function pageInit(scriptContext) { }

        return {
            pageInit: pageInit,
            fetchStatus: fetchStatus,
            UpdateTracking: UpdateTracking,
            UpdateDocument: UpdateDocument
        };
    });