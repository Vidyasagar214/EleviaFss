Ext.define('TS.model.shared.User', {
    extend: 'TS.model.Base',

    idProperty: 'userId',
    identifier: 'uuid',

    fields: [
        {
            name: 'userId',
            type: 'auto'
        },
        {
            name: 'username',
            type: 'string'
        },
        {
            name: 'empId',
            type: 'string'
        },
        {
            name: 'role',
            reference: 'SeRole'
        },
        {
            name: 'format',
            reference: 'Formatting'
        }

    ],

    proxy: {
        type: 'default',
        directFn: 'User.GetList',
        paramOrder: 'dbi|username|start|limit'
    }
});
