/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/record','N/config',"N/render","N/file","N/xml","N/search"], function(record,config,render,file,xml,search) {
    function onRequest(context) {
	var soRecord = record.load({
		type: record.Type.SALES_ORDER, 
		id: 7325,
		isDynamic: true
	});
	var info = config.load({type:config.Type.COMPANY_INFORMATION});
	var companyName=info.getValue({fieldId:'companyname'});
	var companyLogoURL='http://3951061.shop.netsuite.com/core/media/media.nl?id=11749&c=3951061&h=gCzCbwH9OaZPAfYjdQFBCen9js0HVLoJJweHVOD0ej_d5sap';
	companyLogoURL=companyLogoURL.replace(/&(?!(#\\d+|\\w+);)/g, "&amp;$1");
	var companyAddress=info.getText({fieldId:'mainaddress_text'});
	if(companyAddress)
	{
		companyAddressArr=companyAddress.split(" ");
		companyAddressArr=companyAddress.split(companyAddressArr[4]);
		companyAddress=companyAddressArr[0]+"<br/>"+companyAddressArr[1];
	}
	//log.debug("COMPANY_INFORMATION",companyName+" "+companyLogoURL+" "+companyAddress);
var xmlHeader='<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"><pdf>';
//var pdfStr='';
var pdfStr='<head>';
pdfStr+='<link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />';
pdfStr+='<#if .locale == "zh_CN">';
pdfStr+='<link name="NotoSansCJKsc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKsc_Regular}" src-bold="${nsfont.NotoSansCJKsc_Bold}" bytes="2" />';
pdfStr+='<#elseif .locale == "zh_TW">';
pdfStr+='<link name="NotoSansCJKtc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKtc_Regular}" src-bold="${nsfont.NotoSansCJKtc_Bold}" bytes="2" />';
pdfStr+='<#elseif .locale == "ja_JP">';
pdfStr+='<link name="NotoSansCJKjp" type="font" subtype="opentype" src="${nsfont.NotoSansCJKjp_Regular}" src-bold="${nsfont.NotoSansCJKjp_Bold}" bytes="2" />';
pdfStr+='<#elseif .locale == "ko_KR">';
pdfStr+='<link name="NotoSansCJKkr" type="font" subtype="opentype" src="${nsfont.NotoSansCJKkr_Regular}" src-bold="${nsfont.NotoSansCJKkr_Bold}" bytes="2" />';
pdfStr+='<#elseif .locale == "th_TH">';
pdfStr+='<link name="NotoSansThai" type="font" subtype="opentype" src="${nsfont.NotoSansThai_Regular}" src-bold="${nsfont.NotoSansThai_Bold}" bytes="2" />';
pdfStr+='</#if>';
pdfStr+='<macrolist>';
pdfStr+='<macro id="nlheader">';//'+objRecord.getValue({fieldId: 'item'});+'
pdfStr+='<table style="width: 100%; font-size: 10pt;"><tr>';
pdfStr+='<td rowspan="2" colspan="2" text-align="center" ><img src="'+companyLogoURL+'" width="120" height="80" style="float: left; margin: 7px" /> <span><p text-align="center" font-weight= "bold" font-size= "8pt" class="nameandaddress">'+companyName+' <br />'+companyAddress+'<br /> 636-536-5007 <br /> WWW.PIERTECH.COM </p></span></td>';
pdfStr+='<td align="right" style="padding: 0;"><span style="font-size: 14pt; font-weight: bold;">Pick List</span></td>';
pdfStr+='</tr>';
var otherrefnum=soRecord.getValue({fieldId: "otherrefnum"});
var tranDate=soRecord.getValue({fieldId: "trandate"});

if(tranDate)
{
	tranDate=getFormattedDate(new Date(tranDate));
}
var tranid=soRecord.getValue({fieldId: "tranid"});
var createdfrom=soRecord.getValue({fieldId: "createdfrom"});
var shippeddate=soRecord.getValue({fieldId: "shipdate"});
if(shippeddate)
{
	shippeddate=getFormattedDate(new Date(shippeddate));
}
var shipaddress=soRecord.getValue({fieldId: "shipaddress"});

pdfStr+='<tr><td rowspan="5" align="right" style="padding: 0;"><span style="font-size: 9pt;">Date: '+tranDate+'<br/>Customer PO: '+otherrefnum+'<br/>Sales Order: '+tranid+'<br/> Quote Number:'+createdfrom+'<br/>Ship Date: '+shippeddate+'</span>';
pdfStr+='</td></tr>';
pdfStr+='</table>';
pdfStr+='</macro>';
pdfStr+='<macro id="nlfooter">';
pdfStr+='<table class="footer"><tr>';
pdfStr+='<td align="right"><pagenumber/> of <totalpages/></td>';
pdfStr+='</tr></table>';
pdfStr+='</macro>';
pdfStr+='</macrolist>';
pdfStr+='<style type="text/css">* {';
pdfStr+='<#if .locale == "zh_CN">';
pdfStr+='font-family: NotoSans, NotoSansCJKsc, sans-serif;';
pdfStr+='<#elseif .locale == "zh_TW">';
pdfStr+='font-family: NotoSans, NotoSansCJKtc, sans-serif;';
pdfStr+='<#elseif .locale == "ja_JP">';
pdfStr+='font-family: NotoSans, NotoSansCJKjp, sans-serif;';
pdfStr+='<#elseif .locale == "ko_KR">';
pdfStr+='font-family: NotoSans, NotoSansCJKkr, sans-serif;';
pdfStr+='<#elseif .locale == "th_TH">';
pdfStr+='font-family: NotoSans, NotoSansThai, sans-serif;';
pdfStr+='<#else>';
pdfStr+='font-family: NotoSans, sans-serif;';
pdfStr+='</#if>';
pdfStr+='}';
pdfStr+='table {';
pdfStr+='font-size: 9pt;';
pdfStr+='table-layout: fixed;';
pdfStr+='}';
pdfStr+='th {';
pdfStr+='font-weight: bold;';
pdfStr+='font-size: 8pt;';
pdfStr+='vertical-align: middle;';
pdfStr+='padding: 5px 6px 3px;';
pdfStr+='background-color: #e3e3e3;';
pdfStr+='color: #333333;';
pdfStr+='}';
pdfStr+='td {';
pdfStr+='padding: 4px 6px;}';
pdfStr+='td p { align:left }';
pdfStr+='b {font-weight: bold;color: #333333;}';
pdfStr+='table.header td {padding: 0;font-size: 10pt;}';
pdfStr+='table.footer td {padding: 0;font-size: 8pt;}';
pdfStr+='table.itemtable th {padding-bottom: 10px;padding-top: 10px;}';
pdfStr+='table.body td {padding-top: 2px;}';
pdfStr+='td.addressheader {font-size: 8pt;font-weight: bold;padding-top: 6px;padding-bottom: 2px;}';
pdfStr+='td.address {padding-top: 0;}';
pdfStr+='span.title {font-size: 28pt;}';
pdfStr+='span.number {font-size: 16pt;}';
pdfStr+='span.itemname {font-weight: bold;line-height: 150%;}';
pdfStr+='div.returnform {width: 100%;height: 200pt;page-break-inside: avoid;page-break-after: avoid;}';
pdfStr+='hr {border-top: 1px dashed #d3d3d3;width: 100%;color: #ffffff;background-color: #ffffff;height: 1px;}';
pdfStr+='</style></head>';
pdfStr+='<body header="nlheader" header-height="10%" footer="nlfooter" footer-height="20pt" padding="0.5in 0.5in 0.5in 0.5in" size="Letter">';
pdfStr+='<table style="width: 100%; margin-top: 10px;">';
pdfStr+='<tr><td colspan="4" style="font-size: 8pt; padding: 6px 0 2px; font-weight: bold; color: #333333;"></td>';
pdfStr+='<td align="left" class="address"><span style="font-size: 9pt;font-weight: bold;">Ship To</span></td>';
pdfStr+='</tr><tr><td colspan="4" style="font-size: 8pt; padding: 6px 0 2px; font-weight: bold; color: #333333;"></td>';
pdfStr+='<td align="right" class="address"><span style="font-size: 9pt;">'+shipaddress+'</span></td>';
pdfStr+='</tr></table>';

pdfStr+='<table class="itemtable" style="width: 100%; margin-top: 10px;">';
pdfStr+='<thead>';
pdfStr+='<tr>';
pdfStr+='<th colspan="2" align="left">Ln#</th>';
pdfStr+='<th colspan="8" align="left">Item <br/> Serial / Lot Number</th>';
pdfStr+='<th colspan="8" align="center"> Description</th>';
pdfStr+='<th colspan="4" align="center">Order Qty</th>';
pdfStr+='<th colspan="4" align="center">Ship Qty</th>';
pdfStr+='<th colspan="4" align="center">B/O Qty</th>';
pdfStr+='</tr>';
pdfStr+='</thead>';

var lineCount=soRecord.getLineCount({sublistId: 'item'});
var itemArr=[];
for(var i=0;i<lineCount;i++){
	var item = soRecord.getSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    line: i
	});
	itemArr.push(item);
}
var itemInvDetailsJson=runSearchAndFetchResult(itemArr);
for(var i=0;i<lineCount;i++){
	pdfStr+='<tr>';
	var item = soRecord.getSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    line: i
	});
	var itemName = soRecord.getSublistText({
    sublistId: 'item',
    fieldId: 'item',
    line: i
	});
	var description = soRecord.getSublistValue({
    sublistId: 'item',
    fieldId: 'description',
    line: i
	});
	var quantity = soRecord.getSublistValue({
    sublistId: 'item',
    fieldId: 'quantity',
    line: i
	});
	var quantityremaining = soRecord.getSublistValue({
    sublistId: 'item',
    fieldId: 'quantitybackordered',
    line: i
	});
	var fieldLookUp = search.lookupFields({
		type: search.Type.ITEM,
		id: item,
		columns: 'itemid'
	});
	index=i+1;
pdfStr+='<td colspan="2">'+index+'</td>';
	var invDetails='';
	if(itemInvDetailsJson[fieldLookUp.itemid]!=undefined){
		invDetails='<table class="itemtable" style="width: 100%; margin-top: 10px;">'+itemInvDetailsJson[fieldLookUp.itemid]+'</table>';
		pdfStr+='<td colspan="8" align="left"><span class="itemname">'+itemName+'</span><br />'+invDetails+'</td>';
	}
	else{
		pdfStr+='<td colspan="8" align="left"><span class="itemname">'+itemName+'</span></td>';
	}
	log.debug("invDetails",invDetails);
pdfStr+='<td colspan="8" align="center">'+description+'</td>'; //description
pdfStr+='<td colspan="4" align="center">'+quantity+'</td>';
pdfStr+='<td colspan="4" align="center">'+quantity+'</td>';
pdfStr+='<td colspan="4" align="center">'+quantityremaining+'</td>';
pdfStr+='</tr>';
}
pdfStr+='</table>';
pdfStr+='</body>';
pdfStr+=pdfStr;
var finalXml=xmlHeader+pdfStr+'</pdf>';
var fileObj =null;
try{
fileObj = file.create({
    name: 'pdfText.txt',
    fileType: file.Type.PLAINTEXT,
    contents: finalXml
});
fileObj.folder = 2491;
fileObj.save();
		var renderer = render.create();
		renderer.templateContent =finalXml;
		fileObj = renderer.renderAsPdf();
}catch(e){
	log.error("error",JSON.stringify(e));
}
		context.response.writeFile(fileObj);
        context.response.setHeader({
            name: 'Custom-Header-Demo',
            value: 'Demo'
        });
    }
	function runSearchAndFetchResult(itemArr) {
        var mySearch = search.load({
            id: 'customsearch1216'
        });
		mySearch.filters = [
        search.createFilter({
            name: "internalid",
            operator: search.Operator.ANYOF,
            values: itemArr
        })
		];

        var searchResult = mySearch.run().getRange({
            start: 0,
            end: 100
        });
		var itemInvDetailsJson={};
		var htmlTable='';
        for (var i = 0; i < searchResult.length; i++) {
			var itemName = searchResult[i].getValue({
                name: "itemid"
            });
            var invNumber = searchResult[i].getText({
                name: "inventorynumber",
				join:"inventoryNumberBinOnHand"
            });
            var qtyAvailable = searchResult[i].getValue({
                name: "quantityavailable",
				join:"inventoryNumberBinOnHand"
            });
			var binNumber = searchResult[i].getText({
                name: "binnumber",
				join:"inventoryNumberBinOnHand"
            });
			if(itemInvDetailsJson[itemName]!=undefined){
				htmlTable+='<tr><td colspan="2">'+invNumber+'</td><td colspan="2">'+binNumber+'</td><td colspan="2">'+qtyAvailable+'</td></tr>';
				itemInvDetailsJson[itemName]=htmlTable;
				log.debug("inside If",htmlTable);
			}
			else if(invNumber || binNumber){
				htmlTable+='<tr><td colspan="2">'+invNumber+'</td><td colspan="2">'+binNumber+'</td><td colspan="2">'+qtyAvailable+'</td></tr>';
				itemInvDetailsJson[itemName]=htmlTable;
				log.debug("inside else",htmlTable);
			}
			//log.debug("htmlTable",htmlTable);
			log.debug(itemName,"invNumber "+invNumber+" binNumber "+binNumber+" qtyAvailable "+qtyAvailable);
        }
		log.debug("searchResult",JSON.stringify(itemInvDetailsJson));
		return itemInvDetailsJson;
    }
	function getFormattedDate(trandate)
	{
		var month=trandate.getMonth()+1;
		var date=trandate.getDate();
		var year=trandate.getFullYear();
		return month+"/"+date+"/"+year;
	}

    return {
        onRequest: onRequest
    };
}); 