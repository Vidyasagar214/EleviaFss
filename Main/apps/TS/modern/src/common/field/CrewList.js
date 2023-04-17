Ext.define('TS.common.field.CrewList', {
    extend: 'Ext.field.Select',
    xtype: 'field-crewlist',

    requires: [
        'TS.model.fwa.Crew'
    ],

    config: {
        valueField: 'crewId',
        displayField: 'crewName',
        store: 'CrewsForNewFWA'
    },

    initialize: function () {
        var me = this,
            settings = TS.app.settings,
            store = me.getStore();

        // if (settings.schedCrewPreparedByMe == 'Y') {
        //     store.clearFilter();
        //     store.filterBy(function (obj) {
        //         return obj.get('preparedByEmpId') == settings.empId;
        //     });
        // } else {
        //     store.clearFilter();
        // }
        //
        me.callParent();
    }
});