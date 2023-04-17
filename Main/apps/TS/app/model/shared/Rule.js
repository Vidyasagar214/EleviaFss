Ext.define('TS.model.shared.Rule', {
    extend: 'TS.model.Base',

    idProperty: 'ruleId',
    identifier: 'uuid',

    fields: [
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
