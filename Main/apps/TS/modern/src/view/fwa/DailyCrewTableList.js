/**
 * Created by steve.tess on 6/22/2018.
 */
Ext.define('TS.view.fwa.DailyCrewTableList', {
    extend: 'Ext.Sheet',

    xtype: 'dailycrewtabletlist',

    controller: 'fwa-edit',
    viewModel: 'fwa-main',

    stretchX: true,
    stretchY: true,
    layout: 'fit',
    autoDestroy: true,

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            bind: {
                title: 'Daily {settings.crewLabel} {settings.fwaAbbrevLabel} List'
            },
            //title: {_tr: 'fwaAbbrevLabel', tpl: 'Daily {0} List'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: function (bt) {
                        var sheet = bt.up('sheet');
                        sheet.hide();
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            layout: 'vbox',
            items: [
                {
                    xtype: 'grid',
                    flex: 1,
                    itemId: 'tableCrewTaskGrid',
                    // features: [{
                    //     ftype: 'grouping',
                    //     groupHeaderTpl: '{columnName}: {name}'
                    // }],
                    store: {
                        model: 'TS.model.fwa.Fwa',
                        autoLoad: true,
                        sorters: ['scheduledCrewName', 'schedStartDate'],
                        //grouper:'scheduledCrewName',
                        proxy: {
                            type: 'default',
                            directFn: 'Fwa.GetSchedulerFwaList',
                            paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe|timeZoneOffset|scheduledFwas',
                            extraParams: {
                                scheduledFwas: true,
                                isPreparedByMe: 'N',
                                timeZoneOffset: new Date().getTimezoneOffset()
                            },
                            reader: {
                                type: 'default',
                                transform: {
                                    fn: function (data) {
                                        // console.log('modern daily crew');
                                        // // do some manipulation of the raw data object
                                        // var decommValue;
                                        // decommValue = TS.Util.Decompress(data.data);
                                        // data.data = [];
                                        // Ext.each(decommValue, function (item) {
                                        //     data.data.push(item);
                                        // });
                                        return data;
                                    },
                                    scope: this
                                }
                            }
                        }
                        ,
                        filters: [
                            function (item) {
                                return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(new Date(), DATE_FORMAT);
                            }
                        ]
                    },
                    columns: [
                        {
                            dataIndex: 'scheduledCrewName',
                            text: {_tr: 'crewLabel'},
                            flex: .75,
                            renderer: function (value, record, rec, row) {
                                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                                return value || '-';
                            }
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'schedStartDate',
                            format: ' m/d/Y g:i A',
                            text: 'Start',
                            flex: .5,
                            cell: {
                                xtype: 'gridcell',
                                innerCls: 'ts-multiline-cell',
                                encodeHtml: false//important to write HTML to cell
                            },
                            renderer: function (value, record, rec, row) {
                                var fn = Ext.util.Format.date;
                                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));

                                return '<span>' + fn(value, 'n/j/Y') + '</span><span>' + fn(value, 'h:i A') + '</span>';
                            }
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'schedEndDate',
                            format: ' m/d/Y g:i A',
                            text: 'End',
                            flex: .5,
                            cell: {
                                xtype: 'gridcell',
                                innerCls: 'ts-multiline-cell',
                                encodeHtml: false//important to write HTML to cell
                            },
                            renderer: function (value, record, rec, row) {
                                var fn = Ext.util.Format.date;
                                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));

                                return '<span>' + fn(value, 'n/j/Y') + '</span><span>' + fn(value, 'h:i A') + '</span>';
                            }
                        },
                        {
                            dataIndex: 'fwaName',
                            text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                            flex: 1,
                            renderer: function (value, record, rec, row) {
                                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                                return value || '-';
                            }
                        },
                        {
                            dataIndex: 'wbs1',
                            text: {_tr: 'wbs1Label', tpl: '{0}#'},
                            flex: .5,
                            renderer: function (value, record, rec, row) {
                                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                                return value || '-';
                            }
                        },
                        {
                            dataIndex: 'wbs1Name',
                            text: {_tr: 'wbs1Label', tpl: '{0} Name'},
                            flex: 1.5,
                            renderer: function (value, record, rec, row) {
                                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                                return value || '-';
                            }
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    cls: 'ts-navigation-header',
                    reference: 'crewTaskDateBar',
                    itemId: 'crewTaskDateBar',
                    layout: {
                        pack: 'center'
                    },
                    docked: 'bottom',
                    items: [
                        {
                            iconCls: 'x-fa fa-arrow-left',
                            handler: 'lastTabletCrewTaskDate',
                            reference: 'lastTabletCrewTaskDate',
                            itemId: 'lastTabletCrewTaskDate',
                            align: 'left'
                        },
                        {
                            xtype: 'displayfield',
                            //padding: '0 0 0 10',
                            cls: 'ts-navigation-header',
                            reference: 'tabletCrewTaskDateHeader',
                            itemId: 'tabletCrewTaskDateHeader',
                            width: 110,
                            style: 'color: white;'
                        },
                        {
                            iconCls: 'x-fa fa-arrow-right',
                            handler: 'nextTabletCrewTaskDate',
                            reference: 'nextTabletCrewTaskDate',
                            itemId: 'nextTabletCrewTaskDate',
                            align: 'right'
                        }
                    ]
                }
            ]
        }
    ]
});