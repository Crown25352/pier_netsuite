/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/redirect', 'N/url', 'N/ui/dialog', 'N/ui/serverWidget'],
	function (record, search, redirect, url, dialog, N_server) {

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

					var addressId = context.request.parameters.ids;
					var addressDel = record.delete({
						type: 'customrecord_p1_addresses',
						id: addressId,
					});
					var suitletURL = url.resolveScript({
						scriptId: 'customscript_sl_p1_address_details',
						deploymentId: 'customdeploy_sl_p1_address_details'
					});
					redirect.redirect({
						url: suitletURL
					});

				} catch (error) {

					log.debug('errorn', error);
					errorMessage = error.message;
					log.debug('Error in API function', errorMessage);
					var html;
					var type_obj = getType(errorMessage);
					log.debug('type_obj', type_obj);
					if (type_obj == 'object') {
						html = `
					<!DOCTYPE html><html>
					<head>    
						<link href=”https://system.netsuite.com/core/media/media.nl?id=1234&_xt=.css” rel=”stylesheet” media=”print” /> 
						<style>
						pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; font-size: 20px;}
						.string { color: green; }
						.number { color: darkorange; }
						.boolean { color: blue; }
						.null { color: magenta; }
						.key { color: red; }
						</style>
					</head>
						<body>
						<script>
						function output(inp) {
							document.body.appendChild(document.createElement('pre')).innerHTML = inp;
						}
						function syntaxHighlight(json) {
							json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
							return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
								var cls = 'number';
								if (/^"/.test(match)) {
									if (/:$/.test(match)) {
										cls = 'key';
									} else {
										cls = 'string';
									}
								} else if (/true|false/.test(match)) {
									cls = 'boolean';
								} else if (/null/.test(match)) {
									cls = 'null';
								}
								return '<span class="' + cls + '">' + match + '</span>';
							});
						}
				
						var obj = ${errorMessage};
						var str = JSON.stringify(obj, undefined, 4);
						output(syntaxHighlight(str));
						</script>
						</body>
							</html>`;
					}
					else {
						html = `<!DOCTYPE html>
							<html>
							<body>    
							<h1>Error</h1>    
							<p><span style="color:red;font-weight:bold">${errorMessage}</span><span style="color:darkolivegreen;font-weight:bold"></span></p>    
							</body>
							</html>`;
					}
					function getType(p) {
						// if (Array.isArray(p)) return 'array';
						if (typeof p == 'string') return 'string';
						else if (p != null && typeof p == 'object') return 'object';
						else return 'other';
					}
					context.response.write(html);
				}

			}
			else {
				try {

				} catch (e) {
					log.debug("Error in Post", e.message);
				}

			}
		}
		return {
			onRequest: onRequest
		};


	});