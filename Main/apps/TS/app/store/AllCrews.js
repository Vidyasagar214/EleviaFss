/**
 * Created by steve.tess on 7/22/2016.
 */
Ext.define('TS.store.AllCrews', {
    extend: 'Ext.data.Store',
    storeId: 'AllCrews',

    model: 'TS.model.fwa.Crew',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Crew.GetList',
        paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe',
        extraParams: {
            limit: 1000,
            isPreparedByMe: 'N' //TS.app.settings.schedCrewPreparedByMe
        }
    }
});