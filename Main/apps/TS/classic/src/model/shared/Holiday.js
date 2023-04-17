Ext.define('TS.model.shared.Holiday', {
    extend: 'Sch.model.Range',

    identifier: 'uuid',
    idProperty: 'holidayScheduleId',

    startDateField: 'HolidayDate',
    endDateField: 'HolidayEnd',
    nameField: 'HolidayDescr',

    fields: [

        {name: 'holidayScheduleId', type: 'string'},
        {
            name: 'holidayDate',
            type: 'date',
            format: 'c',
            persist: false,
            convert: function (value) {
                //return Ext.Date.clearTime(new Date(value));
                return Ext.Date.add(Ext.Date.clearTime(new Date(value)), Ext.Date.DAY, 1);
            }
        },
        {name: 'holidayDescr', type: 'string'},

        // Scheduler fields, not part of Ext.Direct
        {
            name: 'holidayEnd',
            type: 'date',
            persist: false,
            convert: function (value, record) {
                return Ext.Date.add(Ext.Date.clearTime(new Date(record.data.holidayDate)), Ext.Date.DAY, 1);
            }
        },
        {name: 'Cls', defaultValue: 'holiday-zone', persist: false}
    ],

    proxy: {
        type: 'default',
        directFn: 'Holiday.GetListByEmployee',
        paramOrder: 'dbi|username|start|limit|empId'
    }

});
