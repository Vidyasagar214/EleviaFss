/**
 * Created by steve.tess on 11/9/2017.
 */
Ext.define('TS.model.fwa.EmployeeViewListGantt', {
    extend: 'Sch.model.Event',

    idProperty: 'id',
    identifier: 'uuid',

    startDateField: 'startDateTime',
    endDateField: 'endDateTime',
    nameField: 'fwaName',
    resourceIdField: 'resourceId',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'empId', type: 'string'},
        {name: 'empGroupId', type: 'string'},
        {name: 'empGroupName', type: 'string'},
        {name: 'empName', type: 'string'},
        {name: 'schedHrs', type: 'float'},
        {name: 'fwaId', type: 'string'},
        {name: 'fwaNum', type: 'string'},
        {name: 'fwaName', type: 'string'},
        {
            name: 'startDateTime',
            type: 'date',
            dateFormat: 'c',
            mapping: function(data){
                if (data.recurrencePattern) {
                    var datesInRange = data.recurrenceDatesInRange,
                        startIsDaylight = new Date(new Date(datesInRange[0]).setTime(new Date(data.startDateTime).getTime())).toString().includes('Daylight'),
                        valueIsDaylight = new Date(data.startDateTime).toString().includes('Daylight'),
                        endIsStandard = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.endDateTime).getHours())).toString().includes('Standard'),
                        startIsStandard = new Date(new Date(datesInRange[0]).setTime(new Date(data.startDateTime).getTime())).toString().includes('Standard'),
                        valueIsStandard = new Date(data.startDateTime).toString().includes('Standard'),
                        endIsDaylight = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.endDateTime).getHours())).toString().includes('Daylight');
                    //daylight to standard
                    if (startIsDaylight && endIsStandard && valueIsDaylight) {
                        var newDate = TS.common.Util.getInUTCDate(data.startDateTime);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    } else if (startIsDaylight && endIsStandard && !valueIsDaylight) {
                        return TS.common.Util.getInUTCDate(data.startDateTime);
                    }
                    //standard to daylight
                    else if (startIsStandard && endIsDaylight && valueIsStandard) {
                        return TS.common.Util.getInUTCDate(data.startDateTime);

                    } else if (startIsStandard && endIsDaylight && !valueIsStandard) {
                        var newDate = TS.common.Util.getInUTCDate(data.startDateTime);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                }
                return TS.common.Util.getInUTCDate(data.startDateTime);
            }
        },
        {
            name: 'endDateTime',
            type: 'date',
            dateFormat: 'c',
            mapping: function(data){
                if (data.recurrencePattern && data.recurrenceDatesInRange) {

                    var datesInRange = data.recurrenceDatesInRange,
                        startIsDaylight = new Date(new Date(datesInRange[0]).setHours(new Date(data.startDateTime).getHours())).toString().includes('Daylight'),
                        valueIsDaylight = TS.common.Util.getInUTCDate(data.endDateTime).toString().includes('Daylight'),
                        endIsStandard = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.endDateTime).getHours())).toString().includes('Standard'),
                        startIsStandard = new Date(new Date(datesInRange[0]).setHours(new Date(data.startDateTime).getHours())).toString().includes('Standard'),
                        valueIsStandard = TS.common.Util.getInUTCDate(data.endDateTime).toString().includes('Standard'),
                        endIsDaylight = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.endDateTime).getHours())).toString().includes('Daylight');
                    //daylight to standard
                    if (startIsDaylight && endIsStandard && valueIsDaylight) {
                        var newDate = TS.common.Util.getInUTCDate(data.endDateTime);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                    //standard to daylight
                    if (startIsStandard && endIsDaylight && !valueIsStandard) {
                        var newDate = TS.common.Util.getInUTCDate(data.endDateTime);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                }
                return TS.common.Util.getInUTCDate(data.endDateTime);
            }
        },
        {
            name: 'resourceId',
            type: 'string'
        },
        {
            name: 'hoverRows',
            type: 'string'
        },
        {
            name: 'recurrenceDatesInRange',
            type: 'auto'
        },
        {
            name: 'recurrencePattern', // Empty string if non-recurring
            type: 'string'
        }
    ]
});