/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/url', 'N/https', 'N/redirect', 'N/task'],
    function (N_server, record, search, url, https, redirect, task) {
        function onRequest(context) {
            try {

                var objFormAddressList = N_server.createForm({
                    title: 'Addresses'
                });
                var address_Search = objFormAddressList.addField({
                    id: 'addrsearch',
                    type: N_server.FieldType.TEXT,
                    label: 'Filters'
                });

                objFormAddressList.clientScriptModulePath = './CS_P1_addressConfig.js';
                var objSublistAddress = objFormAddressList.addSublist({
                    id: 'custfield_addresslist',
                    type: N_server.SublistType.STATICLIST,
                    label: ' '
                });

                objSublistAddress.addField({
                    id: 'custfield_company',
                    type: N_server.FieldType.TEXT,
                    label: 'COMPANY'
                });
                objSublistAddress.addField({
                    id: 'custfield_phonenumber',
                    type: N_server.FieldType.TEXT,
                    label: 'PHONE NUMBER'
                });
                objSublistAddress.addField({
                    id: 'custfield_address',
                    type: N_server.FieldType.TEXT,
                    label: 'ADDRESS'
                });
                objSublistAddress.addField({
                    id: 'custfield_citystatezipcountry',
                    type: N_server.FieldType.TEXT,
                    label: 'CITY/STATE/ZIP/COUNTRY'
                });
                objSublistAddress.addField({
                    id: 'custfield_actions',
                    type: N_server.FieldType.TEXT,
                    label: 'ACTIONS'
                });

                if (context.request.method == 'GET') {
                    var filterVal = context.request.parameters.filter;

                    if (filterVal == null) {
                        var companyName_, phoneNumber_, address_, city_, state_, country_, postalCode_, fullAddress_, internalId_;
                        var customrecord_addresses_tmsSearchObj = search.create({
                            type: "customrecord_p1_addresses",
                            filters: [],
                            columns: [
                                search.createColumn({
                                    name: "custrecord_company_name123",
                                    label: "Company name"
                                }),
                                search.createColumn({
                                    name: "custrecord_complete_address",
                                    label: "Address"
                                }),
                                search.createColumn({
                                    name: "custrecord_address_1",
                                    label: "Address 1"
                                }),
                                search.createColumn({
                                    name: "custrecordcity",
                                    label: "City"
                                }),
                                search.createColumn({
                                    name: "custrecord_phonenumber",
                                    label: " Phone Number"
                                }),
                                search.createColumn({
                                    name: "custrecordpostal_code",
                                    label: " Postal Code"
                                }),
                                search.createColumn({
                                    name: "custrecord_country_abbreviation",
                                    label: "Country Abbreviation"
                                }),
                                search.createColumn({
                                    name: "custrecordstateabbreviation",
                                    label: "StateAbbreviation"
                                }),
                                search.createColumn({
                                    name: "internalid",
                                    label: "Internal ID"
                                })

                            ]
                        });
                        var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;

                        var lineNumberIs = 0;
                        var custResult = customrecord_addresses_tmsSearchObj.run();
                        log.debug('custResult 100', custResult);
                        var searchresultRange = custResult.getRange({
                            start: 0,
                            end: 1000
                        });

                        var i = 0;
                        var j = 0;

                        while (i < searchresultRange.length) {
                            companyName_ = searchresultRange[i].getValue({
                                name: "custrecord_company_name123"
                            });
                            phoneNumber_ = searchresultRange[i].getValue({
                                name: "custrecord_phonenumber"
                            });
                            address_ = searchresultRange[i].getValue({
                                name: "custrecord_complete_address"
                            });
                            city_ = searchresultRange[i].getValue({
                                name: "custrecordcity"
                            });
                            state_ = searchresultRange[i].getValue({
                                name: "custrecordstateabbreviation"
                            });
                            country_ = searchresultRange[i].getValue({
                                name: "custrecord_country_abbreviation"
                            });
                            postalCode_ = searchresultRange[i].getValue({
                                name: "custrecordpostal_code"
                            });
                            internalId_ = searchresultRange[i].getValue({
                                name: "internalid"
                            });

                            objSublistAddress.setSublistValue({
                                id: 'custfield_company',
                                line: j,
                                value: companyName_
                            });

                            objSublistAddress.setSublistValue({
                                id: 'custfield_phonenumber',
                                line: j,
                                value: phoneNumber_ ? phoneNumber_ : ' '
                            });
                            objSublistAddress.setSublistValue({
                                id: 'custfield_address',
                                line: j,
                                value: address_ ? address_ : ' '
                            });

                            fullAddress_ = city_ + ', ' + state_ + ', ' + postalCode_ + ', ' + country_;
                            objSublistAddress.setSublistValue({
                                id: 'custfield_citystatezipcountry',
                                line: j,
                                value: fullAddress_
                            });
                            var addressEdit = url.resolveScript({
                                scriptId: 'customscript_sl_p1_address_update',
                                deploymentId: 'customdeploy_sl_p1_address_update'
                            });
                            addressEdit = addressEdit + '&ids=' + internalId_;
                            var html = "<!DOCTYPE html>";
                            html += '<html>';
                            html += '<a href="' + addressEdit + '">EDIT</a>';
                            html += '</html>';

                            var addressDelete = url.resolveScript({
                                scriptId: 'customscript_sl_address_details_delete',
                                deploymentId: 'customdeploy_sl_address_details_delete'
                            });
                            addressDelete = addressDelete + '&ids=' + internalId_;
                            var htmlD = "<!DOCTYPE html>";
                            htmlD += '<html>';
                            htmlD += '<a href="' + addressDelete + '">DELETE</a>';
                            htmlD += '</html>'

                            objSublistAddress.setSublistValue({
                                id: 'custfield_actions',
                                line: j,
                                value: html + ' | ' + htmlD
                            });

                            lineNumberIs++;
                            i++; j++;
                            if (i == 1000) {
                                i = 0;
                                log.debug('i || j in', i + ' || ' + j);
                                searchresultRange = custResult.getRange({
                                    start: j,
                                    end: j + 1000
                                });
                            }
                        }
                        objFormAddressList.addSubmitButton({
                            label: 'New address'
                        });

                    }

                    objFormAddressList.addButton({
                        id: 'filter',
                        label: 'Search',
                        functionName: 'filter'
                    });
                    objFormAddressList.addButton({
                        id: 'resetbutton',
                        label: 'Reset',
                        functionName: 'resetadd'
                    });
                    var search_add = context.request.parameters.addsearch;

                    /****Start to filter the data as per Search button Criteria****/
                    var companyName, Address, phoneNumber_, city, state, zip, Country, fullAddress, internalId;

                    var filter = [];
                    log.debug('search_add', search_add);
                    if (filterVal == 'T') {
                        address_Search.defaultValue = search_add;
                        if (search_add) {

                            filter = [
                                ["custrecord_address_1", "contains", search_add],
                                "OR",
                                ["custrecord_company_name123", "startswith", search_add]
                            ];
                        }
                        // var count = 0;
                        var customrecord_addresses_tmsSearchObj = search.create({
                            type: "customrecord_p1_addresses",
                            filters: filter,
                            columns: [
                                search.createColumn({
                                    name: "custrecord_company_name123",
                                    label: "Company name"
                                }),
                                search.createColumn({
                                    name: "custrecord_complete_address",
                                    label: "Address"
                                }),
                                search.createColumn({
                                    name: "custrecord_address_1",
                                    label: "Address 1"
                                }),
                                search.createColumn({
                                    name: "custrecord_contact_name",
                                    label: " Contact name"
                                }),
                                search.createColumn({
                                    name: "custrecord_address_2",
                                    label: "Address 2"
                                }),
                                search.createColumn({
                                    name: "custrecordcity",
                                    label: "City"
                                }),
                                search.createColumn({
                                    name: "custrecordstateabbreviation",
                                    label: "StateAbbreviation"
                                }),
                                search.createColumn({
                                    name: "custrecord_country_abbreviation",
                                    label: "Country Abbreviation"
                                }),
                                search.createColumn({
                                    name: "custrecordpostal_code",
                                    label: " Postal Code"
                                }),
                                search.createColumn({
                                    name: "custrecord_email_address",
                                    label: "Email Address"
                                }),
                                search.createColumn({
                                    name: "custrecord_phonenumber",
                                    label: " Phone Number"
                                }),
                                search.createColumn({
                                    name: "custrecord_open",
                                    label: "Open"
                                }),
                                search.createColumn({
                                    name: "custrecord_close",
                                    label: "Close"
                                }),
                                search.createColumn({
                                    name: "custrecord_pickupaccessorials",
                                    label: "PICKUP ACCESSORIALS"
                                }),
                                search.createColumn({
                                    name: "custrecord_deliveryaccessorials",
                                    label: "DELIVERY ACCESSORIALS"
                                }),
                                search.createColumn({
                                    name: "custrecord_notes",
                                    label: "Notes"
                                }),
                                search.createColumn({
                                    name: "custrecord_ext",
                                    label: "Ext."
                                }),
                                search.createColumn({
                                    name: "internalid",
                                    label: "Internal ID"
                                })
                            ]
                        });
                        var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
                        var searchresult = customrecord_addresses_tmsSearchObj.run();
                        log.debug('searchresult 309', searchresult);
                        var searchresultRange = searchresult.getRange({
                            start: 0,
                            end: 1000
                        });
                        log.debug('searchresultRange 314', searchresultRange);
                        var i = 0;
                        var j = 0;
                        while (i < searchresultRange.length) {

                            companyName = searchresultRange[i].getValue('custrecord_company_name123');
                            Address = searchresultRange[i].getValue('custrecord_complete_address');
                            phoneNumber_ = searchresultRange[i].getValue('custrecord_phonenumber');
                            city = searchresultRange[i].getValue('custrecordcity');
                            state = searchresultRange[i].getValue('custrecordstateabbreviation');
                            zip = searchresultRange[i].getValue('custrecordpostal_code');
                            Country = searchresultRange[i].getValue('custrecord_country_abbreviation');
                            internalId = searchresultRange[i].getValue({
                                name: "internalid"
                            });

                            fullAddress = city + ', ' + state + ', ' + zip + ', ' + Country;

                            objSublistAddress.setSublistValue({
                                id: 'custfield_company',
                                line: j,
                                value: companyName ? companyName : ' '
                            });
                            log.debug('phoneNumber_', phoneNumber_);
                            objSublistAddress.setSublistValue({
                                id: 'custfield_phonenumber',
                                line: j,
                                value: phoneNumber_ ? phoneNumber_ : ' '
                            });

                            objSublistAddress.setSublistValue({
                                id: 'custfield_address',
                                line: j,
                                value: Address ? Address : ' '
                            });
                            objSublistAddress.setSublistValue({
                                id: 'custfield_citystatezipcountry',
                                line: j,
                                value: fullAddress
                            });
                            var addressEdit = url.resolveScript({
                                scriptId: 'customscript_sl_p1_address_update',
                                deploymentId: 'customdeploy_sl_p1_address_update'
                            });
                            addressEdit = addressEdit + '&ids=' + internalId;
                            var html = "<!DOCTYPE html>";
                            html += '<html>';
                            html += '<a href="' + addressEdit + '">EDIT</a>';
                            html += '</html>';

                            var addressDelete = url.resolveScript({
                                scriptId: 'customscript_sl_address_details_delete',
                                deploymentId: 'customdeploy_sl_address_details_delete'
                            });
                            addressDelete = addressDelete + '&ids=' + internalId;
                            var htmlD = "<!DOCTYPE html>";
                            htmlD += '<html>';
                            htmlD += '<a href="' + addressDelete + '">DELETE</a>';
                            htmlD += '</html>'

                            objSublistAddress.setSublistValue({
                                id: 'custfield_actions',
                                line: j,
                                value: html + ' | ' + htmlD
                            });

                            // count++;
                            i++, j++;

                            //// INCREASE SAVED SEARCH RANGE AFTER GETTING 1000 DATA FROM SAVED SEARCH
                            if (i == 1000) {
                                i = 0;
                                log.debug('i || j in', i + ' || ' + j);
                                searchresultRange = custResult.getRange({
                                    start: j,
                                    end: j + 1000
                                });

                                // log.debug("count : " + count, "NEXT searchresultRange :- " + searchresultRange.length + " || TOTAL searchResultCount :- " + searchResultCount);
                                // log.debug('394');
                            }
                        }
                        /****End to filter the data as per Search button Criteria****/
                    } else if (filterVal == 'F') {

                        /****Start to add functionality to the reset button****/
                        var companyName_, phoneNumber_, address_, city_, state_, country_, postalCode_, fullAddress_, internalId_;
                        var customrecord_addresses_tmsSearchObj = search.create({
                            type: "customrecord_p1_addresses",
                            filters: [],
                            columns: [
                                search.createColumn({
                                    name: "custrecord_company_name123",
                                    label: "Company name"
                                }),
                                search.createColumn({
                                    name: "custrecord_address_1",
                                    label: "Address 1"
                                }),
                                search.createColumn({
                                    name: "custrecord_complete_address",
                                    label: "Address"
                                }),
                                search.createColumn({
                                    name: "custrecordcity",
                                    label: "City"
                                }),
                                search.createColumn({
                                    name: "custrecord_phonenumber",
                                    label: " Phone Number"
                                }),
                                search.createColumn({
                                    name: "custrecordpostal_code",
                                    label: " Postal Code"
                                }),
                                search.createColumn({
                                    name: "custrecord_country_abbreviation",
                                    label: "Country Abbreviation"
                                }),
                                search.createColumn({
                                    name: "custrecordstateabbreviation",
                                    label: "StateAbbreviation"
                                }),
                                search.createColumn({
                                    name: "internalid",
                                    label: "Internal ID"
                                })
                            ]
                        });
                        var searchResultCount = customrecord_addresses_tmsSearchObj.runPaged().count;
                        var searchresult = customrecord_addresses_tmsSearchObj.run();
                        var searchresultRange = searchresult.getRange({
                            start: 0,
                            end: 1000
                        });
                        var lineNumberIs = 0;
                        var i = 0; j = 0;

                        while (i < searchresultRange.length) {
                            companyName_ = searchresultRange[i].getValue({
                                name: "custrecord_company_name123"
                            });
                            phoneNumber_ = searchresultRange[i].getValue({
                                name: "custrecord_phonenumber"
                            });
                            address_ = searchresultRange[i].getValue({
                                name: "custrecord_complete_address"
                            });
                            city_ = searchresultRange[i].getValue({
                                name: "custrecordcity"
                            });
                            state_ = searchresultRange[i].getValue({
                                name: "custrecordstateabbreviation"
                            });
                            country_ = searchresultRange[i].getValue({
                                name: "custrecord_country_abbreviation"
                            });
                            postalCode_ = searchresultRange[i].getValue({
                                name: "custrecordpostal_code"
                            });
                            internalId_ = searchresultRange[i].getValue({
                                name: "internalid"
                            });
                            fullAddress_ = city_ + ', ' + state_ + ', ' + postalCode_ + ', ' + country_;

                            objSublistAddress.setSublistValue({
                                id: 'custfield_company',
                                line: j,
                                value: companyName_ ? companyName_ : ' '
                            });

                            objSublistAddress.setSublistValue({
                                id: 'custfield_phonenumber',
                                line: j,
                                value: phoneNumber_ ? phoneNumber_ : ' '
                            });
                            objSublistAddress.setSublistValue({
                                id: 'custfield_address',
                                line: j,
                                value: address_ ? address_ : ' '
                            });
                            objSublistAddress.setSublistValue({
                                id: 'custfield_citystatezipcountry',
                                line: j,
                                value: fullAddress_
                            });
                            var addressEdit = url.resolveScript({
                                scriptId: 'customscript_sl_p1_address_update',
                                deploymentId: 'customdeploy_sl_p1_address_update'
                            });
                            addressEdit = addressEdit + '&ids=' + internalId_;
                            var html = "<!DOCTYPE html>";
                            html += '<html>';
                            html += '<a href="' + addressEdit + '">EDIT</a>';
                            html += '</html>';

                            var addressDelete = url.resolveScript({
                                scriptId: 'customscript_sl_address_details_delete',
                                deploymentId: 'customdeploy_sl_address_details_delete'
                            });
                            addressDelete = addressDelete + '&ids=' + internalId_ + '&defaultVal=F';
                            var htmlD = "<!DOCTYPE html>";
                            htmlD += '<html>';
                            htmlD += '<a href="' + addressDelete + '">DELETE</a>';
                            htmlD += '</html>'

                            objSublistAddress.setSublistValue({
                                id: 'custfield_actions',
                                line: j,
                                value: html + ' | ' + htmlD
                            });

                            lineNumberIs++;
                            i++, j++;
                            //// INCREASE SAVED SEARCH RANGE AFTER GETTING 1000 DATA FROM SAVED SEARCH
                            if (i == 999) {
                                i = 0;
                                searchresultRange = searchresult.getRange({
                                    start: j,
                                    end: j + 1000
                                });

                                // log.debug("lineNumberIs : " + lineNumberIs, "NEXT searchresultRange :- " + searchresultRange.length + " || TOTAL searchResultCount :- " + searchResultCount);
                            }
                        }
                        objFormAddressList.addSubmitButton({
                            label: 'New address'
                        });
                        /****End to add functionality to the reset button****/
                    }
                    context.response.writePage({
                        pageObject: objFormAddressList
                    });
                }
                else {

                    /****Start to rdirect the suitelet when New Address button Clicked****/
                    var suiteletURL = url.resolveScript({
                        scriptId: 'customscript_sl_p1_create_address',
                        deploymentId: 'customdeploy_sl_p1_create_address'
                    });
                    redirect.redirect({
                        url: suiteletURL
                    });

                    /****End to rdirect the suitelet when New Address button Clicked****/
                }

                /****Start to check status value of Map reduce from custom record****/

                var config = objFormAddressList.addButton({
                    id: 'configuration',
                    label: 'Configuration',
                    functionName: 'config'
                });

                var recObj = record.load({
                    type: 'customrecord_p1_task_status',
                    id: 1
                });

                var statusrec = recObj.getValue('name');
                if (statusrec) {
                    var checkStatus = task.checkStatus(statusrec);
                }

                if (checkStatus.status == 'COMPLETE') {
                    config.isDisabled = false;
                } else if (checkStatus.status == null || checkStatus.status == undefined) {
                    config.isDisabled = false;
                } else {
                    config.isDisabled = true;
                }
                /****End to check status value of Map reduce from custom record****/

                context.response.writePage({
                    pageObject: objFormAddressList
                });
            } catch (e) {
                log.debug('Error in objFormAddressList ', e);
            }

        }

        return {
            onRequest: onRequest
        };
    });