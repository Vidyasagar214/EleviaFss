/**
 * Created by steve.tess on 3/14/2017.
 */
Ext.define('TS.model.fwa.RecurrenceConfig', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'freq', type: 'string'}, // DAILY, WEEKLY or MONTHLY
        {name: 'interval', type: 'int'}, // Every N days/weeks/months
        // If DAILY:
        {name: 'everyWeekday', type: 'boolean'}, // If true, then interval should be 0; if false, then interval should be non-zero.
        // If WEEKLY, in addition to interval:
        {name: 'monday', type: 'boolean'}, // If WEEKLY and Monday is checked, etc.....
        {name: 'tuesday', type: 'boolean'},
        {name: 'wednesday', type: 'boolean'},
        {name: 'thursday', type: 'boolean'},
        {name: 'friday', type: 'boolean'},
        {name: 'saturday', type: 'boolean'},
        {name: 'sunday', type: 'boolean'},
        // If MONTHLY, in addition to interval:
        {name: 'dayNum', type: 'int'}, // The Nth day of every <interval> months; 0 if dayOccurrence is being used
        {name: 'dayOccurrence', type: 'int'}, // The first/second/third/fourth ... of every <interval> months; 0 if dayNum is being used
        {name: 'dayOfWeek', type: 'string'}, // MUST BE MO, TU, WE, TH, FR, SA or SU
        // Bottom section
        {name: 'startDate', type: 'date'}, // Required for ALL recurring FWAs
        {name: 'count', type: 'int'}, // End after N occurrences; set to 0 if "until" is used
        {name: 'until', type: 'date'},// End by this date; set to DateTime.MaxDate if "count" is used
        {name: 'noEndDate', type: 'boolean'}, // True if "No end date" is specified
        //Additional dates (array)
        {name: 'addlDates', type: 'auto'},
        //Except these dates (array)
        {name: 'exceptDates', type: 'auto'},
        {name: 'recurEnd', type: 'auto'},
        {name: 'recurStart', type: 'auto'}
    ]
});