Ext.define('TS.view.fwa.Main', {
    extend: 'TS.view.main.Main',
    xtype: 'app-fwa',

    requires: [
        'TS.controller.fwa.MainController',
        'TS.model.fwa.MainModel',
        'TS.view.fwa.FWAList',
        'TS.view.fwa.FWATabletList'
    ],

    controller: 'fwa-main',
    viewModel: 'fwa-main',

    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            title: 'Main card', //will be invisible as we are hiding the tab bar
            items: [
                {
                    xtype: 'titlebar',
                    cls: 'login-navigation-header',
                    docked: 'top',
                    title: {_tr: 'empName'},
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa  fa-home',
                            align: 'left',
                            handler: 'onBackToFSS',
                            bind: {
                                hidden: '{!fromFSS}'
                            }
                        },
                        {
                            align: 'right',
                            iconCls: 'x-fa fa-bars',
                            handler: 'onMainMenuTap'
                        }
                    ]
                },
                {
                    xtype: IS_TABLET ? 'fwa-tabletlist' : 'fwa-list',
                    itemId: 'fwaList',
                    bind: {
                        store: '{fwalist}',
                        selection: '{selectedFWA}' //We publish selection in the viewModel
                    },
                    style: 'border-bottom:1px solid #ccc',
                    flex: 1,
                    listeners: {
                        itemsingletap: 'onLoadFwaEdit',
                        itemdoubletap: 'onSelectionDoubleTap'
                    }
                },
                {
                    xtype: 'panel',
                    itemId: 'description',
                    scrollable: true,
                    height: 95,
                    padding: 10,
                    bind: {
                        data: '{selectedFWA}'
                    },
                    //Simulate initial data, this will ensure that template labels show up properly
                    data: {
                        data: {
                            fwaNum: '',
                            wbs1: '',
                            clientName: '',
                            fwaStatusString: '',
                            wbs1Name: '',
                            fieldPriorityDesc: ''
                        }
                    },
                    cls: 'ts-details-container',
                    tpl: new Ext.XTemplate(
                        '<div><span>{[this.dic("fwaAbbrevLabel")]}:</span>{[this.displayFwaNum(values)]}</div>' +// fwaNum is the dataIndex
                        '<div  word-wrap: break-word;><span>{[this.dic("wbs1Label")]}:</span>{[this.displayWbs1(values)]}</div>' +
                        '<div  word-wrap: break-word;><span>{[this.dic("clientLabel")]}:</span>{[this.displayClient(values)]}</div>',
                        '<div>',
                        '   <div style="float:left;padding-right:10px;"><span>Status:</span>{[this.displayStatus(values)]}</div>&nbsp;',
                        '   <div style="float:left"><span>Priority:</span>{[this.displayPriority(values)]}</div>',
                        '</div',
                        {
                            //Use template member function
                            dic: function (value) {
                                return TS.app.settings[value];
                            },
                            displayPriority: function (values) {
                                var id = values.data && values.data.fieldPriorityId ? values.data.fieldPriorityId : 999,
                                    store = Ext.getStore('PriorityList').getById(id);
                                return store ? store.get('priorityDescr') : '';
                            },
                            displayFwaNum: function (values) {
                                return values.data ? values.data.fwaNum : '';
                            },
                            displayWbs1: function (values) {
                                return values.data && values.data.wbs1 ? values.data.wbs1 + '-' + values.data.wbs1Name : '';
                            },
                            displayClient: function (values) {
                                return values.data && values.data.clientName ? values.data.clientName : '';
                            },
                            displayStatus: function (values) {
                                return values.data ? values.data.fwaStatusString : '';
                            }
                        }
                    )
                },
                {
                    xtype: 'toolbar',
                    itemId: 'fwaListToolbar',
                    height: 70,
                    docked: 'bottom',
                    items: [
                        {
                            text: '{settings.offLineText}',
                            iconCls: 'x-fa fa-wifi',
                            ui: 'action',
                            height: 33,
                            padding: '5 5 5 5',
                            handler: 'takeOfflineOnline',
                            itemId: 'offLineButton',
                            reference: 'offLineButton',
                            hidden: true
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'Today Only', //Show All
                            padding: '5 5 5 5',
                            handler: 'showTodayOnly',
                            disabled: false,
                            ui: 'action',
                            reference: 'showTodayBtn'
                        },
                        {
                            text: {_tr: 'fwaAbbrevLabel', tpl: 'Select {0}'},
                            ui: 'action',
                            //iconCls: 'x-fa fa-pencil',
                            handler: 'onLoadFwaEdit',
                            reference: 'mainSelectBtn',
                            itemId: 'mainSelectBtn',
                            disabled: true,
                            height: 33,
                            padding: '5 5 5 5',
                        }
                    ]
                }
            ]
        }
    ]
});
