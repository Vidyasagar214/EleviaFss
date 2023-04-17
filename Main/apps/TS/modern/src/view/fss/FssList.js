Ext.define('TS.view.fss.FssList', {
    extend: 'Ext.grid.Grid',

    xtype: 'fss-list',

    isScheduler: false,

    cls: 'custom-grid',
    columns: [
        {
            text: '<b>Please select from application(s) below.</b>',
            dataIndex: 'name',
            flex: 1
        }
    ]

});