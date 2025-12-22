/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 /*
  * Find the earliest created CONTACT assoc with the CUSTOMER and display it in a custom field
 *
 * 
 * 
  */
define(['N/record', 'N/search'],
function(record, search) {
  
function afterSubmit(context){
	
	if(context.type != "create"){
        return;
    }

		try{
			
         var recObj = context.newRecord;
		 var recId = recObj.id; 
		 var recType = recObj.type;
         var custId = recObj.getValue({fieldId: 'company'});
		 var PRIMARY_CONTACT_CUSTOM_FIELD = 'custentity_primary_contact';

        log.debug('custId is:', custId);

         var customerSearchObj = search.create({
            type: "customer",
            filters:
            [
                ["custentity_primary_contact","anyof","@NONE@"], 
                "AND",
                ["internalid","anyof", custId],
                "AND", 
                ["status","anyof","6"]   //LEAD-UNQUALIFIED
            ], 
            columns:
            [
               search.createColumn({name: "entityid", sort: search.Sort.ASC, label: "ID"}),
               search.createColumn({name: "altname", label: "Name"}),
               search.createColumn({name: "email", label: "Email"})
            ]
         });
         var searchResultCount = customerSearchObj.runPaged().count;

         
         if(searchResultCount == 0) return;  //only proceed if the custom field on the CUSTOMER is empty
		 
            record.submitFields({type: record.Type.CUSTOMER, id: custId, values: {'custentity_primary_contact': recId}});
            log.debug('Set custentity_primary_contact field on LEAD');
                 
          }catch(e){
              log.error(e.name, e.message);
          }
         
       
    
	
}

    return {
   
        afterSubmit: afterSubmit
    };


    
});