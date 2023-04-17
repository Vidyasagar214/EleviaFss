/**
 * Created by steve.tess on 5/15/2017.
 */
Ext.define('TS.controller.fwa.SignatureListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.window-signaturelist',

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            template = me.lookup('signatureTemplate'),
        signatureType = vw.signatureType;

        if(signatureType == 'S'){
            vw.setTitle(settings.clientLabel +' Signature List');
        }
        else {
            vw.setTitle(settings.crewChiefLabel +' Signature List');
        }
        template.setData(vw.attachmentsList);
    },

    doCloseWindow: function (component, e) {
        this.getView().close();
    }
});