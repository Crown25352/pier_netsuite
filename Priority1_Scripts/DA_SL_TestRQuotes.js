/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/https', 'N/search', 'N/redirect', 'N/url', 'N/record', 'N/cache', 'N/format'],

    function (N_server, https, search, redirect, url, record, cache, format) {

        function onRequest(context) {

            try {
                if (context.request.method === 'GET') {
                    // log.debug('context', context);

                    var priorityRecordId = context.request.parameters.custPriorityRecId;
                    // log.debug('priorityRecordId', priorityRecordId);

                    var objForm = N_server.createForm({
                        title: 'New Quotes'
                    });
                    objForm.clientScriptModulePath = './DA_CS_NewQuotes.js';

                    //code for fieldgroup PICKUP
                    var objFgp = objForm.addFieldGroup({
                        id: 'fieldgroupid',
                        label: 'PICKUP'
                    });
                    var pickupDate = objForm.addField({
                        id: 'custpage_pdate',
                        type: N_server.FieldType.DATE,
                        label: 'PICKUP DATE',
                        container: 'fieldgroupid'
                    });
                    pickupDate.updateLayoutType({
                        layoutType: N_server.FieldLayoutType.STARTROW
                    });

                    var pickupAddress = objForm.addField({
                        id: 'custpage_address',
                        type: N_server.FieldType.SELECT,
                        label: 'Address Book',
                        source: 'customrecord_p1_addresses',
                        container: 'fieldgroupid'
                    });
                    pickupAddress.updateLayoutType({
                        layoutType: N_server.FieldLayoutType.MIDROW
                    });
                    // pickupAddress.updateDisplaySize({
                    //     height: 10,
                    //     width: 16
                    // });

                    var pickzip = objForm.addField({
                        id: 'custpage_zip',
                        type: N_server.FieldType.TEXT,
                        label: 'PICKUP Zip',
                        container: 'fieldgroupid'
                    });
                    pickzip.updateLayoutType({
                        layoutType: N_server.FieldLayoutType.MIDROW
                    });

                    pickzip.isMandatory = true;
                    // pickzip.updateDisplaySize({
                    //     height: 10,
                    //     width: 12
                    // });

                    var countryfield = objForm.addField({
                        id: 'custpage_countryp',
                        type: N_server.FieldType.SELECT,
                        label: 'Country',
                        container: 'fieldgroupid'
                    });

                    countryfield.updateLayoutType({
                        layoutType: N_server.FieldLayoutType.ENDROW
                    });
                    // countryfield.updateDisplaySize({
                    //     height: 60,
                    //     width: 16
                    // });
                    countryfield.addSelectOption({
                        value: 'US',
                        text: 'United States'
                    });
                    countryfield.addSelectOption({
                        value: 'CA',
                        text: 'Canada'
                    });
                    countryfield.addSelectOption({
                        value: 'MX',
                        text: 'Mexico'
                    });
                    countryfield.addSelectOption({
                        value: 'PR',
                        text: 'Puerto Rico'
                    });

                    //Code for fieldgroup DESTINATION
                    var objFgd = objForm.addFieldGroup({
                        id: 'fieldgroupiddest',
                        label: 'DESTINATION'
                    });

                    var destadd = objForm.addField({
                        id: 'custpage_address_dest',
                        type: N_server.FieldType.SELECT,
                        label: 'Address Book',
                        source: 'customrecord_p1_addresses',
                        container: 'fieldgroupiddest'
                    });
                    destadd.updateLayoutType({
                        layoutType: N_server.FieldLayoutType.STARTROW
                    });
                    // destadd.updateDisplaySize({
                    //     height: 10,
                    //     width: 16
                    // });

                    var destzip = objForm.addField({
                        id: 'custpage_zip_dest',
                        type: N_server.FieldType.TEXT,
                        label: 'DESTINATION Zip',
                        container: 'fieldgroupiddest'
                    });
                    destzip.updateLayoutType({
                        layoutType: N_server.FieldLayoutType.MIDROW
                    });

                    destzip.isMandatory = true;
                    // destzip.updateDisplaySize({
                    //     height: 10,
                    //     width: 12
                    // });

                    var countryfieldD = objForm.addField({
                        id: 'custpage_countryd',
                        type: N_server.FieldType.SELECT,
                        label: 'Country',
                        container: 'fieldgroupiddest'
                    });
                    countryfieldD.updateLayoutType({
                        layoutType: N_server.FieldLayoutType.ENDROW
                    });
                    // countryfieldD.updateDisplaySize({
                    //     height: 60,
                    //     width: 16
                    // });
                    countryfieldD.addSelectOption({
                        value: 'US',
                        text: 'United States'
                    });
                    countryfieldD.addSelectOption({
                        value: 'CA',
                        text: 'Canada'
                    });
                    countryfieldD.addSelectOption({
                        value: 'MX',
                        text: 'Mexico'
                    });
                    countryfieldD.addSelectOption({
                        value: 'PR',
                        text: 'Puerto Rico'
                    });

                    //code  for fieldgroup Accessorial Services
                    var objFgad = objForm.addFieldGroup({
                        id: 'fieldgroupaccessdp',
                        label: 'ACCESSORIAL SERVICES'
                    });

                    var accSerMul = objForm.addField({
                        id: 'custpage_dd',
                        type: N_server.FieldType.MULTISELECT,
                        label: 'Accessorial Services',
                        container: 'fieldgroupaccessdp'
                    });

                    var servHtml = '<!DOCTYPE html>' +
                        '<html>' +
                        '<body>' +
                        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>' +
                        '<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>' +
                        '<button id="clickMe" style="margin-left: 9px">Remove Accessorial Values</button>' +
                        '</body>' +
                        '</html>';

                    var accSerhtmlFld = objForm.addField({
                        id: 'custpage_html_field',
                        type: N_server.FieldType.INLINEHTML,
                        label: 'Service',
                    });
                    accSerhtmlFld.defaultValue = servHtml;
                    var servListHtml = '<!DOCTYPE html>' +
                        '<html>' +
                        '<body>' +
                        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>' +
                        '<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>' +
                        '<h3 style="margin-top: 10px" >Selected Accessorial Services</h3>' +
                        '<ul style= "line-height: 0px" id="listacc"></ul>' +
                        '</body>' +
                        '</html>';

                    var accListSerhtmlFld = objForm.addField({
                        id: 'custpage_html_list_field',
                        type: N_server.FieldType.INLINEHTML,
                        label: 'Service List',
                        container: 'fieldgroupaccessdp'
                    });
                    accListSerhtmlFld.defaultValue = servListHtml;
                    // accSerMul.addSelectOption({
                    //     value: '',
                    //     text: ''
                    // });

                    var accessorialSearchObj = search.create({
                        type: "customrecord_p1_accessorial_services",
                        filters: [],
                        columns: [
                            search.createColumn({
                                name: "custrecord_accessorial_services_codes",
                                label: "ACESSORIAL SERVICE CODES"
                            }),
                            search.createColumn({
                                name: "custrecord_accessorial_services_name",
                                label: "ACCESORIAL SERVICE NAME"
                            }),
                            search.createColumn({
                                name: "internalid",
                                label: "Internal ID"
                            })
                        ]
                    });
                    accessorialSearchObj.run().each(function (result) {
                        accSerMul.addSelectOption({
                            value: result.getValue('custrecord_accessorial_services_codes'),
                            text: result.getValue('custrecord_accessorial_services_name')
                        });

                        return true;
                    });


                    //code for ITEM sublist

                    //***start add saved search for item mapping***//

                    var itemType_;
                    var customrecord_api_configurationsSearchObj = search.create({
                        type: "customrecord_p1_api_configurations",
                        filters: [
                            ["internalidnumber", "equalto", "1"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_item_type",
                                label: "Item Type"
                            })
                        ]
                    });

                    var searchResultCount = customrecord_api_configurationsSearchObj.runPaged().count;
                    customrecord_api_configurationsSearchObj.run().each(function (result) {
                        itemType_ = result.getValue({
                            name: "custrecord_item_type"
                        });

                        return true;
                    });


                    // ***start add saved search for item mapping***//

                    var objsub = objForm.addSublist({
                        id: 'itemssublist',
                        type: N_server.SublistType.INLINEEDITOR,
                        label: 'Items',
                        container: 'fieldgroupitemsublist'
                    });

                    objsub.addField({
                        id: 'stackable',
                        type: N_server.FieldType.CHECKBOX,
                        label: 'Stackable'
                    });
                    objsub.addField({
                        id: 'hazmat',
                        type: N_server.FieldType.CHECKBOX,
                        label: 'Hazmat'
                    });
                    objsub.addField({
                        id: 'used',
                        type: N_server.FieldType.CHECKBOX,
                        label: 'Used'
                    });
                    objsub.addField({
                        id: 'machinery',
                        type: N_server.FieldType.CHECKBOX,
                        label: 'Machinery'
                    });
                    // log.debug('itemType_', itemType_);
                    var item = objsub.addField({
                        id: 'items_a',
                        type: N_server.FieldType.SELECT,
                        source: itemType_,
                        label: 'Item'
                    });


                    var unitFldObj = objsub.addField({
                        id: 'units',
                        type: N_server.FieldType.INTEGER,
                        label: 'UNITS'
                    });
                    unitFldObj.isMandatory = true;

                    var objPack = objsub.addField({
                        id: 'packaging',
                        type: N_server.FieldType.SELECT,
                        label: 'HANDLING UNIT'
                    });
                    objPack.addSelectOption({
                        value: 'Pallet',
                        text: 'Pallet'
                    });
                    objPack.addSelectOption({
                        value: 'Box',
                        text: 'Box'
                    });
                    objPack.addSelectOption({
                        value: 'Bale',
                        text: 'Bale'
                    });
                    objPack.addSelectOption({
                        value: 'Bag',
                        text: 'Bag'
                    });
                    objPack.addSelectOption({
                        value: 'Bucket',
                        text: 'Bucket'
                    });
                    objPack.addSelectOption({
                        value: 'Bundle',
                        text: 'Bundle'
                    });
                    objPack.addSelectOption({
                        value: 'Can',
                        text: 'Can'
                    });
                    objPack.addSelectOption({
                        value: 'Carton',
                        text: 'Carton'
                    });
                    objPack.addSelectOption({
                        value: 'Case',
                        text: 'Case'
                    });
                    objPack.addSelectOption({
                        value: 'Coil',
                        text: 'Coil'
                    });
                    objPack.addSelectOption({
                        value: 'Crate',
                        text: 'Crate'
                    });
                    objPack.addSelectOption({
                        value: 'Cylinder',
                        text: 'Cylinder'
                    });
                    objPack.addSelectOption({
                        value: 'Drums',
                        text: 'Drums'
                    });
                    objPack.addSelectOption({
                        value: 'Pail',
                        text: 'Pail'
                    });
                    objPack.addSelectOption({
                        value: 'Pieces',
                        text: 'Pieces'
                    });
                    objPack.addSelectOption({
                        value: 'Reel',
                        text: 'Reel'
                    });
                    objPack.addSelectOption({
                        value: 'Roll',
                        text: 'Roll'
                    });
                    objPack.addSelectOption({
                        value: 'Skid',
                        text: 'Skid'
                    });
                    objPack.addSelectOption({
                        value: 'Tube',
                        text: 'Tube'
                    });
                    objPack.addSelectOption({
                        value: 'Tote',
                        text: 'Tote'
                    });

                    var piecesFldObj = objsub.addField({
                        id: 'pieces',
                        type: N_server.FieldType.INTEGER,
                        label: 'PIECES'
                    });
                    piecesFldObj.isMandatory = true;

                    var weight = objsub.addField({
                        id: 'weight',
                        type: N_server.FieldType.INTEGER,
                        label: 'WEIGHT'
                    });
                    weight.isMandatory = true;

                    var weightsize = objsub.addField({
                        id: 'custpage_weight',
                        type: N_server.FieldType.SELECT,
                        label: 'Wt Unit '
                    });
                    weightsize.isMandatory = true;

                    weightsize.addSelectOption({
                        value: 'lbs',
                        text: 'lbs'
                    });
                    weightsize.addSelectOption({
                        value: 'kg',
                        text: 'kg'
                    });

                    var length = objsub.addField({
                        id: 'length1',
                        type: N_server.FieldType.INTEGER,
                        label: 'LENGTH'
                    });
                    length.isMandatory = true;

                    var width = objsub.addField({
                        id: 'width1',
                        type: N_server.FieldType.INTEGER,
                        label: 'WIDTH'
                    });
                    width.isMandatory = true;

                    var height = objsub.addField({
                        id: 'height1',
                        type: N_server.FieldType.INTEGER,
                        label: 'HEIGHT'
                    });
                    height.isMandatory = true;

                    var size = objsub.addField({
                        id: 'custpage_size',
                        type: N_server.FieldType.SELECT,
                        label: 'LWH Unit '
                    });
                    size.isMandatory = true;
                    size.addSelectOption({
                        value: 'in',
                        text: 'in'
                    });
                    size.addSelectOption({
                        value: 'cm',
                        text: 'cm'
                    });
                    size.addSelectOption({
                        value: 'm',
                        text: 'm'
                    });
                    size.addSelectOption({
                        value: 'ft',
                        text: 'ft'
                    });

                    var suggestclass = objsub.addField({
                        id: 'class1',
                        type: N_server.FieldType.SELECT,
                        label: 'CLASS'
                    });

                    suggestclass.isMandatory = true;
                    suggestclass.addSelectOption({
                        value: 'a',
                        text: ''
                    });
                    suggestclass.addSelectOption({
                        value: '50',
                        text: '50'
                    });
                    suggestclass.addSelectOption({
                        value: '55',
                        text: '55'
                    });
                    suggestclass.addSelectOption({
                        value: '60',
                        text: '60'
                    });
                    suggestclass.addSelectOption({
                        value: '65',
                        text: '65'
                    });
                    suggestclass.addSelectOption({
                        value: '70',
                        text: '70'
                    });
                    suggestclass.addSelectOption({
                        value: '77.5',
                        text: '77.5'
                    });
                    suggestclass.addSelectOption({
                        value: '85',
                        text: '85'
                    });
                    suggestclass.addSelectOption({
                        value: '92.5',
                        text: '92.5'
                    });
                    suggestclass.addSelectOption({
                        value: '100',
                        text: '100'
                    });
                    suggestclass.addSelectOption({
                        value: '110',
                        text: '110'
                    });
                    suggestclass.addSelectOption({
                        value: '125',
                        text: '125'
                    });
                    suggestclass.addSelectOption({
                        value: '150',
                        text: '150'
                    });
                    suggestclass.addSelectOption({
                        value: '175',
                        text: '175'
                    });
                    suggestclass.addSelectOption({
                        value: '200',
                        text: '200'
                    });
                    suggestclass.addSelectOption({
                        value: '250',
                        text: '250'
                    });
                    suggestclass.addSelectOption({
                        value: '300',
                        text: '300'
                    });
                    suggestclass.addSelectOption({
                        value: '400',
                        text: '400'
                    });
                    suggestclass.addSelectOption({
                        value: '500',
                        text: '500'
                    });

                    var suggestedClass = objsub.addField({
                        id: 'suggestedclass',
                        type: N_server.FieldType.TEXT,
                        label: 'Suggested Class'
                    });
                    suggestedClass.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });

                    var nmfc_List = objsub.addField({
                        id: 'nmfc',
                        type: N_server.FieldType.SELECT,
                        label: 'NMFC'
                    });
                    nmfc_List.addSelectOption({
                        value: '',
                        text: ''
                    });
                    nmfc_List.addSelectOption({
                        value: '104340',
                        text: '104340'
                    });
                    nmfc_List.addSelectOption({
                        value: '104600',
                        text: '104600'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-02',
                        text: '133300-02'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-03',
                        text: '133300-03'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-04',
                        text: '133300-04'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-05',
                        text: '133300-05'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-07',
                        text: '133300-07'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-08',
                        text: '133300-08'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-09',
                        text: '133300-09'
                    });
                    nmfc_List.addSelectOption({
                        value: '133300-10',
                        text: '133300-10'
                    });
                    nmfc_List.addSelectOption({
                        value: '93490',
                        text: '93490'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-01',
                        text: '95190-01'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-02',
                        text: '95190-02'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-03',
                        text: '95190-03'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-04',
                        text: '95190-04'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-05',
                        text: '95190-05'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-06',
                        text: '95190-06'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-07',
                        text: '95190-07'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-08',
                        text: '95190-08'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-09',
                        text: '95190-09'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-10',
                        text: '95190-10'
                    });
                    nmfc_List.addSelectOption({
                        value: '95190-11',
                        text: '95190-11'
                    });

                    var descFldObj = objsub.addField({
                        id: 'description',
                        type: N_server.FieldType.TEXT,
                        label: 'DESCRIPTION',

                    });
                    descFldObj.isMandatory = true;

                    // if (context.request.method === 'GET') {

                    var objButton = objForm.addSubmitButton({
                        label: 'Get rates'
                    });
                    context.response.writePage({
                        pageObject: objForm
                    });
                }
                if (context.request.method === 'POST') {

                    var originZipCode = context.request.parameters.custpage_zip;
                    log.debug('originZipCode', originZipCode);

                    var destinationZipCode = context.request.parameters.custpage_zip_dest;
                    log.debug('destinationZipCode', destinationZipCode);

                    var pickupDate = context.request.parameters.custpage_pdate;
                    log.debug('pickupDate', pickupDate);

                    var parsedDate = format.parse({ value: pickupDate, type: format.Type.DATE });

                    var delimiter = /\u0005/;
                    var Accessorial_service = context.request.parameters.custpage_dd.split(delimiter);
                    log.debug('Accessorial_service', Accessorial_service);
                    var accesorialServiceString = Accessorial_service.toString();

                    // ---------------- Getting Pickup & Destination Details-----------------
                    var pick_company, pick_contact, pick_addr1, pick_addr2, pick_phone, pick_email, pick_city, pick_state, pick_open, pick_close, pick_country;
                    var dest_company, dest_contact, dest_addr1, dest_addr2, dest_phone, dest_email, dest_city, dest_state, dest_open, dest_close, dest_country;

                    var PickAddress = context.request.parameters.custpage_address;
                    if (PickAddress) {
                        var pik_Record = record.load({
                            type: 'customrecord_p1_addresses',
                            id: PickAddress,
                            isDynamic: true
                        });

                        pick_company = pik_Record.getValue('custrecord_company_name123');
                        pick_contact = pik_Record.getValue('custrecord_contact_name');
                        pick_addr1 = pik_Record.getValue('custrecord_address_1');
                        pick_addr2 = pik_Record.getValue('custrecord_address_2');
                        pick_phone = pik_Record.getValue('custrecord_phonenumber');
                        pick_email = pik_Record.getValue('custrecord_email_address');
                        pick_city = pik_Record.getValue('custrecordcity');
                        pick_state = pik_Record.getValue('custrecordstateabbreviation');
                        log.debug('pick_state 1', pick_state);
                        pick_state = state_Code(pick_state);
                        log.debug('pick_state 2', pick_state);
                        pick_country = pik_Record.getValue('custrecord_country_abbreviation');
                        pick_open = pik_Record.getValue('custrecord_open');
                        pick_close = pik_Record.getValue('custrecord_close');
                    }

                    var DestAddress = context.request.parameters.custpage_address_dest;
                    if (DestAddress) {
                        var des_Record = record.load({
                            type: 'customrecord_p1_addresses',
                            id: DestAddress,
                            isDynamic: true
                        });

                        dest_company = des_Record.getValue('custrecord_company_name123');
                        dest_contact = des_Record.getValue('custrecord_contact_name');
                        dest_addr1 = des_Record.getValue('custrecord_address_1');
                        dest_addr2 = des_Record.getValue('custrecord_address_2');
                        dest_phone = des_Record.getValue('custrecord_phonenumber');
                        dest_email = des_Record.getValue('custrecord_email_address');
                        dest_city = des_Record.getValue('custrecordcity');
                        dest_state = des_Record.getValue('custrecordstateabbreviation');
                        log.debug('dest_state 1', dest_state);
                        dest_state = state_Code(dest_state);
                        log.debug('dest_state 2', dest_state);
                        dest_country = des_Record.getValue('custrecord_country_abbreviation');
                        dest_open = des_Record.getValue('custrecord_open');
                        dest_close = des_Record.getValue('custrecord_close');

                    }

                    var PickCountry = pick_country ? pick_country : context.request.parameters.custpage_countryp;
                    log.debug('PickCountry', PickCountry);
                    var DestCountry = dest_country ? dest_country : context.request.parameters.custpage_countryd;
                    log.debug('DestCountry', DestCountry);

                    // -------------Creating Quote record --------------------
                    var priorityQuoteCustomRecord = record.create({
                        type: 'customrecord_p1_priority_quote',
                        isDynamic: true
                    });

                    // ------------- Setting Pickup Date ----------------
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_p1_pickup_date',
                        value: parsedDate
                    });

                    // ------------- Setting Pickup Details ----------------
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_company',
                        value: pick_company
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_contact',
                        value: pick_contact
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_addr_1',
                        value: pick_addr1
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_addr_2',
                        value: pick_addr2
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_phone',
                        value: pick_phone
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_email',
                        value: pick_email
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_city',
                        value: pick_city
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_state',
                        value: pick_state
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_open',
                        value: pick_open
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pick_close',
                        value: pick_close
                    });
                    // ------------- Setting Destination Detsils ----------------


                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_company',
                        value: dest_company
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_contact',
                        value: dest_contact
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_addr_1',
                        value: dest_addr1
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_addr_2',
                        value: dest_addr2
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_phone',
                        value: dest_phone
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_email',
                        value: dest_email
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_city',
                        value: dest_city
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_state',
                        value: dest_state
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_open',
                        value: dest_open
                    });
                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_dest_close',
                        value: dest_close
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pickup_date',
                        value: parsedDate
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_address_book',
                        value: PickAddress
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_pickup_zip',
                        value: originZipCode
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_country',
                        value: PickCountry
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_destination_address_book',
                        value: DestAddress
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_destination_country',
                        value: DestCountry
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_destination_zip',
                        value: destinationZipCode
                    });

                    priorityQuoteCustomRecord.setValue({
                        fieldId: 'custrecord_accessorial_services',
                        value: accesorialServiceString
                    });

                    var internal_id;
                    var fieldLookUp;
                    var access_code = [];
                    if (Accessorial_service[0]) {
                        for (var count = 0; count < Accessorial_service.length; count++) {
                            var data = {
                                "code": Accessorial_service[count]
                            }
                            access_code.push(data);
                        }
                    }

                    var TotalLines = context.request.getLineCount({
                        group: 'itemssublist'
                    });

                    var itemsDetails = [];
                    var itemToSendArr = [];
                    var enhancedItem = [];

                    for (var i = 0; i < TotalLines; i++) {
                        var stackable = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'stackable',
                            line: i
                        }) == "T" ? true : false;

                        var hazmat = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'hazmat',
                            line: i
                        }) == "T" ? true : false;

                        var used = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'used',
                            line: i
                        }) == "T" ? true : false;

                        var machinery = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'machinery',
                            line: i
                        }) == "T" ? true : false;

                        var Items = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'items_a',
                            line: i
                        });

                        var Units = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'units',
                            line: i
                        });

                        var Packaging = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'packaging',
                            line: i
                        });
                        // log.debug('Packaging', Packaging);

                        var pieces = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'pieces',
                            line: i
                        });

                        var weight = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'weight',
                            line: i
                        });

                        var weightUnit = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'custpage_weight',
                            line: i
                        });
                        // log.debug('weightUnit', weightUnit);

                        var length = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'length1',
                            line: i
                        });

                        var width = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'width1',
                            line: i
                        });

                        var height = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'height1',
                            line: i
                        });

                        var lwhUnit = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'custpage_size',
                            line: i
                        });
                        // log.debug('lwhUnit', lwhUnit);

                        var Class = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'class1',
                            line: i
                        });
                        // log.debug('Class', Class);

                        var SuggestedSubClass = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'suggestedclass',
                            line: i
                        });

                        var Description = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'description',
                            line: i
                        });

                        var nmfc = context.request.getSublistValue({
                            group: 'itemssublist',
                            name: 'nmfc',
                            line: i
                        });

                        var mainNmfc, subNmfc;
                        if (nmfc) {
                            var nfc_contain = nmfc.indexOf("-");
                            if (nfc_contain == -1) {
                                mainNmfc = nmfc;
                                subNmfc = null;
                            } else if (nfc_contain != -1) {
                                var nmfcArray = nmfc.split("-");
                                mainNmfc = nmfcArray[0];
                                subNmfc = nmfcArray[1];
                            }
                        } else {
                            mainNmfc = null;
                            subNmfc = null;
                        }
                        if (!Units) {
                            Units = "1";
                        }
                        if (!pieces) {
                            pieces = "1";  //parseInt("1");
                        }
                        if (hazmat == true) {
                            var dataitems = {
                                freightClass: Class,
                                packagingType: Packaging,
                                units: Units,
                                pieces: pieces,
                                totalWeight: weight,
                                length: length,
                                width: width,
                                height: height,
                                description: Description,
                                isStackable: stackable,
                                isHazardous: hazmat,
                                isUsed: used,
                                isMachinery: machinery,
                                nmfcItemCode: mainNmfc,
                                nmfcSubCode: subNmfc,
                                hazmatDetail: {
                                    "identificationNumber": "",
                                    "properShippingName": "",
                                    "hazardClass": "",
                                    "packingGroup": ""
                                }

                            };
                            itemsDetails.push(dataitems);
                        } else {
                            var dataitems = {
                                freightClass: Class,
                                packagingType: Packaging,
                                units: Units,
                                pieces: pieces,
                                totalWeight: weight,
                                length: length,
                                width: width,
                                height: height,
                                description: Description,
                                isStackable: stackable,
                                isHazardous: hazmat,
                                isUsed: used,
                                isMachinery: machinery,
                                nmfcItemCode: mainNmfc,
                                nmfcSubCode: subNmfc,

                            };
                            itemsDetails.push(dataitems);
                        }
                        var dataitems = {
                            itemName: Items,
                            SuggestedSubClass: SuggestedSubClass,
                            description: Description,
                            freightClass: Class,
                            packagingType: Packaging,
                            units: Units,
                            pieces: pieces,
                            totalWeight: weight,
                            totalWeightUnit: weightUnit,
                            length: length,
                            width: width,
                            height: height,
                            singleLwhUnit: lwhUnit,
                            isStackable: stackable,
                            isHazardous: hazmat,
                            isUsed: used,
                            isMachinery: machinery,
                            nmfcItemCode: nmfc,
                            nmfcSubCode: null
                        };
                        itemToSendArr.push(dataitems);
                    }

                    var payloadObj = {
                        items: itemToSendArr,
                        enhancedHandlingUnits: null
                    };
                    var setPayload = JSON.stringify(payloadObj);

                    var bodyPriority = JSON.stringify({
                        "originCity": pick_city,
                        "originStateAbbreviation": pick_state,
                        "originZipCode": originZipCode,
                        "originCountryCode": PickCountry,
                        "destinationCity": dest_city,
                        "destinationStateAbbreviation": dest_state,
                        "destinationZipCode": destinationZipCode,
                        "destinationCountryCode": DestCountry,
                        "pickupDate": pickupDate,
                        "items": itemsDetails,
                        "accessorialServices": access_code
                    });
                    log.debug('bodyPriority', bodyPriority);

                    var urlendPoint_, xApiKey;
                    var fieldLookUp = search.lookupFields({
                        type: "customrecord_p1_api_configurations",
                        id: 1,
                        columns: ['custrecord_endpointurl', 'custrecord_xapikey']
                    });
                    urlendPoint_ = fieldLookUp.custrecord_endpointurl;
                    xApiKey = fieldLookUp.custrecord_xapikey;

                    var urlEndPoint = urlendPoint_
                    var postRequest = https.post({
                        url: urlEndPoint + '/v2/ltl/quotes/rates',
                        headers: {
                            "X-API-KEY": xApiKey,
                            "Content-Type": "application/json"
                        },
                        body: bodyPriority
                    });

                    var jsonrequest = JSON.parse(postRequest.body);
                    log.debug('jsonrequest', jsonrequest);

                    if (postRequest) {
                        priorityQuoteCustomRecord.setValue({
                            fieldId: 'custrecord_p1_quote_id',
                            value: jsonrequest.id
                        });
                        priorityQuoteCustomRecord.setValue({
                            fieldId: 'custrecord_response_data',
                            value: postRequest.body
                        });
                        // itemToSendArr = JSON.stringify(itemToSendArr);
                        priorityQuoteCustomRecord.setValue({
                            fieldId: 'custrecord_p1_item_object',
                            value: setPayload
                        });
                    }

                    var recordId = priorityQuoteCustomRecord.save();
                    log.debug('recordId', recordId);

                    var getRate = url.resolveScript({
                        scriptId: 'customscript_da_sl_getrate',
                        deploymentId: 'customdeploy_da_sl_getrate',
                        params: ({
                            'custRecId': recordId
                        })
                    });

                    redirect.redirect({
                        url: getRate
                    });
                }

            } catch (error) {
                log.debug('errorn', error);
                errorMessage = error.message;
                log.debug('Error in API function', errorMessage);
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

        function state_Code(str1) {
            var state_Code;
            var stateSearchObj = search.create({
                type: "state",
                filters:
                    [
                        ["fullname", "is", str1]
                    ],
                columns:
                    [
                        search.createColumn({ name: "shortname", label: "Short Name" })
                    ]
            });
            stateSearchObj.run().each(function (result) {
                state_Code = result.getValue('shortname');
            });

            var State_Code = state_Code ? state_Code : str1;
            return State_Code;
        }

        return {
            onRequest: onRequest,
            state_Code: state_Code
        };
    }); 