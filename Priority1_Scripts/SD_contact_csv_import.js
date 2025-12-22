/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
 define(['N/file', 'N/sftp', 'N/record', 'N/format', 'N/search'],
    function (file, sftp, record, format, search) {
        function execute(context) {
            try {
                // 1.GET CSV FILE
                var fileId = 672472;
                csv = file.load({ 
                    id: fileId 
                });

                // 2.LOAD CSV CONTENT INTO OBJECT
                var obj = [];
                var prior;
                var idx = 0;
                csv.lines.iterator().each(function (line) {
                    // if (idx == 150) return false;
                    var w = line.value.split(",");
                    if (!idx) {
                        idx ++;
                        return true;
                    } 
                    
                    obj.push({
                        firstname: w[3],
                        middlename: w[4],
                        lastname: w[5],
                        fullname: w[2],
                        company: w[8],
                        jobtitle: w[10],
                        department: w[9],
                        company2: w[11],
                        jobtitle2: w[13],
                        department2: w[12],
                        mobile: w[17],
                        tel: w[20],
                        tel2: w[21],
                        fax: w[23],
                        email: w[26],
                        address: w[29],
                        address2: w[30],
                        website: 'https://' + w[33],
                        nickname: w[36],
                        image: w[46]
                    })

                    return true;
                })
                log.debug('object', JSON.stringify(obj))

                // 3.CREATE RECORDS ON THE ROWS
                for (var i = 0; i < obj.length; i++) {
                    try {
                        var data = obj[i];
                        log.debug('iaDate', data)

                        if (data.company) {
                            data.company = data.fullname;
                        }

                        var custRec = record.create({
                            type: 'prospect'
                        });

                        custRec.setValue('companyname', data.fullname);
                        // custRec.setValue('isperson', false);
                        custRec.setValue('subsidiary', 4);
                        custRec.setValue('category', 10);
                        custRec.setValue('entitystatus', 9);
                        custRec.setValue('salesrep', 18835);
                        custRec.setValue('email', data.email);
                        custRec.setValue('phone', data.mobile);
                        custRec.setValue('url', data.website);
                        custRec.setValue('defaultaddress', data.address);
                        custRec.setValue('defaultaddress', data.address);

                        var custId = custRec.save();
                        log.debug('Customer id', custId)
                        
                        var contRec = record.create({
                            type: record.Type.CONTACT
                        });
                        contRec.setValue('company', custId);
                        contRec.setValue('firstname', data.firstname);
                        contRec.setValue('middlename', data.middlename);
                        contRec.setValue('lastname', data.lastname);
                        contRec.setValue('entityid', data.fullname);
                        contRec.setValue('subsidiary', 4);
                        // contRec.setValue('image', data.image);
                        contRec.setValue('email', data.email);
                        contRec.setValue('mobilephone', data.mobile);
                        contRec.setValue('officephone', data.tel);
                        contRec.setValue('phone', data.tel2);
                        contRec.setValue('defaultaddress', data.address);
                        contRec.setValue('defaultaddress', data.address);
                        var contId = contRec.save()
                        log.debug('Contact id', contId)
                    } catch (e) {
                        log.debug('error-cycle', e.message)
                    }
                    
                }
                
            } catch (e) {
               log.error("Error", JSON.stringify(e));
            }
        }
        return {
            execute: execute
        };
    });