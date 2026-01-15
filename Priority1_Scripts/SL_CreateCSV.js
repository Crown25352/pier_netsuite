function createCSV(request, response) {
    var recId = request.getParameter('dataid');
    var fileName = request.getParameter('filename');
    nlapiLogExecution('debug', 'Params', recId + " : " + fileName);

    var rec = nlapiLoadRecord('customrecord_export_csv_data', recId);
    var csvContent = rec.getFieldValue('custrecord_csv_content');
    var csvFile = nlapiCreateFile(fileName, 'CSV', csvContent.replace(/!~!~/gi, '""'));
    csvFile.setFolder('5480');
    var fileId = nlapiSubmitFile(csvFile);

    nlapiLogExecution('debug', 'File ID', fileId);
    csvFile = nlapiLoadFile(fileId);

    var fileUrl = csvFile.getURL();
    response.write(fileUrl);
}