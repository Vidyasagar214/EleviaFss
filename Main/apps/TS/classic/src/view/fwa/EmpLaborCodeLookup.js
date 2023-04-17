/**
 * Created by steve.tess on 12/13/2018.
 */
Ext.define('TS.view.fwa.EmpLaborCodeLookup', {
    extend: 'Ext.window.Window',

    xtype: 'emp-window-labor-code-lookup',
    controller: 'emp-window-labor-code-lookup',

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 300
        },
        normal: {
            width: 500
        }
    },

    title: {_tr: 'laborCodeLabel', tpl: '{0} Lookup'},
    callingPage: 'FWA',
    autoHeight: true,
    layout: 'vbox',
    top: 270, //170
    height: 400, //600
    modal: true,

    buttons: [{
        text: 'OK',
        handler: 'onOkLookup'
    }, {
        text: 'Cancel',
        handler: 'onCancelLookup'
    }],

    items: [
        {
            xtype: 'displayfield',
            margin:  '10 0 0 10',
            value:{_tr: 'laborCodeLabel'}
        },
        {
            xtype: 'container',
            layout: 'hbox',
            width: '100%',
            margin: '0 10 10 10',

            defaults: {
                xtype: 'textfield',
                flex: 1,
                readOnly: true
            },

            items: [
                {
                    bind: {
                        value: '{laborCodeString}'
                    },
                    margin: '0 10 0 0'
                },
                {
                    bind: {
                        value: '{laborLabelString}'
                    }
                }]
        }, {
            xtype: 'container',
            reference: 'laborCodeGridsContainer',
            flex: 1,
            margin: '0 0 10 10',
            layout: 'hbox',
            width: '100%'
        }
    ]
});