/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/redirect', 'N/ui/serverWidget','N/url','N/task'],
 function(record, search, redirect, server,url,task) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(context) {

		if (context.request.method === 'GET') {
			try {
				
				/*****START Create Form For Schedule the script ****/
				var objscheduleForm = server.createForm({
					title: 'Schedule'
				});
       objscheduleForm.clientScriptModulePath = './CS_Schedule_Date_Time.js';
				var date = objscheduleForm.addField({
					id: 'custpage_date',
					type: server.FieldType.DATE,
					label: 'Date'
				});

				var time = objscheduleForm.addField({
					id: 'custpage_time',
					type: server.FieldType.SELECT,
					label: 'Time'
				});
				time.addSelectOption({
                        value: '12:00 AM',
                        text: '12:00 AM'
                    });
                    time.addSelectOption({
                        value: '12:30 AM',
                        text: '12:30 AM'
                    });
                    time.addSelectOption({
                        value: '1:00 AM',
                        text: '1:00 AM'
                    });
                    time.addSelectOption({
                        value: '1:30 AM',
                        text: '1:30 AM'
                    });
                    time.addSelectOption({
                        value: '2:00 AM',
                        text: '2:00 AM'
                    });
                    time.addSelectOption({
                        value: '2:30 AM',
                        text: '2:30 AM'
                    });
                    time.addSelectOption({
                        value: '3:00 AM',
                        text: '3:00 AM'
                    });
                    time.addSelectOption({
                        value: '3:30 AM',
                        text: '3:30 AM'
                    });
                    time.addSelectOption({
                        value: '4:00 AM',
                        text: '4:00 AM'
                    });
                    time.addSelectOption({
                        value: '4:30 AM',
                        text: '4:30 AM'
                    });
                    time.addSelectOption({
                        value: '5:00 AM',
                        text: '5:00 AM'
                    });
                    time.addSelectOption({
                        value: '5:30 AM',
                        text: '5:30 AM'
                    });
                    time.addSelectOption({
                        value: '6:00 AM',
                        text: '6:00 AM'
                    });
                    time.addSelectOption({
                        value: '6:30 AM',
                        text: '6:30 AM'
                    });
                    time.addSelectOption({
                        value: '7:00 AM',
                        text: '7:00 AM'
                    });
                    time.addSelectOption({
                        value: '7:30 AM',
                        text: '7:30 AM'
                    });
				    time.addSelectOption({
                        value: '8:00 AM',
                        text: '8:00 AM'
                    });
                    time.addSelectOption({
                        value: '8:30 AM',
                        text: '8:30 AM'
                    });
                    time.addSelectOption({
                        value: '9:00 AM',
                        text: '9:00 AM'
                    });
                    time.addSelectOption({
                        value: '9:30 AM',
                        text: '9:30 AM'
                    });
                    time.addSelectOption({
                        value: '10:00 AM',
                        text: '10:00 AM'
                    });
                    time.addSelectOption({
                        value: '10:30 AM',
                        text: '10:30 AM'
                    });
                    time.addSelectOption({
                        value: '11:00 AM',
                        text: '11:00 AM'
                    });
                    time.addSelectOption({
                        value: '11:30 AM',
                        text: '11:30 AM'
                    });
                    time.addSelectOption({
                        value: '12:00 PM',
                        text: '12:00 PM'
                    });
                    time.addSelectOption({
                        value: '12:30 PM',
                        text: '12:30 PM'
                    });
                    time.addSelectOption({
                        value: '1:00 PM',
                        text: '1:00 PM'
                    });
                    time.addSelectOption({
                        value: '1:30 PM',
                        text: '1:30 PM'
                    });
                    time.addSelectOption({
                        value: '2:00 PM',
                        text: '2:00 PM'
                    });
                    time.addSelectOption({
                        value: '2:30 PM',
                        text: '2:30 PM'
                    });
                    time.addSelectOption({
                        value: '3:00 PM',
                        text: '3:00 PM'
                    });
                    time.addSelectOption({
                        value: '3:30 PM',
                        text: '3:30 PM'
                    });
                    time.addSelectOption({
                        value: '4:00 PM',
                        text: '4:00 PM'
                    });
                    time.addSelectOption({
                        value: '4:30 PM',
                        text: '4:30 PM'
                    });
                    time.addSelectOption({
                        value: '5:00 PM',
                        text: '5:00 PM'
                    });
                    time.addSelectOption({
                        value: '5:30 PM',
                        text: '5:30 PM'
                    });
                    time.addSelectOption({
                        value: '6:00 PM',
                        text: '6:00 PM'
                    });
                    time.addSelectOption({
                        value: '6:30 PM',
                        text: '6:30 PM'
                    });
                    time.addSelectOption({
                        value: '7:00 PM',
                        text: '7:00 PM'
                    });
                    time.addSelectOption({
                        value: '7:30 PM',
                        text: '7:30 PM'
                    });
                    time.addSelectOption({
                        value: '8:00 PM',
                        text: '8:00 PM'
                    });
                    time.addSelectOption({
                        value: '8:30 PM',
                        text: '8:30 PM'
                    });
                    time.addSelectOption({
                        value: '9:00 PM',
                        text: '9:00 PM'
                    });
                    time.addSelectOption({
                        value: '9:30 PM',
                        text: '9:30 PM'
                    });
                    time.addSelectOption({
                        value: '10:00 PM',
                        text: '10:00 PM'
                    });
					time.addSelectOption({
                        value: '10:30 PM',
                        text: '10:30 PM'
                    });
					time.addSelectOption({
                        value: '11:00 PM',
                        text: '11:00 PM'
                    });
					time.addSelectOption({
                        value: '11:30 PM',
                        text: '11:30 PM'
                    });
				var recordFieldType = objscheduleForm.addField({
					id: 'custpage_rec',
					type: server.FieldType.SELECT,
					label: 'Record Type'
				});

				recordFieldType.addSelectOption({
					value: 'salesorder',
					text: 'Sales Order'
				});
				recordFieldType.addSelectOption({
					value: 'employee',
					text: 'Employee'
				});
				recordFieldType.addSelectOption({
					value: 'customer',
					text: 'Customer'
				});
				recordFieldType.addSelectOption({
					value: 'purchaseorder',
					text: 'Purchase Order'
				});
				recordFieldType.addSelectOption({
					value: 'invoice',
					text: 'Invoice'
				});
				recordFieldType.addSelectOption({
					value: 'vendorBill',
					text: 'Bill'
				});
				recordFieldType.addSelectOption({
					value: 'location',
					text: 'Location'
				});
				objscheduleForm.addSubmitButton({
					label: 'Save'
				});
				var statusadd = objscheduleForm.addField({
					id: 'custpagestatus_123',
					type: server.FieldType.SELECT,
					label: 'Status'
				});
				statusadd.addSelectOption({
					value: '1',
					text: 'Scheduled'
				});
				statusadd.addSelectOption({
					value: '2',
					text: 'Completed'
				});
				statusadd.updateDisplayType({
					displayType : server.FieldDisplayType.HIDDEN
				});
				statusadd.defaultValue = '1';
				log.debug('statusadd',statusadd);
				
				/***** END Create Form For Schedule the script ****/
				
				/**** START to add sublist to show ****/
				var listInfoSub = objscheduleForm.addSublist({
					id: 'custpage_list_info',
					type: server.SublistType.STATICLIST,
					label: ' '	
				});
				listInfoSub.addField({
					id: 'custpagedate',
					type: server.FieldType.DATE,
					label: 'Date'
				});
			var listTime =	listInfoSub.addField({
					id: 'custpagetime',
					type: server.FieldType.SELECT,
					label: 'Time'
				});
				listTime.updateDisplayType({
			    displayType: server.FieldDisplayType.INLINE
			    });
				    listTime.addSelectOption({
                        value: '12:00 AM',
                        text: '12:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '12:30 AM',
                        text: '12:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '1:00 AM',
                        text: '1:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '1:30 AM',
                        text: '1:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '2:00 AM',
                        text: '2:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '2:30 AM',
                        text: '2:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '3:00 AM',
                        text: '3:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '3:30 AM',
                        text: '3:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '4:00 AM',
                        text: '4:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '4:30 AM',
                        text: '4:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '5:00 AM',
                        text: '5:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '5:30 AM',
                        text: '5:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '6:00 AM',
                        text: '6:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '6:30 AM',
                        text: '6:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '7:00 AM',
                        text: '7:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '7:30 AM',
                        text: '7:30 AM'
                    });
				 listTime.addSelectOption({
                        value: '8:00 AM',
                        text: '8:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '8:30 AM',
                        text: '8:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '9:00 AM',
                        text: '9:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '9:30 AM',
                        text: '9:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '10:00 AM',
                        text: '10:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '10:30 AM',
                        text: '10:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '11:00 AM',
                        text: '11:00 AM'
                    });
                    listTime.addSelectOption({
                        value: '11:30 AM',
                        text: '11:30 AM'
                    });
                    listTime.addSelectOption({
                        value: '12:00 PM',
                        text: '12:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '12:30 PM',
                        text: '12:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '1:00 PM',
                        text: '1:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '1:30 PM',
                        text: '1:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '2:00 PM',
                        text: '2:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '2:30 PM',
                        text: '2:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '3:00 PM',
                        text: '3:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '3:30 PM',
                        text: '3:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '4:00 PM',
                        text: '4:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '4:30 PM',
                        text: '4:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '5:00 PM',
                        text: '5:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '5:30 PM',
                        text: '5:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '6:00 PM',
                        text: '6:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '6:30 PM',
                        text: '6:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '7:00 PM',
                        text: '7:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '7:30 PM',
                        text: '7:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '8:00 PM',
                        text: '8:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '8:30 PM',
                        text: '8:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '9:00 PM',
                        text: '9:00 PM'
                    });
                    listTime.addSelectOption({
                        value: '9:30 PM',
                        text: '9:30 PM'
                    });
                    listTime.addSelectOption({
                        value: '10:00 PM',
                        text: '10:00 PM'
                    });
					listTime.addSelectOption({
                        value: '10:30 PM',
                        text: '10:30 PM'
                    });
					listTime.addSelectOption({
                        value: '11:00 PM',
                        text: '11:00 PM'
                    });
					listTime.addSelectOption({
                        value: '11:30 PM',
                        text: '11:30 PM'
                    });
			var rec =	listInfoSub.addField({
					id: 'custpagerec',
					type: server.FieldType.SELECT,
					label: 'Record Type'
				});
				rec.updateDisplayType({
			    displayType: server.FieldDisplayType.INLINE
			    });
				rec.addSelectOption({
					value: 'salesorder',
					text: 'Sales Order'
				});
				rec.addSelectOption({
					value: 'employee',
					text: 'Employee'
				});
				rec.addSelectOption({
					value: 'customer',
					text: 'Customer'
				});
				rec.addSelectOption({
					value: 'purchaseorder',
					text: 'Purchase Order'
				});
				rec.addSelectOption({
					value: 'invoice',
					text: 'Invoice'
				});
				rec.addSelectOption({
					value: 'vendorBill',
					text: 'Bill'
				});
				rec.addSelectOption({
					value: 'location',
					text: 'Location'
				});

			var statusadd = listInfoSub.addField({
					id: 'custpagestatus',
					type: server.FieldType.SELECT,
					label: 'Status'
				});
				statusadd.updateDisplayType({
			    displayType: server.FieldDisplayType.INLINE
			    });
				statusadd.addSelectOption({
					value: '1',
					text: 'Scheduled'
				});
				statusadd.addSelectOption({
					value: '2',
					text: 'Completed'
				});
				
			 /**** END to add sublist to show ****/
			 
			 /**** Start to show saved search ****/
			 var dateRec,timeRec, recordType,statusRec,count=0;
				var customrecord_schedule_record_typeSearchObj = search.create({
				   type: "customrecord_p1_schedule_record",
				   filters:
				   [
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
				customrecord_schedule_record_typeSearchObj.run().each(function(result){
				   dateRec =result.getValue('custrecord_date');
				   timeRec = result.getValue('custrecord125');
				   recordType = result.getValue('custrecord_record_type_123');
				   statusRec = result.getValue('custrecord_status_123');
				   
				   listInfoSub.setSublistValue({
					id: 'custpagedate',
					line: count,
					value: dateRec
					});
					listInfoSub.setSublistValue({
					id: 'custpagetime',
					line: count,
					value: timeRec
					});
					listInfoSub.setSublistValue({
					id: 'custpagerec',
					line: count,
					value: recordType
					});
					if(statusRec)
					{
						listInfoSub.setSublistValue({
						id: 'custpagestatus',
						line: count,
						value: statusRec
						});	
					}
					count++;
				   return true;	   
				});
				objscheduleForm.addButton({
						id : 'backforconfig',
						label : 'Back to Configuration',
						functionName: 'BackConfiguration'
						
					});
			/****End to show saved search****/	
			 context.response.writePage({
			  pageObject: objscheduleForm
		   });
			} catch (e) {
				log.debug('Error in Schedule Screen Get', e);
			}

		}
		else {
				try {
					
					var date = context.request.parameters.custpage_date;
					var time = context.request.parameters.custpage_time;
					var recordType = context.request.parameters.custpage_rec;
					var Status = context.request.parameters.custpagestatus_123;
					
				var objRecord = record.create({
					   type: 'customrecord_p1_schedule_record'
				});
				objRecord.setValue('custrecord_date',new Date(date));
				objRecord.setValue('custrecord125',time);
				objRecord.setValue('custrecord_record_type_123',recordType);
				objRecord.setValue('custrecord_status_123',Status);
				objRecord.save();
				
				var suiteletURL = url.resolveScript({
				scriptId: 'customscript_sl_p1_address_details',
				deploymentId: 'customdeploy_sl_p1_address_details'
				});
				redirect.redirect({
					url: suiteletURL
				});

				} 
				catch (e) {
				log.debug('Error in Schedule Screen post',e);
				}

		   }
	}
	return {
		onRequest: onRequest
	};
});