Ext.define('TS.view.Login', {
    extend: 'Ext.Container',
    xtype: 'window-login',

    controller: 'login',
    requires: [
        'Ext.Label'
    ],

    fullscreen: true,
    layout: 'card',
    modal: true,
    autoShow: true,

    scrollable: true,

    activeItem: 0, //defaults to email card

    defaults: {
        xtype: 'formpanel',
        layout: {
            type: 'vbox',
            align: 'middle',
            //pack: 'center'
        }
    },


    items: [
        {
            reference: 'loginForm',
            defaultButton: 'loginSubmit',

            items: [
                {
                    xtype: 'titlebar',
                    cls: 'login-navigation-header',
                    layout: {
                        type: 'vbox',
                        align: 'middle',
                        pack: 'center'
                    },
                    docked: 'top',
                    items: [
                        {
                            xtype: 'image',
                            alt: 'Elevia',
                            imageCls: 'eleviaIcon-smaller',// 'eleviaIcon-smaller',
                            style: 'text-align: center; margin: auto',
                            docked: 'top',
                            title: 'User Login'
                        },
                        {
                            xtype: 'label',
                            padding: '0 0 0 15',
                            html: 'Field Services Suite', //#C51A1E
                            style: 'font-size: 18px; font-weight: bold; color: white ; background-color: rgb(33, 99, 156); text-align: center;'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    style: 'background: #ececec !important;',
                    cls: 'loginForm' + IS_TABLET,
                    //height: window.outerHeight,
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Username',
                            allowBlank: false,
                            reference: 'username', //'email',
                            id: 'loginScreenUsername',
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = this.getParent().getParent().getScrollable(),
                                        //scrollToY = TS.Util.getCurrentScrollToY(),
                                        ost = obj.element.dom.offsetTop;
                                    //TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                    {
                                        scroller.scrollTo(null,ost);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            inputType: 'password',
                            label: 'Password',
                            //allowBlank: false,
                            reference: 'password',
                            name: 'password',
                            hidden: true,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = this.getParent().getParent().getScrollable(),
                                        ost = obj.element.dom.offsetTop;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                    {
                                        scroller.scrollTo(null, ost + 45);
                                    }
                                }
                            }

                        }, {
                            xtype: 'textfield',
                            inputType: 'password',
                            minLength: 4,
                            maxLength: 4,
                            label: 'PIN',
                            allowBlank: false,
                            reference: 'pin',
                            name: 'pin',
                            hidden: true,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = this.getParent().getParent().getScrollable(),
                                        ost = obj.element.dom.offsetTop;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                    {
                                        scroller.scrollTo(null, ost + 45);
                                    }
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            label: 'Domain',
                            name: 'domain',
                            reference: 'domain',
                            hidden: true,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = this.getParent().getParent().getScrollable(),
                                        ost = obj.element.dom.offsetTop;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                    {
                                        scroller.scrollTo(null, ost + 90);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            label: 'Windows Authentication',
                            labelAlign: 'left',
                            labelWidth: '200',
                            name: 'integrated',
                            reference: 'integrated',
                            hidden: true
                        }
                    ]
                },
                {
                    xtype: 'titlebar',
                    cls: 'ts-gray-toolbar',
                    docked: 'bottom',
                    items: [
                        {
                            text: 'Submit',
                            handler: 'submitMyPin',
                            formBind: true,
                            ui: 'action',
                            align: 'right',
                            reference: 'loginSubmit'
                        },
                        {
                            text: 'Submit Login',
                            handler: 'submitUsername',
                            formBind: true,
                            ui: 'action',
                            align: 'right',
                            hidden: true,
                            reference: 'loginSubmitUsername'
                        }
                    ]
                }
            ]
        },
        {
            reference: 'pinCreateForm',
            defaultButton: 'createPinSubmit',
            items: [
                {
                    xtype: 'titlebar',
                    cls: 'blue-title-bar',
                    docked: 'top',
                    title: 'Create Pin'
                },
                {
                    xtype: 'fieldset',
                    height: window.outerHeight,
                    items: [
                        {
                            xtype: 'textfield',
                            inputType: 'password',
                            minLength: 4,
                            maxLength: 4,
                            label: 'PIN',
                            allowBlank: false,
                            name: 'pin',
                            reference: 'pinCreateField',
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = this.getParent().getParent().getScrollable(),
                                        ost = obj.element.dom.offsetTop;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                    {
                                        scroller.scrollTo(null, ost);
                                    }
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            inputType: 'password',
                            minLength: 4,
                            maxLength: 4,
                            label: 'Last 4 SSN',
                            allowBlank: false,
                            name: 'ssn',
                            reference: 'ssnCreateField',
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = this.getParent().getParent().getScrollable(),
                                        ost = obj.element.dom.offsetTop;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                    {
                                        scroller.scrollTo(null, ost + 45);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'titlebar',
                    cls: 'ts-gray-toolbar',
                    docked: 'bottom',
                    items: [
                        {
                            text: 'Create PIN',
                            align: 'right',
                            handler: 'submitPinCreate',
                            formBind: true,
                            ui: 'action',
                            reference: 'createPinSubmit'
                        },
                        {
                            text: 'Cancel',
                            align: 'left',
                            handler: 'loginReset'
                        }
                    ]
                }
            ]
        },
        {
            reference: 'pinForm',
            defaultButton: 'pinSubmit',
            items: [
                {
                    xtype: 'titlebar',
                    cls: 'blue-title-bar',
                    docked: 'top',
                    title: 'Enter PIN'
                },
                {
                    xtype: 'fieldset',
                    height: window.outerHeight,
                    items: [
                        {
                            xtype: 'textfield',
                            inputType: 'password',
                            minLength: 4,
                            maxLength: 4,
                            label: 'PIN',
                            allowBlank: false,
                            name: 'pin',
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = this.getParent().getParent().getScrollable(),
                                        ost = obj.element.dom.offsetTop;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                    {
                                        scroller.scrollTo(null, ost);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'titlebar',
                    cls: 'ts-gray-toolbar',
                    docked: 'top',
                    items: [{
                        text: 'Submit PIN',
                        handler: 'submitPin',
                        formBind: true,
                        ui: 'action',
                        align: 'right',
                        reference: 'pinSubmit'
                    }]
                }
            ]
        }
    ],
    listeners: {
        painted: function () {
            if (TS.MISSING_FILE)
                Ext.Msg.alert('Warning', 'Missing file \'settings.js\'; application cannot continue.');

        }
        // boxready: function (win) {
        //     var lm = new Ext.LoadMask(win, {
        //         cls: 'login',
        //         msg: 'loadmask msg'
        //     });
        //     lm.show();
        // }
    }
});
