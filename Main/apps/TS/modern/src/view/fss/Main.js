Ext.define('TS.view.fss.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'app-fss',

    requires: [
        'TS.view.fss.FssList',
        'TS.controller.fss.MainController',
        'TS.model.fss.MainModel'
    ],

    fullscreen: true,

    config: {
        fromFSS: true
    },
    style: 'background-color: white !important;',
    controller: 'fss-main',
    viewModel: 'fss-main',

    header: {
        hidden: true
    },

    items: [
        {
            xtype: 'panel',
            // scrollable: true,
            //height: '100%',//window.outerHeight,
            layout: 'vbox',
            title: 'Main card', //will be invisible as we are hiding the tab bar
            items: [
                {
                    xtype: 'titlebar',
                    cls: 'login-navigation-header',
                    style: 'background-color: rgb(33, 99, 156) !important;',
                    layout: {
                        type: 'vbox',
                        align: 'middle',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'image',
                            alt: 'Elevia',
                            imageCls: 'eleviaIcon-smaller',
                            style: 'text-align: center; margin: auto',
                            docked: 'top',
                            title: 'User Login'
                        },
                        {
                            xtype: 'label',
                            html: 'Field Services Suite', //#C51A1E
                            style: 'font-size: 26px; font-weight: bold; color: white ; background-color: rgb(33, 99, 156); text-align: center;'
                        }
                    ]
                },
                {
                    xtype: 'formpanel',
                    // layout: {
                    //     type: 'vbox',
                    //     align: 'middle',
                    //     pack: 'center'
                    // },
                    items: [
                        {
                            scrollable: 'y',
                            xtype: 'fssButtonList',
                            listeners: {
                                painted: function (cmp) {
                                    // if (Ext.os.is.Android && Ext.os.is.Phone) {
                                    //     this.setHeight(400);
                                    // }
                                }
                            }
                        },
                    ]
                },
                {
                    xtype: 'titlebar',
                    height: 20,
                    docked: 'bottom'
                }
            ]
        }
    ],

    listeners: {
        painted: function (comp) {
            // var store = Ext.first('#fssList').getStore();
            // /* uncomment below to allow a direct call if only a single application available to user*/
            // if (store.getRange().length == 1) {
            //     Ext.GlobalEvents.fireEvent('ChangeViewport', store.getRange()[0].get('app'));
            //     Ext.Viewport.setActiveItem(store.getRange()[0].get('path'));
            // }
        }

    }
});