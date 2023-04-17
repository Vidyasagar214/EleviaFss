/**
 * Created by steve.tess on 8/2/2016.
 */
Ext.define('TS.view.fwa.Search', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-search',

    requires: [
        'TS.model.fwa.FwaProjectSearch'
    ],

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Search'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    //iconCls: 'x-fa fa-chevron-left',
                    handler: 'closeSheet'
                }
            ]
        },
        {
            xtype: 'formpanel',
            scrollable: 'y',
            items: [
                {
                    xtype: 'fieldset',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'clientSearch',
                            label: {_tr: 'clientLabel', tpl: '{0}:'},
                            labelWidth: '40%'
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'wbs1Search',
                            label: {_tr: 'wbs1Label', tpl: '{0}:'},
                            labelWidth: '40%'
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'wbs2Search',
                            label: {_tr: 'wbs2Label', tpl: '{0}:'},
                            labelWidth: '40%',
                            bind: {
                                hidden: '{hideFwaWbs2}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'wbs3Search',
                            label: {_tr: 'wbs3Label', tpl: '{0}:'},
                            labelWidth: '40%',
                            bind: {
                                hidden: '{hideFwaWbs3}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'button',
                            top: '-0.6em',
                            right: '1em',
                            iconCls: 'x-fa fa-refresh',
                            handler: 'onClearSearchDates'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Search Dates',
                    items: [
                        {
                            xtype: 'datepickerfield',
                            itemId: 'startDateSearch',
                            label: {_tr: 'fwaAbbrevLabel', tpl: 'For {0}s from:'},
                            labelWidth: '40%'
                        },
                        {
                            xtype: 'datepickerfield',
                            itemId: 'endDateSearch',
                            label: 'To:',
                            labelWidth: '40%'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'button',
                            top: '-0.6em',
                            right: '1em',
                            iconCls: 'x-fa fa-refresh',
                            handler: 'onClearSelections',
                            itemId: 'clearSelectionButton'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    padding: '0 40 0 40',
                    title: {_tr: 'workCodeLabelPlural', tpl: 'Filter For {0}'},
                    reference: 'searchForm',
                    items: [
                        {
                            xtype: 'list',
                            fullscreen: false,
                            scrollable: 'y',
                            mode: 'MULTI',
                            name: 'workCodeList',
                            itemId: 'workCodeList',
                            itemTpl: new Ext.XTemplate(
                                '<p>{[this.getWorkCodeAbbrev(values)]} - {[this.getDescription(values)]}</p>',
                                {
                                    getWorkCodeAbbrev: function (values) {
                                        return values.workCodeAbbrev;
                                    },

                                    getDescription: function (values) {
                                        return values.workCodeDescr;
                                    }
                                }
                            )
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Search Results'},
                    reference: 'searchResultSet',
                    hidden: true,
                    items: [
                        {
                            xtype: 'list',
                            emptyText: {_tr: 'fwaAbbrevLabel', tpl: 'No Matching {0}s'},
                            deferEmptyText: false,
                            fullscreen: false,
                            scrollable: 'y',
                            mode: 'SINGLE',
                            name: 'resultList',
                            reference: 'fwaResultList',
                            store: {
                                model: 'TS.model.fwa.FwaProjectSearch',
                                autoLoad: false,
                                proxy: {
                                    type: 'default',
                                    directFn: 'Fwa.SearchForFwas',
                                    paramOrder: 'dbi|username|fwaId|searchParameters'
                                }
                            },
                            itemId: 'resultsList',
                            itemTpl: new Ext.XTemplate(
                                '<div style="font-weight: bold;">#{fwaNum} - {fwaName}</div>' +
                                '<div >{[this.formatDate(values)]} - {fwaStatusString}</div>',
                                {
                                    formatDate: function (values) {
                                        var fn = Ext.util.Format.date;
                                        return '<span>' + fn(values.schedStartDate, 'n/j/Y') + '</span>&nbsp;&nbsp;<span>' + fn(values.schedStartDate, 'h:i A') + '</span>';
                                    },

                                    getFwaNumber: function (values) {
                                        return values.fwaNum;
                                    },

                                    getDescription: function (values) {
                                        return values.fwaName;
                                    }
                                }
                            ),
                            listeners: {
                                itemdoubletap: 'viewSelectedResult'
                            }
                        }
                    ]
                }
            ]
        },

        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'View',
                    align: 'left',
                    iconCls: 'x-fa fa-pencil',
                    handler: 'viewSelectedResult',
                    itemId: 'viewButton',
                    hidden: true,
                    bind: {
                        disabled: '{!fwaResultList.selection}'
                    }
                },
                {
                    text: 'Search',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-search',
                    handler: 'searchPrior',
                    itemId: 'searchButton'
                },
                {
                    text: 'Search',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-repeat ',
                    handler: 'resetSearch',
                    itemId: 'resetSearchButton',
                    hidden: true
                },
                {
                    text: 'Cancel',
                    style: 'margin-left: 5px;',
                    align: 'right',
                    ui: 'action',
                    handler: 'closeSheet'
                }
            ]
        }
    ]

});