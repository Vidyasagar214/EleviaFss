Ext.define('TS.common.field.CrewRole', {

    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-crewrole',
    requires: ['TS.model.shared.CrewRole'],

    valueField: 'crewRoleId',
    displayField: 'crewRoleName',
    matchFieldWidth: false,
    queryMode: 'local',
    forceSelection: true,

    store: 'Roles'
    // constructor: function (config) {
    //
    //     this.store = Ext.create('Ext.data.Store', {
    //         model: 'TS.model.shared.CrewRole',
    //         autoLoad: true,
    //         pageSize: 1000,
    //         remoteFilter: false,
    //         sorters: [{
    //             property: 'crewRoleName',
    //             direction: 'ASC'
    //         }],
    //         filters: ( config.noFilter ? [] : [{property: 'crewRoleStatus', value: 'A'}] )
    //     });
    //
    //     this.callParent(arguments);
    // }
});
