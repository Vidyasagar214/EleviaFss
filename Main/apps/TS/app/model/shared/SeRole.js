Ext.define('TS.model.shared.SeRole', {
    extend: 'TS.model.Base',

    idProperty: 'seRoleId',
    identifier: 'uuid',

    fields: [
        {
            name: 'seRoleId',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        }
    ]
    //not currently used - no proxy needed
});
