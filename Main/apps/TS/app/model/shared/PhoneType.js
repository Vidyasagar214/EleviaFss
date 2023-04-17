Ext.define('TS.model.shared.PhoneType', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'desc',
            type: 'auto'
        }
    ]
    //not used at this time
});
