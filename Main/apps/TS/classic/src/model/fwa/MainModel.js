/**
 * This class is the view model for the FWA Viewport
 */
Ext.define('TS.model.fwa.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.fwa',

    data: {
        name: 'FWA',
        newFwa: false,
        clientSigReq: false,
        chiefSigReq: false,
        startDate: null,
        endDate: null,
        selectedTimesheet: null,
        hideColumn: false,
        isSubmitted: false,
        notesCls: 'notes_empty',
        hasRights: false,
        canModify: false,
        wbsLocked: false,
        fromFSS: false,
        isScheduler: false,
        recurrenceBtn: 'timesheet'
    },

    formulas: {
        fwaStartStop: function (get) {
            return (get('fwaStatusId') !== 'I' ? 'Start' : 'Stop');
        },
        clientSigReqTxt: function (get) {
            if (get('clientSigReq')) {
                return '(*required field)';
            } else {
                return '';
            }
        },
        chiefSigReqTxt: function (get) {
            if (get('chiefSigReq')) {
                return '(*required field)';
            } else {
                return '';
            }
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
                if (endDate.getTimezoneOffset() <= startDate.getTimezoneOffset())
                    diff++;
            }
            return ((startDate && endDate && diff) ? diff : 0);
        },

        isHidden: function (get) {
            return get('hideColumn');
        },

        hideExpAccount: function (get) {
            if (get('settings.exDisplayAccount') == 'B' || get('settings.exDisplayAccount') == 'U')
                return false;
            else
                return true;
        },

        hideExpAccountName: function (get) {
            if (get('settings.exDisplayAccount') == 'B' || get('settings.exDisplayAccount') == 'A')
                return false;
            else
                return true;
        },

        displayBillable: function (get) {
            return get('settings.exDisplayBillable');
        },

        displayCompanyPaid: function (get) {
            return get('settings.exDisplayCompanyPaid');
        },

        canModifyFwaExp: function (get) {
            return get('settings.exCanModifyFwaExp');
        },

        hideExpWbs1: function (get) {
            if (get('settings.exDisplayWbs1') == 'B' || get('settings.exDisplayWbs1') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs1Name: function (get) {
            if (get('settings.exDisplayWbs1') == 'B' || get('settings.exDisplayWbs1') == 'A')
                return false;
            else
                return true;
        },

        hideExpWbs2: function (get) {
            if (get('settings.exDisplayWbs2') == 'B' || get('settings.exDisplayWbs2') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs2Name: function (get) {
            if (get('settings.fwaDisplayWbs3') == 'B' || get('settings.fwaDisplayWbs3') == 'A')
                return false;
            else
                return true;
        },

        hideExpWbs3: function (get) {
            if (get('settings.exDisplayWbs3') == 'B' || get('settings.exDisplayWbs3') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs3Name: function (get) {
            if (get('settings.exDisplayWbs3') == 'B' || get('settings.exDisplayWbs3') == 'A')
                return false;
            else
                return true;
        },

        hideAccount: function (get) {
            return !(get('settings.exDisplayAccount') === 'B' || get('settings.exDisplayAccount') === 'U');
        },

        hideAccountName: function (get) {
            return !(get('settings.exDisplayAccount') === 'B' || get('settings.exDisplayAccount') === 'A');
        },

        hideUdf_c1: function (get) {
            return TS.app.settings.fwaDisplay_udf_c1 == 'N';
        },
        readOnlyUdf_c1: function (get) {
            return TS.app.settings.fwaDisplay_udf_c1 == 'RO';
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

        hideUdf_a1_all: function (get) {
            return TS.app.settings.fwaDisplay_udf_a1 == 'N'
        },
        hideUdf_a2_all: function (get) {
            return TS.app.settings.fwaDisplay_udf_a2 == 'N'
        },
        hideUdf_a3_all: function (get) {
            return TS.app.settings.fwaDisplay_udf_a3 == 'N'
        },
        hideUdf_a4_all: function (get) {
            return TS.app.settings.fwaDisplay_udf_a4 == 'N'
        },
        hideUdf_a5_all: function (get) {
            return TS.app.settings.fwaDisplay_udf_a5 == 'N'
        },
        hideUdf_a6_all: function (get) {
            return TS.app.settings.fwaDisplay_udf_a6 == 'N'
        },

        hideUdf_l1: function () {
            return TS.app.settings.fwaDisplay_udf_l1 == 'N';
        },

        hideUdf_l2: function () {
            return TS.app.settings.fwaDisplay_udf_l2 == 'N';
        },

        readOnlyUdf_a1: function (get) {
            return TS.app.settings.fwaDisplay_udf_a1 == 'RO';
        },

        readOnlyUdf_a2: function (get) {
            return TS.app.settings.fwaDisplay_udf_a2 == 'RO';
        },

        readOnlyUdf_a3: function (get) {
            return TS.app.settings.fwaDisplay_udf_a3 == 'RO';
        },

        readOnlyUdf_a4: function (get) {
            return TS.app.settings.fwaDisplay_udf_a4 == 'RO';
        },

        readOnlyUdf_a5: function () {
            return TS.app.settings.fwaDisplay_udf_a5 == 'RO';
        },

        readOnlyUdf_a6: function () {
            return TS.app.settings.fwaDisplay_udf_a6 == 'RO';
        },

        readOnlyUdf_l1: function () {
            return TS.app.settings.fwaDisplay_udf_l1 == 'RO';
        },
        readOnlyUdf_l2: function () {
            return TS.app.settings.fwaDisplay_udf_l2 == 'RO';
        },

        hideUdf_a1Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a1 == 'N' || !this.data.isScheduler;
        },
        hideUdf_a2Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a2 == 'N' || !this.data.isScheduler;
        },
        hideUdf_a3Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a3 == 'N' || !this.data.isScheduler;
        },
        hideUdf_a4Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a4 == 'N' || !this.data.isScheduler;
        },
        hideUdf_a5Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a5 == 'N' || !this.data.isScheduler;
        },
        hideUdf_a6Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a6 == 'N' || !this.data.isScheduler;
        },
        hideUdf_l1Grid: function () {
            return TS.app.settings.fwaDisplay_udf_l1 == 'N' || !this.data.isScheduler;
        },
        hideUdf_l2Grid: function () {
            return TS.app.settings.fwaDisplay_udf_l2 == 'N' || !this.data.isScheduler;
        },

        readOnlyUdf_a1Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a1 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_a2Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a2 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_a3Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a3 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_a4Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_a5Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a5 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_a6Grid: function () {
            return TS.app.settings.fwaDisplay_udf_a6 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_l1Grid: function () {
            return TS.app.settings.fwaDisplay_udf_l1 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_l1Grid: function () {
            return TS.app.settings.fwaDisplay_udf_l2 == 'RO' || !this.data.isScheduler;
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

        hideUdf_t1Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t1 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t2Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t2 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t3Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t3 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t4Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t5Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t5 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t6Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t6 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t7Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t7 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t8Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t8 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t9Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t9 == 'N' || !this.data.isScheduler;
        },
        hideUdf_t10Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t10 == 'N' || !this.data.isScheduler;
        },

        readOnlyUdf_t1: function () {
            return TS.app.settings.fwaDisplay_udf_t1 == 'RO';
        },
        readOnlyUdf_t2: function () {
            return TS.app.settings.fwaDisplay_udf_t2 == 'RO';
        },
        readOnlyUdf_t3: function () {
            return TS.app.settings.fwaDisplay_udf_t3 == 'RO';
        },
        readOnlyUdf_t4: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'RO';
        },
        readOnlyUdf_t5: function () {
            return TS.app.settings.fwaDisplay_udf_t5 == 'RO';
        },
        readOnlyUdf_t6: function () {
            return TS.app.settings.fwaDisplay_udf_t6 == 'RO';
        },
        readOnlyUdf_t7: function () {
            return TS.app.settings.fwaDisplay_udf_t7 == 'RO';
        },
        readOnlyUdf_t8: function () {
            return TS.app.settings.fwaDisplay_udf_t8 == 'RO';
        },
        readOnlyUdf_t9: function () {
            return TS.app.settings.fwaDisplay_udf_t9 == 'RO';
        },
        readOnlyUdf_t10: function () {
            return TS.app.settings.fwaDisplay_udf_t10 == 'RO';
        },

        readOnlyUdf_t1Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t1 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t2Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t2 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t3Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t3 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t4Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t5Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t5 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t6Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t6 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t7Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t7 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t8Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t8 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t9Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t9 == 'RO' || !this.data.isScheduler;
        },
        readOnlyUdf_t10Grid: function () {
            return TS.app.settings.fwaDisplay_udf_t10 == 'RO' || !this.data.isScheduler;
        },

        hideUdf_d1: function () {
            return TS.app.settings.fwaDisplay_udf_d1 == 'N';
        },
        hideUdf_d2: function () {
            return TS.app.settings.fwaDisplay_udf_d2 == 'N';
        },
        hideUdf_d3: function () {
            return TS.app.settings.fwaDisplay_udf_d3 == 'N';
        },
        readOnlyUdf_d1: function () {
            return TS.app.settings.fwaDisplay_udf_d1 == 'RO';
        },
        readOnlyUdf_d2: function () {
            return TS.app.settings.fwaDisplay_udf_d2 == 'RO';
        },
        readOnlyUdf_d3: function () {
            return TS.app.settings.fwaDisplay_udf_d3 == 'RO';
        }

    },

    getPageTitle: function () {
        return TS.app.settings.fwaTitle;
    }
});