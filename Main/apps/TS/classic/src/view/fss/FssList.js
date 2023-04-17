Ext.define('TS.view.fss.FssList', {
    extend: 'Ext.grid.Panel',
    xtype: 'fss-list',
    style: 'background: white !important; text-align: right !important',
    isScheduler: false,
    viewConfig: {
        stripeRows: false
    },
    scrollable: false,
    hideHeaders: true,
    rowLines: false,
    cls: 'fss-grid',
    columns: [
        {
            dataIndex: 'name',
            textAlign: 'right',
            //style: 'margin-left: 10px;',
            width: '90%',
            flex: 5,
            renderer: function (value, metadata, record) {
                this.getToolTip(value, metadata, record);
                metadata.tdCls = 'fss-centertext';
                return '<b>' + value + '</b>';
            }
        },
        {
            xtype: 'actioncolumn',
            align: 'left',
            width: 85,
            //flex: 2,
            style: 'margin-right: 115px;',
            handler: 'onActionSelection',
            items:  [{
                getClass: function(v, meta, rec) {
                    return rec.get('icon');
                }
            }]
        }
    ],

    listeners: {
        select: 'onApplicationSelection'
    },

    getToolTip: function (value, metaData, record) {
        metaData.tdAttr = 'data-qtip=\'<html><head></head><body><table>' + record.get('name') + '</table></body></html>\'';
    }

});