/**
 * Created by steve.tess on 6/13/2016.
 */
Ext.define('TS.store.ActiveRoles', {
    extend: 'Ext.data.Store',
    
    alias: 'store.ActiveRoles',    

    storeId: 'ActiveRoles',

    model: 'TS.model.shared.CrewRole',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Role.GetList',
        paramOrder: 'dbi|username|start|limit',
        extraParams: {
            start: 0,
            limit: 25
        }
    },
    filters: ( [{property: 'crewRoleStatus', value: 'A'}] )
    
});