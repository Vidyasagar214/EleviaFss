Ext.define('TS.model.shared.Phone', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'phoneNumber',
            type: 'string'
        },
        {
            name: 'phoneType',
            type: 'auto'
        }
    ]
    //not used at this time
});
