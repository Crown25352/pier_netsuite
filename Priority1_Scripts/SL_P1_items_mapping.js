/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/record'],
    function(N_server, search, record) {
        function onRequest(context) {
            try {
                /***Start to Create a item mapping form ***/

                var objFormItemMapping = N_server.createForm({
                    title: 'Items Mapping'
                });
                objFormItemMapping.clientScriptModulePath = './CS_P1_item_mapping.js';

                //***start to add field in item mapping form***//

                var fieldgroupitemMapping = objFormItemMapping.addFieldGroup({
                    id: 'fieldgroupitemmapping',
                    label: 'Item Mapping Configuration'
                });

                var objScreenName = objFormItemMapping.addField({
                    id: 'custfield_screenname',
                    type: N_server.FieldType.TEXT,
                    label: 'Map Item & Description field in New Quotes Screen',
                    container: 'fieldgroupitemmapping'
                })

                objScreenName.defaultValue = 'New Quotes';
                objScreenName.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var objItemType = objFormItemMapping.addField({
                    id: 'custfield_itemtype',
                    type: N_server.FieldType.SELECT,
                    label: 'Select Netsuite Source Inventory Item Type',
                    container: 'fieldgroupitemmapping'
                });

                objItemType.addSelectOption({
                    value: ' ',
                    text: ' '
                });
                objItemType.addSelectOption({
                    value: 'inventoryitem',
                    text: 'Inventory Items'
                });
                objItemType.addSelectOption({
                    value: 'lotnumberedinventoryitem',
                    text: 'Lot Number Inventory Items'
                });
                objItemType.addSelectOption({
                    value: 'discountitem',
                    text: 'Discount Item'
                });
                objItemType.addSelectOption({
                    value: 'noninventoryitem',
                    text: 'Non-Inventory Items'
                });
                objItemType.addSelectOption({
                    value: 'serviceitem',
                    text: 'Service Items'
                });
                objItemType.addSelectOption({
                    value: 'itemgroup',
                    text: 'Items Group'
                });
                objItemType.addSelectOption({
                    value: 'kititem',
                    text: 'Kit/Package Items'
                });
                objItemType.addSelectOption({
                    value: 'markupitem',
                    text: 'Matrix Items'
                });

                /**** Start Adding feild group for image ****/
                var itemimage = objFormItemMapping.addFieldGroup({
                    id: 'itemimage',
                    label: 'Fields'
                });

                var objItemimage = objFormItemMapping.addField({
                    id: 'custfield_itemimage',
                    type: N_server.FieldType.INLINEHTML,
                    label: 'Example',
                    container: 'itemimage'
                });

                var img = 'https://tstdrv2377917.secure.netsuite.com/core/media/media.nl?id=8890&c=TSTDRV2377917&h=VLomPefogUGL5o5wx8xjCqFvaiyUEFxQuREjSdHylmGkUBtx';

                var image_tag = '<img src="' + img + '" width="64%" height="55%"/>';
                objItemimage.defaultValue = image_tag;

                /**** End Adding feild group for image ****/

                if (context.request.method == 'GET') {
                    objFormItemMapping.addSubmitButton({ //***add button ***//
                        label: 'Apply'
                    });
                } else {
                    objFormItemMapping.addButton({
                        id: 'buttonid',
                        label: 'Edit',
                        functionName: 'Edits'
                    });

                    var itemValue;
                    var apiConfigtypeRecord = record.load({
                        type: 'customrecord_p1_api_configurations',
                        id: 1 /// load api configuration custom record
                    });
                    itemValue = context.request.parameters.custfield_itemtype;
                    apiConfigtypeRecord.setValue({
                        fieldId: 'custrecord_item_type',
                        value: itemValue
                    });

                    apiConfigtypeRecord.save();
                    objItemType.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                    objItemType.defaultValue = itemValue;
                    objScreenName.updateDisplayType({
                        displayType: N_server.FieldDisplayType.DISABLED
                    });
                }
                //***end to add field in item mapping form***//

                context.response.writePage({
                    pageObject: objFormItemMapping
                });
            } catch (e) {
                log.debug('Error in objFormItemMapping ', e);
            }

            /***end to Create a item mapping form ***/
        }

        return {
            onRequest: onRequest
        };
    });