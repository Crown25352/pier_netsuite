/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/url', 'N/https', 'N/redirect', 'N/task'],
    function (N_server, record, search, url, https, redirect, task) {
        function onRequest(context) {
            try {

                var objFormAddressconfiguration = N_server.createForm({
                    title: 'Address Configuration'
                });
                objFormAddressconfiguration.clientScriptModulePath = './CS_P1_schedule_config.js';
                var recordType = objFormAddressconfiguration.addField({
                    id: 'recordtypens',
                    type: N_server.FieldType.SELECT,
                    label: 'RECORD TYPE'
                });

                recordType.addSelectOption({
                    value: 'vendorBill',
                    text: 'Bill'
                });
                recordType.addSelectOption({
                    value: 'customer',
                    text: 'Customer'
                });
                recordType.addSelectOption({
                    value: 'employee',
                    text: 'Employee'
                });
                recordType.addSelectOption({
                    value: 'invoice',
                    text: 'Invoice'
                });
                recordType.addSelectOption({
                    value: 'location',
                    text: 'Location'
                });
                recordType.addSelectOption({
                    value: 'purchaseorder',
                    text: 'Purchase Order'
                });
                recordType.addSelectOption({
                    value: 'salesorder',
                    text: 'Sales Order'
                });
                recordType.addSelectOption({
                    value: 'vendor',
                    text: 'Vendor'
                });

                objFormAddressconfiguration.addButton({
                    id: 'schedule',
                    label: 'Schedule for later',
                    functionName: 'schedule'
                });

                if (context.request.method === 'GET') {
                    objFormAddressconfiguration.addSubmitButton({
                        label: 'Execute now'
                    });
                }
                else {
                    var typeRecord = context.request.parameters.recordtypens;
                    log.debug('typeRecord', typeRecord);

                    // var objparam = JSON.stringify({ 'typeRecord': typeRecord });
                    // log.debug('objparam 65', objparam);
                    // log.debug('objparam type', typeof (objparam));

                    var mrTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_p1_get_address_from_custome',
                        deploymentId: 'customdeploy_p1_get_address_from_custome',
                        params: {
                            'custscript_filter_parameter': typeRecord
                        }
                    });
                    var mrTaskId = mrTask.submit();
                    log.debug("mrTaskId", mrTaskId);

                    var recObj = record.load({
                        type: 'customrecord_p1_task_status',
                        id: 1
                    });
                    recObj.setValue('name', mrTaskId);
                    recObj.save();
                    var taskStatus = task.checkStatus(mrTaskId);

                    var suiteleturl = url.resolveScript({
                        scriptId: 'customscript_sl_p1_address_details',
                        deploymentId: 'customdeploy_sl_p1_address_details'
                    });

                    redirect.redirect({
                        url: suiteleturl
                    });
                }
                context.response.writePage({
                    pageObject: objFormAddressconfiguration
                });
            } catch (e) {
                log.debug('Error in objFormAddressconfiguration ', e);
            }

        }

        return {
            onRequest: onRequest
        };
    });