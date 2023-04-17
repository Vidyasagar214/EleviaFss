Ext.define('TS.common.field.CrewRoleNoFilter', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-crewrolenofilter',

    valueField: 'crewRoleId',
    displayField: 'crewRoleName',
    matchFieldWidth: false,

    store: {
        model: 'TS.model.shared.crewRole',
        autoLoad: true,
        pageSize: 1000,
        remoteFilter: false,
        sorters: [{
            property: 'crewRoleName',
            direction: 'ASC'
        }]
    }
});
