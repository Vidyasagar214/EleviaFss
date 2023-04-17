Ext.define('TS.view.crew.EmployeeForm', {
    extend: 'Ext.panel.Panel',

    xtype: 'employeeassignform',

    layout: 'hbox',

    items: [
        {
            xtype: 'combo',
            valueField: 'empId',
            displayField: 'empName',
            margin: '0 5 0 0',
            store: {
                type: 'Employees'
            },
            emptyText: 'Employee...',
            width: 125
        },
        {
            xtype: 'combo',
            valueField: 'crewRoleId',
            displayField: 'crewRoleName',
            store: {
                type: 'ActiveRoles'
            },
            emptyText: 'Role...',
            maxWidth: 110
        }
    ]
});