<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
<head>
	<link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />
	<#if .locale == "zh_CN">
		<link name="NotoSansCJKsc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKsc_Regular}" src-bold="${nsfont.NotoSansCJKsc_Bold}" bytes="2" />
	<#elseif .locale == "zh_TW">
		<link name="NotoSansCJKtc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKtc_Regular}" src-bold="${nsfont.NotoSansCJKtc_Bold}" bytes="2" />
	<#elseif .locale == "ja_JP">
		<link name="NotoSansCJKjp" type="font" subtype="opentype" src="${nsfont.NotoSansCJKjp_Regular}" src-bold="${nsfont.NotoSansCJKjp_Bold}" bytes="2" />
	<#elseif .locale == "ko_KR">
		<link name="NotoSansCJKkr" type="font" subtype="opentype" src="${nsfont.NotoSansCJKkr_Regular}" src-bold="${nsfont.NotoSansCJKkr_Bold}" bytes="2" />
	<#elseif .locale == "th_TH">
		<link name="NotoSansThai" type="font" subtype="opentype" src="${nsfont.NotoSansThai_Regular}" src-bold="${nsfont.NotoSansThai_Bold}" bytes="2" />
	</#if>
    <macrolist>
        <macro id="nlheader">
           <table style="width: 100%; font-size: 10pt;"><tr>
	<td rowspan="2" colspan="2" text-align="center" ><#if companyInformation.logoUrl?length != 0><img src="${companyInformation.logoUrl}" width="120" height="80" style="float: left; margin: 7px" /> </#if><span><p text-align="center" font-weight= "bold" font-size= "8pt" class="nameandaddress">${companyInformation.companyName} <br />${companyInformation.addressText} <br /> 636-536-5007 <br /> WWW.PIERTECH.COM </p></span></td>
	<td align="right" style="padding: 0;"><span style="font-size: 14pt; font-weight: bold;">Pick List</span></td>
	</tr>
	<tr><td align="right" style="padding: 0;"><span style="font-size: 9pt;">Date: ${record.trandate} <br/>Customer PO: ${record.otherrefnum}<br/>Sales Order: ${record.tranid}<br/> Quote Number: ${record.createdfrom}<br/>Ship Date: ${record.shipdate}</span></td>	
	</tr>
	</table>
        </macro>
        <macro id="nlfooter">
            <table class="footer"><tr>
	<td align="right"><pagenumber/> of <totalpages/></td>
	</tr></table>
        </macro>
    </macrolist>
    <style type="text/css">* {
		<#if .locale == "zh_CN">
			font-family: NotoSans, NotoSansCJKsc, sans-serif;
		<#elseif .locale == "zh_TW">
			font-family: NotoSans, NotoSansCJKtc, sans-serif;
		<#elseif .locale == "ja_JP">
			font-family: NotoSans, NotoSansCJKjp, sans-serif;
		<#elseif .locale == "ko_KR">
			font-family: NotoSans, NotoSansCJKkr, sans-serif;
		<#elseif .locale == "th_TH">
			font-family: NotoSans, NotoSansThai, sans-serif;
		<#else>
			font-family: NotoSans, sans-serif;
		</#if>
		}
		table {
			font-size: 9pt;
			table-layout: fixed;
		}
        th {
            font-weight: bold;
            font-size: 8pt;
            vertical-align: middle;
            padding: 5px 6px 3px;
            background-color: #e3e3e3;
            color: #333333;
        }
        td {
            padding: 4px 6px;
        }
		td p { align:left }
        b {
            font-weight: bold;
            color: #333333;
        }
        table.header td {
            padding: 0;
            font-size: 10pt;
        }
        table.footer td {
            padding: 0;
            font-size: 8pt;
        }
        table.itemtable th {
            padding-bottom: 10px;
            padding-top: 10px;
        }
        table.body td {
            padding-top: 2px;
        }
        td.addressheader {
            font-size: 8pt;
            font-weight: bold;
            padding-top: 6px;
            padding-bottom: 2px;
        }
        td.address {
            padding-top: 0;
        }
        span.title {
            font-size: 28pt;
        }
        span.number {
            font-size: 16pt;
        }
        span.itemname {
            font-weight: bold;
            line-height: 150%;
        }
        div.returnform {
            width: 100%;
            /* To ensure minimal height of return form */
            height: 200pt;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        hr {
            border-top: 1px dashed #d3d3d3;
            width: 100%;
            color: #ffffff;
            background-color: #ffffff;
            height: 1px;
        }
</style>
</head>
<body header="nlheader" header-height="10%" footer="nlfooter" footer-height="20pt" padding="0.5in 0.5in 0.5in 0.5in" size="Letter">
     <table style="width: 100%; height: 10% margin-top: 10px;"><tr>
	<td  align="center" colspan="4" style="font-size: 8pt; padding: 6px 0 2px; font-weight: bold; color: #333333;"></td>
	<td  align="center" colspan="4" style="font-size: 8pt; padding: 6px 0 2px; font-weight: bold; color: #333333;">${record.shipaddress@label}:</td>
	</tr>
	<tr>
	<td align="center" colspan="4" style="padding: 0; width:30%;"></td>
	<td align="right" colspan="4" style="padding: 0; width:30%;">${record.shipaddress}</td>
	</tr></table>


<#if record.item?has_content>

<table class="itemtable" style="width: 100%; margin-top: 10px;">
<thead>
	<tr>
	<th colspan="2" align="left">${"Ln#"}</th>
	<th colspan="11" align="left">Item<br/> 
	<table class="itemtable" style="width: 100%;table-layout: fixed;">
	<tr>
		<td width="50%" style="font-size: 8pt; font-weight: normal">Lot Number</td>
		<td width="25%" style="font-size: 8pt; font-weight: normal">Bin</td>
		<td width="25%" style="font-size: 8pt; font-weight: normal">Qty In Bin</td>
	</tr>
	</table>
	</th>
	<th colspan="8" align="center">Description</th>
	<th colspan="4" align="center">Order Qty</th>
	<th colspan="4" align="center">Ship Qty</th>
	<th colspan="4" align="center">Left Qty</th>
	</tr>
</thead>
<#list record.item as tranline><tr>
	<td colspan="2">${tranline?counter}</td>
	<#assign itemName = tranline.item?keep_before(" ")>
	<#assign invdetailsJSON = record.custpage_iteminvdetails>
	<#if invdetailsJSON?has_content>
	<#assign invdetailsJSON = record.custpage_iteminvdetails?eval>
	<#if invdetailsJSON[itemName]?has_content> 
		<td colspan="11" align="left"><span class="itemname">${itemName}<br/>
		<table class="itemtable" style="width: 100%; margin-top: 10px;">
		<#list invdetailsJSON[itemName]?split("|") as itemInvArr>
		<#if itemInvArr?has_content>
			<#assign itemInvDetailArr = itemInvArr?split(",")>
			<tr>
			<#if itemInvDetailArr[0]?has_content>
				<td style='width:50%;'>${itemInvDetailArr[0]}</td>
			<#else>
				<td style='width:50%;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
			</#if>
			
				<td style='width:25%;'>${itemInvDetailArr[1]}</td>
				<td style='width:25%;'>${itemInvDetailArr[2]}</td>
			</tr>
		</#if>
		</#list>
		</table>
		</span>
	<#else> 
		<td colspan="11" align="left"><span class="itemname">${itemName}</span>
	</#if>
	<#else> 
	<td colspan="11" align="left"><span class="itemname">${itemName}</span>
	</#if>
</td>
	<td colspan="8" align="center">${tranline.description}</td>
	<td colspan="4" align="center">${tranline.quantity}</td>
	<td colspan="4" align="center">${tranline.quantitypickpackship}</td>
	<td colspan="4" align="center">${(tranline.quantity?string('0')?number - tranline.quantitypickpackship?string('0')?number)}</td>
	</tr>
	</#list></table>
</#if>
</body>
</pdf>