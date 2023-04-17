Ext.define('TS.common.window.LicenseAgreement', {
    extend: 'Ext.window.Window',

    controller: 'window-licenseagreement',

    xtype: 'window-licenseagreement',


    title: '<div style="float:left; width:64%" >' +
    '<p style="color:white;font-weight:bold;font-size: 150%;">License Agreement</p>' +
    '<p style="color:white;font-weight:bold;">Please read the following license agreement carefully.</p>' +
    '</div>' +
    '<div style="float:left; width:34%">' +
    '<img width="200" height="72" src="resources/elevia_med.png" style="vertical-align: text-top;" />' +
    '</div>',

    maxWidth: 600,
    minWidth: 480,
    height: 350,
    bodyPadding: 10,
    closable: false,
    //userData: null,

    layout: 'fit',
    items: {
        xtype: 'panel',
        scrollable: true,
        reference: 'licenseAgreementHtml',
        readOnly: true
    },

    buttons: [{
        xtype: 'radiogroup',
        reference: 'rbCol',
        columns: 1,
        items: [
            {
                boxLabel: 'I accept the terms in the license agreement.',
                name: 'rb-col',
                inputValue: true
            },
            {
                boxLabel: 'I do not accept the terms in the license agreement.',
                name: 'rb-col',
                inputValue: false,
                checked: true
            }
        ],
        listeners: {
            change: function (field, newValue, oldValue) {
                var btn = Ext.getCmp('btnSave');
                btn.setDisabled(oldValue['rb-col']);
            }
        }
    }, '->', {
        text: 'OK',
        id: 'btnSave', //TODO Remove id!
        handler: 'doSaveLicense',
        disabled: true
    }, {
        text: 'Cancel',
        handler: 'doCancelLicense'
    }]
});
