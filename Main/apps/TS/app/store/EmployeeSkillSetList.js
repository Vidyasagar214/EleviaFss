
Ext.define('TS.store.EmployeeSkillSetList', {
    extend: 'Ext.data.Store',

    storeId: 'EmployeeSkillSetList',

    model: 'TS.model.shared.EmployeeSkillSetList',
    autoLoad: false,
    settingsDependency: true, //custom property

    proxy: {
        type: 'default',
        directFn: 'Employee.GetEmployeeSkillSetList',
        paramOrder: 'dbi'
    }
});