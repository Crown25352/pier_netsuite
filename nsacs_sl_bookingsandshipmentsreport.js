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

                var form = serverWidget.createForm({title : 'Bookings and Shipments Report'});

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

                if(reportEndingDate){
                    reportEndingDateField.defaultValue = (convertDate(reportEndingDate));
                }
                
                totalMonthWorkDaysField.defaultValue = (totalMonthWorkDays);
                mtdWorkDaysField.defaultValue = (mtdWorkDays);

                if(reportEndingDate && totalMonthWorkDays && mtdWorkDays){
                    reportHtmlField.defaultValue = htmlReport(convertDate(reportEndingDate), totalMonthWorkDays, mtdWorkDays);
                }

                form.clientScriptModulePath = './nsacs_cs_bookingsandshipmentsreport.js';
                scriptContext.response.writePage(form);
                
                var remainingUsage = currentScript.getRemainingUsage();
                log.debug('remainingUsage', remainingUsage);
            }
            catch (e){
                log.debug('Main Function Error', e);
            }
        }

        function htmlReport(reportEndingDate, totalMonthWorkDays, mtdWorkDays){
            var accountingPeriodRecordId;

            var accountingperiodSearchObj = search.create({
                type: "accountingperiod",
                filters:
                [
                    ["isyear","is","T"], 
                    "AND", 
                    ["startdate","on",getYearFirstDate(reportEndingDate)]
                ],
                columns:
                [
                    search.createColumn({name: "internalid", label: "Internal ID"}),
                    search.createColumn({name: "periodname", sort: search.Sort.ASC, label: "Name"})
                ]
            });
            
            accountingperiodSearchObj.run().each(function(result){
                accountingPeriodRecordId = result.getValue({name: "internalid", label: "Internal ID"});
                //return true;
            });

            var html = "";            
            
            html += "<h1>Bookings</h1>";
            html += htmlReportStart();
    		html += htmlBookingsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, accountingPeriodRecordId);
            html += htmlReportEnd();
            
            html += "<hr />";            
            
            html += "<h1>Shipments</h1>";
            html += htmlReportStart();
    		html += htmlShipmentsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, accountingPeriodRecordId);
            html += htmlReportEnd();
    	
    	    return html;
        }

        function htmlReportStart(){
            var html = "";
            
            html += "<table style='width: 100%;'>";

            return html;
        }
        
        function htmlReportEnd(){
            var html = "";

            html += "</table>";

            return html;
        }

        function htmlBookingsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, accountingPeriodRecordId){
            //START TABLE HEADER
            var html = "";

            html += "<tr>";
            html += "<td><b>Location</b></td>";
            html += "<td><b>Bookings</b></td>";
            html += "<td><b>MTD D<br/>Avg</b></td>";
            html += "<td><b>MTD<br/>Bookings</b></td>";
            html += "<td><b>Run Rate<br/>Bookings</b></td>";
            html += "<td><b>Full M<br/>Budget</b></td>";
            html += "<td><b>MTD<br/>Budget</b></td>";
            html += "<td><b>Var % vs Act</b></td>";
            html += "<td><b>Var $$$ vs Act</b></td>";
            html += "<td><b>Total<br/>Backlog</b></td>";
            html += "<td><b>Curr M<br/>Released Backlog</b></td>";
            html += "<td><b>Pending Approval<br/>Backlog</b></td>";
            html += "<td><b>Past Due</b></td>";
            html += "</tr>";            

            //START CONSTANTS
            var reportStartDate = getMonthFirstDate(reportEndingDate);
            log.debug('reportStartDate', reportStartDate);
            
            var fullMonthBudget = 0;

            var budgetimportSearchObj = search.create({
                type: "budgetimport",
                filters:
                [
                    ["year","anyof",accountingPeriodRecordId],
                    "AND", 
                    ["account","anyof","54"]
                ],
                columns:
                [
                    search.createColumn({name: "internalid", label: "Internal ID"})
                ]
            });
            
            budgetimportSearchObj.run().each(function(result){
                var budgetRecordId = result.getValue({name: "internalid", label: "Internal ID"});
                var budgetRecord = record.load({type: 'budgetImport', id: budgetRecordId});

                var periodAmountFieldName = 'periodamount' + Number(getMonth(reportEndingDate));
                fullMonthBudget += Number(budgetRecord.getValue(periodAmountFieldName));

                //return true;
            });

            var mtdBudget = fullMonthBudget * (mtdWorkDays/totalMonthWorkDays);

            //START LOOP

            var locationSearchObj = search.create({
                type: "location",
                filters:
                [
                    ["isinactive","is","F"]
                ],
                columns:
                [
                    search.createColumn({name: "internalid", label: "Internal ID"}),
                    search.createColumn({name: "name", sort: search.Sort.ASC, label: "Name"})
                ]
            });
            
            locationSearchObj.run().each(function(result){

                var locationRecordId = result.getValue({name: "internalid", label: "Internal ID"});
                var locationName = result.getValue({name: "name", sort: search.Sort.ASC, label: "Name"});

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
                        ["trandate","within",reportStartDate,reportEndingDate], 
                        "AND", 
                        ["location","anyof",locationRecordId]
                    ],
                    columns:
                    [
                        search.createColumn({name: "formulacurrency", summary: "SUM", formula: "ROUND({amount}/1000,2)", label: "MTD D Avg"}),
                        search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} IN ('Pending Approval', 'Pending Fulfillment') THEN ROUND({amount}/1000,2) ELSE 0 END", label: "MTD Bookings"}),
                        search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} IN ('Pending Approval', 'Pending Fulfillment') THEN ROUND({amount}/1000,2) WHEN {status} = 'Partially Fulfilled' THEN ROUND((({quantity}-NVL({quantitycommitted},0)-NVL({quantityshiprecv},0))*{rate})/1000,2) ELSE 0 END", label: "Total Backlog"}),
                        search.createColumn({name: "formulacurrency", summary: "SUM", formula: "CASE WHEN {status} = 'Pending Approval' THEN ROUND({amount}/1000,2) ELSE 0 END", label: "Pending Approval Backlog"}),
                    ]
                });

                salesorderSearchObj.run().each(function(result){
                    var resultJsonString = JSON.stringify(result);
                    var resultJson = JSON.parse(resultJsonString);
                    //log.debug('resultJson', resultJson);
    
                    mtdAvg = resultJson.values['SUM(formulacurrency)'];
                    mtdBookings = resultJson.values['SUM(formulacurrency)_1'];
                    totalBacklog = resultJson.values['SUM(formulacurrency)_2'];
                    pendingApprovalBacklog = resultJson.values['SUM(formulacurrency)_3'];
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
                    runRateBookings = (mtdAvg * totalMonthWorkDays) - totalMonthWorkDays;
                }

                if(mtdBookings != 0){                    
                    varPercentageVsAct = ((mtdBudget - mtdBookings)/mtdBookings)*100;
                    varAmountVsAct = (mtdBudget - mtdBookings)/mtdBookings;
                }

                var fullMonthBudgetLine = fullMonthBudget;
                var mtdBudgetLine = mtdBudget;

                if(Number(mtdBookings) == 0){
                    fullMonthBudgetLine = 0;
                    mtdBudgetLine = 0;
                }

                html += "<tr>";
                html += "<td>" + locationName + "</td>";
                html += "<td>" + formatNumber(bookings) + "</td>";
                html += "<td>" + formatNumber(mtdAvg) + "</td>";
                html += "<td>" + formatNumber(mtdBookings) + "</td>";
                html += "<td>" + formatNumber(runRateBookings) + "</td>";
                html += "<td>" + formatNumber(fullMonthBudgetLine) + "</td>";
                html += "<td>" + formatNumber(mtdBudgetLine) + "</td>";
                html += "<td>" + formatNumber(varPercentageVsAct) + "</td>";
                html += "<td>" + formatNumber(varAmountVsAct) + "</td>";
                html += "<td>" + formatNumber(totalBacklog) + "</td>";
                html += "<td>" + formatNumber(currentMonthReleasedBacklog) + "</td>";
                html += "<td>" + formatNumber(pendingApprovalBacklog) + "</td>";
                html += "<td>" + formatNumber(pastDue) + "</td>";
                html += "</tr>";

                return true;
            });

            return html;
        }

        function htmlShipmentsReportBody(reportEndingDate, totalMonthWorkDays, mtdWorkDays, accountingPeriodRecordId){            
            var html = "";

            html += "<tr>";
            html += "<td><b>Location</b></td>";
            html += "<td><b>Shipments</b></td>";
            html += "<td><b>MTD D<br/>Avg</b></td>";
            html += "<td><b>MTD<br/>Shipments</b></td>";
            html += "<td><b>Run Rate<br/>Shipments</b></td>";
            html += "<td><b>Full M<br/>Budget</b></td>";
            html += "<td><b>MTD<br/>Budget</b></td>";
            html += "<td><b>Var % vs Act</b></td>";
            html += "<td><b>Var $$$ vs Act</b></td>";
            html += "</tr>";

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
