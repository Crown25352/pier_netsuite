/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/format', 'N/record', 'N/search', 'N/url'],
/**
 * @param{currentRecord} currentRecord
 * @param{format} format
 * @param{record} record
 * @param{search} search
 * @param{url} url
 */
function(currentRecord, format, record, search, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        if(scriptContext.fieldId == 'custpage_date' ||
           scriptContext.fieldId == 'custpage_totalmonthworkdays'){

            var currentRecord = scriptContext.currentRecord;

            var reportEndingDate = currentRecord.getValue('custpage_date');
            var totalMonthWorkDays = currentRecord.getValue('custpage_totalmonthworkdays');
            var mtdWorkDays = currentRecord.getValue('custpage_mtdworkdays');

            var output = url.resolveScript({
    		    scriptId: 'customscript_nsacs_sl_bookingandshipment',
    		    deploymentId: 'customdeploy_nsacs_sl_bookingandshipment'
    		});

            if(reportEndingDate){
                var date = new Date(reportEndingDate);

                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();

                var dateString = pad(month, 2) + pad(day, 2) + pad(year, 4);

                output = output + '&date=' + dateString;
            }

            if(totalMonthWorkDays){
                output = output + '&totaldays=' + totalMonthWorkDays;
            }

            if(reportEndingDate){
                var mtdWorkDays = getBusinessDatesCount(reportEndingDate);

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

                var fullMonthBookingsBudget = 0;
                var fullMonthShipmentsBudget = 0;

                var budgetimportSearchObj = search.create({
                    type: "budgetimport",
                    filters:
                    [
                        ["year","anyof",accountingPeriodRecordId],
                        "AND", 
                        ["account","anyof","54","108"]
                    ],
                    columns:
                    [
                        search.createColumn({name: "account", sort: search.Sort.ASC, label: "Account"}),
                        search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
                });
                
                budgetimportSearchObj.run().each(function(result){
                    var accountRecordId = result.getValue({name: "account", sort: search.Sort.ASC, label: "Account"});
                    console.log("accountRecordId: " + accountRecordId);

                    var budgetRecordId = result.getValue({name: "internalid", label: "Internal ID"});

                    var budgetRecord = record.load({type: 'budgetImport', id: budgetRecordId});

                    var periodAmountFieldName = 'periodamount' + Number(getMonth(reportEndingDate));

                    if(accountRecordId == "Sales: Final Assembly"){
                        fullMonthBookingsBudget += Number(budgetRecord.getValue(periodAmountFieldName));
                    }
                    else if(accountRecordId == "Shipping and Handling"){
                        fullMonthShipmentsBudget += Number(budgetRecord.getValue(periodAmountFieldName));
                    }

                    return true;
                });
                
                output = output + '&mtddays=' + mtdWorkDays;
                output = output + '&bbudget=' + fullMonthBookingsBudget;
                output = output + '&sbudget=' + fullMonthShipmentsBudget;
            }            

            window.onbeforeunload = null;
            window.location = output;
        }
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

    function getYearFirstDate(dateString) {
        var date = new Date(dateString);
        
        var year = date.getFullYear();

        var yearFirstDate = '1/1/' + year;

        return yearFirstDate;
    }

    function getMonth(dateString) {
        var date = new Date(dateString);
        
        var month = date.getMonth() + 1;

        return month;
    }

    function getBusinessDatesCount(dateString){
        var count = 0;

        var date = new Date(dateString);

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        
        var startDate =  new Date(month + '/1/' + year);
        var endDate =  new Date(month + '/' + day + '/' + year);
        
        const curDate = new Date(startDate.getTime());
        while (curDate <= endDate) {
            const dayOfWeek = curDate.getDay();
            if(dayOfWeek !== 0 && dayOfWeek !== 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        return count;
    }

    return {
        //pageInit: pageInit,
        fieldChanged: fieldChanged,
        //postSourcing: postSourcing,
        //sublistChanged: sublistChanged,
        //lineInit: lineInit,
        //validateField: validateField,
        //validateLine: validateLine,
        //validateInsert: validateInsert,
        //validateDelete: validateDelete,
        //saveRecord: saveRecord
    };
    
});
