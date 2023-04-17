Ext.define('TS.store.EmployeeRegistrationList', {
    extend: 'Ext.data.Store',

    storeId: 'EmployeeRegistrationList',

    model: 'TS.model.shared.EmployeeRegistrationList',
    autoLoad: false,
    settingsDependency: true, //custom property

    proxy: {
        type: 'default',
        directFn: 'Employee.GetEmployeeRegistrationList',
        paramOrder: 'dbi'
    }
});