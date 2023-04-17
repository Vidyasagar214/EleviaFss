Ext.define('TS.model.ts.MainModel', {
    extend: 'TS.view.main.MainModel',
    alias: 'viewmodel.ts-main',

    init: function () {

        var me = this,
            makeUniqueView = function (store) {
            var arr = [],
                    settings = TS.app.settings,
                    records = store.getRange(),
                    i = 0,
                    n,
                    text,
                    found;

                if (records) {
                    //collect and reduce at the same time
                    for (; i < records.length; i++) {
                        text = TS.common.Util.createGroupHeader(records[i]);
                        if (text == '') {
                            text = 'No ' + settings.wbs1Label + ' info for ' + settings.tsTitle + ' period, select to enter.';
                        }
                        found = false;
                        for (n = 0; n < arr.length; n++) {
                            if (arr[n].title === text) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            arr.push({
                                seq: records[i].get('seq'),
                                title: text
                            });
                        }
                    }
                }

                me.getStore('projects').loadData(arr);
            };

        //Massage the data
        me.get('timesheetfwa').on('load', function (store, records) {
            me.set('fwa', records[0]);
        });

        me.get('tsrow').on({
            add: makeUniqueView,
            remove: makeUniqueView,
            load: makeUniqueView,
            update: makeUniqueView
        });

        me.callParent();
    },

    data: {
        name: 'Timesheet',
        startDate: null,
        endDate: null,
        selectedTimesheet: null,
        employeeSelectedTimesheet: null,
        hideColumn: false,
        isScheduler: false,
        dayCount: 0,
        totalHours: 0,
        employeeDisabled: false,
        tsStatus: '',
        fromFSS: false
    },

    formulas: {
        hideUdf_d1: function(){
            return TS.app.settings.fwaDisplay_udf_d1 === 'N';
        },
        hideUdf_d2: function(){
            return TS.app.settings.fwaDisplay_udf_d2 === 'N';
        },
        hideUdf_d3: function(){
            return TS.app.settings.fwaDisplay_udf_d3 === 'N';
        },
        hideUdf_c1: function(get){
            return TS.app.settings.fwaDisplay_udf_c1 === 'N';
        },

        readOnlyUdf_c1: function(get){
            return TS.app.settings.fwaDisplay_udf_c1 === 'RO';
        },

        hideUdf_a1_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a1 == 'N' || TS.app.settings.udf_a1_Type == 'dropdown';
        },
        hideUdf_a1_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a1 == 'N' || TS.app.settings.udf_a1_Type != 'dropdown';
        },

        hideUdf_a2_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a2 == 'N' || TS.app.settings.udf_a2_Type == 'dropdown';
        },
        hideUdf_a2_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a2 == 'N' || TS.app.settings.udf_a2_Type != 'dropdown';
        },

        hideUdf_a3_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a3 == 'N' || TS.app.settings.udf_a3_Type == 'dropdown';
        },
        hideUdf_a3_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a3 == 'N' || TS.app.settings.udf_a3_Type != 'dropdown';
        },

        hideUdf_a4_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a4 == 'N' || TS.app.settings.udf_a4_Type == 'dropdown';
        },
        hideUdf_a4_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a4 == 'N' || TS.app.settings.udf_a4_Type != 'dropdown';
        },

        hideUdf_a5_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a5 == 'N' || TS.app.settings.udf_a5_Type == 'dropdown';
        },
        hideUdf_a5_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a5 == 'N' || TS.app.settings.udf_a5_Type != 'dropdown';
        },

        hideUdf_a6_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a6 == 'N' || TS.app.settings.udf_a6_Type == 'dropdown';
        },
        hideUdf_a6_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a6 == 'N' || TS.app.settings.udf_a6_Type != 'dropdown';
        },
        hideUdf_a1_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a1 == 'N'
        },
        hideUdf_a2_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a2 == 'N'
        },
        hideUdf_a3_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a3 == 'N'
        },
        hideUdf_a4_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a4 == 'N'
        },
        hideUdf_a5_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a5 == 'N'
        },
        hideUdf_a6_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a6 == 'N'
        },

        readOnlyUdf_a1: function(get){
            return TS.app.settings.fwaDisplay_udf_a1 === 'RO';
        },

        readOnlyUdf_a2: function(get){
            return TS.app.settings.fwaDisplay_udf_a2 === 'RO';
        },

        readOnlyUdf_a3: function(get){
            return TS.app.settings.fwaDisplay_udf_a3 === 'RO';
        },

        readOnlyUdf_a4: function(get){
            return TS.app.settings.fwaDisplay_udf_a4 === 'RO';
        },

        readOnlyUdf_a5: function(){
            return TS.app.settings.fwaDisplay_udf_a5 === 'RO';
        },

        readOnlyUdf_a6: function(){
            return TS.app.settings.fwaDisplay_udf_a6 === 'RO';
        },

        readOnlyUdf_l1: function(){
            return TS.app.settings.fwaDisplay_udf_l1 === 'RO';
        },

        readOnlyUdf_l2: function(){
            return TS.app.settings.fwaDisplay_udf_l2 === 'RO';
        },

        hideUdf_t1_text: function () {
            return TS.app.settings.fwaDisplay_udf_t1 == 'N' || TS.app.settings.udf_t1_Type == 'dropdown';
        },
        hideUdf_t1_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t1 == 'N' || TS.app.settings.udf_t1_Type != 'dropdown';
        },

        hideUdf_t2_text: function () {
            return TS.app.settings.fwaDisplay_udf_t2 == 'N' || TS.app.settings.udf_t2_Type == 'dropdown';
        },
        hideUdf_t2_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t2 == 'N' || TS.app.settings.udf_t2_Type != 'dropdown';
        },

        hideUdf_t3_text: function () {
            return TS.app.settings.fwaDisplay_udf_t3 == 'N' || TS.app.settings.udf_t3_Type == 'dropdown';
        },
        hideUdf_t3_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t3 == 'N' || TS.app.settings.udf_t3_Type != 'dropdown';
        },

        hideUdf_t4_text: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'N' || TS.app.settings.udf_t4_Type == 'dropdown';
        },
        hideUdf_t4_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'N' || TS.app.settings.udf_t4_Type != 'dropdown';
        },

        hideUdf_t5_text: function () {
            return TS.app.settings.fwaDisplay_udf_t5 == 'N' || TS.app.settings.udf_t5_Type == 'dropdown';
        },
        hideUdf_t5_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t5 == 'N' || TS.app.settings.udf_t5_Type != 'dropdown';
        },

        hideUdf_t6_text: function () {
            return TS.app.settings.fwaDisplay_udf_t6 == 'N' || TS.app.settings.udf_t6_Type == 'dropdown';
        },
        hideUdf_t6_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t6 == 'N' || TS.app.settings.udf_t6_Type != 'dropdown';
        },

        hideUdf_t7_text: function () {
            return TS.app.settings.fwaDisplay_udf_t7 == 'N' || TS.app.settings.udf_t7_Type == 'dropdown';
        },
        hideUdf_t7_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t7 == 'N' || TS.app.settings.udf_t7_Type != 'dropdown';
        },

        hideUdf_t8_text: function () {
            return TS.app.settings.fwaDisplay_udf_t8 == 'N' || TS.app.settings.udf_t8_Type == 'dropdown';
        },
        hideUdf_t8_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t8 == 'N' || TS.app.settings.udf_t8_Type != 'dropdown';
        },

        hideUdf_t9_text: function () {
            return TS.app.settings.fwaDisplay_udf_t9 == 'N' || TS.app.settings.udf_t9_Type == 'dropdown';
        },
        hideUdf_t9_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t9 == 'N' || TS.app.settings.udf_t9_Type != 'dropdown';
        },

        hideUdf_t10_text: function () {
            return TS.app.settings.fwaDisplay_udf_t10 == 'N' || TS.app.settings.udf_t10_Type == 'dropdown';
        },
        hideUdf_t10_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t10 == 'N' || TS.app.settings.udf_t10_Type != 'dropdown';
        },

        hideUdf_l1: function(){
            return TS.app.settings.fwaDisplay_udf_l1 === 'N';
        },
        hideUdf_l2: function(){
            return TS.app.settings.fwaDisplay_udf_l2 === 'N';
        },

        readOnlyUdf_t1: function(){
            return TS.app.settings.fwaDisplay_udf_t1 === 'RO';
        },

        readOnlyUdf_t2: function(){
            return TS.app.settings.fwaDisplay_udf_t2 === 'RO';
        },

        readOnlyUdf_t3: function(){
            return TS.app.settings.fwaDisplay_udf_t3 === 'RO';
        },
        readOnlyUdf_t4: function(){
            return TS.app.settings.fwaDisplay_udf_t4 === 'RO';
        },

        readOnlyUdf_t5: function(){
            return TS.app.settings.fwaDisplay_udf_t5 === 'RO';
        },

        readOnlyUdf_t6: function(){
            return TS.app.settings.fwaDisplay_udf_t6 === 'RO';
        },

        readOnlyUdf_t7: function(){
            return TS.app.settings.fwaDisplay_udf_t7 === 'RO';
        },

        readOnlyUdf_t8: function(){
            return TS.app.settings.fwaDisplay_udf_t8 === 'RO';
        },

        readOnlyUdf_t9: function(){
            return TS.app.settings.fwaDisplay_udf_t9 === 'RO';
        },

        readOnlyUdf_t10: function(){
            return TS.app.settings.fwaDisplay_udf_t10 === 'RO';
        },
        // Gets the day count between start and end date
        dayCount: function (get) {
            var startDate = get('startDate'),
                endDate = get('endDate'),
                minutes,
                diff,
                startOffset,
                endOffset;
            //deals with GMT issues ie: GMT 0600 & GMT 0500
            if (startDate) {
                minutes = endDate.getTime() - startDate.getTime();
                diff = Math.ceil(minutes / 1000 / 60 / 60 / 24);
                if(endDate.getTimezoneOffset() <= startDate.getTimezoneOffset())
                    diff++;
            }
            return ((startDate && endDate && diff) ? diff : 0);
        },

        lockEmployee: function (get) {
            return get('employeeDisabled');
        },

        tsDisabled: function (get) {
            return (get('tsStatus') == 'A') || (get('tsStatus') == 'S' && !get('settings.tsAllowUnsubmit'));
        },

        tsProjectEdit: function(get){
            var settings = TS.app.settings;
            if (get('tsStatus') == 'A' || get('tsStatus') == 'S') {
                if (!settings.tsApproverCanModify && settings.tsIsApprover) {
                    if (!settings.tsAllowUnsubmit) {
                        return true;
                    }
                }
                if (!settings.tsIsApprover) {
                    return true;
                }
            }
            return false;
        }
    },

    stores: {
        tsheet: {
            model: 'TS.model.ts.Tsheet',
            autoLoad: true,
            proxy: {
                type: 'default',
                directFn: 'TimeSheet.GetListByEmployee',
                paramOrder: 'dbi|username|empId|start|limit',
                extraParams: {
                    start: 0,
                    limit: 1000
                }
            }
        },
        tsrow: {
            model: 'TS.model.ts.TsRow',
            proxy: {
                type: 'default',
                directFn: 'TimeSheet.GetByEmployeeByDate',
                paramOrder: 'dbi|username|start|limit|empId|tsDate|includeCrewMembers',
                extraParams: {
                    start: 0,
                    limit: 1000
                },
                reader: {
                    type: 'default',
                    rootProperty: 'data.rows' // Server returns more data than we need here, and it's nested in rows array
                }
            },
            grouper: {
                groupFn: TS.common.Util.createGroupHeader
            }
        },
        // Intermediate store to facilitate grouped nature and specific data allocated to Hours view
        hoursview: {
            model: 'TS.model.ts.TsCell',
            grouper: {
                groupFn: function (rec) {
                    var d = new Date(rec.get('workDate')), //new Date(TS.common.Util.getInUTCDate(new Date(rec.get('workDate')))),
                        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    //return days[d.getUTCDay()] + ' ' +Ext.Date.format(new Date(d),DATE_FORMAT); //days[d.getUTCDay()] + ' ' + d; //
                    //return new Date(Ext.Date.format(new Date(rec.get('workDate'), DATE_FORMAT)));
                    return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT);
                    //return Ext.Date.format(TS.common.Util.getNewInUTCDate(rec.get('workDate')), DATE_FORMAT);
                },
                property: 'workDate'
            }
        },
        // store for a FWA tied to a timesheet
        timesheetfwa: {
            model: 'TS.model.fwa.Fwa',
            proxy: {
                type: 'default',
                directFn: 'Fwa.Get',
                paramOrder: 'dbi|username|id|fwaDate'
            }
        },

        //This store serves as a view from tsrow
        // We have set up 'load' event listener on tsrow store that will repopulate  projects store with unique values
        // NOTE: Add other listeners ad needed. load should be enough as after any update to underlying tsrow project update we will reload it.
        // Do not make any changes to this store directly
        // Work on the tsrow record instead
        // NOTE: If multiple rows have the same project bound, it will reflect only the first one.
        projects: {
            fields: ['seq', 'title'] // title reflect long name that is generated from wbs counterparts
        },

        signaturelist: {
            model: 'TS.model.shared.Attachment',
            sorters: [
                {
                    property: 'dateAttached',
                    direction: 'ASC'
                }
            ]
        }
    },

    //Main model must implement this method
    getPageTitle: function () {
        return TS.app.settings.tsTitle;
    }
});
