Ext.define('TS.view.LicenseAgreementController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.window-licenseagreement',

    init: function () {
        var licenseWindow = this.getView().lookup('licenseAgreementHtml');
        Licensing.GetLicenseAgreement(function (response, operation, success) {
            if (response && response.data) {
                licenseWindow.setHtml(response.data);
            }
        }, this, {
            autoHandle: true
        });
    },

    doCancelLicense: function () {
        var me = this,
            message = TS.Messages.getByCode('cancelledLicenseAgreement');
        Ext.Msg.show({
            title: message.title,
            message: message.message,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn == 'ok') {
                    me.onCancelLicense()
                } else {
                    return;
                }
            }
        });
       
    },
    
    onCancelLicense: function(){
        Ext.create('TS.view.Login');
        if (!Ext.isModern) {
            this.getView().close();
        } else {
            this.closeView();
        }
    },    

    doSaveLicense: function () {
        var me = this,
            vm = me.getViewModel(),
            url = Ext.Object.fromQueryString(location.search),
            hasAccess = true,
            appAccess,
            appName;
        
        Licensing.SetOkdLicense(window.userGlobal.dbi, vm.get('username'), function (response, operation, success) {
                if (success && response.data) {
                    Ext.GlobalEvents.fireEvent('Settings:Loaded', vm.getData());
                    me.closeView();
                }
            }, me, {
                autoHandle: true
            }
        );
    },

    onRadioCheck: function (field) {
        var bt = field.up('container').down('button[action=save]');
        field.dontAgree ? bt.disable() : bt.enable();
    }
});

