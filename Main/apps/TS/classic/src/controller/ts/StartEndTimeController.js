Ext.define('TS.controller.ts.StartEndTimeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-startendtime',

    init: function () {
        var me = this,
            settings = TS.app.settings,
            record = me.getView().tsRowRecord,
            startEndTimes = record.get('startEndTimes') || [],
            vm = me.getViewModel(),
            vw = me.getView(),
            selectedDate = vw.workDate,
            dayCount = Ext.Date.diff(record.get('startDate'), record.get('endDate'), Ext.Date.DAY) + 1,
            workDate;

        if (settings.empId != record.get('empId') && !settings.tsCanEnterCrewMemberTime && !vm.get('isTimesheetApproval')) {
            me.setFormReadOnly();
        }

        if (vm.get('isTimesheetApproval') && !vm.get('tsApproverCanModify')) {
            me.setFormReadOnly();
        }

        workDate = Ext.Array.findBy(startEndTimes, function (item) {
            if (Ext.Date.format(item.workDate, DATE_FORMAT) === Ext.Date.format(new Date(selectedDate), DATE_FORMAT))
                return true;
        })

        me.lookup('startEndTimesForm').getForm().setValues({
            //Set all form values according to existing data in cell
            startTime: workDate.startTime,
            endTime: workDate.endTime,
            workDate: workDate.workDate,
            empId: workDate.empId
        });
    },

    saveStartEndTime: function (obj) {
        var me = this,
            bob = '',
            settings = TS.app.settings,
            record = me.getView().tsRowRecord,
            workDate = me.getView().workDate,
            startEndTimes = me.lookup('startEndTimesForm').getForm().getValues(),
            timesForm = Ext.Array.findBy(record.get('startEndTimes'), function (item) {
                if (Ext.Date.format(new Date(item.workDate), DATE_FORMAT) === Ext.Date.format(new Date(workDate), DATE_FORMAT))
                    return true;
            });

        if (startEndTimes.startTime > startEndTimes.endTime) {
            bob = Ext.Msg.alert('Warning', 'Start Time must be < End Time');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
            //return;
        } else if (!startEndTimes.startTime || !startEndTimes.endTime) {
            bob = Ext.Msg.alert('Warning', 'Both Start Time and End Time are required fields.');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
            //return;
        } else if (startEndTimes.startTime === startEndTimes.endTime) {
            bob = Ext.Msg.alert('Warning', 'Start Time and End Time cannot equal each other.');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
        } else {
            timesForm.startTime = startEndTimes.startTime;
            timesForm.endTime = startEndTimes.endTime;
            Ext.first('#startEndPopoup').close();
        }
    },

    cancelStartEndTime: function () {
        Ext.first('#startEndPopoup').close();
    }

});
