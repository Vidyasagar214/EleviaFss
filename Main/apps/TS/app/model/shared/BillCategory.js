Ext.define('TS.model.shared.BillCategory', {
    extend: 'TS.model.Base',

    idProperty: 'category',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'category', type: 'string'},
        {name: 'description', type: 'string'}
    ],
    proxy: {
        type: 'default',
        directFn: 'BillCategory.GetList',
        paramOrder: 'dbi|username|start|limit'
    }
});
