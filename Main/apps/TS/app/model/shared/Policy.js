Ext.define('TS.model.shared.Policy', {
    extend: 'TS.model.Base',

    idProperty: 'policyId',
    identifier: 'uuid',

    fields: [
        {
            name: 'policyId',
            type: 'int'
        },
        {
            name: 'policyName',
            type: 'string'
        },
        {
            name: 'ruleId',
            type: 'int'
        },
        {
            name: 'ruleName',
            type: 'string'
        },
        {
            name: 'desc',
            type: 'string'
        },
        {
            name: 'dvalue1',
            type: 'int'
        },
        {
            name: 'dvalue2',
            type: 'int'
        },
        {
            name: 'svalue',
            type: 'string'
        }
    ]
    //not currently used - no proxy needed
});
