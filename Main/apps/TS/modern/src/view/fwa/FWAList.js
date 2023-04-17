Ext.define('TS.view.fwa.FWAList', {
    extend: 'Ext.grid.Grid',
    xtype: 'fwa-list',

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
    columns: [
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
                return '<span>' + fn(value, DATE_FORMAT) + '</span><span>' + fn(value, 'h:i A') + '</span>';
            },
            width: 90
        },
        {
            text: 'End',
            dataIndex: 'schedEndDate',
            cell: {
                xtype: 'gridcell',
                innerCls: 'ts-multiline-cell',
                encodeHtml: false//important to write HTML to cell
            },
            renderer: function (value, record, rec, row) {
                var fn = Ext.util.Format.date;
                row.setStyle(record.get('fieldPriorityColor') + record.get('fieldPriorityFontColor'));
                return '<span>' + fn(value, DATE_FORMAT) + '</span><span>' + fn(value, 'h:i A') + '</span>';
            },
            width: 80,
            hidden: true
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
            text: 'Map',
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype: 'button',
                    ui: 'plain',
                    iconCls: 'x-fa fa-map-pin ',
                    handler: 'onCellMapTap'
                },
                width: 60,
                bind: {
                    style: '{buttonBGColor}'
                }
            }
        }
    ]
});
