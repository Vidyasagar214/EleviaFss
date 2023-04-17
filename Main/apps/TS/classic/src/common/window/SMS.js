/**
 * Created by steve.tess on 3/5/2018.
 */
Ext.define('TS.common.window.SMS', {
    extend: 'Ext.window.Window',

    xtype: 'window-SMS',

    requires: [
        'TS.common.field.EmployeeMobilePhoneNumbers',
        'TS.common.field.ProviderList'
    ],

    modal: true,
    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 300
        },
        normal: {
            width: 400
        }
    },

    maxHeight: 600,
    scrollable: true,
    title: 'Text Message',

    items: [
        {
            xtype: 'form',
            scrollable: true,
            reference: 'smsForm',
            bodyPadding: 10,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Employee',
                    //baseCls: 'legend-bold',
                    border: false,
                    align: 'center',
                    width: '90%',
                    items: [
                        {
                            xtype: 'field-employeeMobilePhoneNumbers',
                            name: 'mobileNumber',
                            width: '300px',
                            allowBlank: false
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Provider',
                    //baseCls: 'legend-bold',
                    align: 'center',
                    width: '90%',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Select from list',
                            width: '90%'
                        },
                        {
                            xtype: 'field-providerList',
                            width: '300px',
                            name: 'provider'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Or type in provider (ex: @txt.att.net)',
                            labelWidth: 300
                        },
                        {
                            xtype: 'textfield',
                            width: '300px',
                            name: 'providerText'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Message',
                    //baseCls: 'legend-bold',
                    border: false,
                    align: 'center',
                    width: '90%',
                    items: [
                        {
                            xtype: 'textareafield',
                            grow: true,
                            name: 'message',
                            width: '300px',
                            minHeight: '150px',
                            allowBlank: false
                        }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Send',
            handler: 'sendSMS',
            formBind: true
        },
        {
            text: 'Cancel',
            align: 'right',
            handler: 'closeSMS'
        }
    ]
});