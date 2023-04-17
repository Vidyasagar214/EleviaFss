/**
 * Created by steve.tess on 7/30/2018.
 */
Ext.define('TS.store.ExpPeriodDates', {
    extend: 'Ext.data.Store',

    alias: 'store.ExpPeriodDates',

    storeId: 'ExpPeriodDates',

    model: 'TS.model.shared.ExpPeriodDates',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Exp.GetExpensePeriodDates',
        paramOrder: 'dbi|username|empId'
    }
});