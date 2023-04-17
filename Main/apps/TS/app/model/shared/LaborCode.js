Ext.define('TS.model.shared.LaborCode', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'lcLevel',
            type: 'auto'
        },
        {
            name: 'lcCode',
            type: 'auto'
        },
        {
            name: 'lcLabel',
            type: 'auto'
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'LaborCode.GetList',
        paramOrder: 'dbi|username|start|limit'
    }
});
