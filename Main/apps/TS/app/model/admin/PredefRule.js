Ext.define('TS.model.admin.PredefRule', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'predefRuleNum',
            type: 'int'
        },
        {
            name: 'descr',
            type: 'string'
        }

    ]
    //not currently used - no proxy needed
});
