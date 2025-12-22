function purgeTestData(type) {
    try {
        var tranType = nlapiGetContext().getSetting('SCRIPT', 'custscript_tran_type');
        var searchId = nlapiGetContext().getSetting('SCRIPT', 'custscript_search_id');

        nlapiLogExecution('audit', 'Search Type: '+tranType, 'Search ID: '+searchId);

        var results = searchTrans(tranType, searchId);
        nlapiLogExecution('audit', 'Number of records to delete: ' + results.length);
        if (results != null) {
            for (var x = 0; x < results.length; x++) {
                var id = results[x].getId();
                nlapiLogExecution('audit', 'Deleting record', id);
                checkUsageRemaining();
                try {
                    nlapiDeleteRecord(tranType, id);
                    nlapiLogExecution('audit', 'Deleted Successful', id);
                } catch (e) {
                    nlapiLogExecution('error', 'Delete error: '+id, e);
                }
            }
        } else {
            nlapiLogExecution('audit', 'No records to delete');
        }
    } catch (e) {
        nlapiLogExecution('error', 'deleteMrpDetails', e);
    }
}

function searchTrans(tranType, id) {
    try {
        var sresults = nlapiSearchRecord(tranType, id, null, null);
        return sresults;

    } catch(e) {
        nlapiLogExecution('error', 'searchMrpDetails:', e);
    }

    return null;
}

function checkUsageRemaining()
{
    // Get the remaining usage points of the scripts
    var remainingUsage = nlapiGetContext().getRemainingUsage();

    // If the script's remaining usage points are bellow 1,000 ...
    if (remainingUsage < 1000)
    {
	    // ...yield the script
	    var state = nlapiYieldScript();
	    // Throw an error or log the yield results
	    if (state.status == 'FAILURE')
		    throw "Failed to yield script";
	    else if (state.status == 'RESUME')
		    nlapiLogExecution('DEBUG','Resuming script');
    }
}