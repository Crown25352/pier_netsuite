/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/https', 'N/search', 'N/log', 'N/file'], function(record, https, search, log, file) {

    function getInputData() {
        try {
            let data = [];
            
            let searchResults = search.load({
                id: 'customsearch2051'
            })
            let resultSet = searchResults.run();

            let currentRange = resultSet.getRange({
                start : 0,
                end : 1000
            });
            let i = 0;  // iterator for all search results
            let j = 0;  // iterator for current result range 0..999

            while (j < currentRange.length) {
                let result = currentRange[j];

                data.push(result.id);

                i++; j++;
                if (j == 1000) {   // check if it reaches 1000
                    j = 0;          // reset j an reload the next portion
                    currentRange = resultSet.getRange({
                        start : i,
                        end : i + 1000
                    });
                }
            }

            // data.push(302770);
            return data;
        } catch (e) {
            log.debug('error', e.message)
        }
    }

    function reduce(context) {
        try {
            const data = JSON.parse(context.values[0]);
            log.debug('data', data)

            let ifRec = record.load({
                type: 'itemfulfillment',
                id: data
            });

            ifRec.save();
            log.debug('success', data);

        } catch (e) {
            log.error("reduce error", e);
        }
    }

    return {
        getInputData: getInputData,
        reduce: reduce
    };
});
