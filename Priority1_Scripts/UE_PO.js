/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([], () => {

  function beforeLoad(ctx) {
    try {
        // Only UI
        if (
        ctx.type !== ctx.UserEventType.VIEW &&
        ctx.type !== ctx.UserEventType.EDIT &&
        ctx.type !== ctx.UserEventType.CREATE &&
        ctx.type !== ctx.UserEventType.COPY
        ) return;

        const form = ctx.form;
        var newRec = ctx.newRecord;
        if (newRec.getValue('orderstatus') == 'A') hideEmailButton(form);
    } catch (e) {
        log.debug('error', e)
    }
  }

  function hideEmailButton(form) {
    const fld = form.addField({
      id: 'custpage_hide_newmessage_inline',
      label: 'hide new message',
      type: 'inlinehtml'
    });

    fld.defaultValue = `
      <script>
        (function () {
          function run() {
            var el = document.getElementById('tbl_newmessage');
            if (el) {
              el.style.display = 'none';   // hide
              // el.remove();              // or remove completely (if supported)
            }
          }
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
          } else {
            run();
          }
        })();
      </script>
    `;
  }

  return { beforeLoad };
});
