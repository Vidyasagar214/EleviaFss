Ext.define('TS.model.admin.Rule', {
    extend: 'TS.model.Base',

    idProperty: 'RuleId',
    identifier: 'uuid',

    fields: [
        {name: 'ruleId', type: 'auto'},
        {name: 'predefRuleNum', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'dValue1', type: 'int'},
        {name: 'dValue2', type: 'int'},
        {name: 'sValue', type: 'string'},
        {name: 'resultType', type: 'auto'},
        {name: 'resultMsg', type: 'string'}

    ]
    //not currently used - no proxy needed
});
