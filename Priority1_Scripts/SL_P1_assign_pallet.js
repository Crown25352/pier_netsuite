/**
* @NApiVersion 2.1
* @NScriptType Suitelet
* @NModuleScope SameAccount
*/
define(['N/record', 'N/ui/serverWidget', 'N/search', 'N/redirect'],
    /**
     * @param {record} record
     * @param {serverWidget} serverWidget
     */
    function (record, serverWidget, search, redirect) {
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

                var salesOrderId = context.request.parameters.tranID;
                var trxType = context.request.parameters.tranType;
                log.debug('salesOrderId', salesOrderId);

                // var salesIntId = context.request.parameters.sordId;
                // log.debug('salesIntId inside get', salesIntId);

                var form = serverWidget.createForm({
                    title: 'Assign packages on pallet',
                    hideNavBar: true
                });
                var soIdField = form.addField({
                    id: 'custpage_so_id_field',
                    type: serverWidget.FieldType.TEXT,
                    label: 'SOID'
                });
                soIdField.defaultValue = salesOrderId;
                soIdField.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var trxField = form.addField({
                    id: 'custpage_trx_type_field',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Tranx Type'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                trxField.defaultValue = trxType;
                var trx_search_filters = [
                    // ["type", "anyof", "SalesOrd"],
                    // "AND",
                    ["internalid", "anyof", salesOrderId],
                    // "AND",
                    // ["mainline", "is", "F"],
                    // ["item.internalid", "noneof", "-286", "12184","15"]
                    "AND",
                    ["shipping", "is", "F"],
                    "AND",
                    ["taxline", "is", "F"],
                    "AND",
                    ["cogs", "is", "F"]
                ];

                if (trxType == 'salesorder') {
                    trx_search_filters.push("AND");
                    trx_search_filters.push(["mainline", "is", "F"]);
                }

                var tableField = form.addField({

                    id: 'custpage_table_field',

                    type: serverWidget.FieldType.INLINEHTML,

                    label: ' '

                });

                var pallet_fieldLookUp = search.lookupFields({
                    type: trxType,
                    id: salesOrderId,
                    columns: ['custbody_p1_assigned_pallet_data']
                });

                // JSON Data which we need to populate in the form;
                var json_data = pallet_fieldLookUp.custbody_p1_assigned_pallet_data;

                log.debug('json_data', json_data);

                if (json_data) {

                    var items_arr = JSON.parse(json_data).items;
                    log.debug('items_arr', items_arr);


                    var htmlTable = '<!DOCTYPE html>' +

                        '<html>' +

                        '' +

                        '<head>' +

                        '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">' +

                        '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />' +

                        '  <link rel="stylesheet"' +

                        '    href="https://cdn.rawgit.com/tonystar/bootstrap-float-label/v4.0.1/dist/bootstrap-float-label.min.css">' +


                        '  <style>' +

                        '      @import url(https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap);*{box-sizing:border-box}body{margin:0;padding:0;font-family:Roboto,sans-serif}.form-body,.form-user{padding:15px}.Repeated-form {border: 1px solid #dedede;}.heading{width:100%;margin-bottom:5px}.heading h6{margin:0;font-size:16px}.form-main{border:none;border-radius:5px;width:100%;overflow:visible}.form-main .Repeated-form .form-heading{background:#f9fafa;padding:6px;border-radius:5px;display:flex;width:100%;justify-content:space-between;align-items:center}.form-button-inventry button{padding:3px 10px;border:1px solid #a6a7a7;border-radius:3px;background:#f9fafa;color:#a6a7a7;white-space:nowrap}.check-buttons{display:flex;align-items:center;margin-left:10px;width:90%;border-left:1px solid #b9b9b9}.check-buttons .first-checkbox{margin:0 10px;color:#968b8f}.delete-icons button{background:0 0;border:none;font-size:20px;color:#a43936}.form-body .form-flexx input,.form-body .form-flexx select{outline:0!important;box-shadow:none}.has-float-label .form-control:placeholder-shown:not(:focus)+*{opacity:.5;top:1em!important;font-size:14px!important}.nor-radius-R{border-radius:.25rem 0 0 .25rem!important}.nor-radius{border-radius:0 .25rem .25rem 0!important}.custom-width{max-width:105px !important;}.input-group .has-float-label{display:table-cell;width:100%}.form-footer{border-top:1px solid #dedede;padding:10px;display:flex;justify-content:end}.form-footer Button{background:0 0;border:none;color:#968b8f;font-weight:400;font-size:16px}.form-button-Heading h6{white-space:nowrap;margin:0 16px 0 0;border-right:1px solid #b9b9b9;padding-right:15px;height:21px}.btn-toggle.btn-sm>.handle{position:absolute;top:.1875rem;left:.1875rem;width:1.125rem;height:1.125rem;border-radius:1.125rem;background:#fff;transition:left .25s}.btn-toggle.btn-sm{margin:0 .5rem;padding:0;position:relative;border:none;height:1.5rem;width:3rem;border-radius:1.5rem}.btn-toggle.btn-sm:before{content:\'Off\';left:-.5rem}.btn-toggle.btn-sm:after,.btn-toggle.btn-sm:before{line-height:1.5rem;width:.5rem;text-align:center;font-weight:600;font-size:.55rem;text-transform:uppercase;letter-spacing:2px;position:absolute;bottom:0;transition:opacity .25s}.btn-toggle.btn-sm:after{content:\'On\';right:-.5rem;opacity:.5}div#Copied-form .custom-width{max-width:166px !important}.add-items button{background:#f9fafa;border:1px solid #dedede;color:#000;font-weight:400;font-size:16px;padding:5px 10px}.add-items{display:flex;justify-content:end;position:relative;margin-bottom:20px}.show-hide{position:absolute;background:#fff;z-index:999;width:220px;padding:0;box-shadow:0 10px 10px #dedede;border-radius:0}.heading-dropdown{display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #dedede}.heading-dropdown h4{font-size:16px;margin:0}.heading-dropdown button{padding:0!important;background:0 0!important;border:none!important;color:#000!important}.search-main{padding:5px 10px}.search-main input{width:100%;border:1px solid #dedede;padding:5px 10px;margin-top:10px}.repeated-content{padding:10px 15px;font-size:14px;border-bottom:1px solid #dedede}.value-2{display:flex;justify-content:space-between}.search-main {max-height: 200px;overflow-y: scroll;}.form-flexx.row input, .form-flexx.row select {height: 38px;}body, label, p, span, div, h6 {font-size: 14px;}.delete-icons.disbaled-remove button {pointer-events: none !important;}#appendList .delete-icons.disbaled-remove button {pointer-events: inherit !important;}.form-diabled .Repeated-form .form-body .custom-disabled, .form-diabled .Repeated-form .form-heading .custom-disabled {pointer-events: none;opacity: 0.4;}.form-diabled .Repeated-form .add-clone .form-body, .form-diabled .Repeated-form .add-clone .form-heading {   opacity: 1;pointer-events: auto;}.form-user { min-width: calc(1920px - 30px);}.Checkbox-icons {visibility: hidden;}span.has-float-label.mb-0.new-width {min-width: 200px !important;width: 100% !important;}table#tbl_submitter td#tdbody_submitter input.disabled {!important;cursor: pointer !important;box-shadow: none !important;outline: none !important;}td#tdbody_submitter {border: none;} .close-page-button {position: absolute;right: 16px;top: 25px;}.close-page-button button {background: red !important;color: #fff;border: none;padding: 5px 15px;}' +

                        '.add-item-btn {' +
                        ' display: flex;' +
                        'justify-content: end;' +
                        '}' +
                        '.add-item-btn .add-item-class{' +
                        'border: none;' +
                        'padding: 9px 20px;' +
                        'font-weight: 600;' +
                        'font-size: 16px;' +
                        '}' +
                        '  </style>' +
                        '<script>' +
                        'function selectitem(item){' +
                        'var x=document.getElementById(item.id);' +
                        'var y=x.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild;' +
                        'y.value=item.innerHTML;' +
                        '}' +
                        '</script>' +

                        '</head>' +

                        '' +

                        '<body>' +
                        '<div class="form-user">' +

                        '<div class="heading">' +

                        //'<p>'+ json_data +'</p>' +
                        '<h6>Items</h6>' +

                        '</div>';

                    '  <div class="main-parent">';

                    var units_, stackable_, hazmat_, used_, machinery_, itemName_;
                    var itemsss = [];
                    var unitsess = [];
                    var ixd = 0;

                    for (var i = 0; i < items_arr.length; i++) {
                        var item_element = items_arr[i];
                        log.debug('item_element', item_element);
                        // var salesorderSearchObj = search.create({
                        //     type: "salesorder",
                        //     filters:
                        //         [
                        //             ["type", "anyof", "SalesOrd"],
                        //             "AND",
                        //             ["internalid", "anyof", salesOrderId],
                        //             "AND",
                        //             ["mainline", "is", "F"],
                        //             // "AND",
                        //             // ["item.internalid", "noneof", "-286", "12184","15"]
                        //             "AND",
                        //             ["shipping", "is", "F"],
                        //             "AND",
                        //             ["taxline", "is", "F"],
                        //             "AND",
                        //             ["cogs", "is", "F"]
                        //         ],
                        //     columns:
                        //         [
                        //             search.createColumn({
                        //                 name: "internalid",
                        //                 join: "item",
                        //                 label: "Internal ID"
                        //             }),
                        //             search.createColumn({ name: "custcol_p1_stackable", label: "Stackable" }),
                        //             search.createColumn({ name: "custcol_p1_hazmat", label: "Hazmat" }),
                        //             search.createColumn({ name: "custcol_p1_used", label: "Used" }),
                        //             search.createColumn({ name: "custcol_p1_machinery", label: "Machinery" }),
                        //             search.createColumn({ name: "item", label: "Item" }),
                        //             search.createColumn({ name: "custcol_p1_units", label: "Units" }),
                        //             search.createColumn({ name: "custcol_p1_handling_unit", label: "Handling Unit" }),
                        //             search.createColumn({ name: "quantity", label: "Quantity" }),
                        //             search.createColumn({ name: "custcol_p1_weight", label: "Weight" }),
                        //             search.createColumn({ name: "custcol_p1_wt_unit", label: "WT UNIT" }),
                        //             search.createColumn({ name: "custcol_p1_length", label: "Length" }),
                        //             search.createColumn({ name: "custcol_p1_width", label: "Width" }),
                        //             search.createColumn({ name: "custcol_p1_height", label: "Height" }),
                        //             search.createColumn({ name: "custcol_p1_lwh_unit", label: "LWH UNIT" }),
                        //             search.createColumn({ name: "custcol_p1_class", label: "Class" }),
                        //             search.createColumn({ name: "custcol_p1_suggested_class", label: "Suggested Class" }),
                        //             search.createColumn({ name: "custcol_p1_nmfc", label: "NMFC" })
                        //         ]
                        // });
                        // var searchResultCount = salesorderSearchObj.runPaged().count;
                        // log.debug("salesorderSearchObj result count", searchResultCount);
                        // salesorderSearchObj.run().each(function (result) {
                        var stackable_ = item_element.isStackable;
                        // result.getValue({ name: "custcol_p1_stackable" });
                        var hazmat_ = item_element.isHazardous;
                        // result.getValue({ name: "custcol_p1_hazmat" });
                        var used_ = item_element.isUsed;
                        // result.getValue({ name: "custcol_p1_used" });
                        var machinery_ = item_element.isMachinery;
                        // result.getValue({ name: "custcol_p1_machinery" });
                        var item_ = item_element.description;
                        // result.getValue({ name: "item" });
                        var itemName_ = item_element.description;
                        // result.getText({ name: "item" });
                        var units_ = item_element.units;
                        // result.getValue({ name: "custcol_p1_units" });
                        var handlingUnit_ = item_element.packagingType;
                        // result.getText({ name: "custcol_p1_handling_unit" });
                        var quantity_ = item_element.pieces;
                        log.debug('quantity_', quantity_);
                        // result.getValue({ name: "quantity" });
                        var weight_ = item_element.totalWeight;
                        // result.getValue({ name: "custcol_p1_weight" });
                        var wtUnit_ = item_element.totalWeightUnit;
                        // result.getText({ name: "custcol_p1_wt_unit" });
                        var length_ = item_element.length;
                        // result.getValue({ name: "custcol_p1_length" });
                        var width_ = item_element.width;
                        // result.getValue({ name: "custcol_p1_width" });
                        var height_ = item_element.height;
                        // result.getValue({ name: "custcol_p1_height" });
                        var lwhUnit_ = item_element.sinLwhUnit;
                        // result.getText({ name: "custcol_p1_lwh_unit" });
                        var class_ = item_element.freightClass;
                        // result.getText({ name: "custcol_p1_class" });
                        var suggestedClass_ = item_element.freightClass;
                        // result.getValue({ name: "custcol_p1_suggested_class" });
                        var nmfc_;
                        if (item_element.nmfcSubCode && item_element.nmfcItemCode) {
                            nmfc_ = item_element.nmfcItemCode + '-' + item_element.nmfcSubCode;
                        } else if (item_element.nmfcItemCode) {
                            nmfc_ = item_element.nmfcItemCode
                        } else {
                            nmfc_ = '';
                        }

                        // result.getValue({ name: "custcol_p1_nmfc" });
                        if (stackable_ === true) {
                            stackable_ = 'checked'
                        }
                        else {
                            stackable_ = ''
                        }
                        if (hazmat_ === true) {
                            hazmat_ = 'checked'
                        }
                        else {
                            hazmat_ = ''
                        }
                        if (used_ === true) {
                            used_ = 'checked'
                        }
                        else {
                            used_ = ''
                        }
                        if (machinery_ === true) {
                            machinery_ = 'checked'
                        }
                        else {
                            machinery_ = ''
                        }

                        itemName_ = itemName_.toString();
                        log.debug('itemName_ 219', itemName_);
                        log.debug("stackable_ final values", stackable_);
                        log.debug("length_, width_, height_", length_ + "||" + width_ + "||" + height_);

                        htmlTable += ' <section class="pallet tableRow"> <div id="main-form" class="form-main">' +
                            '      <div id="repform" class="Repeated-form mb-4">' +

                            '        <div class="form-heading">' +

                            '          <div class="check-buttons">' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-stackable" value="checked" + stackable_ +" id="stackable" ' + stackable_ + '> Stackable' +

                            '            </div>' +

                            '            <div class="first-checkbox custom-disabled">' +

                            '              <input type="checkbox" class="cls-hazmat" value="checked" id="Hazmat" ' + hazmat_ + '> Hazmat' +

                            '            </div>' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-used" value="checked" id="Used" ' + used_ + '> Used' +

                            '            </div>' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-machinery" value="checked" id="Machinery" ' + machinery_ + '> Machinery' +

                            '            </div>' +

                            '          </div>' +
                            '' +

                            '          <div class="Checkbox-icons">' +

                            '            <input type="checkbox" id="mark-flag' + ixd + '"> Mark as flag ' +

                            '          </div>' +

                            '' +

                            '          <div class="delete-icons">' +

                            '            <button class="remove-div dltRows" type="button" value=""><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +

                            '          </div>' +

                            '' +

                            '        </div>' +

                            '        <div class="form-body custom-form-input calc-parent-div">' +

                            '          <div class="form-flexx row">' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label mb-0">';
                        if (units_) {
                            htmlTable += '                  <input class="form-control mb-0 unit-change" id="Units" type="text" value = "' + units_ + '" required/>';
                        } else {
                            htmlTable += '                  <input class="form-control mb-0 unit-change" id="Units" type="text" value = "" required/>';
                        }
                        htmlTable += '                  <label class="mb-0">Units</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 HandlingUnit-change" id="HandlingUnit">';
                        if (handlingUnit_) {
                            htmlTable += '                    <option selected>' + handlingUnit_ + '</option>';
                        } else {
                            htmlTable += '                    <option selected>Pallet</option>';
                        }

                        // '                    <option selected>' + handlingUnit_ + '</option>' +
                        // htmlTable += '                    <option>Box</option>' +

                        htmlTable += '                    <option>Box</option>' +
                            '                    <option>Bale</option>' +

                            '                    <option>Bag</option>' +

                            '                    <option>Bucket</option>' +

                            '                    <option>Bundle</option>' +

                            '                    <option>Can</option>' +

                            '                    <option>Carton</option>' +

                            '                    <option>Case</option>' +

                            '                    <option>Coil</option>' +

                            '                    <option>Crate</option>' +

                            '                    <option>Cylinder</option>' +

                            '                    <option>Drums</option>' +

                            '                    <option>Pail</option>' +

                            '                    <option>Pieces</option>' +

                            '                    <option>Pallet</option>' +

                            '                    <option>Reel</option>' +

                            '                    <option>Roll</option>' +

                            '                    <option>Skid</option>' +

                            '                    <option>Tube</option>' +

                            '                    <option>Tote</option>' +

                            '                  </select>' +

                            '                  <span>Handling Unit</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <span class="has-float-label mb-0">';

                        if (quantity_ != null) {
                            htmlTable += '                  <input class="form-control mb-0 Pieces-change" id="Pieces" type="text" value="' + quantity_ + '" required/>';
                        } else {
                            htmlTable += '                  <input class="form-control mb-0 Pieces-change" id="Pieces" type="text" required />';
                        }

                        htmlTable += '                  <label class="mb-0">Pieces</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <div class="col-6 p-0">' +

                            '                  <span class="has-float-label mb-0">';

                        if (weight_) {
                            htmlTable += '                    <input class="form-control mb-0 nor-radius-R Weight-change" id="Weight" type="text"  value="' + weight_ + '"  />';
                        } else {
                            htmlTable += '                    <input class="form-control mb-0 nor-radius-R Weight-change" id="Weight" type="text"  value=""/>';
                        }

                        htmlTable += '                    <label class="mb-0">Weight</label>' +

                            '                  </span>' +

                            '                </div>' +

                            '                <div class="col-6 p-0">' +

                            '                  <span class="mb-0">' +

                            '                    <select class="form-control custom-select nor-radius mb-0 kg-change" id="kg">';
                        // log.debug('wtUnit_ 382', wtUnit_);
                        if (wtUnit_) {
                            htmlTable += '<option selected>' + wtUnit_ + '</option>';
                        } else {
                            htmlTable += '<option selected>lbs</option>';
                        }
                        // '<option selected>' + wtUnit_ + '</option>' +
                        // '                      <option>lbs</option>' +

                        htmlTable += '                      <option>kg</option>' +

                            '                      <option>grams</option>' +

                            '                    </select>' +

                            '                  </span>' +

                            '                </div>' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-3">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label custom-width mb-0">';

                        if (length_) {
                            htmlTable += '                  <input class="form-control Length-change" id="Length" type="text" value= ' + length_ + ' required/>';
                        } else {
                            htmlTable += '                  <input class="form-control Length-change" id="Length" type="text" value= "" required/>';
                        }


                        htmlTable += '                  <label class="mb-0" for="">Length</label>' +

                            '                </span>' +

                            '                <label class="has-float-label custom-width mb-0">';

                        if (width_) {
                            htmlTable += '                  <input class="form-control Width-change" type="text" id="Width" value= ' + width_ + ' required/>';
                        } else {
                            htmlTable += '                  <input class="form-control Width-change" type="text" id="Width" value="" required/>'
                        }

                        htmlTable += '                  <span>Width</span>' +

                            '                </label>' +

                            '' +

                            '                <label class="has-float-label custom-width mb-0">';

                        if (height_) {
                            htmlTable += '                  <input class="form-control Height-change" type="text" id="Height"  value= ' + height_ + ' required />';
                        } else {
                            htmlTable += '                  <input class="form-control Height-change" type="text" id="Height"  value= "" required />';
                        }

                        htmlTable += '                  <span>Height</span>' +

                            '                </label>' +

                            '                <span class="mb-0 custom-width-1">' +

                            '                  <select class="form-control custom-select nor-radius mb-0 wtUnit-change" id="wtUnit" >';
                        if (lwhUnit_) {
                            htmlTable += '                    <option selected>' + lwhUnit_ + '</option>';
                        } else {
                            htmlTable += '                    <option selected>In</option>';
                        }
                        // '                    <option selected>' + lwhUnit_ + '</option>' +
                        // '                    <option >In</option>' +
                        htmlTable += '                    <option>cm</option>' +
                            '                    <option >m</option>' +
                            '                    <option>ft</option>' +
                            '                  </select>' +

                            '                </span>' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 class-change" id="class" required />' +

                            '                    <option>' + class_ + '</option>' +

                            // '                    <option >Class</option>' +

                            '                    <option >50</option>' +

                            '                    <option>55</option>' +

                            '                    <option>60</option>' +

                            '                    <option>65</option>' +

                            '                    <option>70</option>' +

                            '                    <option>77.5</option>' +

                            '                    <option>85</option>' +

                            '                    <option>92.5</option>' +

                            '                    <option>100</option>' +

                            '                    <option>110</option>' +

                            '                    <option>125</option>' +

                            '                    <option>150</option>' +

                            '                    <option>175</option>' +

                            '                    <option>200</option>' +

                            '                    <option>250</option>' +

                            '                    <option>300</option>' +

                            '                    <option>400</option>' +

                            '                    <option>500</option>' +

                            '                  </select>' +

                            '                  <span>Class</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label mb-0">';

                        if (suggestedClass_) {
                            htmlTable += '                  <input class="form-control mb-0 Suggested_Class-change" id="Suggested_Class" type="text" value = " ' + suggestedClass_ + '" placeholder="Suggested Class" disabled/>';
                        } else {
                            htmlTable += '                  <input class="form-control mb-0 Suggested_Class-change" id="Suggested_Class" type="text" value = "" placeholder="Suggested Class" disabled/>';
                        }
                        htmlTable += '                  <label class="mb-0">Suggested Class</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 NMFC-change" id="NMFC">' +

                            '                    <option selected>' + nmfc_ + '</option>' +

                            '                    <option>93490</option>' +

                            '                    <option>104340</option>' +

                            '                    <option>104600</option>' +

                            '                    <option>133300-02</option>' +

                            '                    <option>133300-03</option>' +

                            '                    <option>133300-04</option>' +

                            '                    <option>133300-05</option>' +

                            '                    <option>133300-07</option>' +

                            '                    <option>133300-08</option>' +

                            '                    <option>133300-09</option>' +

                            '                    <option>133300-10</option>' +

                            '                    <option>95190-01</option>' +

                            '                    <option>95190-02</option>' +

                            '                    <option>95190-03</option>' +

                            '                    <option>95190-04</option>' +

                            '                    <option>95190-05</option>' +

                            '                    <option>95190-06</option>' +

                            '                    <option>95190-07</option>' +

                            '                    <option>95190-08</option>' +

                            '                    <option>95190-09</option>' +

                            '                    <option>95190-10</option>' +

                            '                    <option>95190-11</option>' +

                            '                  </select>' +

                            '                  <span>NMFC</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-2">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <span class="has-float-label mb-0">' +

                            '                  <input class="form-control mb-0 description NMFCDesc-change" id="NMFCDesc" type="text" value="' + itemName_ + '" name="description" />' +

                            '                  <label class="mb-0" for="NMFC">Description</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +
                            '  </div>' +

                            '          </div>' +

                            '        </div>' +

                            '        <div class="add-clone" id="add-clone1">' +

                            '' +

                            '        </div>' +

                            '        <div class="form-footer">' +

                            '          <button type="button" id="add-package1" class="add-package">' +

                            '            <i class="fa fa-plus"></i> Add Package' +

                            '          </button>' +

                            '        </div>' +

                            '      </div>' +

                            '    </div> </section>';



                        itemsss.push(itemName_);
                        unitsess.push(units_);
                        ixd++;
                        // return true;
                        // });
                    }

                    // code for enhance handling items

                    var enh_items = JSON.parse(json_data).enhancedHandlingUnits;
                    log.debug('enh_items', enh_items);

                    // loop for enh items 
                    var id_val = 1;
                    for (var e = 0; e < enh_items.length; e++) {
                        var enh_itm_obj = enh_items[e];
                        log.debug('enh_itm_obj', enh_itm_obj);

                        parent_stackable_ = enh_itm_obj.isStackable;
                        log.debug('stackable_', stackable_);
                        // hazmat_ = item_element.isHazardous;
                        // used_ = item_element.isUsed;
                        parent_machinery_ = enh_itm_obj.isMachinery;
                        // item_ = item_element.description;
                        parent_itemName_ = enh_itm_obj.description;
                        parent_units_ = enh_itm_obj.units;
                        parent_handlingUnit_ = enh_itm_obj.handlingUnitType;
                        log.debug('handlingUnit_', handlingUnit_);
                        // quantity_ = item_element.pieces;
                        parent_weight_ = enh_itm_obj.handlingUnitWeight;
                        // wtUnit_ = enh_itm_obj.totalWeightUnit;
                        // log.debug('wtUnit_', wtUnit_);
                        parent_length_ = enh_itm_obj.handlingUnitLength;
                        parent_width_ = enh_itm_obj.handlingUnitWidth;
                        parent_height_ = enh_itm_obj.handlingUnitHeight;
                        // lwhUnit_ = item_element.sinLwhUnit;
                        // class_ = item_element.freightClass;
                        // suggestedClass_ = item_element.freightClass;
                        // nmfc_ = item_element.nmfcItemCode + '-' + item_element.nmfcSubCode;

                        if (parent_stackable_ === true) {
                            parent_stackable_ = 'checked'
                        }
                        else {
                            parent_stackable_ = ''
                        }
                        if (parent_machinery_ === true) {
                            parent_machinery_ = 'checked'
                        }
                        else {
                            machinery_ = ''
                        }

                        htmlTable += '<section class="pallet tableRow"> <div id="main-form" class="form-main form-diabled">' +     //////////////////////////////////
                            '      <div id="repform" class="Repeated-form mb-4">' +

                            '        <div class="form-heading">' +

                            '          <div class="check-buttons">' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-stackable" value="checked" + stackable_ +" id="stackable" ' + parent_stackable_ + '> Stackable' +

                            '            </div>' +

                            '            <div class="first-checkbox custom-disabled">' +

                            '              <input type="checkbox" class="cls-hazmat" value="checked" id="Hazmat" > Hazmat' +

                            '            </div>' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-used" value="checked" id="Used" > Used' +

                            '            </div>' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-machinery" value="checked" id="Machinery" ' + parent_machinery_ + '> Machinery' +

                            '            </div>' +

                            '          </div>' +
                            '' +

                            '          <div class="Checkbox-icons">' +

                            '            <input type="checkbox" id="mark-flag"> Mark as flag ' +

                            '          </div>' +

                            '' +

                            '          <div class="delete-icons">' +

                            '            <button class="remove-div dltRows" type="button" value=""><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +

                            '          </div>' +

                            '' +

                            '        </div>' +

                            '        <div class="form-body custom-form-input calc-parent-div">' +

                            '          <div class="form-flexx row">' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label mb-0">';
                        if (parent_units_) {
                            htmlTable += '                  <input class="form-control mb-0 unit-change" id="Units" type="text" value = "' + parent_units_ + '" required/>';
                        } else {
                            htmlTable += '                  <input class="form-control mb-0 unit-change" id="Units" type="text" value = "" required/>';
                        }
                        htmlTable += '                  <label class="mb-0">Units</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 HandlingUnit-change" id="HandlingUnit">';
                        if (parent_handlingUnit_) {
                            htmlTable += '                    <option selected>' + parent_handlingUnit_ + '</option>';
                        } else {
                            htmlTable += '                    <option selected>Pallet</option>';
                        }

                        // '                    <option selected>' + handlingUnit_ + '</option>' +
                        // htmlTable += '                    <option>Box</option>' +

                        htmlTable += '                    <option>Box</option>' +
                            '                    <option>Bale</option>' +

                            '                    <option>Bag</option>' +

                            '                    <option>Bucket</option>' +

                            '                    <option>Bundle</option>' +

                            '                    <option>Can</option>' +

                            '                    <option>Carton</option>' +

                            '                    <option>Case</option>' +

                            '                    <option>Coil</option>' +

                            '                    <option>Crate</option>' +

                            '                    <option>Cylinder</option>' +

                            '                    <option>Drums</option>' +

                            '                    <option>Pail</option>' +

                            '                    <option>Pieces</option>' +

                            '                    <option>Pallet</option>' +

                            '                    <option>Reel</option>' +

                            '                    <option>Roll</option>' +

                            '                    <option>Skid</option>' +

                            '                    <option>Tube</option>' +

                            '                    <option>Tote</option>' +

                            '                  </select>' +

                            '                  <span>Handling Unit</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <span class="has-float-label mb-0">' +

                            '                  <input class="form-control mb-0 Pieces-change" id="Pieces" type="text" required/>' +

                            '                  <label class="mb-0">Pieces</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <div class="col-6 p-0">' +

                            '                  <span class="has-float-label mb-0">';

                        if (parent_weight_) {
                            htmlTable += '                    <input class="form-control mb-0 nor-radius-R Weight-change" id="Weight" type="text"  value=' + parent_weight_ + ' />';
                        } else {
                            htmlTable += '                    <input class="form-control mb-0 nor-radius-R Weight-change" id="Weight" type="text"  value=""/>';
                        }

                        htmlTable += '                    <label class="mb-0">Weight</label>' +

                            '                  </span>' +

                            '                </div>' +

                            '                <div class="col-6 p-0">' +

                            '                  <span class="mb-0">' +

                            '                    <select class="form-control custom-select nor-radius mb-0 kg-change" id="kg">';
                        // log.debug('wtUnit_ 382', wtUnit_);
                        // if (wtUnit_) {
                        //     htmlTable += '<option selected>' + wtUnit_ + '</option>';
                        // } else {
                        htmlTable += '<option selected>lbs</option>';
                        // }
                        // '<option selected>' + wtUnit_ + '</option>' +
                        // '                      <option>lbs</option>' +

                        htmlTable += '                      <option>kg</option>' +

                            '                      <option>grams</option>' +

                            '                    </select>' +

                            '                  </span>' +

                            '                </div>' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-3">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label custom-width mb-0">';

                        if (parent_length_) {
                            htmlTable += '                  <input class="form-control Length-change" id="Length" type="text" value= ' + parent_length_ + ' required/>';
                        } else {
                            htmlTable += '                  <input class="form-control Length-change" id="Length" type="text" value= "" required/>';
                        }


                        htmlTable += '                  <label class="mb-0" for="">Length</label>' +

                            '                </span>' +

                            '                <label class="has-float-label custom-width mb-0">';

                        if (parent_width_) {
                            htmlTable += '                  <input class="form-control Width-change" type="text" id="Width" value= ' + parent_width_ + 'required/>';
                        } else {
                            htmlTable += '                  <input class="form-control Width-change" type="text" id="Width" value="" required/>'
                        }

                        htmlTable += '                  <span>Width</span>' +

                            '                </label>' +

                            '' +

                            '                <label class="has-float-label custom-width mb-0">';

                        if (parent_height_) {
                            htmlTable += '                  <input class="form-control Height-change" type="text" id="Height"  value= ' + parent_height_ + ' required />';
                        } else {
                            htmlTable += '                  <input class="form-control Height-change" type="text" id="Height"  value= "" required />';
                        }

                        htmlTable += '                  <span>Height</span>' +

                            '                </label>' +

                            '                <span class="mb-0 custom-width-1">' +

                            '                  <select class="form-control custom-select nor-radius mb-0 wtUnit-change" id="wtUnit" >';
                        // if (lwhUnit_) {
                        //     htmlTable += '                    <option selected>' + lwhUnit_ + '</option>';
                        // } else {
                        htmlTable += '                    <option selected>In</option>';
                        // }
                        // '                    <option selected>' + lwhUnit_ + '</option>' +
                        // '                    <option >In</option>' +
                        htmlTable += '                    <option>cm</option>' +
                            '                    <option >m</option>' +
                            '                    <option>ft</option>' +
                            '                  </select>' +

                            '                </span>' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 class-change" id="class"/>' +

                            '                    <option></option>' +

                            // '                    <option >Class</option>' +

                            '                    <option >50</option>' +

                            '                    <option>55</option>' +

                            '                    <option>60</option>' +

                            '                    <option>65</option>' +

                            '                    <option>70</option>' +

                            '                    <option>77.5</option>' +

                            '                    <option>85</option>' +

                            '                    <option>92.5</option>' +

                            '                    <option>100</option>' +

                            '                    <option>110</option>' +

                            '                    <option>125</option>' +

                            '                    <option>150</option>' +

                            '                    <option>175</option>' +

                            '                    <option>200</option>' +

                            '                    <option>250</option>' +

                            '                    <option>300</option>' +

                            '                    <option>400</option>' +

                            '                    <option>500</option>' +

                            '                  </select>' +

                            '                  <span>Class</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <span class="has-float-label mb-0">' +

                            '                  <input class="form-control mb-0 NMFC-change" id="NMFC" type="text" value= "" />' +

                            '                  <label class="mb-0" for="NMFC">NMFC</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-3">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <span class="has-float-label mb-0">' +

                            '                  <input class="form-control mb-0 description NMFCDesc-change" id="NMFCDesc" type="text" value="' + parent_itemName_ + '" name="description" />' +

                            '                  <label class="mb-0" for="NMFC">Description</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +
                            '  </div>' +

                            '          </div>' +

                            '        </div>' +

                            '        <div class="add-clone" id="add-clone1">';


                        log.debug('child_item', child_item);

                        for (var k = 0; k < enh_items[e].packages.length; k++) {
                            log.debug("enh_items[e].packages", enh_items[e].packages);
                            log.debug("enh_items[e].packages[k]", enh_items[e].packages[k]);
                            log.debug("enh_items[e].packages[k].packageDesc", enh_items[e].packages[k].packageDesc);

                            var child_item = enh_items[e].packages[k];

                            // child_stackable_ = child_item.isStackable;
                            // log.debug('child_stackable_', child_stackable_);
                            child_hazmat_ = child_item.packageIsHazardous;
                            child_used_ = child_item.packageIsUsed;
                            child_machinery_ = child_item.packageIsMachinery;
                            // child_item_ = item_element.packageDesc;
                            child_itemName_ = child_item.packageDesc;
                            // child_units_ = child_item.quantity;

                            child_quantity_ = child_item.quantity;
                            child_weight_ = child_item.weightPerPackage;

                            // log.debug('wtUnit_', wtUnit_);
                            child_length_ = child_item.packageLength;
                            child_width_ = child_item.packageWidth;
                            child_height_ = child_item.packageHeight;

                            child_class_ = child_item.packageFreightClass;
                            log.debug('child_class_', child_class_);
                            child_lwhUnit_ = child_item.packageLwhunit;
                            log.debug('child_lwhUnit_', child_lwhUnit_);
                            child_wtUnit_ = child_item.weightUnitPackage;
                            log.debug('child_wtUnit_', child_wtUnit_);
                            child_handlingUnit_ = child_item.packagingType;
                            log.debug('child_handlingUnit_', child_handlingUnit_);
                            // child_suggestedClass_ = child_item.freightClass;
                            if (child_item.packageNmfcSubCode && child_item.packageNmfcItemCode) {
                                child_nmfc_ = child_item.packageNmfcItemCode + '-' + child_item.packageNmfcSubCode;
                            } else if (child_item.packageNmfcItemCode) {
                                child_nmfc_ = child_item.packageNmfcItemCode;
                            } else {
                                child_nmfc_ = '';
                            }

                            if (child_hazmat_ === true) {
                                child_hazmat_ = "checked"
                            }
                            else {
                                child_hazmat_ = ''
                            }
                            log.debug('child_hazmat_P', child_hazmat_);
                            if (child_used_ === true) {
                                child_used_ = "checked"
                            }
                            else {
                                child_used_ = ''
                            }
                            log.debug('child_used_P', child_used_);


                            // htmlTable += JSON.stringify(enh_items[e].packages);
                            htmlTable += `<div id="Parentid${id_val}" class="Appended-HTML">
    <div id="main-form-1" class="custom-append form-main mb-4">
        <div id="add-clone-main">
            <div id="Copied-form" class="Repeated-form">
                <div class="form-heading">`;
                            htmlTable += `<div class="form-button-Heading">
                        <h6>PACKAGE <span count-heafng-1="">${k + 1}</span></h6>
                    </div>`;
                            // select inventory options.

                            htmlTable += '<div class=\'form-button-inventry\'><select  id= \'task-status\' class = \'form-control custom-select custom-select-new\' required /><option value = \'\'>Select Inventory</option>';
                            if (child_itemName_) {
                                htmlTable += `<option selected>${child_itemName_}</option>`;
                            }
                            var arrays = [];
                            var salesorderSearchObj = search.create({
                                type: trxType,
                                filters: trx_search_filters,
                                columns:
                                    [
                                        search.createColumn({
                                            name: "internalid",
                                            join: "item",
                                            label: "Internal ID"
                                        }),
                                        search.createColumn({ name: "item", label: "Item" })
                                    ]
                            });
                            var searchResultCount = salesorderSearchObj.runPaged().count;
                            log.debug("salesorderSearchObj result count", searchResultCount);
                            salesorderSearchObj.run().each(function (result) {
                                var itemNm = result.getText({ name: "Item" });
                                log.debug('itemNm', itemNm);
                                arrays.push(itemNm);

                                return true;
                            });
                            var lengtha = arrays.length;
                            log.debug('lengtha', lengtha);

                            for (var i = 0; i < lengtha; i++) {

                                log.debug('arrays[i]', arrays[i]);
                                var set_val = arrays[i].toString();
                                // set_val = "'+set_val+'"
                                htmlTable += "<option value = '" + arrays[i] + "'>" + arrays[i] + "</option>"

                            }
                            log.debug('ixd 700', ixd);

                            htmlTable += `</select></div>`;
                            //         <div class="form-button-inventry">
                            //     <select id="task-status${id_val}"class="form-control custom-select custom-select-new" required="">
                            //         <option selected>${child_itemName_}</option>'
                            //     </select>
                            // </div>`;
                            htmlTable += `<div class="check-buttons">
                        <div class="first-checkbox"><input class="new-cls-hazmat" type="checkbox" value="checked" ${child_hazmat_}> Hazmat
                        </div>
                        <div class="first-checkbox"><input class="new-cls-used" type="checkbox" value="checked" ${child_used_}> Used </div>
                    </div>
                    <div class="delete-icons"><button class="remove-div1" id="custom-remove" type="button" value=""><i
                                class="fa fa-trash-o" aria-hidden="true"></i></button></div>
                </div>
                <div class="form-body">
                    <div class="form-flexx row calc-child-div">
                        <div class="col-lg-1 col-md-2 col-sm-6">
                            <div class="form-group input-group mb-0"> <span class="has-float-label mb-0"> <input
                                        data-calc="unit-val"
                                        class="form-control mb-0 unit-val-change calc-child focus-function-unit"
                                        id="unit-val${id_val}" type="text" value="${child_quantity_}"
                                        required=""> <label class="mb-0">#Per Units</label> </span> </div>
                        </div>
                        <div class="col-lg-1 col-md-2 col-sm-6">
                            <div class="form-group input-group mb-0"><label
                                    class="form-group has-float-label mb-0">
                                    <select id="newhandlingunit${id_val}" class="form-control custom-select mb-0 newhandlingunit-change" required="">`;
                            if (child_handlingUnit_) {
                                htmlTable += `<option selected>${child_handlingUnit_}</option>`;
                            }
                            htmlTable += `<option>Box</option>
                                        <option>Bale</option>
                                        <option>Bag</option>
                                        <option>Bucket</option>
                                        <option>Bundle</option>
                                        <option>Can</option>
                                        <option>Carton</option>
                                        <option>Case</option>
                                        <option>Coil</option>
                                        <option>Crate</option>
                                        <option>Cylinder</option>
                                        <option>Drums</option>
                                        <option>Pail</option>
                                        <option>Pieces</option>
                                        <option>Pallet</option>
                                        <option>Reel</option>
                                        <option>Roll</option>
                                        <option>Skid</option>
                                        <option>Tube</option>
                                        <option>Tote</option>
                                    </select> <span>Handling Unit</span> </label></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-6">
                            <div class="form-group input-group mb-0"> <span class="has-float-label mb-0"> <input
                                        data-calc="pieces-val" class="form-control mb-0 Pieces-val-change calc-child"
                                        id="Pieces-val${id_val}" type="text" required=""> <label
                                        class="mb-0">Pieces</label> </span> </div>
                        </div>
                        <div class="col-lg-2 col-md-3 col-sm-6">
                            <div class="form-group input-group mb-0">
                                <div class="col-md-8 p-0"> <span class="has-float-label mb-0 new-width"> <input
                                            data-calc="weight-val"
                                            class="form-control mb-0 nor-radius-R Weight-val-change calc-child focus-function"
                                            id="Weight-val${id_val}" type="text" value="${child_weight_}"
                                            required="">
                                        <label class="mb-0">Weight</label> </span> </div>
                                <div class="col-md-4 p-0"> <span class="mb-0"> <select id="newewightunit${id_val}" data-calc="weight-unit" class="form-control custom-select nor-radius mb-0 newweightunit-change">`;
                            if (child_wtUnit_) {
                                htmlTable += `<option selected>${child_wtUnit_}</option>`;
                            }
                            htmlTable += `<option>lbs</option>
                                            <option>kg</option>
                                            <option>grams</option>
                                        </select> </span> </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="form-group input-group mb-0"> <span class="has-float-label custom-width mb-0">
                                    <input data-calc="length-val" class="form-control Length-val-change calc-child"
                                        id="Length-val${id_val}" type="text" value="${child_length_}" required="">
                                    <label class="mb-0" for="">Length</label> </span><label
                                    class="has-float-label custom-width mb-0 "><input data-calc="width-val"
                                        class="form-control Width-val-change calc-child" type="text" 
                                        value="${child_width_}" id="Width-val${id_val}" required=""> <span>Width</span> </label><label
                                    class="has-float-label custom-width mb-0"><input data-calc="height-val"
                                        class="form-control Height-val-change calc-child" id="Height-val${id_val}"
                                        type="text" value="${child_height_}" required=""> <span>Height</span>
                                </label> <span class="mb-0 custom-width-1"> <select id="newlwhunit${id_val}" data-calc="lwh-unit" class="form-control custom-select nor-radius mb-0 calc-child newlwhunit-change">`;
                            if (child_lwhUnit_) {
                                htmlTable += `<option selected>${child_lwhUnit_}</option>`;
                            }
                            htmlTable += `<option>in</option>
                                        <option>cm</option>
                                        <option>m</option>
                                        <option>ft</option>
                                    </select> </span> </div>
                        </div>
                        <div class="col-lg-1 col-md-2 col-sm-6">
                            <div class="form-group input-group mb-0"><label
                                    class="form-group has-float-label mb-0"><select
                                        class="form-control custom-select mb-0 new-class-change" id="new-class${id_val}" required="">`;
                            if (child_class_) {
                                htmlTable += `<option selected>${child_class_}</option>`;
                            }
                            htmlTable += `<option>50</option>
                                        <option>55</option>
                                        <option>60</option>
                                        <option>65</option>
                                        <option>70</option>
                                        <option>85</option>
                                        <option>92.5</option>
                                        <option>100</option>
                                        <option>125</option>
                                        <option>175</option>
                                        <option>250</option>
                                        <option>300</option>
                                        <option>400</option>
                                    </select> <span>Class</span> </label></div>
                        </div>
                        <div class="col-lg-1 col-md-2 col-sm-6">
                            <div class="form-group input-group mb-0"> <span class="has-float-label mb-0"> <input
                                        class="form-control mb-0 NMFC-val-change" id="NMFC-val${id_val}" type="text"
                                         value="${child_nmfc_}"> <label class="mb-0" for="NMFC">NMFC</label> </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
                            id_val++;
                        }


                        htmlTable += '        </div>' +

                            '        <div class="form-footer">' +

                            '          <button type="button" id="add-package1" class="add-package">' +

                            '            <i class="fa fa-plus"></i> Add Package' +

                            '          </button>' +

                            '        </div>' +

                            '      </div>' +

                            '    </div> </section>';



                    }

                    htmlTable += '<div id="appendList">' +
                        '  </div>';
                    htmlTable += '<div class="add-item-btn">' +
                        '<button type="button" id="add-item" class="add-item-class">' +

                        '            <i class="fa fa-plus"></i> Add Item' +

                        '          </button>' +
                        '</div>' +

                        '  </div>';


                    htmlTable += '  </div>' +



                        '  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>' +

                        '  <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>' +
                        ' <script>$(function(){ $(\'.pallet\').attr(\'id\',function(i){return \'pallet\'+(i+1);});});</script>' +
                        '<script>function idchange(){ $(\'.unit-change\').each(function(index) { $(this).attr(\'id\', \'Unit\' + (index + 1)); }); $(\'.HandlingUnit-change\').each(function(index) { $(this).attr(\'id\', \'HandlingUnit\' + (index + 1)); }); $(\'.Pieces-change\').each(function(index) { $(this).attr(\'id\', \'Pieces\' + (index + 1)); }); $(\'.Weight-change\').each(function(index) { $(this).attr(\'id\', \'Weight\' + (index + 1)); }); $(\'.Length-change\').each(function(index) { $(this).attr(\'id\', \'Length\' + (index + 1)); }); $(\'.Width-change\').each(function(index) { $(this).attr(\'id\', \'Width\' + (index + 1)); }); $(\'.Height-change\').each(function(index) { $(this).attr(\'id\', \'Height\' + (index + 1)); }); $(\'.class-change\').each(function(index) { $(this).attr(\'id\', \'class\' + (index + 1)); }); $(\'.NMFC-change\').each(function(index) { $(this).attr(\'id\', \'NMFC\' + (index + 1)); }); $(\'.NMFCDesc-change\').each(function(index) { $(this).attr(\'id\', \'NMFCDesc\' + (index + 1)); }); } idchange();</script>' +

                        '  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>' +
                        '<script>$(\'.form-main\').first().find(\'.delete-icons\').addClass(\'disbaled-remove\'); var numItems = $(\'#main-form\').length; $(document).on(\'click\', \'.remove-div\', function() {  $(this).parents().eq(4).remove(); idchange();});</script>' +
                        '<script>function disabledinput(){var numItems = $(\'div.Appended-HTML\').length;console.log(numItems);if(numItems >= 0){$(\'input#submitter\').removeClass(\'disabled\');}else{$(\'input#submitter\').addClass(\'disabled\');} }</script> ' +

                        '<script>$(window).on(\'load\', function(){ disabledinput(); console.log(\'All assets are loaded\')})</script>' +
                        '<script> var clonediv = $(\'#add-clone1\'); var storehtml = $(\'<div id="Parentid" class="Appended-HTML"></div>\').html("<div id=\'main-form-1\' class=\'custom-append form-main mb-4\'><div id=\'add-clone-main\'><div id=\'Copied-form\' class=\'Repeated-form\'><div class=\'form-heading\'><div class=\'form-button-Heading\'><h6>PACKAGE <span count-heafng-1></span></span></h6> </div>';
                    htmlTable += '<div class=\'form-button-inventry\'><select  id= \'task-status\' class = \'form-control custom-select custom-select-new\' required /><option value = \'\'>Select Inventory</option>';

                    var arrays = [];
                    var salesorderSearchObj = search.create({
                        type: trxType,
                        filters: trx_search_filters,
                        columns:
                            [
                                search.createColumn({
                                    name: "internalid",
                                    join: "item",
                                    label: "Internal ID"
                                }),
                                search.createColumn({ name: "item", label: "Item" })
                            ]
                    });
                    var searchResultCount = salesorderSearchObj.runPaged().count;
                    log.debug("salesorderSearchObj result count", searchResultCount);
                    salesorderSearchObj.run().each(function (result) {
                        var itemNm = result.getText({ name: "Item" });
                        log.debug('itemNm', itemNm);
                        arrays.push(itemNm);

                        return true;
                    });
                    var lengtha = arrays.length;
                    log.debug('lengtha', lengtha);

                    for (var i = 0; i < lengtha; i++) {

                        log.debug('arrays[i]', arrays[i]);
                        var set_val = arrays[i].toString();
                        // set_val = "'+set_val+'"
                        htmlTable += "<option value = '" + arrays[i] + "'>" + arrays[i] + "</option>"

                    }
                    log.debug('ixd 699', ixd);

                    htmlTable += '</select></div>';
                    htmlTable += '<div class=\'check-buttons\'><div class=\'first-checkbox\'><input class=\'new-cls-hazmat\' type=\'checkbox\' value=' + hazmat_ + ' id=\'\'> Hazmat </div><div class=\'first-checkbox\'><input class=\'new-cls-used\' type=\'checkbox\' value=' + used_ + ' id=\'\'> Used </div></div><div class=\'delete-icons\'><button class=\'remove-div1\' id=\'custom-remove\' type=\'button\' value=\'\'><i class=\'fa fa-trash-o\' aria-hidden=\'true\'></i></button></div></div><div class=\'form-body\'><div class=\'form-flexx row calc-child-div\'><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label mb-0\'> <input data-calc=\'unit-val\' class=\'form-control mb-0 unit-val-change calc-child focus-function-unit\' id=\'unit-val\' type=\'text\'  value=\' \' required/> <label class=\'mb-0\'>#Per Units</label> </span> </div></div><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'><label class=\'form-group has-float-label mb-0\'><select id=\'newhandlingunit\' class=\'form-control custom-select mb-0 newhandlingunit-change\' required> <option>Box</option><option>Bale</option><option>Bag</option><option>Bucket</option><option>Bundle</option><option>Can</option><option>Carton</option><option>Case</option><option>Coil</option><option>Crate</option><option>Cylinder</option><option>Drums</option><option>Pail</option><option>Pieces</option><option>Pallet</option><option>Reel</option><option>Roll</option><option>Skid</option><option>Tube</option><option>Tote</option></select> <span>Handling Unit</span> </label></div></div><div class=\'col-lg-2 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label mb-0\'> <input data-calc=\'pieces-val\' class=\'form-control mb-0 Pieces-val-change calc-child\' id=\'Pieces-val\' type=\'text\' required/> <label class=\'mb-0\'>Pieces</label> </span> </div></div><div class=\'col-lg-2 col-md-3 col-sm-6\'><div class=\'form-group input-group mb-0\'><div class=\'col-md-8 p-0\'> <span class=\'has-float-label mb-0 new-width\'> <input data-calc=\'weight-val\' class=\'form-control mb-0 nor-radius-R Weight-val-change calc-child focus-function\' id=\'Weight-val\' type=\'text\'  value=\'\' required /> <label class=\'mb-0\'>Weight</label> </span> </div><div class=\'col-md-4 p-0\'> <span class=\'mb-0\'> <select id=\'newewightunit\' data-calc=\'weight-unit\' class=\'form-control custom-select nor-radius mb-0 newweightunit-change\'> <option selected>lbs</option> <option>kg</option> <option>grams</option> </select> </span> </div></div></div><div class=\'col-lg-4 col-md-4 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label custom-width mb-0\'> <input data-calc=\'length-val\' class=\'form-control Length-val-change calc-child\' id=\'Length-val\' type=\'text\'  value=\'\' required/> <label class=\'mb-0\' for=\'\'>Length</label> </span><label class=\'has-float-label custom-width mb-0 \'><input data-calc=\'width-val\' class=\'form-control Width-val-change calc-child\' type=\'text\'  value=\'\' id=\'Width-val\' required/> <span>Width</span> </label><label class=\'has-float-label custom-width mb-0\'><input data-calc=\'height-val\' class=\'form-control Height-val-change calc-child\' id=\'Height-val\' type=\'text\' value=\'\' required/> <span>Height</span> </label> <span class=\'mb-0 custom-width-1\'> <select id=\'newlwhunit\' data-calc=\'lwh-unit\' class=\'form-control custom-select nor-radius mb-0 calc-child newlwhunit-change\'> <option selected>in</option> <option>cm</option> <option>m</option> <option>ft</option> </select> </span> </div></div><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'><label class=\'form-group has-float-label mb-0\'><select  class=\'form-control custom-select mb-0 new-class-change\' id=\'new-class\' required><option >50</option><option>55</option><option>60</option><option>65</option><option>70</option><option>85</option><option>92.5</option><option>100</option><option>125</option><option>175</option><option>250</option><option>300</option><option>400</option></select> <span>Class</span> </label></div></div><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label mb-0\'> <input class=\'form-control mb-0 NMFC-val-change\' id=\'NMFC-val\' type=\'text\' value=\'\'  /> <label class=\'mb-0\' for=\'NMFC\'>NMFC</label> </span> </div></div></div></div></div></div></div>")</script>' +
                        '<script>$(document).on(\'click\', \'.add-package\', function() { var numItems1 = $(\'div.Appended-HTML\').length;console.log(numItems);if(numItems1 >= 1){$(\'input#submitter\').addClass(\'disabled\');}else{$(\'input#submitter\').removeClass(\'disabled\');}; $(\'input#submitter\').removeClass(\'disabled\'); var handilingnew = $(this).parent().parent(\'.Repeated-form\').find(\'select.HandlingUnit-change option:selected\').val(); console.log(handilingnew); var handilingcontent =  handilingnew + "(s) containing the following:"; console.log(handilingcontent); var unitval = $(this).parent().parent(\'.Repeated-form\').find(\'input.unit-change\').val(); var piecesval = $(this).parent().parent(\'.Repeated-form\').find(\'#Pieces\').val(); var Weightval = $(this).parent().parent(\'.Repeated-form\').find(\'#Weight\').val(); var Widthval = $(this).parent().parent(\'.Repeated-form\').find(\'#Width\').val(); var Heightval = $(this).parent().parent(\'.Repeated-form\').find(\'#Height\').val(); var NMFCval = $(this).parent().parent(\'.Repeated-form\').find(\'input.NMFC-change\').val(); var classunit = $(this).parent().parent(\'.Repeated-form\').find(\'select.class-change option:nth-child(2)\').attr(\'selected\', \'selected\');; console.log(classunit); var lengthval = $(this).parent().parent(\'.Repeated-form\').find(\'#Length\').val(); var descriptionvalue = $(this).parent().parent(\'.Repeated-form\').find(\'#NMFCDesc\').val(); var inputvalue1 = $(".form-body input").val(); $(this).parent(".Repeated-form").find(".add-clone").find(".formbody").find("input").val("inputvalue"); var inputvalue = $(\'.custom-form-input input\').val(); $(this).parent().parent(".Repeated-form").find(".add-clone").append(storehtml.clone()); $(function(){ $(\'.Appended-HTML\').attr(\'id\',function(i){return \'Parentid\'+(i+1);});}); packageidchange();  var clonedata = $(this).parent().parent(\'.Repeated-form\').find("#add-clone1").find(".Appended-HTML").length; $(this).parent().parent().parent(\'#main-form\').addClass(\'form-diabled\'); $(this).parent().parent(".Repeated-form").find(\'#Copied-form h6 span\').each(function(index) { $(this).html((index + 1)); }); for(i=0;i<clonedata;i++){ if (clonedata >= 2) {$(this).parent().parent(\'.Repeated-form\').find(\'input.unit-val-change\').val(1); $(this).parent().parent(\'.Repeated-form\').find(\'input#Pieces-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Weight-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Length-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Width-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Height-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#NMFC-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#description-new\').val();$(this).parent().parent(\'.Repeated-form\').find(\'select.class-change\').val();$(this).parent().parent(\'.Repeated-form\').find(\'select.new-class-change\').children(\'option:selected\').val(); $(this).parent().parent().parent(\'#main-form\').addClass(\'form-diabled\');} else{$(this).parent().parent(\'.Repeated-form\').find(\'input.unit-val-change\').val(1); $(this).parent().parent(\'.Repeated-form\').find(\'input.Pieces-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Weight-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Length-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Width-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Height-val-change\').val();$(this).parent().parent(\'.Repeated-form\').find(\'.new-class-change\').val("Class"); $(this).parent().parent(\'.Repeated-form\').find(\'input.NMFC-val-change\').val(NMFCval);$(this).parent().parent(\'.Repeated-form\').find(\'input.NMFCDesc-change\').val(handilingcontent); $(this).parent().parent(\'.Repeated-form\').find(\'input#description-new\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'select.new-class-change\').children(\'option:selected\').val(classunit);} }; var selectedCountry1 = $(this).children(\'option:selected\').val(); var newArray1 = new Array(); $(\'input:text[name=description]\').each(function() { newArray1.push($("selectedCountry1").val()); }); console.log(newArray1.length); selectonchange(); disabledinput(); }); </script>' +
                        '<script>$(document).on(\'click\', \'#custom-remove\', function() { $(this).parent().parent(".Repeated-form").find(\'#Copied-form h6 span\').each(function(index) { $(this).html((index + 1)); });var clonedata0 = $(this).closest(\'#add-clone1\').find(\'.Appended-HTML\').length;if (clonedata0 <= 1) {$(this).parent().parent().parent().parent().parent().parent().parent().parent().parent(\'.form-main\').removeClass(\'form-diabled\');}  $(this).closest(\'.Appended-HTML\').remove(); var numItems2 = $(\'div.Appended-HTML\').length;console.log(numItems2);if(numItems2 === 0){$(\'input#submitter\').addClass(\'disabled\');}else{$(\'input#submitter\').removeClass(\'disabled\');};  packageidchange(); selectonchange(); });</script>' +
                        '<script>function packageidchange(){ $(\'.unit-val-change\').each(function(index) { $(this).attr(\'id\', \'unit-val\' + (index + 1)); }); $(\'.newhandlingunit-change\').each(function(index) { $(this).attr(\'id\', \'newhandlingunit\' + (index + 1)); }); $(\'.Pieces-val-change\').each(function(index) { $(this).attr(\'id\', \'Pieces-val\' + (index + 1)); }); $(\'.Weight-val-change\').each(function(index) { $(this).attr(\'id\', \'Weight-val\' + (index + 1)); }); $(\'.newweightunit-change\').each(function(index) { $(this).attr(\'id\', \'newewightunit\' + (index + 1)); }); $(\'.Length-val-change\').each(function(index) { $(this).attr(\'id\', \'Length-val\' + (index + 1)); }); $(\'.Width-val-change\').each(function(index) { $(this).attr(\'id\', \'Width-val\' + (index + 1)); }); $(\'.Height-val-change\').each(function(index) { $(this).attr(\'id\', \'Height-val\' + (index + 1)); });  $(\'.newlwhunit-change\').each(function(index) { $(this).attr(\'id\', \'newlwhunit\' + (index + 1)); }); $(\'.new-class-change\').each(function(index) { $(this).attr(\'id\', \'new-class\' + (index + 1)); }); $(\'.NMFC-val-change\').each(function(index) { $(this).attr(\'id\', \'NMFC-val\' + (index + 1)); });$(\'.custom-select-new\').each(function(index) { $(this).attr(\'id\', \'task-status\' + (index + 1)); }); }</script>' +
                        //'<script> $(\'#close_page\').on(\'click\', function(){window.open("", "_self").window.close();; }); </script>' +
                        // '<script> $("#add-package1d").click(function(){ $("div").append(`${htmlTable}`);});</script>' +
                        '<script>document.getElementById("add-item").onclick = duplicate;' +

                        // document.getElementById('add-item').onclick = duplicate;
                        // '<script>$("#add-item").on("click", function (e) { e.preventDefault(); var i = ' + ixd + '; var $self = $(this); $self.before($self.prev("#pallet" + i).clone());});</script>' +
                        // "<script>$('#add-item').on('click', function(e){ e.preventDefault(); var i = " + ixd + "; var $self = $('.pallet' + i).clone(); $('.form-user').append($self);});</script>" + 
                        'var i = ' + ixd + ';' +
                        'function duplicate() {' +
                        'var original = document.getElementsByClassName("tableRow")[0];' +
                        'var appendList = document.getElementById("appendList");' +
                        'var clone = original.cloneNode(true);' + // "deep" clone
                        'clone.id = "pallet" + ++i;' +// there can only be one element with an ID
                        // 'clone.onclick = duplicate;' + // event handlers are not cloned
                        'i++;' +

                        'appendList.appendChild(clone);' +
                        '}</script>' +
                        '</html>';

                    tableField.defaultValue = htmlTable;


                }
                else {
                    var htmlTable = '<!DOCTYPE html>' +

                        '<html>' +

                        '' +

                        '<head>' +

                        '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">' +

                        '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />' +

                        '  <link rel="stylesheet"' +

                        '    href="https://cdn.rawgit.com/tonystar/bootstrap-float-label/v4.0.1/dist/bootstrap-float-label.min.css">' +


                        '  <style>' +

                        '      @import url(https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap);*{box-sizing:border-box}body{margin:0;padding:0;font-family:Roboto,sans-serif}.form-body,.form-user{padding:15px}.Repeated-form {border: 1px solid #dedede;}.heading{width:100%;margin-bottom:5px}.heading h6{margin:0;font-size:16px}.form-main{border:none;border-radius:5px;width:100%;overflow:visible}.form-main .Repeated-form .form-heading{background:#f9fafa;padding:6px;border-radius:5px;display:flex;width:100%;justify-content:space-between;align-items:center}.form-button-inventry button{padding:3px 10px;border:1px solid #a6a7a7;border-radius:3px;background:#f9fafa;color:#a6a7a7;white-space:nowrap}.check-buttons{display:flex;align-items:center;margin-left:10px;width:90%;border-left:1px solid #b9b9b9}.check-buttons .first-checkbox{margin:0 10px;color:#968b8f}.delete-icons button{background:0 0;border:none;font-size:20px;color:#a43936}.form-body .form-flexx input,.form-body .form-flexx select{outline:0!important;box-shadow:none}.has-float-label .form-control:placeholder-shown:not(:focus)+*{opacity:.5;top:1em!important;font-size:14px!important}.nor-radius-R{border-radius:.25rem 0 0 .25rem!important}.nor-radius{border-radius:0 .25rem .25rem 0!important}.custom-width{max-width:105px !important;}.input-group .has-float-label{display:table-cell;width:100%}.form-footer{border-top:1px solid #dedede;padding:10px;display:flex;justify-content:end}.form-footer Button{background:0 0;border:none;color:#968b8f;font-weight:400;font-size:16px}.form-button-Heading h6{white-space:nowrap;margin:0 16px 0 0;border-right:1px solid #b9b9b9;padding-right:15px;height:21px}.btn-toggle.btn-sm>.handle{position:absolute;top:.1875rem;left:.1875rem;width:1.125rem;height:1.125rem;border-radius:1.125rem;background:#fff;transition:left .25s}.btn-toggle.btn-sm{margin:0 .5rem;padding:0;position:relative;border:none;height:1.5rem;width:3rem;border-radius:1.5rem}.btn-toggle.btn-sm:before{content:\'Off\';left:-.5rem}.btn-toggle.btn-sm:after,.btn-toggle.btn-sm:before{line-height:1.5rem;width:.5rem;text-align:center;font-weight:600;font-size:.55rem;text-transform:uppercase;letter-spacing:2px;position:absolute;bottom:0;transition:opacity .25s}.btn-toggle.btn-sm:after{content:\'On\';right:-.5rem;opacity:.5}div#Copied-form .custom-width{max-width:166px !important}.add-items button{background:#f9fafa;border:1px solid #dedede;color:#000;font-weight:400;font-size:16px;padding:5px 10px}.add-items{display:flex;justify-content:end;position:relative;margin-bottom:20px}.show-hide{position:absolute;background:#fff;z-index:999;width:220px;padding:0;box-shadow:0 10px 10px #dedede;border-radius:0}.heading-dropdown{display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #dedede}.heading-dropdown h4{font-size:16px;margin:0}.heading-dropdown button{padding:0!important;background:0 0!important;border:none!important;color:#000!important}.search-main{padding:5px 10px}.search-main input{width:100%;border:1px solid #dedede;padding:5px 10px;margin-top:10px}.repeated-content{padding:10px 15px;font-size:14px;border-bottom:1px solid #dedede}.value-2{display:flex;justify-content:space-between}.search-main {max-height: 200px;overflow-y: scroll;}.form-flexx.row input, .form-flexx.row select {height: 38px;}body, label, p, span, div, h6 {font-size: 14px;}.delete-icons.disbaled-remove button {pointer-events: none !important;}#appendList .delete-icons.disbaled-remove button {pointer-events: inherit !important;}.form-diabled .Repeated-form .form-body .custom-disabled, .form-diabled .Repeated-form .form-heading .custom-disabled {pointer-events: none;opacity: 0.4;}.form-diabled .Repeated-form .add-clone .form-body, .form-diabled .Repeated-form .add-clone .form-heading {   opacity: 1;pointer-events: auto;}.form-user { min-width: calc(1920px - 30px);}.Checkbox-icons {visibility: hidden;}span.has-float-label.mb-0.new-width {min-width: 200px !important;width: 100% !important;}table#tbl_submitter td#tdbody_submitter input.disabled {!important;cursor: pointer !important;box-shadow: none !important;outline: none !important;}td#tdbody_submitter {border: none;} .close-page-button {position: absolute;right: 16px;top: 25px;}.close-page-button button {background: red !important;color: #fff;border: none;padding: 5px 15px;}' +

                        '.add-item-btn {' +
                        ' display: flex;' +
                        'justify-content: end;' +
                        '}' +
                        '.add-item-btn .add-item-class{' +
                        'border: none;' +
                        'padding: 9px 20px;' +
                        'font-weight: 600;' +
                        'font-size: 16px;' +
                        '}' +
                        '  </style>' +
                        '<script>' +
                        'function selectitem(item){' +
                        'var x=document.getElementById(item.id);' +
                        'var y=x.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild;' +
                        'y.value=item.innerHTML;' +
                        '}' +
                        '</script>' +

                        '</head>' +

                        '' +

                        '<body>' +
                        '<div class="form-user">' +

                        '<div class="heading">' +

                        //'<p>'+ json_data +'</p>' +
                        '<h6>Items</h6>' +

                        '</div>';

                    '<div class="main-parent">';

                    var units_, stackable_, hazmat_, used_, machinery_, itemName_;
                    var itemsss = [];
                    var unitsess = [];
                    var ixd = 0;

                    var salesorderSearchObj = search.create({
                        type: trxType,
                        filters: trx_search_filters,
                        columns:
                            [
                                search.createColumn({
                                    name: "internalid",
                                    join: "item",
                                    label: "Internal ID"
                                }),
                                search.createColumn({ name: "custcol_p1_stackable", label: "Stackable" }),
                                search.createColumn({ name: "custcol_p1_hazmat", label: "Hazmat" }),
                                search.createColumn({ name: "custcol_p1_used", label: "Used" }),
                                search.createColumn({ name: "custcol_p1_machinery", label: "Machinery" }),
                                search.createColumn({ name: "item", label: "Item" }),
                                search.createColumn({ name: "custcol_p1_units", label: "Units" }),
                                search.createColumn({ name: "custcol_p1_handling_unit", label: "Handling Unit" }),
                                search.createColumn({ name: "quantity", label: "Quantity" }),
                                search.createColumn({ name: "custcol_p1_weight", label: "Weight" }),
                                search.createColumn({ name: "custcol_p1_wt_unit", label: "WT UNIT" }),
                                search.createColumn({ name: "custcol_p1_length", label: "Length" }),
                                search.createColumn({ name: "custcol_p1_width", label: "Width" }),
                                search.createColumn({ name: "custcol_p1_height", label: "Height" }),
                                search.createColumn({ name: "custcol_p1_lwh_unit", label: "LWH UNIT" }),
                                search.createColumn({ name: "custcol_p1_class", label: "Class" }),
                                search.createColumn({ name: "custcol_p1_suggested_class", label: "Suggested Class" }),
                                search.createColumn({ name: "custcol_p1_nmfc", label: "NMFC" })
                            ]
                    });
                    var searchResultCount = salesorderSearchObj.runPaged().count;
                    log.debug("salesorderSearchObj result count", searchResultCount);
                    salesorderSearchObj.run().each(function (result) {
                        stackable_ = result.getValue({ name: "custcol_p1_stackable" });
                        log.debug('stackable_', stackable_);
                        hazmat_ = result.getValue({ name: "custcol_p1_hazmat" });
                        used_ = result.getValue({ name: "custcol_p1_used" });
                        machinery_ = result.getValue({ name: "custcol_p1_machinery" });
                        item_ = result.getValue({ name: "item" });
                        itemName_ = result.getText({ name: "item" });
                        units_ = result.getValue({ name: "custcol_p1_units" });
                        handlingUnit_ = result.getText({ name: "custcol_p1_handling_unit" });
                        log.debug('handlingUnit_', handlingUnit_);
                        quantity_ = result.getValue({ name: "quantity" });
                        weight_ = result.getValue({ name: "custcol_p1_weight" });
                        wtUnit_ = result.getText({ name: "custcol_p1_wt_unit" });
                        log.debug('wtUnit_', wtUnit_);
                        length_ = result.getValue({ name: "custcol_p1_length" });
                        width_ = result.getValue({ name: "custcol_p1_width" });
                        height_ = result.getValue({ name: "custcol_p1_height" });
                        lwhUnit_ = result.getText({ name: "custcol_p1_lwh_unit" });
                        class_ = result.getText({ name: "custcol_p1_class" });
                        suggestedClass_ = result.getValue({ name: "custcol_p1_suggested_class" });
                        nmfc_ = result.getText({ name: "custcol_p1_nmfc" });
                        if (stackable_ === true) {
                            stackable_ = 'checked'
                        }
                        else {
                            stackable_ = ''
                        }
                        if (hazmat_ === true) {
                            hazmat_ = 'checked'
                        }
                        else {
                            hazmat_ = ''
                        }
                        if (used_ === true) {
                            used_ = 'checked'
                        }
                        else {
                            used_ = ''
                        }
                        if (machinery_ === true) {
                            machinery_ = 'checked'
                        }
                        else {
                            machinery_ = ''
                        }

                        itemName_ = itemName_.toString();
                        log.debug('itemName_ 219', itemName_);
                        log.debug("stackable_ final values", stackable_);
                        log.debug("length_, width_, height_", length_ + "||" + width_ + "||" + height_);

                        htmlTable += ' <section class="pallet tableRow"> <div id="main-form" class="form-main">' +
                            '      <div id="repform" class="Repeated-form mb-4">' +

                            '        <div class="form-heading">' +

                            '          <div class="check-buttons">' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-stackable" value="checked" + stackable_ +" id="stackable" ' + stackable_ + '> Stackable' +

                            '            </div>' +

                            '            <div class="first-checkbox custom-disabled">' +

                            '              <input type="checkbox" class="cls-hazmat" value="checked" id="Hazmat" ' + hazmat_ + '> Hazmat' +

                            '            </div>' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-used" value="checked" id="Used" ' + used_ + '> Used' +

                            '            </div>' +

                            '            <div class="first-checkbox">' +

                            '              <input type="checkbox" class="cls-machinery" value="checked" id="Machinery" ' + machinery_ + '> Machinery' +

                            '            </div>' +

                            '          </div>' +
                            '' +

                            '          <div class="Checkbox-icons">' +

                            '            <input type="checkbox" id="mark-flag' + ixd + '"> Mark as flag ' +

                            '          </div>' +

                            '' +

                            '          <div class="delete-icons">' +

                            '            <button class="remove-div dltRows" type="button" value=""><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +

                            '          </div>' +

                            '' +

                            '        </div>' +

                            '        <div class="form-body custom-form-input calc-parent-div">' +

                            '          <div class="form-flexx row">' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label mb-0">';
                        if (units_) {
                            htmlTable += '                  <input class="form-control mb-0 unit-change" id="Units" type="text" value = "' + units_ + '" required/>';
                        } else {
                            htmlTable += '                  <input class="form-control mb-0 unit-change" id="Units" type="text" value = "" required/>';
                        }
                        htmlTable += '                  <label class="mb-0">Units</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 HandlingUnit-change" id="HandlingUnit">';

                        if (handlingUnit_) {
                            htmlTable += '                    <option selected>' + handlingUnit_ + '</option>';
                        } else {
                            htmlTable += '                    <option selected>Pallet</option>';
                        }

                        htmlTable += '                    <option>Box</option>' +

                            '                    <option>Bale</option>' +

                            '                    <option>Bag</option>' +

                            '                    <option>Bucket</option>' +

                            '                    <option>Bundle</option>' +

                            '                    <option>Can</option>' +

                            '                    <option>Carton</option>' +

                            '                    <option>Case</option>' +

                            '                    <option>Coil</option>' +

                            '                    <option>Crate</option>' +

                            '                    <option>Cylinder</option>' +

                            '                    <option>Drums</option>' +

                            '                    <option>Pail</option>' +

                            '                    <option>Pieces</option>' +

                            '                    <option>Reel</option>' +

                            '                    <option>Roll</option>' +

                            '                    <option>Skid</option>' +

                            '                    <option>Tube</option>' +

                            '                    <option>Tote</option>' +

                            '                  </select>' +

                            '                  <span>Handling Unit</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <span class="has-float-label mb-0">' +

                            '                  <input class="form-control mb-0 Pieces-change" id="Pieces" type="text" value = "1" required/>' +

                            '                  <label class="mb-0">Pieces</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <div class="col-6 p-0">' +

                            '                  <span class="has-float-label mb-0">';

                        if (weight_) {
                            htmlTable += '                    <input class="form-control mb-0 nor-radius-R Weight-change" id="Weight" type="text"  value=' + weight_ + ' />';
                        } else {
                            htmlTable += '                    <input class="form-control mb-0 nor-radius-R Weight-change" id="Weight" type="text"  value="" />';
                        }

                        htmlTable += '                    <label class="mb-0">Weight</label>' +

                            '                  </span>' +

                            '                </div>' +

                            '                <div class="col-6 p-0">' +

                            '                  <span class="mb-0">' +

                            '                    <select class="form-control custom-select nor-radius mb-0 kg-change" id="kg">';
                        // log.debug('wtUnit_ 382', wtUnit_);
                        if (wtUnit_) {
                            htmlTable += '<option selected>' + wtUnit_ + '</option>';
                        } else {
                            htmlTable += '<option selected>lbs</option>';
                        }
                        // '<option selected>' + wtUnit_ + '</option>' +
                        // '                      <option>lbs</option>' +

                        htmlTable += '                      <option>kg</option>' +

                            '                      <option>grams</option>' +

                            '                    </select>' +

                            '                  </span>' +

                            '                </div>' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-3">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label custom-width mb-0">';

                        if (length_) {
                            htmlTable += '                  <input class="form-control Length-change" id="Length" type="text" value= ' + length_ + ' required/>';
                        } else {
                            htmlTable += '                  <input class="form-control Length-change" id="Length" type="text" value= "" required/>';
                        }


                        htmlTable += '                  <label class="mb-0" for="">Length</label>' +

                            '                </span>' +

                            '                <label class="has-float-label custom-width mb-0">';

                        if (width_) {
                            htmlTable += '                  <input class="form-control Width-change" type="text" id="Width" value= ' + width_ + ' required/>';
                        } else {
                            htmlTable += '                  <input class="form-control Width-change" type="text" id="Width" value="" required/>'
                        }

                        htmlTable += '                  <span>Width</span>' +

                            '                </label>' +

                            '' +

                            '                <label class="has-float-label custom-width mb-0">';

                        if (height_) {
                            htmlTable += '                  <input class="form-control Height-change" type="text" id="Height"  value= ' + height_ + ' required />';
                        } else {
                            htmlTable += '                  <input class="form-control Height-change" type="text" id="Height"  value= "" required />';
                        }

                        htmlTable += '                  <span>Height</span>' +

                            '                </label>' +

                            '                <span class="mb-0 custom-width-1">' +

                            '                  <select class="form-control custom-select nor-radius mb-0 wtUnit-change" id="wtUnit" >';
                        if (lwhUnit_) {
                            htmlTable += '                    <option selected>' + lwhUnit_ + '</option>';
                        } else {
                            htmlTable += '                    <option selected>In</option>';
                        }
                        // '                    <option selected>' + lwhUnit_ + '</option>' +
                        // '                    <option >In</option>' +
                        htmlTable += '                    <option>cm</option>' +
                            '                    <option >m</option>' +
                            '                    <option>ft</option>' +
                            '                  </select>' +

                            '                </span>' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 class-change" id="class" required />' +

                            '                    <option>' + class_ + '</option>' +

                            // '                    <option >Class</option>' +

                            '                    <option >50</option>' +

                            '                    <option>55</option>' +

                            '                    <option>60</option>' +

                            '                    <option>65</option>' +

                            '                    <option>70</option>' +

                            '                    <option>77.5</option>' +

                            '                    <option>85</option>' +

                            '                    <option>92.5</option>' +

                            '                    <option>100</option>' +

                            '                    <option>110</option>' +

                            '                    <option>125</option>' +

                            '                    <option>150</option>' +

                            '                    <option>175</option>' +

                            '                    <option>200</option>' +

                            '                    <option>250</option>' +

                            '                    <option>300</option>' +

                            '                    <option>400</option>' +

                            '                    <option>500</option>' +

                            '                  </select>' +

                            '                  <span>Class</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0">' +

                            '                <span class="has-float-label mb-0">' +

                            '                  <input class="form-control mb-0 Suggested_Class-change" id="Suggested_Class" type="text" value = "" disabled/>' +

                            '                  <label class="mb-0">Suggested Class</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-1">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <label class="form-group has-float-label mb-0">' +

                            '                  <select class="form-control custom-select mb-0 NMFC-change" id="NMFC">' +

                            '                    <option selected>' + nmfc_ + '</option>' +

                            '                    <option>93490</option>' +

                            '                    <option>104340</option>' +

                            '                    <option>104600</option>' +

                            '                    <option>133300-02</option>' +

                            '                    <option>133300-03</option>' +

                            '                    <option>133300-04</option>' +

                            '                    <option>133300-05</option>' +

                            '                    <option>133300-07</option>' +
                            
                            '                    <option>133300-08</option>' +

                            '                    <option>133300-09</option>' +

                            '                    <option>133300-10</option>' +

                            '                    <option>95190-01</option>' +

                            '                    <option>95190-02</option>' +

                            '                    <option>95190-03</option>' +

                            '                    <option>95190-04</option>' +

                            '                    <option>95190-05</option>' +

                            '                    <option>95190-06</option>' +

                            '                    <option>95190-07</option>' +

                            '                    <option>95190-08</option>' +

                            '                    <option>95190-09</option>' +

                            '                    <option>95190-10</option>' +

                            '                    <option>95190-11</option>' +

                            '                  </select>' +

                            '                  <span>NMFC</span>' +

                            '                </label>' +

                            '' +

                            '              </div>' +

                            '            </div>' +

                            '            <div class="col-2">' +

                            '              <div class="form-group input-group mb-0 custom-disabled">' +

                            '                <span class="has-float-label mb-0">' +

                            '                  <input class="form-control mb-0 description NMFCDesc-change" id="NMFCDesc" type="text" value="' + itemName_ + '" name="description" />' +

                            '                  <label class="mb-0" for="NMFC">Description</label>' +

                            '                </span>' +

                            '' +

                            '              </div>' +
                            '  </div>' +

                            '          </div>' +



                            '        </div>' +

                            '        <div class="add-clone" id="add-clone1">' +

                            '' +

                            '        </div>' +

                            '        <div class="form-footer">' +

                            '          <button type="button" id="add-package1" class="add-package">' +

                            '            <i class="fa fa-plus"></i> Add Package' +

                            '          </button>' +

                            '        </div>' +


                            '      </div>' +


                            '    </div> </section>';



                        itemsss.push(itemName_);
                        unitsess.push(units_);
                        ixd++;
                        return true;
                    });
                    htmlTable += '<div id="appendList">' +
                        '  </div>';
                    htmlTable += '<div class="add-item-btn">' +
                        '<button type="button" id="add-item" class="add-item-class">' +

                        '            <i class="fa fa-plus"></i> Add Item' +

                        '          </button>' +
                        '</div>' +

                        '  </div>';


                    htmlTable += '  </div>' +



                        '  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>' +

                        '  <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>' +
                        ' <script>$(function(){ $(\'.pallet\').attr(\'id\',function(i){return \'pallet\'+(i+1);});});</script>' +
                        '<script>function idchange(){ $(\'.unit-change\').each(function(index) { $(this).attr(\'id\', \'Unit\' + (index + 1)); }); $(\'.HandlingUnit-change\').each(function(index) { $(this).attr(\'id\', \'HandlingUnit\' + (index + 1)); }); $(\'.Pieces-change\').each(function(index) { $(this).attr(\'id\', \'Pieces\' + (index + 1)); }); $(\'.Weight-change\').each(function(index) { $(this).attr(\'id\', \'Weight\' + (index + 1)); }); $(\'.Length-change\').each(function(index) { $(this).attr(\'id\', \'Length\' + (index + 1)); }); $(\'.Width-change\').each(function(index) { $(this).attr(\'id\', \'Width\' + (index + 1)); }); $(\'.Height-change\').each(function(index) { $(this).attr(\'id\', \'Height\' + (index + 1)); }); $(\'.class-change\').each(function(index) { $(this).attr(\'id\', \'class\' + (index + 1)); }); $(\'.NMFC-change\').each(function(index) { $(this).attr(\'id\', \'NMFC\' + (index + 1)); }); $(\'.NMFCDesc-change\').each(function(index) { $(this).attr(\'id\', \'NMFCDesc\' + (index + 1)); }); } idchange();</script>' +

                        '  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>' +
                        '<script>$(\'.form-main\').first().find(\'.delete-icons\').addClass(\'disbaled-remove\'); var numItems = $(\'#main-form\').length; $(document).on(\'click\', \'.remove-div\', function() {  $(this).parents().eq(4).remove(); idchange();});</script>' +
                        '<script>function disabledinput(){var numItems = $(\'div.Appended-HTML\').length;console.log(numItems);if(numItems >= 0){$(\'input#submitter\').removeClass(\'disabled\');}else{$(\'input#submitter\').addClass(\'disabled\');} }</script> ' +

                        '<script>$(window).on(\'load\', function(){ disabledinput(); console.log(\'All assets are loaded\')})</script>' +
                        '<script> var clonediv = $(\'#add-clone1\'); var storehtml = $(\'<div id="Parentid" class="Appended-HTML"></div>\').html("<div id=\'main-form-1\' class=\'custom-append form-main mb-4\'><div id=\'add-clone-main\'><div id=\'Copied-form\' class=\'Repeated-form\'><div class=\'form-heading\'><div class=\'form-button-Heading\'><h6>PACKAGE <span count-heafng-1></span></span></h6> </div>';
                    htmlTable += '<div class=\'form-button-inventry\'><select  id= \'task-status\' class = \'form-control custom-select custom-select-new\' required /><option value = \'\'>Select Inventory</option>';

                    var arrays = [];
                    var salesorderSearchObj = search.create({
                        type: trxType,
                        filters: trx_search_filters,
                        // [
                        //     // ["type", "anyof", "SalesOrd"],
                        //     // "AND",
                        //     ["internalid", "anyof", salesOrderId],
                        //     // "AND",
                        //     // ["mainline", "is", "F"],
                        //     // ["item.internalid", "noneof", "-286", "12184","15"]
                        //     "AND",
                        //     ["shipping", "is", "F"],
                        //     "AND",
                        //     ["taxline", "is", "F"],
                        //     "AND",
                        //     ["cogs", "is", "F"]
                        // ],
                        columns:
                            [
                                search.createColumn({
                                    name: "internalid",
                                    join: "item",
                                    label: "Internal ID"
                                }),
                                search.createColumn({ name: "item", label: "Item" })
                            ]
                    });
                    var searchResultCount = salesorderSearchObj.runPaged().count;
                    log.debug("salesorderSearchObj result count", searchResultCount);
                    salesorderSearchObj.run().each(function (result) {
                        var itemNm = result.getText({ name: "Item" });
                        log.debug('itemNm', itemNm);
                        arrays.push(itemNm);

                        return true;
                    });
                    var lengtha = arrays.length;
                    log.debug('lengtha', lengtha);

                    for (var i = 0; i < lengtha; i++) {

                        log.debug('arrays[i]', arrays[i]);
                        var set_val = arrays[i].toString();
                        // set_val = "'+set_val+'"
                        htmlTable += "<option value = '" + arrays[i] + "'>" + arrays[i] + "</option>"

                    }
                    log.debug('ixd 699', ixd);

                    htmlTable += '</select></div>';
                    htmlTable += '<div class=\'check-buttons\'><div class=\'first-checkbox\'><input class=\'new-cls-hazmat\' type=\'checkbox\' value=' + hazmat_ + ' id=\'\'> Hazmat </div><div class=\'first-checkbox\'><input class=\'new-cls-used\' type=\'checkbox\' value=' + used_ + ' id=\'\'> Used </div></div><div class=\'delete-icons\'><button class=\'remove-div1\' id=\'custom-remove\' type=\'button\' value=\'\'><i class=\'fa fa-trash-o\' aria-hidden=\'true\'></i></button></div></div><div class=\'form-body\'><div class=\'form-flexx row calc-child-div\'><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label mb-0\'> <input data-calc=\'unit-val\' class=\'form-control mb-0 unit-val-change calc-child focus-function-unit\' id=\'unit-val\' type=\'text\' value=\' \' required/> <label class=\'mb-0\'>#Per Units</label> </span> </div></div><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'><label class=\'form-group has-float-label mb-0\'><select id=\'newhandlingunit\' class=\'form-control custom-select mb-0 newhandlingunit-change\' required> <option>Box</option><option>Bale</option><option>Bag</option><option>Bucket</option><option>Bundle</option><option>Can</option><option>Carton</option><option>Case</option><option>Coil</option><option>Crate</option><option>Cylinder</option><option>Drums</option><option>Pail</option><option>Pieces</option><option>Pallet</option><option>Reel</option><option>Roll</option><option>Skid</option><option>Tube</option><option>Tote</option></select> <span>Handling Unit</span> </label></div></div><div class=\'col-lg-2 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label mb-0\'> <input data-calc=\'pieces-val\' class=\'form-control mb-0 Pieces-val-change calc-child\' id=\'Pieces-val\' type=\'text\' required/> <label class=\'mb-0\'>Pieces</label> </span> </div></div><div class=\'col-lg-2 col-md-3 col-sm-6\'><div class=\'form-group input-group mb-0\'><div class=\'col-md-8 p-0\'> <span class=\'has-float-label mb-0 new-width\'> <input data-calc=\'weight-val\' class=\'form-control mb-0 nor-radius-R Weight-val-change calc-child focus-function\' id=\'Weight-val\' type=\'text\' value=\'\' required /> <label class=\'mb-0\'>Weight</label> </span> </div><div class=\'col-md-4 p-0\'> <span class=\'mb-0\'> <select id=\'newewightunit\' data-calc=\'weight-unit\' class=\'form-control custom-select nor-radius mb-0 newweightunit-change\'> <option selected>lbs</option> <option>kg</option> <option>grams</option> </select> </span> </div></div></div><div class=\'col-lg-4 col-md-4 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label custom-width mb-0\'> <input data-calc=\'length-val\' class=\'form-control Length-val-change calc-child\' id=\'Length-val\' type=\'text\'  value=\'\' required/> <label class=\'mb-0\' for=\'\'>Length</label> </span><label class=\'has-float-label custom-width mb-0 \'><input data-calc=\'width-val\' class=\'form-control Width-val-change calc-child\' type=\'text\' value=\'\' id=\'Width-val\' required/> <span>Width</span> </label><label class=\'has-float-label custom-width mb-0\'><input data-calc=\'height-val\' class=\'form-control Height-val-change calc-child\' id=\'Height-val\' type=\'text\' value=\'\' required/> <span>Height</span> </label> <span class=\'mb-0 custom-width-1\'> <select id=\'newlwhunit\' data-calc=\'lwh-unit\' class=\'form-control custom-select nor-radius mb-0 calc-child newlwhunit-change\'> <option selected>in</option> <option>cm</option> <option>m</option> <option>ft</option> </select> </span> </div></div><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'><label class=\'form-group has-float-label mb-0\'><select  class=\'form-control custom-select mb-0 new-class-change\' id=\'new-class\' required><option >50</option><option>55</option><option>60</option><option>65</option><option>70</option><option>85</option><option>92.5</option><option>100</option><option>125</option><option>175</option><option>250</option><option>300</option><option>400</option></select> <span>Class</span> </label></div></div><div class=\'col-lg-1 col-md-2 col-sm-6\'><div class=\'form-group input-group mb-0\'> <span class=\'has-float-label mb-0\'> <input class=\'form-control mb-0 NMFC-val-change\' id=\'NMFC-val\' type=\'text\' value=\'\'  /> <label class=\'mb-0\' for=\'NMFC\'>NMFC</label> </span> </div></div></div></div></div></div></div>")</script>' +
                        '<script>$(document).on(\'click\', \'.add-package\', function() { var numItems1 = $(\'div.Appended-HTML\').length;console.log(numItems);if(numItems1 >= 1){$(\'input#submitter\').addClass(\'disabled\');}else{$(\'input#submitter\').removeClass(\'disabled\');}; $(\'input#submitter\').removeClass(\'disabled\'); var handilingnew = $(this).parent().parent(\'.Repeated-form\').find(\'select.HandlingUnit-change option:selected\').val(); console.log(handilingnew); var handilingcontent =  handilingnew + "(s) containing the following:"; console.log(handilingcontent); var unitval = $(this).parent().parent(\'.Repeated-form\').find(\'input.unit-change\').val(); var piecesval = $(this).parent().parent(\'.Repeated-form\').find(\'#Pieces\').val(); var Weightval = $(this).parent().parent(\'.Repeated-form\').find(\'#Weight\').val(); var Widthval = $(this).parent().parent(\'.Repeated-form\').find(\'#Width\').val(); var Heightval = $(this).parent().parent(\'.Repeated-form\').find(\'#Height\').val(); var NMFCval = $(this).parent().parent(\'.Repeated-form\').find(\'input.NMFC-change\').val(); var classunit = $(this).parent().parent(\'.Repeated-form\').find(\'select.class-change option:nth-child(2)\').attr(\'selected\', \'selected\');; console.log(classunit); var lengthval = $(this).parent().parent(\'.Repeated-form\').find(\'#Length\').val(); var descriptionvalue = $(this).parent().parent(\'.Repeated-form\').find(\'#NMFCDesc\').val(); var inputvalue1 = $(".form-body input").val(); $(this).parent(".Repeated-form").find(".add-clone").find(".formbody").find("input").val("inputvalue"); var inputvalue = $(\'.custom-form-input input\').val(); $(this).parent().parent(".Repeated-form").find(".add-clone").append(storehtml.clone()); $(function(){ $(\'.Appended-HTML\').attr(\'id\',function(i){return \'Parentid\'+(i+1);});}); packageidchange();  var clonedata = $(this).parent().parent(\'.Repeated-form\').find("#add-clone1").find(".Appended-HTML").length; $(this).parent().parent().parent(\'#main-form\').addClass(\'form-diabled\'); $(this).parent().parent(".Repeated-form").find(\'#Copied-form h6 span\').each(function(index) { $(this).html((index + 1)); }); for(i=0;i<clonedata;i++){ if (clonedata >= 2) {$(this).parent().parent(\'.Repeated-form\').find(\'input.unit-val-change\').val(1); $(this).parent().parent(\'.Repeated-form\').find(\'input#Pieces-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Weight-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Length-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Width-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#Height-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#NMFC-val\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input#description-new\').val();$(this).parent().parent(\'.Repeated-form\').find(\'select.class-change\').val();$(this).parent().parent(\'.Repeated-form\').find(\'select.new-class-change\').children(\'option:selected\').val(); $(this).parent().parent().parent(\'#main-form\').addClass(\'form-diabled\');} else{$(this).parent().parent(\'.Repeated-form\').find(\'input.unit-val-change\').val(1); $(this).parent().parent(\'.Repeated-form\').find(\'input.Pieces-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Weight-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Length-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Width-val-change\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'input.Height-val-change\').val();$(this).parent().parent(\'.Repeated-form\').find(\'.new-class-change\').val("Class"); $(this).parent().parent(\'.Repeated-form\').find(\'input.NMFC-val-change\').val(NMFCval);$(this).parent().parent(\'.Repeated-form\').find(\'input.NMFCDesc-change\').val(handilingcontent); $(this).parent().parent(\'.Repeated-form\').find(\'input#description-new\').val(); $(this).parent().parent(\'.Repeated-form\').find(\'select.new-class-change\').children(\'option:selected\').val(classunit);} }; var selectedCountry1 = $(this).children(\'option:selected\').val(); var newArray1 = new Array(); $(\'input:text[name=description]\').each(function() { newArray1.push($("selectedCountry1").val()); }); console.log(newArray1.length); selectonchange(); disabledinput(); }); </script>' +
                        '<script>$(document).on(\'click\', \'#custom-remove\', function() { $(this).parent().parent(".Repeated-form").find(\'#Copied-form h6 span\').each(function(index) { $(this).html((index + 1)); });var clonedata0 = $(this).closest(\'#add-clone1\').find(\'.Appended-HTML\').length;if (clonedata0 <= 1) {$(this).parent().parent().parent().parent().parent().parent().parent().parent().parent(\'.form-main\').removeClass(\'form-diabled\');}  $(this).closest(\'.Appended-HTML\').remove(); var numItems2 = $(\'div.Appended-HTML\').length;console.log(numItems2);if(numItems2 === 0){$(\'input#submitter\').addClass(\'disabled\');}else{$(\'input#submitter\').removeClass(\'disabled\');};  packageidchange(); selectonchange(); });</script>' +
                        '<script>function packageidchange(){ $(\'.unit-val-change\').each(function(index) { $(this).attr(\'id\', \'unit-val\' + (index + 1)); }); $(\'.newhandlingunit-change\').each(function(index) { $(this).attr(\'id\', \'newhandlingunit\' + (index + 1)); }); $(\'.Pieces-val-change\').each(function(index) { $(this).attr(\'id\', \'Pieces-val\' + (index + 1)); }); $(\'.Weight-val-change\').each(function(index) { $(this).attr(\'id\', \'Weight-val\' + (index + 1)); }); $(\'.newweightunit-change\').each(function(index) { $(this).attr(\'id\', \'newewightunit\' + (index + 1)); }); $(\'.Length-val-change\').each(function(index) { $(this).attr(\'id\', \'Length-val\' + (index + 1)); }); $(\'.Width-val-change\').each(function(index) { $(this).attr(\'id\', \'Width-val\' + (index + 1)); }); $(\'.Height-val-change\').each(function(index) { $(this).attr(\'id\', \'Height-val\' + (index + 1)); });  $(\'.newlwhunit-change\').each(function(index) { $(this).attr(\'id\', \'newlwhunit\' + (index + 1)); }); $(\'.new-class-change\').each(function(index) { $(this).attr(\'id\', \'new-class\' + (index + 1)); }); $(\'.NMFC-val-change\').each(function(index) { $(this).attr(\'id\', \'NMFC-val\' + (index + 1)); });$(\'.custom-select-new\').each(function(index) { $(this).attr(\'id\', \'task-status\' + (index + 1)); }); }</script>' +
                        //'<script> $(\'#close_page\').on(\'click\', function(){window.open("", "_self").window.close();; }); </script>' +
                        // '<script> $("#add-package1d").click(function(){ $("div").append(`${htmlTable}`);});</script>' +
                        '<script>document.getElementById("add-item").onclick = duplicate;' +

                        // document.getElementById('add-item').onclick = duplicate;
                        // '<script>$("#add-item").on("click", function (e) { e.preventDefault(); var i = ' + ixd + '; var $self = $(this); $self.before($self.prev("#pallet" + i).clone());});</script>' +
                        // "<script>$('#add-item').on('click', function(e){ e.preventDefault(); var i = " + ixd + "; var $self = $('.pallet' + i).clone(); $('.form-user').append($self);});</script>" + 
                        'var i = ' + ixd + ';' +
                        'function duplicate() {' +
                        'var original = document.getElementsByClassName("tableRow")[0];' +
                        'var appendList = document.getElementById("appendList");' +
                        'var clone = original.cloneNode(true);' + // "deep" clone
                        'clone.id = "pallet" + ++i;' +// there can only be one element with an ID
                        // 'clone.onclick = duplicate;' + // event handlers are not cloned
                        'i++;' +

                        'appendList.appendChild(clone);' +
                        '}</script>' +
                        '</html>';

                    tableField.defaultValue = htmlTable;
                }

                form.clientScriptModulePath = './CS_P1_assign_pallet.js';



                form.addSubmitButton({

                    label: 'Assign Package'

                });
                context.response.writePage(form);

            }
            else {
                var recdId = context.request.parameters.custpage_so_id_field;
                var record_type = context.request.parameters.custpage_trx_type_field;
                var salesOrderRedirect = redirect.toRecord({
                    type: record_type,
                    id: recdId
                });
                log.debug('context.request.parameters', context.request.parameters);
            }

        }

        return {

            onRequest: onRequest

        };

    });