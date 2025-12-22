/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/url'],
    /**
 * @param{url} url
 */
    (url) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            log.debug('Context type', scriptContext.type);
            if (scriptContext.type != 'view') return;

            let stUrl = url.resolveScript({
                scriptId: 'customscript_scm_su_printtraveler',
                deploymentId: 'customdeploy_scm_su_printtraveler'
            });

            scriptContext.form.addButton({
                id: 'custpage_mfg_travel',
                label: 'Print Manufacturing Traveler',
                functionName: `( function () {window.location.href="${stUrl}" })();`
            });
        }

        return {beforeLoad}

    });
