Ext.define('TS.common.field.CrewRole', {
    extend: 'Ext.field.Select',
    xtype: 'field-crewrole',

    config: {
        valueField: 'crewRoleId',
        displayField: 'crewRoleName',
        store: 'Roles'
    }

    // initialize: function () {
    //     var cfg = this.config;
    //
    //     this.setStore({
    //         model: 'TS.model.shared.CrewRole',
    //         autoLoad: true,
    //         pageSize: 1000,
    //         remoteFilter: false,
    //         sorters: [{
    //             property: 'crewRoleName',
    //             direction: 'ASC'
    //         }],
    //         filters: ( cfg.noFilter ? [] : [{property: 'crewRoleStatus', value: 'A'}] )
    //     });
    //
    //     this.callParent();
    // }
});