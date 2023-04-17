/**
 * This class is the view model that each CCG Application Viewport uses
 * All of the individual ViewModels extend from this parent
 */
Ext.define('TS.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'FSS App',
        user: null,
        settings: null
    },

    getPageTitle: function () {
        return this.get('name');
    },

    formulas: {
        isDesktop: function (get) {
            return Ext.os.is.Desktop || false;
            //return (get('settings.fwaCanModify') == 'A' && Ext.os.is.Desktop) || false;
        },

        notDesktop: function () {
            return !Ext.os.is.Desktop;
        },

        // Formulas used to determine the active app
        isTimesheetApproval: function (get) {
            return get('name') == 'TimesheetApproval';
        },

        isTimesheet: function (get) {
            return get('name') == 'Timesheet';
        },

        isFwa: function (get) {
            return !get('newFwa') && get('name') == 'FWA';
        },

        canWindowFwaCopyOpen: function (get) {
            return (!get('newFwa') && (get('name') == 'FWA' || get('name') == 'Scheduler') && get('isChief')) && !IS_OFFLINE;
        },

        canFwaCopy: function (get) {
            return !get('newFwa') && (get('name') == 'FWA' || get('name') == 'Scheduler');
        },

        isNewFwaWithRights: function (get) {
            return get('newFwa') && get('hasRights');
        },

        isNewOrOffline: function (get) {
            return get('newFwa');
        },

        notFwaCreateNew: function (get) {
            return !get('settings.fwaCreateNew') || IS_OFFLINE;
        },

        isScheduler: function (get) {
            return (get('name') == 'Crew' || get('name') == 'Scheduler');
        },

        isSchedulerAndNotReadOnly: function (get) {
            return ((get('name') == 'Crew' || get('name') == 'Scheduler')) && get('settings.schedReadOnly');
        },

        schedReadOnlyAndNotScheduler: function (get) {
            return ((get('name') != 'Crew' && get('name') != 'Scheduler')) || get('settings.schedReadOnly');
        },

        notIsSchedulerAndNewFwa: function (get) {
            return (get('newFwa') && !get('isScheduler'));
        },

        isNotSchedulerOrReadOnly: function (get) {
            return (get('name') != 'Crew' && get('name') != 'Scheduler') || get('settings.schedReadOnly');
        },

        isSchedulerAndCannotApprove: function (get) {
            return (get('isScheduler') && !get('settings.fwaIsApprover'));
        },

        isSchedulerAndCannotApproveOrIsNotScheduler: function (get) {
            return (get('isScheduler') && !get('settings.fwaIsApprover')) || (get('name') != 'Crew' && get('name') != 'Scheduler');
        },

        isSchedulerOrNewFwa: function (get) {
            return (get('newFwa') || get('name') == 'Scheduler');
        },

        // Formulas used to determine the state of certain UI components
        hideFwaStartStop: function (get) {
            return (get('newFwa') || get('isScheduler') || !get('settings.fwaDisplayStartButton'));
        },

        hideBillCategory: function (get) {
            return (get('settings.tsDisplayBillCat') == 'N');
        },

        hideLaborCode: function (get) {
            return (get('settings.tsDisplayLaborCode') == 'N');
        },

        hideFwaWbs1: function (get) {
            if (get('settings.fwaDisplayWbs1') == 'B' || get('settings.fwaDisplayWbs1') == 'U')
                return false;
            else
                return true;
        },

        hideFwaWbs1Name: function (get) {
            if (get('settings.fwaDisplayWbs1') == 'B' || get('settings.fwaDisplayWbs1') == 'A')
                return false;
            else
                return true;
        },

        hideFwaWbs2: function (get) {
            if (get('settings.fwaDisplayWbs2') == 'B' || get('settings.fwaDisplayWbs2') == 'U')
                return false;
            else
                return true;
        },

        hideFwaWbs2Name: function (get) {
            if (get('settings.fwaDisplayWbs2') == 'B' || get('settings.fwaDisplayWbs2') == 'A')
                return false;
            else
                return true;
        },

        hideFwaWbs3: function (get) {
            if (get('settings.fwaDisplayWbs3') == 'B' || get('settings.fwaDisplayWbs3') == 'U')
                return false;
            else
                return true;
        },

        hideFwaWbs3Name: function (get) {
            if (get('settings.fwaDisplayWbs3') == 'B' || get('settings.fwaDisplayWbs3') == 'A')
                return false;
            else
                return true;
        },

        hideFwaDisplayClient: function (get) {
            return (get('settings.fwaDisplayClient') == 'N');
        },

        hideFwaDisplayCrew: function (get) {
            return (get('settings.fwaDisplayCrew') == 'N');
        },

        canFwaAddWorkCode: function (get) {
            return (get('settings.fwaAddWorkCode') != 'N')
        },

        hideFwaClientSignatures: function (get) {
            return get('newFwa') || get('settings.hideSections').indexOf('CS') != -1;
        },

        hideFwaChiefSignatures: function (get) {
            return get('newFwa') || get('settings.hideSections').indexOf('ES') != -1;
        },

        hideTsWbs2: function (get) {
            return (get('settings.tsDisplayWbs2') == 'N');
        },

        hideTsWbs3: function (get) {
            return (get('settings.tsDisplayWbs3') == 'N');
        },

        hideTsDisplayClient: function (get) {
            return (get('settings.tsDisplayClient') == 'N');
        },

        hideEmployeeHrsWorkCode: function (get) {
            return (!get('settings.fwaDisplayWorkCodeInHours'));
        },

        tsIncrement: function (get) {
            if (get('settings.tsIncrement') == 15) return .25;
            if (get('settings.tsIncrement') == 30) return .5;
            return 1;
        },

        tsApproverCanModify: function (get) {
            return (get('settings.tsApproverCanModify'));
        },

        fwaHideActualHours: function (get) {
            return get('settings.fwaWorkCodeActual') == 'H';
        },

        fwaReadOnlyActualHours: function (get) {
            return get('settings.fwaWorkCodeActual') == 'R';
        },

        fwaUnitsEnabled: function (get) {
            return (get('settings.fwaUnitsEnabled') && get('settings.fwaUnitVisibility') != 'H') && get('settings.hideSections').indexOf('U') == -1;
        },

        fwaHideWorkCodes: function (get) {
            return get('settings.fwaHideWorkCodes') || get('settings.hideSections').indexOf('W') != -1;
        },

        hideWorkCodeUnitPanel: function (get) {
            return get('settings.hideSections').indexOf('U') != -1 && get('settings.hideSections').indexOf('W') != -1;
        },

        hideExpenses: function (get) {
            return get('settings.hideSections').indexOf('X') != -1;
        },

        hideClientSignature: function (get) {
            return get('settings.hideSections').indexOf('CS') != -1;
        },

        hideEmployeeSignature: function (get) {
            return get('settings.hideSections').indexOf('ES') != -1;
        },

        hideSignaturePanel: function (get) {
            return get('settings.hideSections').indexOf('ES') != -1 && get('settings.hideSections').indexOf('CS') != -1;
        },

        hideAddressDatePanel: function (get) {
            return false;// get('settings.hideSections').indexOf('ES') != -1 && get('settings.hideSections').indexOf('CS') != -1;
        },

        fwaUnitsReadOnly: function (get) {
            return get('settings.fwaUnitVisibility') == 'R';
        },

        hasUdfT1: function (get) {
            return get('settings.udf_t1_Label') != null && get('settings.udf_t1_Label') != '';
        },

        hasUdfT1AndIsScheduler: function (get) {
            return get('settings.udf_t1_Label') != null && get('settings.udf_t1_Label') != '' && (get('name') == 'Crew' || get('name') == 'Scheduler');
        },

        isFwaScheduler: function (get) {
            return (get('name') == 'Crew' || get('name') == 'Scheduler');
        },

        schedReadOnly: function (get) {
            return get('settings.schedReadOnly') || get('!settings.fwaDisplayActionsbutton');
        },

        fwaReadOnly: function (get) {
            return get('settings.fwaReadOnly');
        },

        timesheetReadOnly: function (get) {
            return get('settings.timesheetReadOnly');
        },

        crewChiefLabelWithFwaAbbrevLabel: function (get) {
            return get('settings.crewChiefLabel') + ' ' + get('settings.fwaAbbrevLabel') + ' List';
        },

        crewLabelWithFwaAbbrevLabel: function (get) {
            return get('settings.crewLabel') + ' ' + get('settings.fwaAbbrevLabel') + ' List';
        },

        fullEmpName: function (get) {
            return get('settings.empNameFirstLast');
        },

        // S(ignatures), W(ork codes), U(nits), E(mployee expenses)
        hideSignatures: function (get) {
            return get('settings.hideSections').indexOf('S') != -1;
        },

        hideWorkCodes: function (get) {
            return get('settings.hideSections').indexOf('W') != -1;
        },

        hideUnits: function (get) {
            return get('settings.hideSections').indexOf('U') != -1;
        },

        isExa: function (get) {
            return get('name') == 'EXA';
        },

        isExaAndCanEdit: function (get) {
            return get('name') == 'EXA' && get('settings.exApproverCanModify');
        },

        showCrewAssignColumn4: function (get) {
            return 4 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn5: function (get) {
            return 5 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn6: function (get) {
            return 6 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn7: function (get) {
            return 7 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn8: function (get) {
            return 8 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn9: function (get) {
            return 9 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn10: function (get) {
            return 10 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn11: function (get) {
            return 11 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn12: function (get) {
            return 12 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn13: function (get) {
            return 13 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn14: function (get) {
            return 14 > get('settings.fwaMaxCrewSize');
        },

        showCrewAssignColumn15: function (get) {
            return 15 > get('settings.fwaMaxCrewSize');
        },

        colorCreating: function () {
            return TS.app.settings.colorCreating;
        },
        colorNotAvailableForField: function () {
            return TS.app.settings.colorNotAvailableForField;
        },
        colorScheduled: function () {
            return TS.app.settings.colorScheduled;
        },
        colorSaved: function () {
            return TS.app.settings.colorSaved;
        },
        colorInProgress: function () {
            return TS.app.settings.colorInProgress;
        },
        colorProgressSavedPastDue: function () {
            return TS.app.settings.colorProgressSavedPastDue;
        },
        colorSubmitted: function () {
            return TS.app.settings.colorSubmitted;
        },
        colorApproved: function () {
            return TS.app.settings.colorApproved;
        },
        colorHoliday: function () {
            return TS.app.settings.colorHoliday;
        }

    },

    // Method for determining FWA status color based on the FWA record
    getFwaStatusColor: function (fwaRecord) {
        var color = '#DAA520', //'goldenrod';
            startDate = fwaRecord.get('schedStartDate') || fwaRecord.get('startDateTime'),
            endDate = fwaRecord.get('schedEndDate') || fwaRecord.get('endDateTime'),
            now = new Date(),
            isHoliday = Ext.getStore('HolidaySchedule').findBy(function (rec) {
                if (Ext.Date.format(new Date(rec.get('holidayDate')), DATE_FORMAT) == Ext.Date.format(new Date(startDate), DATE_FORMAT)) {
                    return rec;
                }
            });

        if (fwaRecord.get('availableForUseInField')) {
            switch (fwaRecord.get('fwaStatusId')) {
                case FwaStatus.Approved:  //approved
                    // if (isHoliday > -1)
                    //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #808080 90%, #808080 100%);'
                    // else
                    color = 'background-color:' + TS.app.settings.colorApproved; //grey
                    break;
                case FwaStatus.Submitted:  //submitted
                    // if (isHoliday > -1)
                    //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #00cd00 25%, #00cd00 50%, #00cd00 50%, #00cd00 75%, #00cd00 75%, #00cd00 100%);'
                    // else
                    color = 'background-color:' + TS.app.settings.colorSubmitted; //green
                    break;
                case FwaStatus.InProgress: //in progress
                    // if (isHoliday > -1)
                    //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #6a5acd 25%, #6a5acd 50%, #6a5acd 50%, #6a5acd 75%, #6a5acd 75%, #6a5acd 100%);'
                    // else
                    color = 'background-color:' + TS.app.settings.colorInProgress; //slateblue
                    break;
                case FwaStatus.Create: //creating
                    // if (isHoliday > -1)
                    //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, # 25%, # 50%, # 50%, # 75%, # 75%, # 100%);'
                    // else
                    color = 'background-color:' + TS.app.settings.colorCreating; //orange
                    break;
                case FwaStatus.Scheduled: //scheduled
                    // if (isHoliday > -1)
                    //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #e2da77 25%, #e2da77 50%, #00ffff 50%, #00ffff 75%, #e2da77 75%, #e2da77 100%);'
                    // else
                    color = 'background-color:' + TS.app.settings.colorScheduled;//goldenrod
                    break;
                case FwaStatus.Saved: //saved
                    // if (isHoliday > -1)
                    //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #0000FF 25%, #0000FF 50%, #0000FF 50%, #0000FF 75%, #0000FF 75%, #0000FF 100%);'
                    // else
                    color = 'background-color:' + TS.app.settings.colorSaved; //blue
                    break;
                default:
                    // if (isHoliday > -1)
                    //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #808080 25%, #808080 50%, #808080 50%, #808080 75%, #808080 75%, #808080 100%);'
                    // else
                    color = 'background-color:' + TS.app.settings.colorApproved; //grey
                    break;
            }
            //check if past due
            if (new Date(endDate) < now && (fwaRecord.get('fwaStatusId') != FwaStatus.Submitted && fwaRecord.get('fwaStatusId') != FwaStatus.Approved)) {
                // if (isHoliday > -1)
                //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #FF0000 25%, #FF0000 50%, #FF0000 50%, #FF0000 75%, #FF0000 75%, #FF0000 100%);'
                // else
                color = 'background-color:' + TS.app.settings.colorProgressSavedPastDue; //red
            }
            // if (Ext.Date.diff(startDate, now, Ext.Date.DAY) > 0  && (fwaRecord.get('fwaStatusId') != 'S' && fwaRecord.get('fwaStatusId') != 'A') ){
            //     color = '#FF0000'; //red
            // }

        } else { //Not available yet
            // if (isHoliday > -1)
            //     color = 'background-image: linear-gradient(90deg, #00ffff 10%, #FFC080 25%, #FFC080 50%, #FFC080 50%, #FFC080 75%, #FFC080 75%, #FFC080 100%);'
            // else
            color = 'background-color:' + TS.app.settings.colorNotAvailableForField //yellow/orange
        }
        return color;
    },

    showStartEndTimeByProject: function(get){
        return get('settings.displayStartEndTime') == 'P';
    },

    showStartEndTimeByDate: function(get){
        return get('settings.displayStartEndTime') == 'D';
    }

});
