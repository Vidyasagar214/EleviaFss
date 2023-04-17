/**
 * Created by steve.tess on 5/22/2017.
 */
Ext.define('TS.store.CrewsForNewFWA', {
    extend: 'Ext.data.Store',
    storeId: 'CrewsForNewFWA',

    model: 'TS.model.fwa.Crew',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Crew.GetCrewListForNewFwa',
        paramOrder: 'dbi|username|empId'
    },
    filters: [{
        property: 'crewStatus',
        value: 'A'
    }]
});