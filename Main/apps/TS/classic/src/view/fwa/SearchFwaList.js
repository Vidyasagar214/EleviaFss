/**
 * Created by steve.tess on 5/30/2019.
 */
Ext.define('TS.view.fwa.SearchFwaList', {
    extend: 'Ext.window.Window',

    xtype: 'window-searchfwalist',

    requires: [
        'Ext.plugin.Responsive'
    ],
    itemId: 'searchFwaList',

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            scrollable: true,
            width: 300
        },
        normal: {
            //scrollable: 'y',
            width: 600
        }
    },

    //maxHeight: 500,
    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} List Search'},

    items: [
        {
            xtype: 'label',
            text: 'Search By Name or Number',
            plugins: 'responsive',
            width: '85%',
            style: 'font-weight:bold',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 0 40'
                }
            }
        },
        {
            xtype: 'textfield',
            itemId: 'fwaNameSearch',
            fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: '{0}'},
            plugins: 'responsive',
            width: '85%',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 0 40'
                }
            }
        },
        {
            xtype: 'textfield',
            itemId: 'clientSearch',
            fieldLabel: {_tr: 'clientLabel', tpl: '{0}'},
            plugins: 'responsive',
            width: '85%',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 0 40'
                }
            }
        },
        {
            xtype: 'textfield',
            itemId: 'wbs1Search',
            fieldLabel: {_tr: 'wbs1Label', tpl: '{0}'},
            plugins: 'responsive',
            width: '85%',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 0 40'
                }
            }
        },
        {
            xtype: 'textfield',
            itemId: 'wbs2Search',
            fieldLabel: {_tr: 'wbs2Label', tpl: '{0}'},
            plugins: 'responsive',
            width: '85%',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 0 40'
                }
            },
            bind: {
                hidden: '{hideFwaWbs2}'
            }
        },
        {
            xtype: 'textfield',
            itemId: 'wbs3Search',
            fieldLabel: {_tr: 'wbs3Label', tpl: '{0}'},
            width: '85%',
            plugins: 'responsive',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 0 40'
                }
            },
            bind: {
                hidden: '{hideFwaWbs3}'
            }
        },
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            plugins: 'responsive',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 10 40'
                }
            },
            items: [
                {
                    xtype: 'datefield',
                    itemId: 'startDateSearch',
                    fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: 'For {0}s from:'},
                    width: '230px'
                },
                {
                    xtype: 'datefield',
                    itemId: 'endDateSearch',
                    fieldLabel: 'to',
                    labelAlign: 'right',
                    width: '230px',
                    style: 'margin-right: 10px'
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-refresh',
                    tooltip: 'Clear dates',
                    handler: 'clearSearchDates'
                }
            ]
        },
        {
            itemId: 'searchWorkCodeGrid',
            xtype: 'grid',
            tools: [
                {
                    type: 'refresh',
                    tooltip: 'Clear selections',
                    handler: function (event, toolEl, panel) {
                        var wc = Ext.first('#searchWorkCodeGrid');
                        wc.getSelectionModel().deselectAll();
                    }
                }
            ],
            scrollable: 'y',
            height: 250,
            plugins: 'responsive',
            selModel: {mode: 'MULTI'},
            store: 'WorkCodes',
            margin: '0 0 20 0',
            responsiveConfig: {
                small: {
                    padding: '5 5 5 5'
                },
                normal: {
                    padding: '10 40 10 40'
                }
            },
            title: {_tr: 'workCodeLabelPlural', tpl: 'Filter For {0}'},
            columns: [
                {
                    text: {_tr: 'workCodeLabel'},
                    dataIndex: 'workCodeAbbrev',
                    flex: 1
                },
                {
                    text: 'Description',
                    dataIndex: 'workCodeDescr',
                    flex: 3
                }
            ]
        }
    ],

    buttons: [
        {
            text: 'Search',
            align: 'right',
            iconCls: 'x-fa fa-search',
            handler: 'searchFwaList',
            hidden: false,
            itemId: 'searchButtonList'
        },
        {
            text: 'Cancel',
            align: 'right',
            handler: 'closeSearchList'
        }
    ]
});