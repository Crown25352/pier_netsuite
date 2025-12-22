/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/search', 'N/record'], function (runtime, search, record) {
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {

        /**** Search on Shipments Record Start ****/

        var shipmentVal;

        var customrecord_p1_addressesSearchObj = search.create({
            type: "customrecord_p1_addresses",
            filters:
                [
                ],
            columns:
                [
                    search.createColumn({ name: "internalid", label: "Internal ID" }),
                    search.createColumn({ name: "name", label: "Name" })
                ]
        });
        var searchResultCount = customrecord_p1_addressesSearchObj.runPaged().count;
        log.debug("customrecord_p1_addressesSearchObj result count", searchResultCount);

        return customrecord_p1_addressesSearchObj;

        // var customrecord_SearchObj = search.create({
        //     type: "customrecord_p1_log_details",
        //     filters: [
        //         ["created", "within", "lastyear"]
        //     ],
        //     columns: [
        //         search.createColumn({
        //             name: "internalid",
        //             label: "Internal ID"
        //         })
        //     ]
        // });
        // var searchResultCount = customrecord_SearchObj.runPaged().count;
        // //var searchResultCount = customrecord_SearchObj.run();
        // log.debug("customrecord_SearchObj result count shipment", searchResultCount);
        // /**** End ****/

        // return customrecord_SearchObj;

    }
    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(mapContext) {
        var recId = mapContext.key
        // log.debug({
        //     title: 'mapContext.key',
        //     details: recId
        // });
        // log.debug({
        //     title: 'mapContext.value',
        //     details: mapContext.value
        // })

        var value = JSON.parse(mapContext.value)
        log.debug({
            title: 'Map value',
            details: value
        })
        mapContext.write({
            key: value.id,
            value: value
        })

        var recordInternal = value.id;
        var recType = value.recordType;
        // log.debug('recType', recType);

        record.delete({
            type: recType,
            id: recordInternal,
        });

    }
    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(reduceContext) {
        var vData = reduceContext.values[0];
        log.debug({
            title: 'reduce',
            details: vData
        })
    }
    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
        // If an error was thrown during the input stage, log the error.
        if (summary.inputSummary.error) {
            log.error({
                title: 'Input Error',
                details: summary.inputSummary.error
            });
        }
        // For each error thrown during the map stage, log the error, the corresponding key,
        // and the execution number. The execution number indicates whether the error was
        // thrown during the the first attempt to process the key, or during a
        // subsequent attempt.
        summary.mapSummary.errors.iterator().each(function (key, error, executionNo) {
            log.error({
                title: 'Map error for key: ' + key + ', execution no. ' + executionNo,
                details: error
            });
            return true;
        });
        // For each error thrown during the reduce stage, log the error, the corresponding
        // key, and the execution number. The execution number indicates whether the error was
        // thrown during the the first attempt to process the key, or during a
        // subsequent attempt.
        summary.reduceSummary.errors.iterator().each(function (key, error, executionNo) {
            log.error({
                title: 'Reduce error for key: ' + key + ', execution no. ' + executionNo,
                details: error
            });
            return true;
        });
    }
    return {
        getInputData: getInputData,
        map: map,
        //reduce: reduce,
        //summarize: summarize
    };
});