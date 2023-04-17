Ext.define('TS.model.fwa.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.fwa-main',

    requires: [
        'TS.model.fwa.Fwa',
        'TS.model.fwa.Store'
    ],

    data: {
        name: 'FWA',
        isScheduler: false,
        newFwa: false,
        clientSigReq: false,
        chiefSigReq: false,
        startDate: null,
        endDate: null,
        selectedTimesheet: null,
        hideColumn: false,
        isSubmitted: false,
        notesCls: 'x-fa fa-file-o',
        hasRights: false,
        wbsLocked: !navigator.onLine || IS_OFFLINE,
        fromFSS: false
    },

    //TODO: 'TS.model.fwa.Fwa',Sort out dependency on 'TS.model.fwa.Fwa',that extends 'Sch.model.Event',
    //Ideally that would be model that can be used across both toolkits
    stores: {
        fwalist: {
            type: 'fwalist',
            model: 'TS.model.fwa.Fwa',
            proxy: {
                type: 'default',
                directFn: 'Fwa.GetList',
                paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler',
                reader: {
                    type: 'default',
                    transform: {
                        fn: function (data) {
                            // do some manipulation of the raw data object
                            // var decommValue;
                            // decommValue = TS.Util.Decompress(data.data);
                            // data.data = [];
                            // Ext.each(decommValue, function (item) {
                            //     data.data.push(item);
                            // });
                            return data;
                        },
                        scope: this
                    }
                }
            },
            filters: [
                function (item) {
                    return item.data.fwaStatusId !== 'S';
                }
            ],
            listeners: {
                load: 'onLoadFwaList'
            }
        },
        viewfwa: {
            model: 'TS.model.fwa.Fwa',
            proxy: {
                type: 'default',
                directFn: 'Fwa.Get',
                paramOrder: 'dbi|username|id|fwaDate'
            }
        },
        // Intermediate store to facilitate grouped nature and specific data allocated to notes view
        notesview: {
            model: 'TS.model.fwa.FwaNote',
            sorters: [
                {
                    property: 'modeDate',
                    direction: 'ASC'
                }
            ]
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

    init: function () {
        var me = this;
        //Massage the data
        me.get('viewfwa').on('load', function (store, records) {
            me.set('fwa', records[0]);
        });
    },

    constructor: function (config) {
        this.callParent([config]);
    },

    formulas: {

        clientSigReqTxt: function (get) {
            if (get('clientSigReq')) {
                return ' (*required field)';
            } else {
                return '';
            }
        },

        fwaStartStop: function (get) {
            return (get('fwaStatusId') !== FwaStatus.InProgress ? 'Start' : 'Stop');
        },

        hourglassIconCls: function (get) {
            return (get('fwaStatusId') !== FwaStatus.InProgress ? 'x-fa fa-hourglass-start' : 'x-fa fa-hourglass-end');
        },

        hideFwaStartStop: function (get) {
            return (get('newFwa') || get('isScheduler') || !TS.app.settings.fwaDisplayStartButton);
        },

        chiefSigReqTxt: function (get) {
            if (get('chiefSigReq')) {
                return ' (*required field)';
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

        hideUdf_c1: function (get) {
            return TS.app.settings.fwaDisplay_udf_c1 === 'N';
        },

        readOnlyUdf_c1: function (get) {
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

        readOnlyUdf_a1: function (get) {
            return TS.app.settings.fwaDisplay_udf_a1 === 'RO';
        },

        readOnlyUdf_a2: function (get) {
            return TS.app.settings.fwaDisplay_udf_a2 === 'RO';
        },

        readOnlyUdf_a3: function (get) {
            return TS.app.settings.fwaDisplay_udf_a3 === 'RO';
        },

        readOnlyUdf_a4: function (get) {
            return TS.app.settings.fwaDisplay_udf_a4 === 'RO';
        },

        readOnlyUdf_a5: function () {
            return TS.app.settings.fwaDisplay_udf_a5 === 'RO';
        },

        readOnlyUdf_a6: function () {
            return TS.app.settings.fwaDisplay_udf_a6 === 'RO';
        },

        readOnlyUdf_l1: function () {
            return TS.app.settings.fwaDisplay_udf_l1 === 'RO';
        },

        readOnlyUdf_l2: function () {
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

        hideUdf_l1: function () {
            return TS.app.settings.fwaDisplay_udf_l1 === 'N';
        },
        hideUdf_l2: function () {
            return TS.app.settings.fwaDisplay_udf_l2 === 'N';
        },

        readOnlyUdf_t1: function () {
            return TS.app.settings.fwaDisplay_udf_t1 === 'RO';
        },

        readOnlyUdf_t2: function () {
            return TS.app.settings.fwaDisplay_udf_t2 === 'RO';
        },

        readOnlyUdf_t3: function () {
            return TS.app.settings.fwaDisplay_udf_t3 === 'RO';
        },
        readOnlyUdf_t4: function () {
            return TS.app.settings.fwaDisplay_udf_t4 === 'RO';
        },

        readOnlyUdf_t5: function () {
            return TS.app.settings.fwaDisplay_udf_t5 === 'RO';
        },

        readOnlyUdf_t6: function () {
            return TS.app.settings.fwaDisplay_udf_t6 === 'RO';
        },

        readOnlyUdf_t7: function () {
            return TS.app.settings.fwaDisplay_udf_t7 === 'RO';
        },

        readOnlyUdf_t8: function () {
            return TS.app.settings.fwaDisplay_udf_t8 === 'RO';
        },

        readOnlyUdf_t9: function () {
            return TS.app.settings.fwaDisplay_udf_t9 === 'RO';
        },

        readOnlyUdf_t10: function () {
            return TS.app.settings.fwaDisplay_udf_t10 === 'RO';
        },

        hideUdf_d1: function () {
            return TS.app.settings.fwaDisplay_udf_d1 === 'N';
        },
        hideUdf_d2: function () {
            return TS.app.settings.fwaDisplay_udf_d2 === 'N';
        },
        hideUdf_d3: function () {
            return TS.app.settings.fwaDisplay_udf_d3 === 'N';
        },
        readOnlyUdf_d1: function () {
            return TS.app.settings.fwaDisplay_udf_d1 === 'RO';
        },
        readOnlyUdf_d2: function () {
            return TS.app.settings.fwaDisplay_udf_d2 === 'RO';
        },
        readOnlyUdf_d3: function () {
            return TS.app.settings.fwaDisplay_udf_d3 === 'RO';
        },
        //
        // fwaUnitsEnabled: function (get) {
        //     return get('settings.fwaUnitsEnabled') && get('settings.fwaUnitVisibility') != 'H';
        // },

        hideExpenses: function (get) {
            return TS.app.settings.hideSections.indexOf('X') != -1;
        },

        fwaHideActualHours: function (get) {
            return TS.app.settings.fwaWorkCodeActual == 'H';
        },

        fwaReadOnlyActualHours: function (get) {
            return TS.app.settings.fwaWorkCodeActual == 'R';
        },

        fwaUnitsEnabled: function (get) {
            return (TS.app.settings.fwaUnitsEnabled && TS.app.settings.fwaUnitVisibility != 'H') && TS.app.settings.hideSections.indexOf('U') == -1;
        },

        fwaHideWorkCodes: function (get) {
            return TS.app.settings.fwaHideWorkCodes || TS.app.settings.hideSections.indexOf('W') != -1;
        },

        hideWorkCodeUnitPanel: function (get) {
            return TS.app.settings.hideSections.indexOf('U') != -1 && TS.app.settings.hideSections.indexOf('W') != -1;
        },

        hideClientSignature: function (get) {
            return TS.app.settings.hideSections.indexOf('CS') != -1;
        },

        hideEmployeeSignature: function (get) {
            return TS.app.settings.hideSections.indexOf('ES') != -1;
        },

        hideSignaturePanel: function (get) {
            return TS.app.settings.hideSections.indexOf('ES') != -1 && TS.app.settings.hideSections.indexOf('CS') != -1;
        },

        hideAddressDatePanel: function (get) {
            return false;// get('settings.hideSections').indexOf('ES') != -1 && get('settings.hideSections').indexOf('CS') != -1;
        },
    },

    //Main model must implemennt this method
    getPageTitle: function () {
        return TS.app.settings.fwaTitle;
    }
});
