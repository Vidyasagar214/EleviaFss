
Ext.define('TS.model.shared.EmployeeSkillSetList', {
    extend: 'Ext.data.Model',

    idProperty: 'id',
    identifier: 'uuid',

    fields:[
        {name: 'id', type: 'string'},
        {name: 'empId', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'description', type: 'string'}
    ]
});