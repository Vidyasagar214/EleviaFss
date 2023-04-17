Ext.define('TS.model.fwa.FwaStatus', {
    extend: 'TS.model.Base',

    idProperty: 'fwaStatusId',
    identifier: 'uuid',

    fields: [
        {
            name: 'fwaStatusId',
            type: 'auto'
        },
        {
            name: 'fwaStatusDescr',
            type: 'string'
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'FwaStatus.GetList',
        paramOrder: 'dbi|username|start|limit'
    }
});
