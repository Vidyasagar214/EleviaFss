Ext.define('TS.model.admin.Policy', {
    extend: 'TS.model.Base',

    idProperty: 'PolicyId',
    identifier: 'uuid',

    fields: [
        {name: 'policyId', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'rules', type: 'auto'}
    ]
    //not currently used - no proxy needed
});
