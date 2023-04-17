Ext.define('TS.common.window.LicenseAgreement', {
    extend: 'Ext.Container',
    xtype: 'window-licenseagreement',

    controller: 'window-licenseagreement',

    fullscreen: true,
    layout: 'fit',

    items: [
        {
            xtype: 'component',
            cls: 'license-header',
            docked: 'top',
            //tested the look on iPhone 5, 6 and responsive tester - looks good
            html: '<div><img src="resources/elevia_sm.png"/></div>' +
            '<h1>License Agreement</h1>' +
            '<h2>Please read the following license agreement carefully.</h2>'
        },
        {
            xtype: 'container',
            cls: 'license-body',
            scrollable: true,
            reference: 'licenseAgreementHtml'
        },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            layout: {
                type: 'hbox',
                pack: 'middle'
            },
            items: [
                {
                    text: 'OK',
                    width: 100,
                    ui: 'confirm',
                    action: 'save',
                    handler: 'doSaveLicense',
                    disabled: true
                },
                {
                    text: 'Cancel',
                    width: 100,
                    ui: 'decline',
                    handler: 'doCancelLicense'
                }
            ]
        },
        {
            xtype: 'radiofield',
            docked: 'bottom',
            cls: 'license-field',
            labelAlign: 'right',
            label: 'I accept the terms in the license agreement',
            name: 'rb-col',
            listeners: {
                check: 'onRadioCheck'
            }
        },
        {
            xtype: 'radiofield',
            docked: 'bottom',
            cls: 'license-field',
            labelAlign: 'right',
            label: 'I do not accept the terms in the license agreement',
            name: 'rb-col',
            checked: true,
            dontAgree: true,
            listeners: {
                check: 'onRadioCheck'
            }
        }
    ]
});