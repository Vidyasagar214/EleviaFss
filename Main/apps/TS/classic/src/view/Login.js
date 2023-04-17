Ext.define('TS.view.Login', {
    extend: 'Ext.Window',
    xtype: 'window-login',
    iconCls: 'eleviaIcon', //eleviaIcon
    controller: 'login',
    title: 'FSS User Login',
    titleAlign: 'center',
    iconAlign: 'top',
    width: 370,
    //height: 150,
    layout: 'card',
    modal: true,
    closable: false,
    autoShow: true,

    activeItem: 0, //defaults to email card
    cls: 'my-login',
    defaults: {
        xtype: 'form',
        bodyPadding: 10
    },

    items: [
        {
            reference: 'loginForm',
            defaultButton: 'loginSubmit',
            items: [
                {
                    xtype: 'textfield',
                    //vtype: 'email',
                    fieldLabel: 'Username',
                    allowBlank: false,
                    reference: 'username',
                    name: 'username',
                    //id: 'loginScreenEmail',
                    width: '100%'
                },
                {
                    xtype: 'textfield',
                    inputType: 'password',
                    // minLength: 4,
                    // maxLength: 4,
                    fieldLabel: 'Password',
                    allowBlank: false,
                    name: 'password',
                    reference: 'password',
                    width: '100%',
                    hidden: true
                }, {
                    xtype: 'textfield',
                    inputType: 'password',
                    enforceMaxLength: true,
                    minLength: 4,
                    maxLength: 4,
                    fieldLabel: 'PIN',
                    allowBlank: false,
                    reference: 'pin',
                    name: 'pin',
                    hidden: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Domain',
                    name: 'domain',
                    reference: 'domain',
                    hidden: true
                },
                {
                    xtype: 'checkboxfield',
                    fieldLabel: 'Windows Authentication',
                    labelStyle: 'white-space: nowrap',
                    labelAlign: 'right',
                    labelWidth: '95%',
                    name: 'integrated',
                    reference: 'integrated',
                    hidden: true
                }
            ],
            fbar: [
                {
                    text: 'Submit',
                    handler: 'submitMyPin',
                    //formBind: true,
                    hidden: true,
                    align: 'right',
                    reference: 'loginSubmit'
                },
                {
                    text: 'Submit Login',
                    handler: 'submitUsername',
                    //formBind: true,
                    hidden: true,
                    align: 'right',
                    reference: 'loginSubmitUsername'
                }
            ]
        },
        {
            reference: 'pinCreateForm',
            defaultButton: 'createPinSubmit',
            items: [
                {
                    xtype: 'textfield',
                    inputType: 'password',
                    enforceMaxLength: true,
                    minLength: 4,
                    maxLength: 4,
                    fieldLabel: 'PIN',
                    allowBlank: false,
                    name: 'pin',
                    reference: 'pinCreateField'
                }, {
                    xtype: 'textfield',
                    inputType: 'password',
                    minLength: 4,
                    maxLength: 4,
                    fieldLabel: 'Last 4 SSN',
                    allowBlank: false,
                    name: 'ssn',
                    reference: 'ssnCreateField'
                }
            ],
            fbar: [
                {
                    text: 'Create PIN',
                    align: 'right',
                    handler: 'submitPinCreate',
                    formBind: true,
                    reference: 'createPinSubmit'
                },
                {
                    text: 'Cancel',
                    align: 'left',
                    handler: 'loginReset'
                }
            ]
        },
        {
            reference: 'pinForm',
            defaultButton: 'pinSubmit',
            items: [
                {
                    xtype: 'textfield',
                    inputType: 'password',
                    enforceMaxLength: true,
                    minLength: 4,
                    maxLength: 4,
                    fieldLabel: 'PIN',
                    allowBlank: false,
                    name: 'pin',
                    width: '100%'
                }
            ],
            fbar: [
                {
                    text: 'Submit PIN',
                    handler: 'submitPin',
                    formBind: true,
                    reference: 'pinSubmit'
                }
            ]
        }
    ],


    //Ensures that focus is set to the correct log in button
    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        if (localStorage.getItem('loginType') === 'P') {
            Ext.defer(() => {
                me.lookup('loginSubmit').focus(false, 100);
            }, 1);
        } else {
            Ext.defer(() => {
                me.lookup('loginSubmitUsername').focus(false, 100);
            }, 1);
        }

        if (TS.MISSING_FILE) {
            var mm = Ext.Msg.alert('Warning', 'Missing file \'settings.js\'; application cannot continue.');
            Ext.defer(function () {
                mm.toFront();
            }, 50);
        }
    },

    listeners:{
        // boxready: function (win) {
        //     var lm = new Ext.LoadMask(win, {
        //         cls: 'login',
        //         msg: 'loadmask msg'
        //     });
        //     lm.show();
        // }
    }
});
