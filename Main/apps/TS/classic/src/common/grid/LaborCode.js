Ext.define('TS.common.grid.LaborCode', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid-laborcode',

    flex: 1,
    height: '100%',
    border: 1,
    margin: '0 10 0 0',

    selModel: 'rowmodel',

    columns: [{
        text: 'Level',
        dataIndex: 'lcLevel',
        hidden: true
    }, {
        text: 'Code',
        dataIndex: 'lcCode',
        width: 55,
        align: 'center'
    }, {
        text: 'Label',
        dataIndex: 'lcLabel',
        flex: 1
    }],

    listeners: {
        select: 'selectLaborCode'
    }

});