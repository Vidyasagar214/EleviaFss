Ext.define('TS.model.shared.JsonReturnModel', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'success',
            type: 'boolean'
        },
        {
            name: 'total',
            type: 'auto'
        },
        {
            name: 'data',
            type: 'auto'
        },
        {
            name: 'message',
            type: 'auto'
        }
    ]
    //used by JSON to return, probably not needed.
});
