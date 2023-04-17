Ext.define('TS.view.utilities.UtilitiesList', {
    extend: 'Ext.grid.Panel',
    xtype: 'utilities-list',
    style: 'background: white !important; text-align: right !important',
    isScheduler: false,
    viewConfig: {
        stripeRows: false
    },

    hideHeaders: true,
    rowLines: false,
    cls: 'utilities-grid',
    columns: [
        {
            xtype: 'actioncolumn',
            align: 'right',
            width: 75,
            handler: 'onActionSelection',
            items:  [{
                getClass: function(v, meta, rec) {
                    return rec.get('icon');
                }
            }]
        },
        {
            dataIndex: 'name',
            style: 'margin-left: 10px;',
            flex: 5,
            renderer: function (value, metadata, record) {
                this.getToolTip(value, metadata, record);
                metadata.tdCls = 'utilities-centertext-right';
                return '<b>' + value + '</b>';
            }
        }
    ],

    listeners: {
        select: 'onApplicationSelection'
    },

    getToolTip: function (value, metaData, record) {
        metaData.tdAttr = 'data-qtip=\'<html><head></head><body><table>' + record.get('name') + '</table></body></html>\'';
    }

});