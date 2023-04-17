/**
 * Created by steve.tess on 4/20/2017.
 */
Ext.define('TS.store.WBS1TsList', {
    extend: 'Ext.data.Store',

    storeId: 'WBS1TsList',

    model: 'TS.model.shared.Wbs1',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Wbs1.GetList',
        paramOrder: 'dbi|username|start|limit|filter|empId|includeInactive|app',
        extraParams: {
            includeInactive: false,
            app: 'TS'
        }
    }
});