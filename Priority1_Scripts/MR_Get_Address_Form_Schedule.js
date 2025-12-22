/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */

 define(['N/runtime', 'N/search', 'N/record'], function(runtime, search, record) {
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
		/***Gaurav Code for get Address For later***/
		
		var ScheduleDate, ScheduleTime, ScheduleRecordType, ScheduleStatus, internalId;
		var customrecord_schedule_record_typeSearchObj = search.create({
		   type: "customrecord_p1_schedule_record",
		   filters:
		   [
		   ["custrecord_status_123","anyof","1"]
		   ],
		   columns:
		   [
			  search.createColumn({name: "custrecord_date", label: "Date"}),
			  search.createColumn({name: "custrecord125", label: "Time"}),
			  search.createColumn({name: "custrecord_record_type_123", label: "Record Type"}),
			  search.createColumn({name: "custrecord_status_123", label: "Status"})
		   ]
		});
		var searchResultCount = customrecord_schedule_record_typeSearchObj.runPaged().count;
		log.debug("customrecord_schedule_record_typeSearchObj result count",searchResultCount);
		customrecord_schedule_record_typeSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
			ScheduleDate = result.getValue({
				name: 'custrecord_date'
			});
			log.debug('ScheduleDate',ScheduleDate);
			
			ScheduleTime = result.getValue({
				name: 'custrecord125'
			});
			log.debug('ScheduleTime',ScheduleTime);
			
			ScheduleRecordType = result.getValue({
				name: 'custrecord_record_type_123'
			});
			log.debug('ScheduleRecordType',ScheduleRecordType);
			
			ScheduleStatus = result.getValue({
				name: 'custrecord_status_123'
			});
			log.debug('ScheduleStatus',ScheduleStatus);
			
			internalId = ScheduleStatus = result.id;
			log.debug('internalId',internalId);
		
			return true;
		});
		return customrecord_schedule_record_typeSearchObj;
		/**End**/
	}
	/**
	 * Executes when the map entry point is triggered and applies to each key/value pair.
	 *
	 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
	 * @since 2015.1
	 */
	function map(mapContext) {
		try{
				log.debug({
				title: 'Map context',
				details: mapContext
			})
			var value = JSON.parse(mapContext.value)
			log.debug({
				title: 'Map value',
				details: value
			})
			var recordType = value.values.custrecord_record_type_123;
			var scheduleDate = value.values.custrecord_date;
			var scheduleTime = value.values.custrecord125;
			log.debug('scheduleDate || scheduleTime', scheduleDate + " || " + scheduleTime);
			
			var timeToNum = scheduleTime.split(" ");
			var scheduleTime = timeToNum[0].replace(/:/g, "");
			
			var scheduleTimeMax = Number(scheduleTime) + 28;

			// var scheduleDateTime = new Date(scheduleDate + " " + scheduleTime);
			// log.debug('scheduleDateTime', scheduleDateTime);
			
			// var hourSch = scheduleDateTime.getHours();	
			// log.debug('hourSch', hourSch);
			// var minSch = scheduleDateTime.getMinutes() + 28;
			// log.debug('minSch', minSch);
			// var ampmSch = hourSch >= 12 ? 'PM' : 'AM';	
			// log.debug('ampmSch', ampmSch);
			// hourSch = hourSch % 12;
			// log.debug('hourSch', hourSch);
			// var scheduleTimeMax = hourSch + ':' + minSch + ' ' + ampmSch;
			// log.debug('scheduleTimeMax', scheduleTimeMax);

			var currentDate = new Date();
			log.debug("currentDate", currentDate);
			var fullyear = currentDate.getFullYear();
			var fullmonth = currentDate.getMonth()+1;
			var fullday = currentDate.getDate();
			var todayDate = fullmonth+'/'+fullday+'/'+fullyear;	
			log.debug("value.recordType", value.recordType);
            log.debug("value.id", value.id);
			var recObj = record.load({
				type : value.recordType,
				id : value.id
			});
			var currDateTime = recObj.getValue("custrecord_curr_date_time");
			log.debug('currDateTime', currDateTime);

			log.debug("scheduleDate || todayDate", scheduleDate + " || " + todayDate)
			log.debug("scheduleTime || currDateTime || scheduleTimeMax", scheduleTime + " || " + currDateTime + " || " + scheduleTimeMax)
			
			if(scheduleDate == todayDate && (Number(scheduleTime) <= Number(currDateTime)) && (Number(currDateTime) <= Number(scheduleTimeMax)) )
			{
				log.debug("YES", "YES");
			}
		}catch(e){
			log.debug('error',e.message);
		}
		
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
		if (summary.inputSummary.error) {
			log.error({
				title: 'Input Error',
				details: summary.inputSummary.error
			});
		}
		summary.mapSummary.errors.iterator().each(function(key, error, executionNo) {
			log.error({
				title: 'Map error for key: ' + key + ', execution no. ' + executionNo,
				details: error
			});
			return true;
		});
		summary.reduceSummary.errors.iterator().each(function(key, error, executionNo) {
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