/**
 * Created by steve.tess on 7/23/2018.
 */
Ext.define('TS.view.exp.ExpReportList', {
    extend: 'Ext.grid.Grid',
    xtype: 'exp-report-list',

    scrollable: true,
    //cls: 'custom-grid',
    columns:[
        {
            text: 'Date',
            dataIndex: 'reportDate',
            renderer: renderDate,
            // renderer: function (value, record, rec, row) {
            //     var fn = Ext.util.Format.date;
            //     return fn(value, DATE_FORMAT);
            // },
            flex: 1
        },
        {
            text: 'Name',
            dataIndex: 'reportName',
            flex: 1.5
        },
        {
            text: 'Status',
            dataIndex: 'status',
            renderer: function(value, record, rec, row){
                var record = Ext.getStore('FwaStatus').findRecord('value', value);
                return (record ? record.get('description') : '');
            },
            flex: 1
        }
    ]
});