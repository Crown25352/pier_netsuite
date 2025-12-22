/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/redirect', 'N/url'],
    function(N_server, search, record, redirect, url) {
        function onRequest(context) {
            try {
                /***Start to Create a api form ***/
				
                var objFormConfiguartionApi = N_server.createForm({
                    title: 'API Configuration'
                });
                objFormConfiguartionApi.clientScriptModulePath = './CS_P1_Configuration_api.js';
                var urlEndPoint = objFormConfiguartionApi.addField({
                    id: 'custfield_endpointurl',
                    type: N_server.FieldType.TEXT,
                    label: 'URL ENDPOINT'
                });
                urlEndPoint.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });
                var xApiKey = objFormConfiguartionApi.addField({
                    id: 'custfield_xapikey',
                    type: N_server.FieldType.TEXT,
                    label: 'X-API KEY'
                });
                xApiKey.updateDisplayType({
                    displayType: N_server.FieldDisplayType.DISABLED
                });

                var apiConfigurationSublist = objFormConfiguartionApi.addSublist({
                    id: 'custsublist_apiconfig',
                    type: N_server.SublistType.STATICLIST,
                    label: 'API Configuration'
                });

                apiConfigurationSublist.addField({
                    id: 'custfield_apiname',
                    type: N_server.FieldType.TEXT,
                    label: 'API NAME'
                });

                apiConfigurationSublist.addField({
                    id: 'custfield_urlendpoint',
                    type: N_server.FieldType.TEXT,
                    label: 'URL END POINT'
                });

                /***Start to Create a saved search to get data from api configuration custom Record***/
                var endPointUrl_, apiName_, urlEndPoint_, xApiKey_;
                var customrecord_api_configurationsSearchObj = search.create({
                    type: "customrecord_p1_api_configurations",
                    filters: [
                        ["internalid", "anyof", "1"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_endpointurl",
                            label: "endpoint url"
                        }),
                        search.createColumn({
                            name: "custrecord_api_key",
                            join: "CUSTRECORD_API_KEY_LIST",
                            label: "API Name"
                        }),
                        search.createColumn({
                            name: "custrecord122",
                            join: "CUSTRECORD_API_KEY_LIST",
                            label: "URL Endpoint"
                        }),

                        search.createColumn({
                            name: "custrecord_xapikey",
                            label: "X-API KEY"
                        })
                    ]
                });
                /***End saved Search***/

                /***Start to set  Value form Saved Search***/
                var searchResultCount = customrecord_api_configurationsSearchObj.runPaged().count;
                var apicount = 0;
                customrecord_api_configurationsSearchObj.run().each(function(result) {
                    endPointUrl_ = result.getValue({
                        name: "custrecord_endpointurl"
                    });
                    xApiKey_ = result.getValue({
                        name: "custrecord_xapikey"
                    });
                    apiName_ = result.getValue({
                        name: 'custrecord_api_key',
                        join: "CUSTRECORD_API_KEY_LIST"
                    });
                    urlEndPoint_ = result.getValue({
                        name: 'custrecord122',
                        join: "CUSTRECORD_API_KEY_LIST"
                    });
                    urlEndPoint.defaultValue = endPointUrl_;
                    xApiKey.defaultValue = xApiKey_;
                    apiConfigurationSublist.setSublistValue({
                        id: 'custfield_apiname',
                        line: apicount,
                        value: apiName_
                    });
                    apiConfigurationSublist.setSublistValue({
                        id: 'custfield_urlendpoint',
                        line: apicount,
                        value: urlEndPoint_
                    });

                    apicount++;
                    return true;
                });
                /***End to set  Value form Saved Search***/

                if (context.request.method == 'GET') {
                    var saveChangesButton = objFormConfiguartionApi.addSubmitButton({
                        label: 'EDIT' /// add Edit button
                    });
                }

                /***Start Post Method***/
                else {
                    objFormConfiguartionApi.addButton({
                        id: 'buttonid',
                        label: 'SAVE CHANGES',
                        functionName: 'savechange'
                    });

                    var apiConfigRecord = record.load({
                        type: 'customrecord_p1_api_configurations',
                        id: 1 /// load api configuration custom record
                    });
                    
                    /***start to get Value in Post method***/
                    var apiUrlEndPointConfigSub, apiNameConfigSub;
                    var endPointUrlPost = context.request.parameters.custfield_endpointurl;
                    var xApiKeys = context.request.parameters.custfield_xapikey;
                    var configSublistCount = context.request.getLineCount({
                        group: 'custsublist_apiconfig'
                    });
					
                    for (var configcount = 0; configcount < configSublistCount; configcount++) {
                        apiNameConfigSub = context.request.getSublistValue({
                            group: 'custsublist_apiconfig',
                            name: 'custfield_apiname',
                            line: configcount
                        });
                        
                        apiUrlEndPointConfigSub = context.request.getSublistValue({
                            group: 'custsublist_apiconfig',
                            name: 'custfield_urlendpoint',
                            line: configcount
                        });
                        
                        /***start to add api details sublist value in api configuration custom record***/
                        apiConfigRecord.setSublistValue({
                            sublistId: 'recmachcustrecord_api_key_list',
                            fieldId: 'custrecord_api_key',
                            line: configcount,
                            value: apiNameConfigSub
                        });
                        apiConfigRecord.setSublistValue({
                            sublistId: 'recmachcustrecord_api_key_list',
                            fieldId: 'custrecord122',
                            line: configcount,
                            value: apiUrlEndPointConfigSub
                        });
                    }
                    /***End to add api details sublist value in api configuration custom record***/

                    /***Start to set Value in Api Config Custom Record***/
                    apiConfigRecord.setValue({
                        fieldId: 'custrecord_endpointurl',
                        value: endPointUrlPost
                    });
                    apiConfigRecord.setValue({
                        fieldId: 'custrecord_xapikey',
                        value: xApiKeys
                    });

                    apiConfigRecord.save(); /// save record
                    xApiKey.updateDisplayType({
                        displayType: N_server.FieldDisplayType.NORMAL
                    });
                }
                /***End to set Value in Api Config Custom Record***/

                context.response.writePage({
                    pageObject: objFormConfiguartionApi
                });
            } catch (e) {
                log.debug('Error in configuration Api ', e);
            }
            /***ENd to Create a api form ***/
        }

        return {
            onRequest: onRequest
        };
    });