/**
 * Created by steve.tess on 11/6/2019.
 */
Ext.define('TS.view.fss.FssListEast', {
    extend: 'Ext.grid.Panel',
    xtype: 'fss-list-east',
    style: 'background: white !important;',
    isScheduler: false,
    viewConfig: {
        stripeRows: false
    },
    scrollable: false,
    hideHeaders: true,
    rowLines: false,
    columns: [
        {
            xtype: 'actioncolumn',
            align: 'right',
            width: 180,
            style: 'margin-left: 105px;',
            handler: 'onActionSelection',
            items:  [{
                getClass: function(v, meta, rec) {
                    return rec.get('icon');
                }
            }]
        },
        {
            dataIndex: 'name',
            textAlign: 'left',
            style: 'margin-left: 10px;',
            flex: 5,
            renderer: function (value, metadata, record) {
                this.getToolTip(value, metadata, record);
                metadata.tdCls = 'fss-centertext-right';
                return '<b>' + value + '</b>';
            }
        }
    ],

    viewConfig: {
        stripeRows: false,
        getRowClass: function (record) {
            //return 'tallRow';
        }
    },

    listeners: {
        select: 'onApplicationSelection'
    },

    getToolTip: function (value, metaData, record) {
        metaData.tdAttr = 'data-qtip=\'<html><head></head><body><table>' + record.get('name') + '</table></body></html>\'';
    }

});