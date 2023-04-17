Ext.define('TS.common.grid.Updatable', {

    extend: 'Ext.grid.Panel',

    xtype: 'grid-updatable',

    requires: [
        //    'CrewDesk.controller.GridController',
        'Ext.grid.plugin.CellEditing',
        'Ext.toolbar.Toolbar',
        'Ext.grid.filters.Filters'
    ],

    initComponent: function () {

        var me = this;
        if (!me.plugins) {
            me.plugins = [];
        }

        me.plugins.push(Ext.create('Ext.grid.plugin.CellEditing', {
            pluginId: 'celledit',
            clicksToEdit: 2
        }));

        me.callParent(arguments);
    }
});
