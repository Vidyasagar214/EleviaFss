/**
 * Created by steve.tess on 7/13/2017.
 */
Ext.define('TS.view.fwa.FWATabletList', {
    extend: 'Ext.grid.Grid',
    xtype: 'fwa-tabletlist',

    requires: [
        'Ext.grid.cell.Widget',
        'TS.view.main.Map'
    ],

    isScheduler: false,
    itemConfig: {
        viewModel: {
            formulas: {
                buttonBGColor: function (get) {
                    return get('record').get('fieldPriorityColor');
                }
            }
        }
    },
    columns:[
        {
            text: 'Start',
            dataIndex: 'nextDate',
            cell: {
                xtype: 'gridcell',
                innerCls: 'ts-multiline-cell',
                encodeHtml: false//important to write HTML to cell
            },
            renderer: function (value, record, rec, row) {
                var fn = Ext.util.Format.date;
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));

                return '<span>' + fn(value, 'n/j/Y') + '</span><span>' + fn(value, 'h:i A') + '</span>';
            },
            width: 80
        },
        {
            text: 'Status',
            dataIndex: 'fwaStatusString',
            renderer: function (value, record, rec, row) {
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return value || '-';
            },
            flex: .75
        },
        {
            text: {_tr: 'fwaAbbrevLabel', tpl: '{0}'},
            dataIndex: 'fwaNum',
            renderer: function (value, record, rec, row) {
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return value || '-';
            },
            flex: 1
        },
        {
            text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
            dataIndex: 'fwaName',
            renderer: function (value, record, rec, row) {
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return value || '-';
            },
            flex: 2
        },
        {
            text: {_tr: 'crewLabel'},
            itemId: 'crewNameColumn',
            dataIndex: 'scheduledCrewName',
            flex: 1,
            renderer: function (value, record, rec, row) {
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return value || '-';
            }
        },
        {
            text: {_tr: 'wbs1Label', tpl: '{0}'},
            itemId: 'wbs1Column',
            dataIndex: 'wbs1',
            flex: 1.5,
            style:'white-space: nowrap;',
            renderer: function (value, record, rec, row) {
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return value;
            }
        },
        {
            text: {_tr: 'wbs1Label', tpl: '{0} Name'},
            itemId: 'wbs1NameColumn',
            dataIndex: 'wbs1Name',
            flex: 1.5,
            renderer: function (value, record, rec, row) {
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return value;
            }
        },
        {
            text: {_tr: 'clientLabel'},
            itemId: 'clientNameColumn',
            dataIndex: 'clientName',
            flex: 1,
            renderer: function (value, record, rec, row) {
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return value;
            }
        },
        {
            text: 'Map',
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype: 'button',
                    ui: 'plain',
                    iconCls: 'x-fa fa-map-marker',
                    handler: 'onCellMapTap'
                    //padding: '0 10 0 0'
                },
                width: 60,
                bind: {
                    style: '{buttonBGColor}'
                }
            }
        }
    ]
});