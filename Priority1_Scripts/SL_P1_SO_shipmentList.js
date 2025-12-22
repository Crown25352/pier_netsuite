/**
 *@NApiVersion 2.1
 *@NModuleScope Public
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/cache', 'N/format/i18n', 'N/file', 'N/url'],
    function (N_server, record, search, cache, format, file, url) {
        function onRequest(context) {
            if (context.request.method === 'GET') {
                var objFormShipmentList = N_server.createForm({
                    title: 'Shipment List'
                });

                objFormShipmentList.clientScriptModulePath = './CS_shipmentlist.js'; // client script.

                // -------------- body fields --------------
                var pickupDateSearch = objFormShipmentList.addField({
                    id: 'pickupdatesearch',
                    type: N_server.FieldType.DATE,
                    label: 'PICKUP DATE'
                });
                var deliveryDateSearch = objFormShipmentList.addField({
                    id: 'deliverydatesearch',
                    type: N_server.FieldType.DATE,
                    label: 'ESTIMATE DELIVERY'
                });
                var statusSearch = objFormShipmentList.addField({
                    id: 'statussearchs',
                    type: N_server.FieldType.SELECT,
                    label: 'STATUS '
                });
                statusSearch.addSelectOption({
                    value: '',
                    text: ''
                });
                statusSearch.addSelectOption({
                    value: 'Pending',
                    text: 'Pending'
                });
                statusSearch.addSelectOption({
                    value: 'Dispatched',
                    text: 'Dispatched'
                });
                statusSearch.addSelectOption({
                    value: 'In Transit',
                    text: 'In Transit'
                });
                statusSearch.addSelectOption({
                    value: 'Delivered',
                    text: 'Delivered'
                });
                statusSearch.addSelectOption({
                    value: 'Canceled',
                    text: 'Canceled'
                });
                statusSearch.addSelectOption({
                    value: 'Exception',
                    text: 'Exception'
                });

                // --------------- Creating Shipment Sublist -------------
                var objsubShipment = objFormShipmentList.addSublist({
                    id: 'custfield_shipmentlist',
                    type: N_server.SublistType.STATICLIST,
                    label: 'Shipment List'
                });
                objsubShipment.addField({
                    id: 'custfield_view',
                    type: N_server.FieldType.INLINEHTML,
                    label: 'VIEW'
                });
                objsubShipment.addField({
                    id: 'custfield_reference',
                    type: N_server.FieldType.TEXT,
                    label: 'REFERENCE'
                });
                objsubShipment.addField({
                    id: 'custfield_pickupdate',
                    type: N_server.FieldType.TEXT,
                    label: 'PICKUP DATE'
                });
                objsubShipment.addField({
                    id: 'custfield_estdelivery',
                    type: N_server.FieldType.TEXT,
                    label: 'ESTIMATE DELIVERY'
                });
                objsubShipment.addField({
                    id: 'custfield_carrier',
                    type: N_server.FieldType.TEXT,
                    label: 'CARRIER'
                });
                objsubShipment.addField({
                    id: 'custfield_origin',
                    type: N_server.FieldType.TEXT,
                    label: 'ORIGIN'
                });
                objsubShipment.addField({
                    id: 'custfield_destination',
                    type: N_server.FieldType.TEXT,
                    label: 'DESTINATION'
                });
                objsubShipment.addField({
                    id: 'custfield_load',
                    type: N_server.FieldType.INLINEHTML,
                    label: 'LOAD CLASS'
                });
                objsubShipment.addField({
                    id: 'custfield_status',
                    type: N_server.FieldType.TEXT,
                    label: 'STATUS'
                });
                // var filter_arr = [];
                var filter = context.request.parameters.filter_arr;
                filter ? filter = JSON.parse(filter) : [];

                var filter_arr = filter ? filter : [];
                log.debug({
                    title: "filter_arr",
                    details: filter_arr
                });

                // var filter_arr = [
                //     [
                //         "custrecord_p1_statuses",
                //         "is",
                //         "Dispatched"
                //     ],
                //     "AND",
                //     [
                //         "custrecord_p1_ps_details",
                //         "is",
                //         "2/9/2024"
                //     ],
                //     "AND",
                //     [
                //         "custrecord_shipment_pick_date",
                //         "is",
                //         "2/1/2024"
                //     ]
                // ];
                // ----------- Search for shipment details --------------
                var lineNumberIs = 0, i = 0;
                var customrecord_p1_shipment_detailsSearchObj = search.create({
                    type: "customrecord_p1_shipment_details",
                    filters: filter_arr,
                    columns:
                        [
                            search.createColumn({ name: "custrecord_bol_number", label: "BOL Number" }),
                            search.createColumn({ name: "custrecord_p1_carrier", label: "CARRIER" }),
                            search.createColumn({ name: "custrecord_address_line_1", label: "Address Line 1" }),
                            search.createColumn({ name: "custrecord_city_state_zip", label: "City/State/Zip" }),
                            search.createColumn({ name: "custrecord_delivery_address_line_1", label: "Address line 1" }),
                            search.createColumn({ name: "custrecord_delivery_city_state_zip", label: "city/state/zip" }),
                            // search.createColumn({ name: "custrecord_p1_reference", label: "REFERENCE " }),
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "custrecord_p1_ps_details", label: "Estimated Delivery Date" }),
                            search.createColumn({ name: "custrecord_p1_statuses", label: "STATUS" }),
                            search.createColumn({ name: "custrecord_shipment_pick_date", label: "PICKUP DATE" }),
                            search.createColumn({ name: "custrecord_p1_load_classes", label: "Load Classes" }),
                            search.createColumn({ name: "custrecord_p1_total_shipment_load", label: "Total Shipment Load" })
                        ]
                });
                // var searchResultCount = customrecord_p1_shipment_detailsSearchObj.runPaged().count;
                // var searchResultCount = customrecord_priority_log_detailsSearchObj.runPaged().count;
                // log.debug('searchResultCount 169', searchResultCount);
                var searchresult = customrecord_p1_shipment_detailsSearchObj.run();
                var searchresultRange = searchresult.getRange({
                    start: 0,
                    end: 1000
                });
                // log.debug('searchresultRange 175', searchresultRange);
                while (i < searchresultRange.length) {
                    // for (var i = 0; i < searchresultRange.length; i++) {

                    /***start set value of sublist***/
                    var urlAllshipment = url.resolveScript({
                        scriptId: 'customscript_sl_p1_allshipment_details',
                        deploymentId: 'customdeploy_sl_p1_allshipment_details'
                    });
                    var ship_id = searchresultRange[i].getValue({
                        name: "internalid"
                    })

                    urlAllshipment = urlAllshipment + '&shipment_id=' + ship_id;

                    var html = "<!DOCTYPE html>";
                    html += '<html>';
                    html += '<a href="' + urlAllshipment + '" target="_blank">VIEW</a>';
                    html += '</html>'
                    // log.debug('urlAllshipment 224', urlAllshipment);
                    // log.debug('referenceNumber_ 225', referenceNumber_);
                    objsubShipment.setSublistValue({
                        id: 'custfield_view',
                        line: lineNumberIs,
                        value: html
                    });

                    objsubShipment.setSublistValue({
                        id: 'custfield_reference',
                        line: lineNumberIs,
                        value: searchresultRange[i].getValue({
                            name: "custrecord_bol_number"
                        }) ? searchresultRange[i].getValue({
                            name: "custrecord_bol_number"
                        }) : ' '
                    });
                    objsubShipment.setSublistValue({
                        id: 'custfield_pickupdate',
                        line: lineNumberIs,
                        value: searchresultRange[i].getValue({
                            name: "custrecord_shipment_pick_date"
                        }) ? searchresultRange[i].getValue({
                            name: "custrecord_shipment_pick_date"
                        }) : ' '
                    });
                    objsubShipment.setSublistValue({
                        id: 'custfield_estdelivery',
                        line: lineNumberIs,
                        value: searchresultRange[i].getValue({
                            name: "custrecord_p1_ps_details"
                        }) ? searchresultRange[i].getValue({
                            name: "custrecord_p1_ps_details"
                        }) : ' '
                    });
                    objsubShipment.setSublistValue({
                        id: 'custfield_carrier',
                        line: lineNumberIs,
                        value: searchresultRange[i].getValue({
                            name: "custrecord_p1_carrier"
                        }) ? searchresultRange[i].getValue({
                            name: "custrecord_p1_carrier"
                        }) : ' '
                    });
                    var origin_address = (searchresultRange[i].getValue({
                        name: "custrecord_address_line_1"
                    }) && searchresultRange[i].getValue({
                        name: "custrecord_city_state_zip"
                    })) ? (searchresultRange[i].getValue({
                        name: "custrecord_address_line_1"
                    }) + ', ' + searchresultRange[i].getValue({
                        name: "custrecord_city_state_zip"
                    })) : ' ';

                    var destination_address = (searchresultRange[i].getValue({
                        name: "custrecord_delivery_address_line_1"
                    }) && searchresultRange[i].getValue({
                        name: "custrecord_delivery_city_state_zip"
                    })) ? (searchresultRange[i].getValue({
                        name: "custrecord_delivery_address_line_1"
                    }) + ', ' + searchresultRange[i].getValue({
                        name: "custrecord_delivery_city_state_zip"
                    })) : ' ';
                    objsubShipment.setSublistValue({
                        id: 'custfield_origin',
                        line: lineNumberIs,
                        value: origin_address
                    });
                    // log.debug('i 256', i);
                    objsubShipment.setSublistValue({
                        id: 'custfield_destination',
                        line: lineNumberIs,
                        value: destination_address
                    });

                    var class_array = searchresultRange[i].getValue({
                        name: "custrecord_p1_load_classes"
                    }) ? JSON.parse(searchresultRange[i].getValue({
                        name: "custrecord_p1_load_classes"
                    })) : '';
                    var total_load = searchresultRange[i].getValue({
                        name: "custrecord_p1_total_shipment_load"
                    }) ? searchresultRange[i].getValue({
                        name: "custrecord_p1_total_shipment_load"
                    }) : '';
                    var ctml_class = '';
                    // log.debug('class_array.length', class_array);
                    if (class_array.length > 0) {
                        for (var c = 0; c < class_array.length; c++) {
                            log.debug('class_array[c]', class_array[c]);
                            ctml_class += `<p>class ${class_array[c]}</p>`;
                        }
                        ctml_class += `<p><b>${total_load}</b></p>`
                        log.debug('ctml_class', ctml_class);
                        var class_html = `<!DOCTYPE html>
                      <html>
                      ${ctml_class}
                      </html>`;
                        log.debug('class_html', class_html);
                        objsubShipment.setSublistValue({
                            id: 'custfield_load',
                            line: lineNumberIs,
                            value: ctml_class ? class_html : ' '
                        });
                    }

                    objsubShipment.setSublistValue({
                        id: 'custfield_status',
                        line: lineNumberIs,
                        value: searchresultRange[i].getValue({
                            name: "custrecord_p1_statuses"
                        }) ? searchresultRange[i].getValue({
                            name: "custrecord_p1_statuses"
                        }) : ' '
                    });

                    //***End set value of sublist from shipment list***//
                    lineNumberIs++, i++;

                    if (i == 1000) {
                        i = 0;
                        searchresultRange = searchresult.getRange({
                            start: lineNumberIs,
                            end: lineNumberIs + 1000
                        });
                        // log.debug("lineNumberIs : " + lineNumberIs, "NEXT searchresultRange :- " + searchresultRange.length + " || TOTAL searchResultCount :- " + searchResultCount);

                    }
                }
                var objButton = objFormShipmentList.addButton({
                    id: 'buttonid',
                    label: 'Search',
                    functionName: 'searchButton'
                });

                objFormShipmentList.addButton({
                    id: 'resetbutton',
                    label: 'Reset',
                    functionName: 'resetbutton'
                });
                context.response.writePage({
                    pageObject: objFormShipmentList
                });
            }
        }
        return {
            onRequest: onRequest
        };
    });