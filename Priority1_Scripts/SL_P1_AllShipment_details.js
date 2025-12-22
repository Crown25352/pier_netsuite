/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/https', 'N/record', 'N/format/i18n', 'N/file', 'N/runtime', 'N/url'],
    function (N_server, search, https, record, format, file, runtime, url) {

        function onRequest(context) {
            try {
                var objAllShipmentForm = N_server.createForm({
                    title: 'Shipment Details'
                });
                objAllShipmentForm.clientScriptModulePath = './CS_SO_AllShipmentDetails.js';

                // ----------------------- Pickup Details -----------------------------
                var pickupDetailsFieldGroup = objAllShipmentForm.addFieldGroup({
                    id: 'pickupdetailsfieldgroupid',
                    label: 'Pickup Details'
                });

                var pickupCompanyName = objAllShipmentForm.addField({
                    id: 'custpage_companyname',
                    type: N_server.FieldType.TEXT,
                    label: 'Company name',
                    container: 'pickupdetailsfieldgroupid'
                });
                pickupCompanyName.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var pickupAdress1 = objAllShipmentForm.addField({
                    id: 'custpage_addressline1',
                    type: N_server.FieldType.TEXT,
                    label: 'Address Line 1',
                    container: 'pickupdetailsfieldgroupid'
                });
                pickupAdress1.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var pickupAdress2 = objAllShipmentForm.addField({
                    id: 'custpage_addressline2',
                    type: N_server.FieldType.TEXT,
                    label: 'Address Line 2',
                    container: 'pickupdetailsfieldgroupid'
                });
                pickupAdress2.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var pickupCityStateZip = objAllShipmentForm.addField({
                    id: 'custpage_city_state_zip',
                    type: N_server.FieldType.TEXT,
                    label: 'City/state/zip',
                    container: 'pickupdetailsfieldgroupid'
                });
                pickupCityStateZip.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var pickupContactPhone = objAllShipmentForm.addField({
                    id: 'custpage_contact_phone',
                    type: N_server.FieldType.TEXT,
                    label: 'Contact phone',
                    container: 'pickupdetailsfieldgroupid'
                });
                pickupContactPhone.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var quoteid_number = objAllShipmentForm.addField({
                    id: 'custpage_delivery_quoteid',
                    type: N_server.FieldType.TEXT,
                    label: 'Sales order No',
                    container: 'pickupdetailsfieldgroupid'
                });
                quoteid_number.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });

                // var hidden_sales_order = context.request.parameters.shipId;
                // quoteid_number.defaultValue = hidden_sales_order;

                //------------------------------ Destination Details ------------------------------
                var deliveryDetailsFieldGroup = objAllShipmentForm.addFieldGroup({
                    id: 'deliverydetailsfieldgroupid',
                    label: 'Delivery Details'
                });

                var deliveryCompanyName = objAllShipmentForm.addField({
                    id: 'custpage_delivery_companyname',
                    type: N_server.FieldType.TEXT,
                    label: 'Company name',
                    container: 'deliverydetailsfieldgroupid'
                });
                deliveryCompanyName.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var deliveryAdress1 = objAllShipmentForm.addField({
                    id: 'custpage_delivery_addressline1',
                    type: N_server.FieldType.TEXT,
                    label: 'Address Line 1',
                    container: 'deliverydetailsfieldgroupid'
                });
                deliveryAdress1.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var deliveryAdress2 = objAllShipmentForm.addField({
                    id: 'custpage_delivery_addressline2',
                    type: N_server.FieldType.TEXT,
                    label: 'Address Line 2',
                    container: 'deliverydetailsfieldgroupid'
                });
                deliveryAdress2.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var deliveryCityStateZip = objAllShipmentForm.addField({
                    id: 'custpage_delivery_city_state_zip',
                    type: N_server.FieldType.TEXT,
                    label: 'City/state/zip',
                    container: 'deliverydetailsfieldgroupid'
                });
                deliveryCityStateZip.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var deliveryContactPhone = objAllShipmentForm.addField({
                    id: 'custpage_delivery_contact_phone',
                    type: N_server.FieldType.TEXT,
                    label: 'Contact phone',
                    container: 'deliverydetailsfieldgroupid'
                });
                deliveryContactPhone.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                //------------------------------ Schedule Estimated Details ------------------------------
                var scheduleEstimatedFieldGroup = objAllShipmentForm.addFieldGroup({
                    id: 'scheduleestimatedfieldgroupid',
                    label: 'Schedule Estimated Details'
                });

                var pickupDate = objAllShipmentForm.addField({
                    id: 'custpage_pick_date',
                    type: N_server.FieldType.TEXT,
                    label: 'PICKUP DATE',
                    container: 'scheduleestimatedfieldgroupid'
                });
                pickupDate.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var deliveryDate = objAllShipmentForm.addField({
                    id: 'custpage_delivery_date',
                    type: N_server.FieldType.TEXT,
                    label: 'DELIVERY DATE',
                    container: 'scheduleestimatedfieldgroupid'
                });
                deliveryDate.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var pickupStart = objAllShipmentForm.addField({
                    id: 'custpage_pick_start',
                    type: N_server.FieldType.TEXT,
                    label: 'PICKUP START',
                    container: 'scheduleestimatedfieldgroupid'
                });
                pickupStart.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var pickupEnd = objAllShipmentForm.addField({
                    id: 'custpage_pick_end',
                    type: N_server.FieldType.TEXT,
                    label: 'PICKUP END',
                    container: 'scheduleestimatedfieldgroupid'
                });
                pickupEnd.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var deliveryStart = objAllShipmentForm.addField({
                    id: 'custpage_delivery_start',
                    type: N_server.FieldType.TEXT,
                    label: 'DESTINATION START',
                    container: 'scheduleestimatedfieldgroupid'
                });
                deliveryStart.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });
                var deliveryEnd = objAllShipmentForm.addField({
                    id: 'custpage_delivery_end',
                    type: N_server.FieldType.TEXT,
                    label: 'DESTINATION END',
                    container: 'scheduleestimatedfieldgroupid'
                });
                deliveryEnd.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                //------------------------------ Carrier Details ------------------------------
                var scheduleEstimatedFieldGroup = objAllShipmentForm.addFieldGroup({
                    id: 'carrierfieldgroupid',
                    label: 'Carrier Details'
                });

                var carimage = objAllShipmentForm.addField({
                    id: 'custfield_carimg',
                    type: N_server.FieldType.INLINEHTML,
                    label: 'Carrier Logo',
                    container: 'carrierfieldgroupid'
                });
                carimage.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                //------------------------ Sublist of Reference Numbers -------------------
                var objReferenceNumberSublist = objAllShipmentForm.addSublist({
                    id: 'custsublist_referncenumber',
                    type: N_server.SublistType.STATICLIST,
                    label: 'Reference Numbers',
                });

                objReferenceNumberSublist.addField({
                    id: 'custfield_referencetype',
                    type: N_server.FieldType.TEXT,
                    label: 'Reference Type'
                });
                objReferenceNumberSublist.addField({
                    id: 'custfield_referencenumber',
                    type: N_server.FieldType.TEXT,
                    label: 'Reference Number'
                });

                // //----------------------- Sublist of Load ------------------------------
                // var objLoadSublist = objAllShipmentForm.addSublist({
                //     id: 'custsublist_load',
                //     type: N_server.SublistType.STATICLIST,
                //     label: 'Load'
                // });

                // objLoadSublist.addField({
                //     id: 'custfield_units',
                //     type: N_server.FieldType.TEXT,
                //     label: 'UNITS'
                // });
                // objLoadSublist.addField({
                //     id: 'custfield_package',
                //     type: N_server.FieldType.TEXT,
                //     label: 'PACKAGE'
                // });
                // objLoadSublist.addField({
                //     id: 'custfield_weight',
                //     type: N_server.FieldType.TEXT,
                //     label: 'WEIGHT'
                // });
                // objLoadSublist.addField({
                //     id: 'custfield_dimension',
                //     type: N_server.FieldType.TEXT,
                //     label: 'DIMENSIONS'
                // });
                // var load_class_ = objLoadSublist.addField({
                //     id: 'custfield_class',
                //     type: N_server.FieldType.TEXT,
                //     label: 'CLASS'
                // });
                // objLoadSublist.addField({
                //     id: 'custfield_nmfc',
                //     type: N_server.FieldType.TEXT,
                //     label: 'NMFC'
                // });
                // objLoadSublist.addField({
                //     id: 'custfield_description',
                //     type: N_server.FieldType.TEXT,
                //     label: 'DESCRIPTION'
                // });

                //-------------------- Sublist of Charges details ------------------------
                var objChargeSublist = objAllShipmentForm.addSublist({
                    id: 'custsublist_charges',
                    type: N_server.SublistType.STATICLIST,
                    label: 'Charges'
                });

                objChargeSublist.addField({
                    id: 'custfield_charges_code',
                    type: N_server.FieldType.TEXT,
                    label: 'CODE'
                });
                objChargeSublist.addField({
                    id: 'custfield_charges_description',
                    type: N_server.FieldType.TEXT,
                    label: 'DESCRIPTION'
                });
                objChargeSublist.addField({
                    id: 'custfield_charges_amount',
                    type: N_server.FieldType.TEXT,
                    label: 'AMOUNT'
                });

                //---------------------- Sublist of Tracking Detials ----------------------
                var objTrackingSublist = objAllShipmentForm.addSublist({
                    id: 'custsublist_tracking',
                    type: N_server.SublistType.STATICLIST,
                    label: 'Tracking Details'
                });

                objTrackingSublist.addField({
                    id: 'custfield_status_tracking',
                    type: N_server.FieldType.TEXT,
                    label: 'STATUS'
                });

                objTrackingSublist.addField({
                    id: 'custfield_tracking_date',
                    type: N_server.FieldType.DATE,
                    label: 'DATE'
                });

                objTrackingSublist.addField({
                    id: 'custfield_tracking_description',
                    type: N_server.FieldType.TEXT,
                    label: 'DESCRIPTION'
                });

                objTrackingSublist.addField({
                    id: 'custfield_tracking_address',
                    type: N_server.FieldType.TEXT,
                    label: 'CURRENT LOCATION'
                });
                //---------------------- Sublist of Documents Details -----------------------
                var objDocumentSublist = objAllShipmentForm.addSublist({
                    id: 'custsublist_document',
                    type: N_server.SublistType.STATICLIST,
                    label: 'Documents'
                });

                objDocumentSublist.addField({
                    id: 'custfield_type',
                    type: N_server.FieldType.TEXT,
                    label: 'TYPE'
                });
                objDocumentSublist.addField({
                    id: 'custfield_source',
                    type: N_server.FieldType.TEXT,
                    label: 'SOURCE'
                });
                objDocumentSublist.addField({
                    id: 'custfield_action',
                    type: N_server.FieldType.URL,
                    label: 'ACTION'
                });

                //-------------------- Setting Value for Shipment Detials --------------------------

                var shipmentRec_id = context.request.parameters.shipment_id;
                log.debug('shipmentRec_id', shipmentRec_id);

                var shipment_record;
                shipmentRec_id ? shipment_record = record.load({
                    type: 'customrecord_p1_shipment_details',
                    id: shipmentRec_id,
                    // isDynamic: true
                }) : shipment_record = '';

                //-------------- PickUp details -------------------------
                (shipment_record.getValue({ fieldId: 'custrecord_company_name' })) ? pickupCompanyName.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_company_name' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_address_line_1' })) ? pickupAdress1.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_address_line_1' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_address_line_2' })) ? pickupAdress2.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_address_line_2' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_city_state_zip' })) ? pickupCityStateZip.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_city_state_zip' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_contact_phone' })) ? pickupContactPhone.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_contact_phone' }) : '';

                //-------------- Destination details -------------------------
                (shipment_record.getValue({ fieldId: 'custrecord_delivery_company_name' })) ? deliveryCompanyName.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_delivery_company_name' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_delivery_address_line_1' })) ? deliveryAdress1.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_delivery_address_line_1' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_delivery_address_line_2' })) ? deliveryAdress2.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_delivery_address_line_2' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_delivery_city_state_zip' })) ? deliveryCityStateZip.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_delivery_city_state_zip' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_delivery_contact_phone' })) ? deliveryContactPhone.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_delivery_contact_phone' }) : '';

                //-------------- Schedule Estimated  details -------------------------
                (shipment_record.getValue({ fieldId: 'custrecord_shipment_pick_date' })) ? pickupDate.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_shipment_pick_date' }) : pickupDate.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });
                (shipment_record.getValue({ fieldId: 'custrecord_shipment_pick_start' })) ? pickupStart.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_shipment_pick_start' }) : pickupStart.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });
                (shipment_record.getValue({ fieldId: 'custrecord_shipment_pick_end' })) ? pickupEnd.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_shipment_pick_end' }) : pickupEnd.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });
                (shipment_record.getValue({ fieldId: 'custrecord_p1_ps_details' })) ? deliveryDate.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_p1_ps_details' }) : deliveryDate.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });
                (shipment_record.getValue({ fieldId: 'custrecord_shipment_destination_start' })) ? deliveryStart.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_shipment_destination_start' }) : deliveryStart.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });
                (shipment_record.getValue({ fieldId: 'custrecord_shipment_destination_end' })) ? deliveryEnd.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_shipment_destination_end' }) : deliveryEnd.updateDisplayType({
                    displayType: N_server.FieldDisplayType.HIDDEN
                });

                //-------------- Carrier Details -------------------------------------
                var carrierImage_code, shipment_status;
                shipment_status = shipment_record.getValue({ fieldId: 'custrecord_p1_statuses' }) ? shipment_record.getValue({ fieldId: 'custrecord_p1_statuses' }) : '';
                (shipment_record.getValue({ fieldId: 'custrecord_p1_carrier_code_all_sh' })) ? carrierImage_code = shipment_record.getValue({ fieldId: 'custrecord_p1_carrier_code_all_sh' }) : '';

                var folder_id = '';
                var folderSearchObj = search.create({
                    type: "folder",
                    filters:
                        [
                            ["name", "is", "Carrier_Priority1"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                });
                var searchResultCount = folderSearchObj.runPaged().count;
                log.debug("folderSearchObj result count", searchResultCount);
                folderSearchObj.run().each(function (result) {
                    folder_id = result.getValue({ name: "internalid", label: "Internal ID" });
                    return true;
                });
                log.debug('folder_id', folder_id);

                var fileSearchObj = search.create({
                    type: "file",
                    filters: [
                        ["name", "haskeywords", carrierImage_code],
                        "AND",
                        ["folder", "anyof", folder_id]
                    ],
                    columns: [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "folder",
                            label: "Folder"
                        }),
                        search.createColumn({
                            name: "documentsize",
                            label: "Size (KB)"
                        }),
                        search.createColumn({
                            name: "url",
                            label: "URL"
                        }),
                    ]
                });
                var fileID, fileName, fileObj;

                var searchResultCount = fileSearchObj.runPaged().count;
                fileSearchObj.run().each(function (result) {
                    fileID = result.getValue({
                        name: 'internalid'
                    });
                    fileName = result.getValue({
                        name: 'name'
                    });
                    return true;
                });

                var NoImg_code;
                var fileSearchObj = search.create({
                    type: "file",
                    filters:
                        [
                            ["name", "contains", "No image"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "name",
                                sort: search.Sort.ASC,
                                label: "Name"
                            }),
                            search.createColumn({ name: "url", label: "URL" }),
                            search.createColumn({ name: "filetype", label: "Type" })
                        ]
                });
                var searchResultCount = fileSearchObj.runPaged().count;
                fileSearchObj.run().each(function (result) {
                    NoImg_code = result.getValue({ name: 'url' });
                    return true;
                });

                var accID = runtime.accountId;
                accID = accID.toLowerCase();

                var comDomain = url.resolveDomain({
                    hostType: url.HostType.APPLICATION,
                    accountId: accID
                });

                var Noimg = "https://" + comDomain + NoImg_code;

                fileName ? fileObj = file.load({
                    id: './Carrier_Priority1/' + fileName
                }).url : '';

                log.debug('fileObj', fileObj);
                log.debug('Noimg', Noimg);

                var img_url = fileName ? fileObj : Noimg;
                var img_html = `<!DOCTYPE html>
                    <html>
                    <body>
                    <p style='font-size: 12px; font-weight: normal !important; color: #6f6f6f !important; text-transform: uppercase;'>CARRIER LOGO<p>
                    <img src="${img_url}" alt="carrier logo" width="120" height="120">
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
                    <script>
                    $(document).ready(function(){
                        // $( ".uir-record-type" ).hide();
                        $( ".uir-page-title-firstline" ).append( "<span style='margin-left: 15px; font-size: 22px; text-shadow: 4px 1px 4px rgba(181, 143, 38, 0.66); font-weight: bold; color: #2F2E17; line-height: 33px; vertical-align: top; margin-bottom: 4px; '><b style=''>${shipment_status}</b></span>" );
                        $( ".text" ).css({"color": "#4d5f79", "font-size": "18px", "font-weight": "bold", "line-height": "33px", "vertical-align": "bottom", "margin-top": "15px"});
                    });
                    </script>
                    </body>
                    </html>`;
                carimage.defaultValue = img_html;

                //-------------- Load Details -------------------------------------
                var quoteRec, item_object;
                (shipment_record.getValue({ fieldId: 'custrecord_p1_quote_rec_id' })) ? quoteRec = record.load({
                    type: 'customrecord_p1_priority_quote',
                    id: (shipment_record.getValue({ fieldId: 'custrecord_p1_quote_rec_id' })),
                    // isDynamic: true
                }) : quoteRec = '';

                quoteRec ? item_object = quoteRec.getValue('custrecord_p1_item_object') : item_object = '';

                // ---------------------- Stand-alone items Item Sublist ------------------------------------
                log.debug('item_object 852', item_object);
                item_object = JSON.parse(item_object);

                var load_tab = objAllShipmentForm.addTab({
                    id: 'custpage_load',
                    label: 'Load Details'
                });
                var tab1 = objAllShipmentForm.addTab({
                    id: 'tab1id',
                    label: 'Payment'
                });
                tab1.helpText = 'Shipment Item Details';
                objAllShipmentForm.addSubtab({
                    id: 'subtab1id',
                    label: 'Stand-alone Items',
                    tab: 'tab1id'
                });

                var stand_alone_hazmat_arr = [];
                if (item_object.items) {
                    var itemLiablitySub = objAllShipmentForm.addSublist({
                        id: 'carrier_info',
                        type: N_server.SublistType.LIST,
                        label: 'Stand-alone Items',
                        tab: 'subtab1id'
                    });
                    itemLiablitySub.addField({
                        id: 'item_no_id',
                        type: N_server.FieldType.TEXT,
                        label: 'Sr. No.'
                    });
                    var handling = itemLiablitySub.addField({
                        id: 'carrier_box',
                        type: N_server.FieldType.TEXT,
                        label: 'HANDLING UNIT'
                    });
                    handling.updateDisplayType({
                        displayType: N_server.FieldDisplayType.INLINE
                    });
                    itemLiablitySub.addField({
                        id: 'carrier_class',
                        type: N_server.FieldType.TEXT,
                        label: 'CLASS'
                    });
                    itemLiablitySub.addField({
                        id: 'carriert_piece',
                        type: N_server.FieldType.TEXT,
                        label: 'Piece(S)'
                    });
                    itemLiablitySub.addField({
                        id: 'carrier_dimension',
                        type: N_server.FieldType.TEXT,
                        label: 'Dimensions'
                    });
                    itemLiablitySub.addField({
                        id: 'carrier_weight',
                        type: N_server.FieldType.TEXT,
                        label: 'Weight'
                    });

                    itemLiablitySub.addField({
                        id: 'carrier_nmfc',
                        type: N_server.FieldType.TEXT,
                        label: 'NMFC CODE'
                    });
                    itemLiablitySub.addField({
                        id: 'carrier_description',
                        type: N_server.FieldType.TEXT,
                        label: 'DESCRIPTION'
                    });
                    var hazValue = itemLiablitySub.addField({
                        id: 'carrier_hazmat',
                        type: N_server.FieldType.CHECKBOX,
                        label: 'hazmat check'
                    });
                    hazValue.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    // ---------------------- Set Stan-alone item sublist --------------
                    if (item_object.items.length > 0)
                        for (v = 0; v < item_object.items.length; v++) {

                            var itmNo_obj = String(v + 1);
                            itemLiablitySub.setSublistValue({
                                id: 'item_no_id',
                                line: v,
                                value: itmNo_obj
                            });

                            itemLiablitySub.setSublistValue({
                                id: 'carrier_box',
                                line: v,
                                value: item_object.items[v].packagingType ? item_object.items[v].packagingType : ' '
                            });

                            itemLiablitySub.setSublistValue({
                                id: 'carrier_class',
                                line: v,
                                value: item_object.items[v].freightClass ? item_object.items[v].freightClass : ' '
                            });

                            itemLiablitySub.setSublistValue({
                                id: 'carriert_piece',
                                line: v,
                                value: item_object.items[v].pieces ? item_object.items[v].pieces : ' '
                            });

                            var singleItemLwhUnit = (item_object.items[v].singleLwhUnit) ? (item_object.items[v].singleLwhUnit) : (item_object.items[v].sinLwhUnit);

                            itemLiablitySub.setSublistValue({
                                id: 'carrier_dimension',
                                line: v,
                                value: item_object.items[v].length + ' x ' + item_object.items[v].width + ' x ' + item_object.items[v].height + ' ' + '(' + singleItemLwhUnit + ')'
                            });

                            var singleItemWeightUnit = (item_object.items[v].totalWeightUnit) ? (item_object.items[v].totalWeightUnit) : '';

                            itemLiablitySub.setSublistValue({
                                id: 'carrier_weight',
                                line: v,
                                value: item_object.items[v].totalWeight + ' ' + singleItemWeightUnit
                            });

                            var set_nmfc = ''
                            if (item_object.items[v].nmfcItemCode) {
                                set_nmfc = item_object.items[v].nmfcItemCode;
                                if (item_object.items[v].nmfcSubCode) {
                                    set_nmfc += '-' + item_object.items[v].nmfcSubCode;
                                }
                            }

                            itemLiablitySub.setSublistValue({
                                id: 'carrier_nmfc',
                                line: v,
                                value: set_nmfc ? set_nmfc : ' '
                            });

                            itemLiablitySub.setSublistValue({
                                id: 'carrier_description',
                                line: v,
                                value: item_object.items[v].description ? item_object.items[v].description : ' '
                            });

                            itemLiablitySub.setSublistValue({
                                id: 'carrier_hazmat',
                                line: v,
                                // value: hazboxObj
                                value: (item_object.items[v].isHazardous) ? 'T' : 'F'
                            });
                            if (item_object.items[v].isHazardous)
                                stand_alone_hazmat_arr.push(v + 1);

                        }
                }

                // --------------------- Creating Enhanced Item Sublist --------------------
                var enhancedLength;
                (item_object.enhancedHandlingUnits) ? enhancedLength = (item_object.enhancedHandlingUnits.length) : '';
                if (enhancedLength > 0) {

                    objAllShipmentForm.addSubtab({
                        id: 'subtab2id',
                        label: 'Package Items',
                        tab: 'tab1id'
                    });
                    var enhanceItemLiablitySub = objAllShipmentForm.addSublist({
                        id: 'carrier_enhance_info',
                        type: N_server.SublistType.LIST,
                        label: 'Package',
                        tab: 'subtab2id'
                    });

                    enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_type',
                        type: N_server.FieldType.TEXT,
                        label: 'Item Type'
                    });

                    var hazField = enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_hazmat',
                        type: N_server.FieldType.CHECKBOX,
                        label: 'Hazmat'
                    });
                    hazField.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    var enhancehandling = enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_box',
                        type: N_server.FieldType.TEXT,
                        label: 'HANDLING UNIT'
                    });
                    enhancehandling.updateDisplayType({
                        displayType: N_server.FieldDisplayType.INLINE
                    });
                    enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_class',
                        type: N_server.FieldType.TEXT,
                        label: 'CLASS'
                    });
                    enhanceItemLiablitySub.addField({
                        id: 'carriert_enhance_piece',
                        type: N_server.FieldType.TEXT,
                        label: 'Piece(S)'
                    });
                    enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_dimension',
                        type: N_server.FieldType.TEXT,
                        label: 'Dimensions'
                    });
                    enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_weight',
                        type: N_server.FieldType.TEXT,
                        label: 'Weight'
                    });

                    enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_nmfc',
                        type: N_server.FieldType.TEXT,
                        label: 'NMFC CODE'
                    });
                    enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_description',
                        type: N_server.FieldType.TEXT,
                        label: 'DESCRIPTION'
                    });
                    var enhanceHazValue = enhanceItemLiablitySub.addField({
                        id: 'carrier_enhance_hazmat_check',
                        type: N_server.FieldType.TEXT,
                        label: 'hazmat check'
                    });
                    enhanceHazValue.updateDisplayType({
                        displayType: N_server.FieldDisplayType.HIDDEN
                    });

                    // ----------------- Data set for enhanced package item ----------------
                    var enhance_hazmat_flag = false;
                    if (item_object.enhancedHandlingUnits) {
                        log.debug('item_object.enhancedHandlingUnits', item_object.enhancedHandlingUnits);

                        var s, k, h, b = 0;
                        for (s = 0; s < item_object.enhancedHandlingUnits.length; s++) {
                            if (s != 0) {
                                k = b + 1;
                            } else {
                                k = s + b;
                            }

                            enhanceItemLiablitySub.setSublistValue({
                                id: 'carrier_enhance_box',
                                line: k,
                                value: item_object.enhancedHandlingUnits[s].handlingUnitType
                            });
                            enhanceItemLiablitySub.setSublistValue({
                                id: 'carrier_enhance_type',
                                line: k,
                                value: 'Parent ' + (s + 1)
                            });

                            enhanceItemLiablitySub.setSublistValue({
                                id: 'carrier_enhance_description',
                                line: k,
                                value: item_object.enhancedHandlingUnits[s].description
                            });

                            var parsedPack = item_object.enhancedHandlingUnits[s].packages;
                            log.debug('parsedPack packages', parsedPack);

                            for (h = 0; h < parsedPack.length; h++) {
                                var packLine = h + k + 1;

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_box',
                                    line: packLine,
                                    value: parsedPack[h].packagingType
                                });

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_type',
                                    line: packLine,
                                    value: 'Package ' + (h + 1)
                                });

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carriert_enhance_piece',
                                    line: packLine,
                                    value: parsedPack[h].pieces
                                });

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_class',
                                    line: packLine,
                                    value: parsedPack[h].packageFreightClass
                                });

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_dimension',
                                    line: packLine,
                                    value: parsedPack[h].packageLength + ' x ' + parsedPack[h].packageWidth + ' x ' + parsedPack[h].packageHeight + ' ' + '(' + parsedPack[h].packageLwhunit + ')'
                                });

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_weight',
                                    line: packLine,
                                    value: parsedPack[h].weightPerPackage + ' ' + parsedPack[h].weightUnitPackage
                                });

                                var en_nmfc;
                                ((parsedPack[h].packageNmfcItemCode) && (parsedPack[h].packageNmfcSubCode)) ? en_nmfc = ((parsedPack[h].packageNmfcItemCode) + '-' + (parsedPack[h].packageNmfcSubCode)) : (parsedPack[h].packageNmfcItemCode) ? en_nmfc = (parsedPack[h].packageNmfcItemCode) : en_nmfc = ' ';

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_nmfc',
                                    line: packLine,
                                    value: en_nmfc
                                });
                                // }

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_description',
                                    line: packLine,
                                    value: parsedPack[h].packageDesc
                                });

                                enhanceItemLiablitySub.setSublistValue({
                                    id: 'carrier_enhance_hazmat',
                                    line: packLine,
                                    value: (parsedPack[h].packageIsHazardous) ? 'T' : 'F'
                                });

                                if (parsedPack[h].packageIsHazardous)
                                    enhance_hazmat_flag = true;

                                b = packLine
                            }
                        }
                    }
                }

                // -------------------- Creating Emergency Contact Sublist ----------------------
                if ((stand_alone_hazmat_arr.length > 0) || enhance_hazmat_flag == true) {
                    var emergency_contact_sublist = objAllShipmentForm.addFieldGroup({
                        id: 'emergency_contact_info',
                        label: 'EMERGENCY CONTACT INFORMATION'
                    });
                    var emergency_contact = objAllShipmentForm.addField({
                        id: 'custpage_emergencycontact',
                        type: N_server.FieldType.TEXT,
                        label: 'EMERGENCY CONTACT',
                        container: 'emergency_contact_info'
                    });
                    emergency_contact.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    (shipment_record.getValue({ fieldId: 'custrecord_p1_emrgcy_cont_name' })) ? emergency_contact.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_p1_emrgcy_cont_name' }) : '';

                    var emergency_no = objAllShipmentForm.addField({
                        id: 'custpage_emergencyno',
                        type: N_server.FieldType.TEXT,
                        label: 'EMERGENCY PHONE NUMBER',
                        container: 'emergency_contact_info'
                    });
                    emergency_no.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    (shipment_record.getValue({ fieldId: 'custrecord_p1_emrgcy_cont_no' })) ? emergency_no.defaultValue = shipment_record.getValue({ fieldId: 'custrecord_p1_emrgcy_cont_no' }) : '';

                }

                //-------------------------- Charges Sublist -----------------------------
                var quote_resp;
                quoteRec ? quote_resp = quoteRec.getValue('custrecord_response_data') : quote_resp = '';

                quote_resp = JSON.parse(quote_resp);
                var carrier_rate_arr = quote_resp.rateQuotes;

                var carQuoteNumber, selected_quote;
                (shipment_record.getValue({ fieldId: 'custrecord_p1_carrier_quote_no' })) ? selected_quote = shipment_record.getValue({ fieldId: 'custrecord_p1_carrier_quote_no' }) : '';
                log.debug('selected_quote', selected_quote);
                var selected_carr_index = carrier_rate_arr.findIndex(p => p.id == selected_quote);
                log.debug('selected_carr_index', selected_carr_index);
                var charges_obj = carrier_rate_arr[selected_carr_index].rateQuoteDetail;
                var total_charge = charges_obj.total;
                var charges_val = charges_obj.charges;
                log.debug('charges_val', charges_val);

                for (var c = 0; c < charges_val.length; c++) {
                    var current_element = charges_val[c];
                    objChargeSublist.setSublistValue({
                        id: 'custfield_charges_code',
                        line: c,
                        value: current_element.code ? current_element.code : null
                    });
                    objChargeSublist.setSublistValue({
                        id: 'custfield_charges_description',
                        line: c,
                        value: current_element.description ? current_element.description : ' '
                    });
                    var myFormat_ChargesAmount = format.getCurrencyFormatter({
                        currency: "USD"
                    });
                    var newCur_ChargesAmount = current_element.amount ? myFormat_ChargesAmount.format({
                        number: current_element.amount
                    }) : ' ';
                    objChargeSublist.setSublistValue({
                        id: 'custfield_charges_amount',
                        line: c,
                        value: newCur_ChargesAmount
                    });
                }
                objChargeSublist.setSublistValue({
                    id: 'custfield_charges_code',
                    line: c,
                    value: ' '
                });
                objChargeSublist.setSublistValue({
                    id: 'custfield_charges_description',
                    line: c,
                    value: 'Total'
                });
                var myFormat_ChargesAmount_total = format.getCurrencyFormatter({
                    currency: "USD"
                });
                var newCur_ChargesAmount_total = total_charge ? myFormat_ChargesAmount_total.format({
                    number: total_charge
                }) : ' ';
                objChargeSublist.setSublistValue({
                    id: 'custfield_charges_amount',
                    line: c,
                    value: newCur_ChargesAmount_total
                });

                // --------------- Adding values in Reference Sublist --------------------
                var shipment_response = JSON.parse(shipment_record.getValue({ fieldId: 'custrecord_ship_response_data' }));
                var shipment_refrence = shipment_record.getValue({ fieldId: 'custrecord_p1_ship_identifiers' }) ? JSON.parse(shipment_record.getValue({ fieldId: 'custrecord_p1_ship_identifiers' })) : '';

                var shipLength = shipment_refrence ? shipment_refrence.length : shipment_response.shipmentIdentifiers.length;
                // log.debug('shipment_refrence.length || shipment_response.shipmentIdentifiers.length', shipment_refrence.length + ' || ' + shipment_response.shipmentIdentifiers.length);
                // log.debug('shipLength', shipLength);

                if (shipLength > 0)
                    for (let r = 0; r < shipLength; r++) {
                        var current_identifier = shipment_refrence[r] ? shipment_refrence[r] : shipment_response.shipmentIdentifiers[r];
                        log.debug('current_identifier', current_identifier);

                        objReferenceNumberSublist.setSublistValue({
                            id: 'custfield_referencetype',
                            line: r,
                            value: current_identifier.type
                        });
                        objReferenceNumberSublist.setSublistValue({
                            id: 'custfield_referencenumber',
                            line: r,
                            value: current_identifier.value
                        });
                    }

                // ------------------- Updating Tracking Details Sublist ---------------------
                // log.debug('tracking_details');
                var tracking_details = (shipment_record.getValue({ fieldId: 'custrecord_p1_track_status' })) ? JSON.parse(shipment_record.getValue({ fieldId: 'custrecord_p1_track_status' })) : [];
                // log.debug('tracking_details', tracking_details);

                if (tracking_details.length > 0)
                    for (var t = 0; t < tracking_details.length; t++) {
                        var current_element = tracking_details[t];
                        // log.debug('current_element', current_element + ' || ' + current_element.status + ' || ' + current_element.timeStamp);
                        objTrackingSublist.setSublistValue({
                            id: 'custfield_status_tracking',
                            line: t,
                            value: current_element.status ? current_element.status : ' '
                        });
                        var crr_date = new Date((current_element.timeStamp).toString());
                        // log.debug('crr_date', crr_date + ' || ' + crr_date.getDate() + '/' + (crr_date.getMonth() + 1) + '/' + crr_date.getFullYear());
                        objTrackingSublist.setSublistValue({
                            id: 'custfield_tracking_date',
                            line: t,
                            value: (crr_date.getMonth() + 1) + '/' + crr_date.getDate() + '/' + crr_date.getFullYear()
                        });

                        objTrackingSublist.setSublistValue({
                            id: 'custfield_tracking_description',
                            line: t,
                            value: current_element.statusReason ? current_element.statusReason : ' '
                        });

                        var add_Line1 = (current_element.addressLineOne != null) ? current_element.addressLineOne + ', ' : ' ';
                        var city = (current_element.city != null) ? current_element.city + ', ' : ' ';
                        var state = (current_element.state != null) ? current_element.state + ', ' : ' ';
                        var postalCode = (current_element.postalCode != null) ? current_element.postalCode : ' ';
                        var tracking_address = add_Line1 + city + state + postalCode;

                        // var tracking_address = current_element.addressLineOne + ', ' + current_element.city + ', ' + current_element.state + ', ' + current_element.postalCode;
                        objTrackingSublist.setSublistValue({
                            id: 'custfield_tracking_address',
                            line: t,
                            value: tracking_address ? tracking_address : ' '
                        });
                    }

                // -------------- Updating shipment documents ------------------
                var count = 0;
                if (shipment_response.capacityProviderBolUrl) {
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_action',
                        line: count,
                        value: shipment_response.capacityProviderBolUrl
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_type',
                        line: count,
                        value: "BillOfLading"
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_source',
                        line: count,
                        value: "Priority1"
                    });
                    count++;
                }

                if (shipment_response.capacityProviderPalletLabelUrl) {
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_action',
                        line: count,
                        value: shipment_response.capacityProviderPalletLabelUrl
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_type',
                        line: count,
                        value: "PalletLabel"
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_source',
                        line: count,
                        value: "Priority1"
                    });
                    count++
                }

                if (shipment_response.capacityProviderPalletLabelExtendedUrl) {
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_action',
                        line: count,
                        value: shipment_response.capacityProviderPalletLabelExtendedUrl
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_type',
                        line: count,
                        value: "PalletLabelExtended"
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_source',
                        line: count,
                        value: "Priority1"
                    });
                    count++
                }

                if (shipment_response.allLabelsUrl) {
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_action',
                        line: count,
                        value: shipment_response.allLabelsUrl
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_type',
                        line: count,
                        value: "AllLabelsUrl"
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_source',
                        line: count,
                        value: "Priority1"
                    });
                    count++
                }

                if (shipment_response.individualLabelUrls) {
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_action',
                        line: count,
                        value: shipment_response.individualLabelUrls
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_type',
                        line: count,
                        value: "IndividualLabelUrls"
                    });
                    objDocumentSublist.setSublistValue({
                        id: 'custfield_source',
                        line: count,
                        value: "Priority1"
                    });
                }
                // -------------- Adding Status Button -----------------
                var bol_value = shipment_record.getValue({ fieldId: 'custrecord_bol_number' });
                objAllShipmentForm.addButton({
                    id: 'statusbuttonid',
                    label: 'Status',
                    functionName: 'fetchStatus(' + bol_value + ',' + shipmentRec_id + ')'
                });

                context.response.writePage({
                    pageObject: objAllShipmentForm
                });
            } catch (error) {
                errorMessage = error.message;
                log.debug('Error in GET API function', error);
                var html;
                var type_obj = getType(errorMessage);
                log.debug('type_obj', type_obj);
                if (type_obj == 'object') {
                    html = `
                <!DOCTYPE html><html>
                <head>    
                    <link href=”https://system.netsuite.com/core/media/media.nl?id=1234&_xt=.css” rel=”stylesheet” media=”print” /> 
                    <style>
                    pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; font-size: 20px;}
                    .string { color: green; }
                    .number { color: darkorange; }
                    .boolean { color: blue; }
                    .null { color: magenta; }
                    .key { color: red; }
                    </style>
                </head>
                    <body>
                    <script>
                    function output(inp) {
                        document.body.appendChild(document.createElement('pre')).innerHTML = inp;
                    }
                    function syntaxHighlight(json) {
                        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                            var cls = 'number';
                            if (/^"/.test(match)) {
                                if (/:$/.test(match)) {
                                    cls = 'key';
                                } else {
                                    cls = 'string';
                                }
                            } else if (/true|false/.test(match)) {
                                cls = 'boolean';
                            } else if (/null/.test(match)) {
                                cls = 'null';
                            }
                            return '<span class="' + cls + '">' + match + '</span>';
                        });
                    }

                    var obj = ${errorMessage};
                    var str = JSON.stringify(obj, undefined, 4);
                    output(syntaxHighlight(str));
                    </script>
                    </body>
                        </html>`;
                }
                else {
                    html = `<!DOCTYPE html>
                        <html>
                        <body>    
                        <h1>Error</h1>    
                        <p><span style="color:red;font-weight:bold">${errorMessage}</span><span style="color:darkolivegreen;font-weight:bold"></span></p>    
                        </body>
                        </html>`;
                }
                function getType(p) {
                    // if (Array.isArray(p)) return 'array';
                    if (typeof p == 'string') return 'string';
                    else if (p != null && typeof p == 'object') return 'object';
                    else return 'other';
                }
                context.response.write(html);
            }

        }


        return {
            onRequest: onRequest

        };
    });