/**
* @NApiVersion 2.x
* @NScriptType ClientScript
* @NModuleScope SameAccount
*/
define(['N/currentRecord'], function (currentRecord) {

	function pageInit(scriptContext) {

		// document.getElementById("NS_MENU_ID0-item0").style.display = "none";
		var elements = document.getElementsByClassName("ns-menuitem ns-submenu");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
	}
	return {
		pageInit: pageInit
	};
});