/**
 * Created by steve.tess on 9/10/2016.
 */
Ext.define('TS.store.HolidaySchedule', {
    extend: 'Ext.data.Store',
    //alias: 'store.HolidaySchedule',

    storeId: 'HolidaySchedule',

    model: 'TS.model.shared.HolidaySchedule',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000
    // proxy: {
    //     type: 'default',
    //     directFn: 'Holiday.GetListByEmployee',
    //     paramOrder: 'dbi|username|start|limit|empId'
    // }
});