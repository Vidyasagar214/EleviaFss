/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.store.UnitCode', {
    extend: 'Ext.data.Store',

   storeId: 'UnitCode',

    model: 'TS.model.shared.UnitCode',
    autoLoad: false,
    settingsDependency: true, //custom property

    proxy: {
        type: 'default',
        directFn: 'UnitCode.GetList',
        paramOrder: 'dbi|username|start|limit|wbs1|wbs2|wbs3|includeInactive',
        extraParams: {
            start: 0,
            limit: 25,
            wbs1: '^',
            wbs2: '^',
            wbs3: '^',
            includeInactive: true
        }
    }
});