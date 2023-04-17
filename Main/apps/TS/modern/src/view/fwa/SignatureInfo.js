Ext.define('TS.view.fwa.SignatureInfo', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-signatureInfo',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    scrollable: 'y',
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            reference: 'signatureTitleBar',
            docked: 'top',
            cls: 'ts-navigation-header',

            items: [
                // {
                //     align: 'right',
                //     text: 'Close',
                //     handler: 'closeSignatureInfoSheet'
                // }
            ]
        },
        {
            xtype: 'panel',
            scrollable: true,
            padding: '0 15 15 15',
            //minHeight: 500,
            //minHeight: 500,
            defaults: {
                xtype: 'displayfield',
                labelWidth: '35%'
            },
            items: [
                {
                    reference: 'fwaInfoField'
                },
                {
                    reference: 'workCodeField',
                    bind: {
                        hidden: '{settings.fwaHideWorkCodes}'
                    }
                },
                {
                    reference: 'empHoursField'
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSignatureInfoSheet'
                }
            ]
        }
    ]
});
