Ext.define('TS.model.shared.HolidaySchedule', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'holidayScheduleId',
            type: 'auto'
        },
        {
            name: 'holidayDate',
            type: 'date',
            format: 'c'
            // persist: false,
            // convert: function (value) {
            //     return Ext.Date.clearTime(new Date(value));
            //     //return Ext.Date.add(Ext.Date.clearTime(new Date(value)), Ext.Date.DAY, 1);
            // }
        },
        {
            name: 'holidayDescr',
            type: 'auto'
        },
        // Scheduler fields, not part of Ext.Direct
        {
            name: 'holidayEnd',
            type: 'date',
            persist: false,
            convert: function (value, record) {
                return Ext.Date.add(Ext.Date.clearTime(new Date(record.data.holidayDate)), Ext.Date.DAY, 1);
            }
        },
        // scheduler date fields for holidays
        {
            name: 'StartDate',
            type: 'date',
            format: 'c',
            mapping: function (data) {
                return data.holidayDate;
            }
        },
        {
            name: 'EndDate',
            type: 'date',
            convert: function (value, record) {
                return Ext.Date.add(Ext.Date.clearTime(new Date(record.data.holidayDate)), Ext.Date.DAY, 1);
            }
        },
        {
            name: 'Name',
            type: 'auto',
            mapping: function (data) {
                return data.holidayDescr;
            }
        },
        {
            name: 'Cls',
            type: 'string',
            mapping: function(){
                return 'myZoneStyle';
            }
            //
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'Holiday.GetListByEmployee',
        paramOrder: 'dbi|username|start|limit|empId'
    }

});
