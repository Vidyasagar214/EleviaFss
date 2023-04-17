Ext.define('TS.model.shared.CcgResponseMessage', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'messageDoc',
            type: 'string'
        },
        {
            name: 'success',
            type: 'boolean'
        },
        {
            name: 'count',
            type: 'int'
        },
        {
            name: 'results',
            type: 'string'
        }
    ]

    //was used by JSON to return, probably never used or needed.
});
