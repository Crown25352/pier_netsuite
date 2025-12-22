/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/format', 'N/http', 'N/query', 'N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{format} format
 * @param{http} http
 * @param{query} query
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (format, http, query, record, runtime, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                var currentScript = runtime.getCurrentScript();
                var remainingUsage = currentScript.getRemainingUsage();
                log.debug('remainingUsage', remainingUsage);

                var form = serverWidget.createForm({title : 'Bookings and Shipments  Report'});

                var reportHtmlField = form.addField({
                    id: 'custpage_report',
                    label: ' ',
                    type: serverWidget.FieldType.INLINEHTML,
                    container: 'reportfieldgroup'
                });
                
                var reportEndingDateField = form.addField({
                    id : 'custpage_date',
                    type : serverWidget.FieldType.DATE,
                    label : 'Date'
                });
                
                var totalMonthWorkDaysField = form.addField({
                    id : 'custpage_totalmonthworkdays',
                    type : serverWidget.FieldType.INTEGER,
                    label : 'Total Month Work Days'
                });
                
                var mtdWorkDaysField = form.addField({
                    id : 'custpage_mtdworkdays',
                    type : serverWidget.FieldType.INTEGER,
                    label : 'MTD Work Days'
                });

                var reportEndingDate = scriptContext.request.parameters['date'];
                var totalMonthWorkDays = scriptContext.request.parameters['totaldays'];
                var mtdWorkDays = scriptContext.request.parameters['mtddays'];
                var fullMonthBookingsBudget = scriptContext.request.parameters['bbudget'];
                var fullMonthShipmentsBudget = scriptContext.request.parameters['sbudget'];

                if(reportEndingDate){
                    reportEndingDateField.defaultValue = (convertDate(reportEndingDate));
                }
                
                totalMonthWorkDaysField.defaultValue = (totalMonthWorkDays);
                mtdWorkDaysField.defaultValue = (mtdWorkDays);

                if(reportEndingDate && totalMonthWorkDays && mtdWorkDays && fullMonthBookingsBudget && fullMonthShipmentsBudget){
                    reportHtmlField.defaultValue = htmlReport(convertDate(reportEndingDate), totalMonthWorkDays, mtdWorkDays, fullMonthBookingsBudget, fullMonthShipmentsBudget);
                }

                form.clientScriptModulePath = './nsacs_cs_bookingsandshipmentsreport_v2.js';
                scriptContext.response.writePage(form);
                
                var remainingUsage = currentScript.getRemainingUsage();
                log.debug('remainingUsage', remainingUsage);
            }
            catch (e){
                log.debug('Main Function Error', e);
            }
        }

        function htmlReport(reportEndingDate, totalMonthWorkDays, mtdWorkDays, fullMonthBookingsBudget, fullMonthShipmentsBudget){
            var html = "";            
            
            html += "<h1>Bookings</h1>";
            html += htmlReportStart();
    		html += htmlBookingsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, fullMonthBookingsBudget);
            html += htmlReportEnd();
            
            html += "<h1>Shipments</h1>";
            html += htmlReportStart();
    		html += htmlShipmentsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, fullMonthShipmentsBudget);
            html += htmlReportEnd();
    	
    	    return html;
        }

        function htmlReportStart(){
            var html = "";
            
            html += "<table class='hovertable' style='width: 100%;'>";

            return html;
        }
        
        function htmlReportEnd(){
            var html = "";

            html += "</table>";

            return html;
        }

        function htmlBookingsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, fullMonthBudget){
            //START TABLE HEADER
            var html = "";

            html += "<style type='text/css'>";
            html += "table, th, td {border-collapse: collapse;}";
            html += "td.bottomborder {border-bottom: 1px solid #e3e3e3; line-height:200%;}";
            html += ".hovertable tr:hover {background-color: #e3e3e3}";
            html += "</style>";

            html += "<tr>";
            html += "<td class='bottomborder'><b>Location</b></td>";
            html += "<td class='bottomborder' align='right'><b>Bookings</b></td>";
            html += "<td class='bottomborder' align='right'><b>MTD D Avg</b></td>";
            html += "<td class='bottomborder' align='right'><b>MTD Bookings</b></td>";
            html += "<td class='bottomborder' align='right'><b>Run Rate Bookings</b></td>";
            html += "<td class='bottomborder' align='right'><b>Full M Budget</b></td>";
            html += "<td class='bottomborder' align='right'><b>MTD Budget</b></td>";
            html += "<td class='bottomborder' align='right'><b>Var % vs Act</b></td>";
            html += "<td class='bottomborder' align='right'><b>Var $$$ vs Act</b></td>";
            html += "<td class='bottomborder' align='right'><b>Total Backlog</b></td>";
            html += "<td class='bottomborder' align='right'><b>Curr M Released Backlog</b></td>";
            html += "<td class='bottomborder' align='right'><b>Pending Approval Backlog</b></td>";
            html += "<td class='bottomborder' align='right'><b>Past Due</b></td>";
            html += "</tr>";            

            //START CONSTANTS
            var reportStartDate = getMonthFirstDate(reportEndingDate);
            log.debug('reportStartDate', reportStartDate);

            var fullMonthBudgetNew = fullMonthBudget/1000;
            var mtdBudget = fullMonthBudgetNew * (mtdWorkDays/totalMonthWorkDays);

            //START LOOP
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters:
                [
                    ["type","anyof","SalesOrd"], 
                    "AND", 
                    ["mainline","is","F"], 
                    "AND", 
                    ["shipping","is","F"], 
                    "AND", 
                    ["taxline","is","F"], 
                    "AND", 
                    ["item","noneof","254","269"], 
                    "AND", 
                    ["trandate","within",reportStartDate,reportEndingDate]
                ],
                columns:
                [
                    search.createColumn({name: "location", summary: "GROUP", label: "Location"}),
                    search.createColumn({name: "formulacurrency", summary: "SUM", formula: "ROUND({amount}/1000,2)", label: "MTD D Avg"}),
                    search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} IN ('Pending Approval', 'Pending Fulfillment') THEN ROUND({amount}/1000,2) ELSE 0 END", label: "MTD Bookings"}),
                    search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} IN ('Pending Approval', 'Pending Fulfillment') THEN ROUND({amount}/1000,2) WHEN {status} = 'Partially Fulfilled' THEN ROUND((({quantity}-NVL({quantitycommitted},0)-NVL({quantityshiprecv},0))*{rate})/1000,2) ELSE 0 END", label: "Total Backlog"}),
                    search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} = 'Pending Approval' THEN ROUND({amount}/1000,2) ELSE 0 END", label: "Pending Approval Backlog"}),
                ]
            });

            salesorderSearchObj.run().each(function(result){  
                var bookings = 0;
                var mtdAvg = 0;
                var mtdBookings = 0;
                var runRateBookings = 0;
                var varPercentageVsAct = 0;
                var varAmountVsAct = 0;
                var totalBacklog = 0;
                var currentMonthReleasedBacklog = 0;
                var pendingApprovalBacklog = 0;
                var pastDue = 0;

                var resultJsonString = JSON.stringify(result);
                var resultJson = JSON.parse(resultJsonString);
                //log.debug('resultJson', resultJson);

                var locationRecordId = resultJson.values['GROUP(location)'][0].value;
                var locationName = resultJson.values['GROUP(location)'][0].text;
                //log.debug('locationRecordId', locationRecordId);
                //log.debug('locationName', locationName);

                if(!locationRecordId){
                    locationRecordId = "@NONE@";
                }

                mtdAvg = resultJson.values['SUM(formulacurrency)'];
                mtdBookings = resultJson.values['SUM(formulacurrency)_1'];
                totalBacklog = resultJson.values['SUM(formulacurrency)_2'];
                pendingApprovalBacklog = resultJson.values['SUM(formulacurrency)_3'];

                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    filters:
                    [
                        ["type","anyof","SalesOrd"], 
                        "AND", 
                        ["mainline","is","F"], 
                        "AND", 
                        ["shipping","is","F"], 
                        "AND", 
                        ["taxline","is","F"], 
                        "AND", 
                        ["item","noneof","254","269"], 
                        "AND", 
                        ["trandate","on",reportEndingDate], 
                        "AND", 
                        ["location","anyof",locationRecordId]
                    ],
                    columns:
                    [
                        search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} IN ('Pending Approval', 'Pending Fulfillment') THEN ROUND({amount}/1000,2) ELSE 0 END", label: "Bookings"}),
                    ]
                });

                salesorderSearchObj.run().each(function(result){
                    var resultJsonString = JSON.stringify(result);
                    var resultJson = JSON.parse(resultJsonString);
                    //log.debug('resultJson', resultJson);
    
                    bookings = resultJson.values['SUM(formulacurrency)'];
                    //return true;
                });               

                if(mtdBookings != 0){
                    var salesorderSearchObj = search.create({
                        type: "salesorder",
                        filters:
                        [
                            ["type","anyof","SalesOrd"], 
                            "AND", 
                            ["mainline","is","F"], 
                            "AND", 
                            ["shipping","is","F"], 
                            "AND", 
                            ["taxline","is","F"], 
                            "AND", 
                            ["item","noneof","254","269"], 
                            "AND", 
                            ["custbody_nacs_so_exp_ship_date","within",reportStartDate,reportEndingDate], 
                            "AND", 
                            ["location","anyof",locationRecordId]
                        ],
                        columns:
                        [
                            search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} = 'Pending Fulfillment' THEN ROUND({amount}/1000,2) ELSE 0 END", label: "Curr M Released Backlog"}),
                        ]
                    });
                    
                    salesorderSearchObj.run().each(function(result){
                        var resultJsonString = JSON.stringify(result);
                        var resultJson = JSON.parse(resultJsonString);
                        //log.debug('resultJson', resultJson);
        
                        currentMonthReleasedBacklog = resultJson.values['SUM(formulacurrency)'];
                        //return true;
                    });              
                } 

                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    filters:
                    [
                        ["type","anyof","SalesOrd"], 
                        "AND", 
                        ["mainline","is","F"], 
                        "AND", 
                        ["shipping","is","F"], 
                        "AND", 
                        ["taxline","is","F"], 
                        "AND", 
                        ["item","noneof","254","269"], 
                        "AND", 
                        ["custbody_nacs_so_exp_ship_date","before",reportEndingDate], 
                        "AND", 
                        ["location","anyof",locationRecordId]
                    ],
                    columns:
                    [
                        search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} = 'Pending Approval' THEN ROUND({amount}/1000,2) ELSE 0 END", label: "Past Due"})
                    ]
                });
                
                salesorderSearchObj.run().each(function(result){
                    var resultJsonString = JSON.stringify(result);
                    var resultJson = JSON.parse(resultJsonString);
                    //log.debug('resultJson', resultJson);
    
                    pastDue = resultJson.values['SUM(formulacurrency)'];
                    //return true;
                });

                if(mtdAvg != 0){   
                    mtdAvg = mtdAvg / mtdWorkDays;                 
                    runRateBookings = (mtdAvg * totalMonthWorkDays) - totalMonthWorkDays;
                }

                var varPercentageVsActLine = '';

                if(mtdBookings != 0){                    
                    varPercentageVsAct = ((mtdBudget - mtdBookings)/mtdBookings)*100;
                    varAmountVsAct = (mtdBudget - mtdBookings)/mtdBookings;

                    varPercentageVsActLine = formatNumber(varPercentageVsAct) + ' %';
                }

                var fullMonthBudgetLine = fullMonthBudgetNew;
                var mtdBudgetLine = mtdBudget;

                if(Number(mtdBookings) == 0){
                    fullMonthBudgetLine = 0;
                    mtdBudgetLine = 0;
                }

                html += "<tr>";
                html += "<td class='bottomborder'>" + locationName + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(bookings) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(mtdAvg) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(mtdBookings) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(runRateBookings) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(fullMonthBudgetLine) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(mtdBudgetLine) + "</td>";
                html += "<td class='bottomborder' align='right'>" + varPercentageVsActLine + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(varAmountVsAct) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(totalBacklog) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(currentMonthReleasedBacklog) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(pendingApprovalBacklog) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(pastDue) + "</td>";
                html += "</tr>";

                return true;
            });

            return html;
        }

        function htmlShipmentsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, fullMonthBudget){
            //START TABLE HEADER
            var html = "";

            html += "<style type='text/css'>";
            html += "table, th, td {border-collapse: collapse;}";
            html += "td.bottomborder {border-bottom: 1px solid #e3e3e3; line-height:200%;}";
            html += ".hovertable tr:hover {background-color: #e3e3e3}";
            html += "</style>";

            html += "<tr>";
            html += "<td class='bottomborder'><b>Location</b></td>";
            html += "<td class='bottomborder' align='right'><b>Shipments</b></td>";
            html += "<td class='bottomborder' align='right'><b>MTD D Avg</b></td>";
            html += "<td class='bottomborder' align='right'><b>MTD Shipments</b></td>";
            html += "<td class='bottomborder' align='right'><b>Run Rate Shipments</b></td>";
            html += "<td class='bottomborder' align='right'><b>Full M Budget</b></td>";
            html += "<td class='bottomborder' align='right'><b>MTD Budget</b></td>";
            html += "<td class='bottomborder' align='right'><b>Var % vs Act</b></td>";
            html += "<td class='bottomborder' align='right'><b>Var $$$ vs Act</b></td>";
            html += "</tr>";

            //START CONSTANTS
            var reportStartDate = getMonthFirstDate(reportEndingDate);
            log.debug('reportStartDate', reportStartDate);

            var fullMonthBudgetNew = fullMonthBudget/1000;
            var mtdBudget = fullMonthBudgetNew * (mtdWorkDays/totalMonthWorkDays);

            //START LOOP
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters:
                [
                    ["type","anyof","SalesOrd"], 
                    "AND", 
                    ["mainline","is","F"], 
                    "AND", 
                    ["shipping","is","F"], 
                    "AND", 
                    ["taxline","is","F"], 
                    "AND", 
                    ["item","noneof","254","269"], 
                    "AND", 
                    ["custbody_nacs_so_exp_ship_date","within",reportStartDate,reportEndingDate]
                ],
                columns:
                [
                    search.createColumn({name: "location", summary: "GROUP", label: "Location"}),
                    search.createColumn({name: "formulacurrency", summary: "SUM", formula: "ROUND({amount}/1000,2)", label: "MTD D Avg"}),
                    search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} IN ('Pending Approval', 'Pending Fulfillment') THEN ROUND({amount}/1000,2) ELSE 0 END",label: "MTD Shipments"}),
                    //search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} = 'Pending Approval' THEN ROUND({amount}/1000,2) ELSE 0 END", label: "Pending Approval Backlog"})
                ]
            });

            salesorderSearchObj.run().each(function(result){
                var shipments = 0;
                var mtdAvg = 0;
                var mtdShipments = 0;
                var runRateShipments = 0;
                var varPercentageVsAct = 0;
                var varAmountVsAct = 0;

                var resultJsonString = JSON.stringify(result);
                var resultJson = JSON.parse(resultJsonString);
                //log.debug('resultJson', resultJson);

                var locationRecordId = resultJson.values['GROUP(location)'][0].value;
                var locationName = resultJson.values['GROUP(location)'][0].text;

                if(!locationRecordId){
                    locationRecordId = "@NONE@";
                }

                mtdAvg = resultJson.values['SUM(formulacurrency)'];
                mtdShipments = resultJson.values['SUM(formulacurrency)_1'];
                //pendingApprovalBacklog = resultJson.values['SUM(formulacurrency)_2'];

                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    filters:
                    [
                        ["type","anyof","SalesOrd"], 
                        "AND", 
                        ["mainline","is","F"], 
                        "AND", 
                        ["shipping","is","F"], 
                        "AND", 
                        ["taxline","is","F"], 
                        "AND", 
                        ["item","noneof","254","269"], 
                        "AND", 
                        ["custbody_nacs_so_exp_ship_date","on",reportEndingDate], 
                        "AND", 
                        ["location","anyof",locationRecordId]
                    ],
                    columns:
                    [
                        search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} IN ('Pending Approval', 'Pending Fulfillment') THEN ROUND({amount}/1000,2) ELSE 0 END",label: "Shipments"}),
                    ]
                });

                salesorderSearchObj.run().each(function(result){
                    var resultJsonString = JSON.stringify(result);
                    var resultJson = JSON.parse(resultJsonString);
                    //log.debug('resultJson', resultJson);
    
                    shipments = resultJson.values['SUM(formulacurrency)'];
                    //return true;
                });

                

                if(mtdAvg != 0){
                    mtdAvg = mtdAvg / mtdWorkDays;                      
                    runRateShipments = (mtdAvg * totalMonthWorkDays) - totalMonthWorkDays;
                }

                var varPercentageVsActLine = '';

                if(mtdShipments != 0){                    
                    varPercentageVsAct = ((mtdBudget - mtdShipments)/mtdShipments)*100;
                    varAmountVsAct = (mtdBudget - mtdShipments)/mtdShipments;

                    varPercentageVsActLine = formatNumber(varPercentageVsAct) + ' %';
                }

                var fullMonthBudgetLine = fullMonthBudgetNew;
                var mtdBudgetLine = mtdBudget;

                if(Number(mtdShipments) == 0){
                    fullMonthBudgetLine = 0;
                    mtdBudgetLine = 0;
                }

                html += "<tr>";
                html += "<td class='bottomborder'>" + locationName + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(shipments) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(mtdAvg) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(mtdShipments) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(runRateShipments) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(fullMonthBudgetLine) + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(mtdBudgetLine) + "</td>";
                html += "<td class='bottomborder' align='right'>" + varPercentageVsActLine + "</td>";
                html += "<td class='bottomborder' align='right'>" + formatNumber(varAmountVsAct) + "</td>";
                html += "</tr>";

                return true;
            });

            return html;
        }

        function convertDate(dateString) {
            var month = dateString.substring(0, 2);
            var day = dateString.substring(2, 4);
            var year = dateString.substring(4, 8);

            return month + '/' + day + '/' + year;
        }

        function getYearFirstDate(dateString) {
            var year = dateString.substring(6, 10);

            var yearFirstDate = '1/1/' + year;

            return yearFirstDate;
        }        

        function getMonthFirstDate(dateString) {
            var month = dateString.substring(0, 2);
            var year = dateString.substring(6, 10);

            var monthFirstDate = month + '/1/' + year;

            return monthFirstDate;
        }

        function getMonth(dateString) {
            var month = dateString.substring(0, 2);

            return month;
        }

        function formatNumber(value) {
            var formattedNumber = Number(value).toFixed(2);

            if(formattedNumber != 0){                
                formattedNumber = formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            else{
                formattedNumber = '';
            }            
            
            return formattedNumber;
        }

        function formatCurrency(value) {
            var formattedNumber = Number(value).toFixed(2);
            formattedNumber = formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            if(Number(value) < 0){
                formattedNumber = "($" + formattedNumber.slice(1) + ")";
            }
            else{
                formattedNumber = "$" + formattedNumber;
            }

            return formattedNumber;
        }

        return {onRequest}

    });
