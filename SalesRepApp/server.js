/**
* @NApiVersion 2.x
* @NScriptType Suitelet
*/

define(['N/https', 'N/record', 'N/email', 'N/search', 'N/task', 'N/runtime', 'N/url', 'N/format'],
    function callbackFunction(https, record, email, search, task, runtime, url, format) {
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
                var getOOHs = params.getOOHs;
                var getBackOrders = params.getBackOrders;
                var getBackSales = params.getBackSales;
                var getBlankUsers = params.getBlankUsers;
                var updateAddress = params.updateAddress;
                var getIFRecords = params.getIFRecords;
                var createIFRecords = params.createIFRecords;
                var soid = params.soid;
                var getIFTracking = params.getIFTracking;
                var getAvgUnits = params.getAvgUnits;
                var getAvgShipped = params.getAvgShipped;
                var getOrders = params.getOrders;
                var getGiftLists = params.getGiftLists;
                var getItemInfo = params.getItemInfo;
                var getAccruedPO = params.getAccruedPO;
                var getLess20 = params.getLess20;
                var getOPOrders = params.getOPOrders;
                var getShippingItems = params.getShippingItems;
                var exportPackList = params.exportPackList;

                if (getShippingItems) {
                    var res = [];
                    search.create({
                        type: 'shipitem',
                        filters: [
                            ['isinactive', 'is', false]
                        ],
                        columns: ['itemid']
                    }).run().each(function(result) {
                        res.push({
                            id: result.id,
                            value: result.getValue('itemid')
                        });
                        return true;
                    });

                    context.response.write(JSON.stringify(res));
                }

                if (exportPackList) {
                    var soIds = JSON.parse(params.so);
                    var res = {};

                    var searchResults = search.create({
                        type: 'salesorder',
                        filters: [
                            ['internalid', 'anyof', soIds],
                            'and', ['mainline', 'is', false],
                            'and', ['shipping', 'is', false],
                            'and', ['taxline', 'is', false]
                        ],
                        // columns: ['item', 'quantity', 'item.memberitem', 'item.memberquantity', 'tranid', 'itemtype']
                        columns: ['item', 'quantity', 'tranid', 'itemtype']
                    })

                    var pagedData = searchResults.runPaged({pageSize : 1000});
                    for (var i = 0; i < pagedData.pageRanges.length; i++) {
                        var currentPage = pagedData.fetch(i);
                        currentPage.data.forEach(function(result) {
                            if (result.getValue('itemtype') != 'Discount') {
                                var item = result.getText('item');
                                if (typeof res[item] == 'undefined') {
                                    res[item] = Number(result.getValue('quantity'));
                                } else {
                                    res[item] += Number(result.getValue('quantity'));
                                }
                            }
                        })
                    }

                    var result = [];
                    for (item in res) {
                        result.push({
                            item: item,
                            qty: res[item]
                        })
                    }
                    context.response.write(JSON.stringify(result));
                }

                if (createIFRecords) {
                    var shipstatus = params.shipstatus; 
                    var shipdate = params.shipdate;
                    var shipmethod = params.shipmethod;
                    var warehouse = params.warehouse;
                    var so = params.so;
                    var shipgroup = params.shipgroup;

                    if (warehouse == "Baltimore") {
                        warehouse = 1;
                    } else if (warehouse == 'Neesvigs') {
                        warehouse = 2;
                    } else if (warehouse == 'CA Bakery') {
                        warehouse = 12;
                    } else if (warehouse == 'RealCold - West') {
                        warehouse = 18;
                    } else if (warehouse == 'RealCold - East') {
                        warehouse = 19;
                    }

                    // Run Map/Reduce Script
                    var mrScript = task.create({taskType: task.TaskType.MAP_REDUCE});
                    mrScript.scriptId = 'customscript_mr_create_item_fulfillment';
                    mrScript.deploymentId = 'customdeploy_mr_create_item_fulfillment';
                    mrScript.params = {
                        custscript_sales_order: so, 
                        custscript_shipgroup: shipgroup,
                        custscript_shipstatus: shipstatus, 
                        custscript_shipdate: shipdate,
                        custscript_shipmethod: shipmethod,
                        custscript_warehouse: warehouse
                    };
                    
                    mrScript.submit();

                    return;
                }

                if (getIFRecords) {
                    var shipdatefrom = params.shipdatefrom;
                    var shipdateto = params.shipdateto;
                    var shiptype = params.shiptype;

                    var salesOrders = [];
                    var prior;
                    var priorItemCnt = 0;
                    var backOrder = true;
                    var fulfilledFg = false;
                    var obj = {};

                    var schId1 = "customsearch_restrict_item_fulfillment";
                    var schId2 = "customsearch_restrict_item_fulfillment_2";
                    var schId3 = "customsearch_restrict_item_fulfillment_3";

                    if (ignorelabels == "true") {
                        schId1 = "customsearch_restrict_if_temp1";
                        schId2 = "customsearch_restrict_if_temp2";
                    }

                    var searchResults = search.load({
                        id: schId1
                    })
                    
                    // if (warehouse) {
                    //     searchResults.filters.push(search.createFilter({
                    //         name: 'location',
                    //         operator: search.Operator.IS,
                    //         values: [LOCS[warehouse]]
                    //     }));
                    // }

                    if (shipmethod && shipmethod != 0 && ignorelabels == "false") {
                        searchResults.filters.push(search.createFilter({
                            name: 'custcol_cwgp_bestshipping',
                            operator: search.Operator.IS,
                            values: [shipmethod]
                        }));
                    }

                    if (shipdatefrom) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_hold_date',
                            operator: search.Operator.ONORAFTER,
                            values: [shipdatefrom]
                        }));
                    }

                    if (shipdateto) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_hold_date',
                            operator: search.Operator.ONORBEFORE,
                            values: [shipdateto]
                        }));
                    }
                    
                    // if (orderform > 0) {
                    //     searchResults.filters.push(search.createFilter({
                    //         name: 'customform',
                    //         operator: search.Operator.IS,
                    //         values: [orderform]
                    //     }));
                    // }
                    var resultSet = searchResults.run();

                    var currentRange = resultSet.getRange({
                        start : 0,
                        end : 1000
                    });
                    
                    var i = 0;  // iterator for all search results
                    var j = 0;  // iterator for current result range 0..999
                    var results = [];
                    while (j < currentRange.length) {
                        results.push(currentRange[j]);
                        i++; j++;
                        if (j == 1000) {   // check if it reaches 1000
                            j = 0;          // reset j an reload the next portion
                            currentRange = resultSet.getRange({
                                start : i,
                                end : i + 1000
                            });
                        }
                    }
                    
                    var resultLast = currentRange[0];

                    // add another filter creteria
                    searchResults = search.load({
                        id: schId2
                    });

                    // if (warehouse) {
                    //     searchResults.filters.push(search.createFilter({
                    //         name: 'location',
                    //         operator: search.Operator.IS,
                    //         values: [LOCS[warehouse]]
                    //     }));
                    // }

                    if (shipmethod && shipmethod != 0 && ignorelabels == "false") {
                        searchResults.filters.push(search.createFilter({
                            name: 'custcol_cwgp_bestshipping',
                            operator: search.Operator.IS,
                            values: [shipmethod]
                        }));
                    }

                    if (shipdatefrom) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_hold_date',
                            operator: search.Operator.ONORAFTER,
                            values: [shipdatefrom]
                        }));
                    }

                    if (shipdateto) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_hold_date',
                            operator: search.Operator.ONORBEFORE,
                            values: [shipdateto]
                        }));
                    }
                    
                    resultSet = searchResults.run();
                    currentRange = resultSet.getRange({
                        start : 0,
                        end : 1000
                    });
                    var i = 0;  // iterator for all search results
                    var j = 0;  // iterator for current result range 0..999
                    while (j < currentRange.length) {
                        results.push(currentRange[j]);
                        i++; j++;
                        if (j == 1000) {   // check if it reaches 1000
                            j = 0;          // reset j an reload the next portion
                            currentRange = resultSet.getRange({
                                start : i,
                                end : i + 1000
                            });
                        }
                    }

                    if (results.length != 0) {
                        results.push(resultLast);
                    }
                    

                    var itemShipType = '';
                    results.forEach(function(result, idx) {
                        var columns = result.columns;
                        var flag = false;
                        var currId = result.getValue(columns[0]);

                        if (idx == results.length - 1) {
                            currId = "Fake: To get the real last info";
                        }

                        if (prior != currId) {
                            prior = currId;
                            
                            if (!backOrder && !fulfilledFg && obj.so !== undefined && obj.isBestShipping) {
                                if ((orderform == SINGLE_FORM && priorItemCnt == 1) || (orderform == MULTI_FORM && priorItemCnt > 1) || (orderform == 0)) { // Ashley asked to change this shipment filter to find the order with single or multiple items instead of form 11/7/2023
                                    if (obj.location.length > 0) {
                                        if (itemShipType.indexOf('Ice') != -1) {
                                            obj.shiptype = 'Ice';
                                        } else if (itemShipType.indexOf('Gel') != -1) {
                                            obj.shiptype = 'Gel';
                                        } else if (itemShipType.indexOf('Dry') != -1) {
                                            obj.shiptype = 'Dry';
                                        }
    
                                        if (shiptype == 'All' || obj.shiptype == shiptype) {
                                            if (giftcert == "false") {
                                                salesOrders.push(obj);   
                                            } else {
                                                if (obj.gcFlag) {
                                                    salesOrders.push(obj);
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            priorItemCnt = 0;
                            obj = {};
                            obj.location = [];
                            backOrder = false;
                            fulfilledFg = false;
    
                            obj.so = result.getValue(columns[0]);
                            obj.soid = result.getValue(columns[7]);
                            obj.customer = result.getText(columns[1]);
                            obj.amount = result.getValue(columns[4]);
                            obj.shippingMethod = result.getText(columns[16]);
                            obj.shippingZipTo = result.getValue(columns[18]);
                            obj.shippingState = result.getValue(columns[19]);
                            obj.holdDate = result.getValue(columns[6]);
                            obj.brand = result.getText(columns[11]);
                            obj.shiptype = '';
                            obj.orderform = result.getValue(columns[15]);
                            obj.gcFlag = true;
                            obj.isBestShipping = true;
                            itemShipType = '';
                            
                            if (obj.orderform == MULTI_FORM) {
                                obj.shipgroup = 2;
                            } else {
                                obj.shipgroup = 1;
                            }
                        }

                        // if (obj.orderform != MULTI_FORM && result.getValue(columns[5]) > 0) {
                        if (result.getValue(columns[5]) > 0) {
                            backOrder = true;
                        }

                        if (obj.orderform != MULTI_FORM && result.getValue(columns[5]) == 0) {
                            obj.location.push(result.getValue(columns[3]));        
                        }

                        if (obj.orderform == MULTI_FORM) {
                            obj.location.push(result.getValue(columns[3]));        
                        }

                        if (!result.getValue(columns[16])) {
                            obj.isBestShipping = false;
                        }

                        if (result.getValue(columns[8]) == "Item Fulfillment") {
                            fulfilledFg = true;
                        }
                        
                        if (giftcert == "true" && obj.gcFlag) {
                            if (GIFT_CERTS.indexOf(result.getText(columns[14])) == -1) {
                                obj.gcFlag = false;
                            }
                        }

                        itemShipType += result.getText(columns[12]);
                        priorItemCnt ++;
                    });

                    // add check/invoice filter creteria
                    /*searchResults = search.load({
                        id: schId3
                    });

                    if (brand && brand != 0) {
                        searchResults.filters.push(search.createFilter({
                            name: 'department',
                            operator: search.Operator.IS,
                            values: [brand]
                        }));
                    }

                    if (shipmethod && shipmethod != 0 && ignorelabels == "false") {
                        searchResults.filters.push(search.createFilter({
                            name: 'shipmethod',
                            operator: search.Operator.IS,
                            values: [shipmethod]
                        }));
                    }

                    if (shiptype == "Dry") {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_ship_type',
                            operator: search.Operator.IS,
                            values: ['Dry']
                        }));
                    }

                    if (shiptype == "Ice") {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_ship_type',
                            operator: search.Operator.CONTAINS,
                            values: ['Ice']
                        }));
                    }

                    if (shipdatefrom) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_hold_date',
                            operator: search.Operator.ONORAFTER,
                            values: [shipdatefrom]
                        }));
                    }

                    if (shipdateto) {
                        searchResults.filters.push(search.createFilter({
                            name: 'custbody_hold_date',
                            operator: search.Operator.ONORBEFORE,
                            values: [shipdateto]
                        }));
                    }
                    
                    resultSet = searchResults.run();
                    currentRange = resultSet.getRange({
                        start : 0,
                        end : 1000
                    });
                    
                    var i = 0;  // iterator for all search results
                    var j = 0;  // iterator for current result range 0..999
                    var flag = false;
                    var backOrder = false;
                    var prior = "";
                    var skip = false;
                    obj = {};
                    while (j < currentRange.length) {
                        var result = currentRange[j];
                        var columns = result.columns;
                        if ((result.getText(columns[16]) == '5- Check' || result.getText(columns[16]) == '7- Invoice' || result.getText(columns[16]) == '') && result.id != prior) {
                            if (obj.so !== undefined && !backOrder) {
                                salesOrders.push(obj);
                            }
                            flag = true;
                            backOrder = false;
                            skip = false;
                            prior = result.id;

                            obj = {};
                            obj.location = [];

                            obj.so = result.getValue(columns[0]);
                            obj.soid = result.getValue(columns[7]);
                            obj.customer = result.getText(columns[1]);
                            obj.amount = result.getValue(columns[4]);
                            obj.shippingMethod = result.getText(columns[10]);
                            obj.holdDate = result.getValue(columns[6]);
                            obj.brand = result.getText(columns[11]);
                            obj.shiptype = result.getValue(columns[12]);
                            obj.orderform = result.getValue(columns[15]);

                            if (result.getValue(columns[5]) > 0) {
                                backOrder = true;
                            }
                        } else {
                            if (result.id == prior) {
                                if (!skip) {
                                    if (result.getValue(columns[5]) > 0) {
                                        backOrder = true;
                                    }
                                    if (flag && result.id == prior) {
                                        obj.location.push(result.getValue(columns[3]));   
                                    } else {
                                        flag = false;
                                    }
                                }
                            } else {
                                skip = true;
                                prior = result.id;
                            }
                        }

                        i++; j++;
                        if (j == 1000) {   // check if it reaches 1000
                            j = 0;          // reset j an reload the next portion
                            currentRange = resultSet.getRange({
                                start : i,
                                end : i + 1000
                            });
                        }
                    } */
                    
                    // if (obj.so !== undefined) {
                    //     salesOrders.push(obj);
                    // } 

                    result = [];
                    salesOrders.forEach(function(so) {
                        if (ignorelabels == "true") {
                            var flag = false;
                            if (so.shippingMethod.indexOf("UP2") != -1 || so.shippingMethod.indexOf("UPN") != -1) {
                                flag = true;
                            }

                            so.location.forEach(function(loc) {
                                if (loc == warehouse)
                                    flag = true;
                            });
        
                            if (flag) {
                                so.location = warehouse;
                                result.push(so);
                            }
                        } else {
                            var flag = false;
                            if (typeof so.location == 'object') {
                                so.location.forEach(function(loc) {
                                    if (loc == warehouse)
                                        flag = true;
                                });
                            } else {
                                if (so.location == warehouse) {
                                    flag = true;
                                }
                            }
        
                            if (flag) {
                                so.location = warehouse;
                                result.push(so);
                            }
                        }
                    })

                    context.response.write(JSON.stringify(result));
                }

            } catch(e) {
                log.error("Error", e);
            }
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