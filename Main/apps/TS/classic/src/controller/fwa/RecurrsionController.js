/**
 * Created by steve.tess on 1/27/2017.
 */
Ext.define('TS.controller.fwa.RecurrsionController', {
    extend: 'TS.view.main.MainController',

    alias: 'controller.recurrsion',

    listen: {
        global: {
            'ReloadRecurrence': 'onOkayRecurrence'
        }
    },

    requires: [
        'TS.model.fwa.RecurrenceConfig'
    ],

    init: function () {
        var me = this,
            vw = me.getView(),
            fwa = vw.fwaRecord,
            record = vw.fwaRecord.get('recurrenceConfig'),
            formRecord = Ext.first('#fwaForm').getRecord(),
            startDate,
            untilDate;
        Ext.first('#recurStartTime').setValue(fwa.get('schedStartDate'));
        Ext.first('#recurEndTime').setValue(fwa.get('schedEndDate'));

        if (record) {
            if (record.freq == 'DAILY') {
                Ext.first('#rDailyFreq').setValue(true);
                if (record.interval != 0 && !record.everyWeekday) {
                    vw.lookup('rEveryDay').setValue(true);
                    vw.lookup('rDailyInterval').setValue(record.interval);
                } else {
                    vw.lookup('rEveryWeekday').setValue(record.everyWeekday);
                }
            } else if (record.freq == 'WEEKLY') {
                Ext.first('#rWeeklyFreq').setValue(true);
                //check boxes
                if (record.interval != 0) {
                    vw.lookup('rWeeklyInterval').setValue(record.interval);
                }
                Ext.first('#cbMon').setValue(record.monday);
                Ext.first('#cbTue').setValue(record.tuesday);
                Ext.first('#cbWed').setValue(record.wednesday);
                Ext.first('#cbThu').setValue(record.thursday);
                Ext.first('#cbFri').setValue(record.friday);
                Ext.first('#cbSat').setValue(record.saturday);
                Ext.first('#cbSun').setValue(record.sunday);
            } else if (record.freq == 'MONTHLY') {
                Ext.first('#rMonthlyFreq').setValue(true);
                if (record.interval != 0 && record.dayNum != 0) {
                    Ext.first('#rMonthlyDay').setValue(true);
                    Ext.first('#mlyDayNumber').setValue(record.dayNum);
                    Ext.first('#rMonthlyInterval').setValue(record.interval);
                } else {
                    Ext.first('#rMonthlySequence').setValue(true);
                    vw.lookup('monthDaySequence').setValue(record.dayOccurrence);
                    vw.lookup('monthWeekdaySequence').setValue(record.dayOfWeek);
                    vw.lookup('rMonthlyInterval2').setValue(record.interval);
                }
            }
            //range of recurrence
            //startDate = Ext.Date.format(new Date(new Date(record.startDate).getUTCMonth() + 1 + '/' + new Date(record.startDate).getUTCDate() + '/' + new Date(record.startDate).getUTCFullYear()), DATE_FORMAT);
            vw.lookup('rangeRecurrenceStartDate').setValue(Ext.Date.format(new Date(record.startDate), DATE_FORMAT));
            if (record.noEndDate) {
                Ext.first('#rNoEndDate').setValue(true);
                Ext.first('#endAfterCheckBox').setValue(false);
                vw.lookup('endByCheckBox').setValue(false);
                Ext.first('#rRangeOccurences').setValue('');
                vw.lookup('rangeRecurrenceEndByDate').setValue('');
            } else if (record.count > 0) {
                record.until = '9999-12-31T23:59:59.9999999';
                Ext.first('#rNoEndDate').setValue(false);
                Ext.first('#endAfterCheckBox').setValue(true);
                vw.lookup('endByCheckBox').setValue(false);
                Ext.first('#rRangeOccurences').setValue(record.count);
                vw.lookup('rangeRecurrenceEndByDate').setValue('');
            } else {
                vw.lookup('endByCheckBox').setValue(true);
                Ext.first('#rRangeOccurences').setValue('');
                vw.lookup('rangeRecurrenceEndByDate').setValue(Ext.Date.format(new Date(record.until), DATE_FORMAT));
                Ext.first('#rangeRecurrenceEndByDate').setValue(Ext.Date.format(new Date(record.until), DATE_FORMAT));
            }
        } else {
            Ext.first('#rDailyFreq').setValue(true);
            vw.fwaRecord.set('recurrenceConfig', Ext.create('TS.model.fwa.RecurrenceConfig'));
            vw.fwaRecord.get('recurrenceConfig').set('addlDates', []);
            vw.fwaRecord.get('recurrenceConfig').set('exceptDates', []);
            me.setDailyDefault();
            me.setRangeRecurrenceDefault();
        }

        formRecord.recurrenceIsDirty = false;
    },

    onRecurrencePatternChange: function (obj, newValue, oldValue, eOpts) {
        var me = this,
            vw = me.getView();

        if (obj.itemId == 'rDailyFreq' && newValue == true) {
            vw.lookup('dailyFieldset').setHidden(false);
            vw.lookup('weeklyFieldset').setHidden(true);
            vw.lookup('monthlyFieldset').setHidden(true);
            me.clearWeekly();
            me.clearMonthly();
            me.setDailyDefault();
        } else if (obj.itemId == 'rWeeklyFreq' && newValue == true) {
            vw.lookup('dailyFieldset').setHidden(true);
            vw.lookup('weeklyFieldset').setHidden(false);
            vw.lookup('monthlyFieldset').setHidden(true);
            me.clearDaily();
            me.clearMonthly();
            me.setWeeklyDefault();
        } else if (obj.itemId == 'rMonthlyFreq' && newValue == true) {
            vw.lookup('dailyFieldset').setHidden(true);
            vw.lookup('weeklyFieldset').setHidden(true);
            vw.lookup('monthlyFieldset').setHidden(false);
            me.clearDaily();
            me.clearWeekly();
            me.setMonthlyDefault();
        }
        //clear range of recurrence
        vw.lookup('rangeRecurrenceStartDate').setValue('');
        Ext.first('#rNoEndDate').setValue(false);
        vw.lookup('endByCheckBox').setValue(false);
        Ext.first('#endAfterCheckBox').setValue(false);
        Ext.first('#rRangeOccurences').setValue('');
        vw.lookup('rangeRecurrenceEndByDate').setValue('');
        me.setRangeRecurrenceDefault();
    },

    clearDaily: function () {
        var me = this,
            vw = me.getView();
        vw.lookup('rEveryDay').setValue(false);
        vw.lookup('rDailyInterval').setValue('');
        vw.lookup('rEveryWeekday').setValue(false);
    },

    clearWeekly: function () {
        var me = this,
            vw = me.getView();
        vw.lookup('rWeeklyInterval').setValue('');
        Ext.first('#cbMon').setValue(false);
        Ext.first('#cbTue').setValue(false);
        Ext.first('#cbWed').setValue(false);
        Ext.first('#cbThu').setValue(false);
        Ext.first('#cbFri').setValue(false);
        Ext.first('#cbSat').setValue(false);
        Ext.first('#cbSun').setValue(false);
    },

    clearMonthly: function () {
        var me = this,
            vw = me.getView();
        Ext.first('#rMonthlyDay').setValue(false);
        Ext.first('#mlyDayNumber').setValue('');
        Ext.first('#rMonthlyInterval').setValue('');
        vw.lookup('monthDaySequence').setValue('');
        vw.lookup('monthWeekdaySequence').setValue('');
    },

    setDailyDefault: function () {
        var me = this,
            vw = me.getView();
        vw.lookup('rDailyInterval').setValue(1);
        vw.lookup('rEveryDay').setValue(true);
    },

    setWeeklyDefault: function () {
        var me = this,
            vw = me.getView(),
            today = new Date();
        vw.lookup('rWeeklyInterval').setValue(1);
        switch (today.getDay()) {
            case 0:
                Ext.first('#cbSun').setValue(true);
                break;
            case 1:
                Ext.first('#cbMon').setValue(true);
                break;
            case 2:
                Ext.first('#cbTue').setValue(true);
                break;
            case 3:
                Ext.first('#cbWed').setValue(true);
                break;
            case 4:
                Ext.first('#cbThu').setValue(true);
                break;
            case 5:
                Ext.first('#cbFri').setValue(true);
                break;
            case 6:
                Ext.first('#cbSat').setValue(true);
                break;
        }
    },

    setMonthlyDefault: function () {
        var me = this,
            vw = me.getView(),
            today = new Date();
        Ext.first('#rMonthlyDay').setValue(true);
        Ext.first('#mlyDayNumber').setValue(today.getDate());
        Ext.first('#rMonthlyInterval').setValue(1);
    },

    setRangeRecurrenceDefault: function () {
        var me = this,
            vw = me.getView();
        //if existing start date; use it in case making a non-recurring to a recurring
        if (vw.fwaStartDate) {
            vw.lookup('rangeRecurrenceStartDate').setValue(Ext.Date.format(new Date(vw.fwaStartDate), 'l ' + DATE_FORMAT));
        } else {
            vw.lookup('rangeRecurrenceStartDate').setValue(Ext.Date.format(new Date(), 'l ' + DATE_FORMAT));
        }

        Ext.first('#endAfterCheckBox').setValue(true);
        Ext.first('#rRangeOccurences').setValue(2);
    },

    onOkayRecurrence: function () {
        var me = this,
            vw = me.getView(),
            fwa = vw.fwaRecord,
            fwaRecord = vw.fwaRecord.get('recurrenceConfig'),
            formRecord = Ext.first('#fwaForm').getRecord(),
            addlArray = [],
            exceptArray = [],
            record = Ext.create('TS.model.fwa.RecurrenceConfig');

        if (me.checkRequiredFields()) {
            Ext.each(fwaRecord.addlDates, function (dt) {
                addlArray.push(dt);
            });
            Ext.each(fwaRecord.exceptDates, function (dt) {
                exceptArray.push(dt);
            });
            record.set('addlDates', addlArray);
            record.set('exceptDates', exceptArray);
            record.set('recurStart', vw.lookup('recurStart').getRawValue());
            record.set('recurEnd', vw.lookup('recurEnd').getRawValue());
            if (Ext.first('#rDailyFreq').getValue()) {
                record.set('freq', 'DAILY');
                record.set('interval', !vw.lookup('rDailyInterval').getValue() ? 0 : vw.lookup('rDailyInterval').getValue());
            } else if (Ext.first('#rWeeklyFreq').getValue()) {
                record.set('freq', 'WEEKLY');
                record.set('interval', vw.lookup('rWeeklyInterval').getValue());
            } else if (Ext.first('#rMonthlyFreq').getValue()) {
                record.set('freq', 'MONTHLY');
                if (vw.lookup('rMonthlyInterval').getValue() == null) {
                    record.set('interval', vw.lookup('rMonthlyInterval2').getValue());
                } else {
                    record.set('interval', vw.lookup('rMonthlyInterval').getValue());
                }
            }
            //daily
            record.set('everyWeekday', vw.lookup('rEveryWeekday').getValue());
            //weekly
            record.set('monday', Ext.first('#cbMon').getValue());
            record.set('tuesday', Ext.first('#cbTue').getValue());
            record.set('wednesday', Ext.first('#cbWed').getValue());
            record.set('thursday', Ext.first('#cbThu').getValue());
            record.set('friday', Ext.first('#cbFri').getValue());
            record.set('saturday', Ext.first('#cbSat').getValue());
            record.set('sunday', Ext.first('#cbSun').getValue());
            //monthly
            record.set('dayNum', !Ext.first('#mlyDayNumber').getValue() ? 0 : Ext.first('#mlyDayNumber').getValue());
            record.set('dayOccurrence', !vw.lookup('monthDaySequence').getValue() ? 0 : vw.lookup('monthDaySequence').getValue());
            record.set('dayOfWeek', !vw.lookup('monthWeekdaySequence').getValue() ? '' : vw.lookup('monthWeekdaySequence').getValue());
            //range of recurrence
            record.set('startDate', vw.lookup('rangeRecurrenceStartDate').getValue());
            record.set('noEndDate', Ext.first('#rNoEndDate').getValue());
            record.set('count', !Ext.first('#rRangeOccurences').getValue() ? 0 : Ext.first('#rRangeOccurences').getValue());
            record.set('until', !vw.lookup('rangeRecurrenceEndByDate').getValue() ? Ext.Date.format(new Date('12/31/2050'), DATE_FORMAT) : vw.lookup('rangeRecurrenceEndByDate').getValue());
            //Ext.Date.format(new Date(vw.lookup('rangeRecurrenceEndByDate').getValue()), DATE_FORMAT));
            record.set('duration', Ext.first('#recurDuration').getValue());

            //Check number of days - must be greater than 1
            if (record.get('count') == 1 || Ext.Date.diff(record.get('startDate'), record.get('until'), Ext.Date.DAY) == 0) {
                Ext.Msg.alert('Warning', 'A Recurrence cannot be only for one(1) day. Please revise.');
                return;
            }

            formRecord.set('recurrenceConfig', record.data);
            //get end date
            Fwa.GetRecurrenceEndDate(record.data, function (response) {
                //set form values
                formRecord.set('schedStartDate', new Date(Ext.Date.format(new Date(record.get('startDate')), DATE_FORMAT) + ' ' + record.get('recurStart')));
                formRecord.set('schedEndDate', new Date(Ext.Date.format(new Date(response.data), DATE_FORMAT) + ' ' + record.get('recurEnd')));
                //update form combo boxes
                Ext.first('#schedStartDateField').setValue(record.get('startDate'));
                Ext.first('#schedStartTimeField').setValue(record.get('recurStart'));
                Ext.first('#schedEndDateField').setValue(new Date(response.data));
                Ext.first('#schedEndTimeField').setValue(record.get('recurEnd'));
                Ext.first('fieldset-datetime').setTitle('Dates & Times (*recurring)');
                Ext.first('#recurDurationDate').setValue(record.get('duration'));

                Ext.first('#fwaDayCount').setValue(Ext.Date.diff(new Date(record.get('startDate')), new Date(response.data), Ext.Date.DAY));
            }, this, {
                autoHandle: true
            });
            //close window
            Ext.first('window-recurrsions').close();

        }
    },

    onCancelRecurrence: function () {
        var fwa = Ext.first('#fwaForm').getRecord();
        if (fwa.get('recurrenceConfig').dirty) {
            fwa.set('recurrenceConfig', null);
        }
        Ext.first('window-recurrsions').close();
    },

    hasEmpHours: function (fwaHours) {
        var hasHours = false;
        Ext.each(fwaHours, function (hrs) {
            if (hrs.get('ovt2Hrs') + hrs.get('ovtHrs') + hrs.get('regHrs') + hrs.get('travelHrs') > 0) {
                hasHours = true;
            }
        });
        return hasHours;
    },

    hasFwaUnits: function (units) {
        var hasUnits = false;
        Ext.each(units, function (unit) {
            if (unit.get('quantity') > 0) {
                hasUnits = true;
            }
        });
        return hasUnits;
    },

    onRemoveRecurrence: function () {
        var me = this,
            fwa = Ext.first('#fwaForm').getRecord(),
            hasUnits = me.hasFwaUnits(fwa.get('units').getRange()), //fwa.get('units').getData().autoSource.length > 0,
            hasHours = me.hasEmpHours(fwa.get('hours').getRange()), // fwa.get('hours').data.items.length > 0,
            msg = !hasUnits && !hasHours ? '' : 'Labor and or Units have already been assigned to multiple days. ';

        if (hasUnits || hasHours) {
            Ext.Msg.alert('Warning', 'Recurrence cannot be removed because Labor and or Units have already been assigned to multiple days. ');
            return;
        } else {
            Ext.Msg.confirm('Please Confirm', 'Are you sure you want to remove the recurrence for ' + fwa.get('fwaName') + '? ' + msg, function (btn) {
                if (btn == 'yes') {
                    fwa.set('recurrenceConfig', null);
                    fwa.set('recurrencePattern', '');
                    fwa.set('schedEndDate', fwa.get('schedStartDate'));// + ' ' + Ext.Date.format(Ext.first('#schedEndTimeField').getValue(), 'H:i A')));
                    Ext.first('#schedEndDateField').setValue(fwa.get('schedEndDate'));
                    Ext.first('fieldset-datetime').setTitle('Dates & Times');
                    Ext.first('window-recurrsions').close();
                    Ext.first('#crewButton').setDisabled(false);
                    Ext.first('#fwaDayCount').setValue(1);
                }
            }, this);
        }
    },

    onTimeChange: function (t, newValue, oldValue, eOpts) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            start = Ext.first('#recurStartTime'),
            end = Ext.first('#recurEndTime'),
            duration = Ext.first('#recurDuration'),
            formRecord = Ext.first('#fwaForm').getRecord(),
            tomorrowDate = '',
            currDiff,
            diff;

        if (t.reference != 'recurDuration') {
            if (start.getValue() && end.getValue()) {
                if (start.getValue() > end.getValue()) {
                    tomorrowDate = Ext.Date.add(new Date(end.getValue()), Ext.Date.DAY, 1);
                    diff = (tomorrowDate - start.getValue()) / 1000 / 60;
                    duration.setValue(diff / 60);
                } else {
                    diff = (end.getValue() - start.getValue()) / 1000 / 60; //Ext.Date.diff(new Date(start.getValue()), new Date(end.getValue()), 'h');
                    if (diff > 0) {
                        duration.setValue(diff > 720 ? '' : diff / 60);
                    } else {
                        diff = diff * -1;
                        duration.setValue(diff / 60);
                    }
                }
            }
        } else {
            if (duration.getValue() && start.getValue() > end.getValue()) { //duration.getValue() > 12 &&
                if (start.getValue() > end.getValue()) {

                    diff = duration.getValue();
                    if (diff > 24) {
                        duration.setValue(diff / 60);
                        end.setValue(Ext.Date.add(new Date(start.getValue()), Ext.Date.HOUR, diff / 60));
                    } else {
                        duration.setValue(diff);
                        end.setValue(Ext.Date.add(new Date(start.getValue()), Ext.Date.HOUR, diff));
                    }
                }
            } else if (duration.getValue() > 0 && start.getValue() < end.getValue()) {
                diff = duration.getValue();
                if (diff > 24)
                    end.setValue(Ext.Date.add(new Date(start.getValue()), Ext.Date.HOUR, diff / 60));
                else
                    end.setValue(Ext.Date.add(new Date(start.getValue()), Ext.Date.HOUR, diff));
            }
        }
        if (t.name == 'recurStart') {
            vw.lookup('recurEnd').setValue(Ext.Date.add(new Date(t.getValue()), Ext.Date.HOUR, 1));
        }
        formRecord.recurrenceIsDirty = true;
    },

    onDailyRecurrenceChange: function () {
        var me = this,
            formRecord = Ext.first('#fwaForm').getRecord(),
            vw = me.getView();

        if (vw.lookup('rEveryWeekday').getValue()) {
            vw.lookup('rDailyInterval').setValue('');
        }

        formRecord.recurrenceIsDirty = true;
    },

    onMonthlyRecurrenceChange: function () {
        var me = this,
            vw = me.getView(),
            formRecord = Ext.first('#fwaForm').getRecord();

        if (vw.lookup('rMonthlySequence').getValue()) {
            vw.lookup('mlyDayNumber').setValue('');
            vw.lookup('rMonthlyInterval').setValue('');
        } else {
            vw.lookup('monthDaySequence').setValue('');
            vw.lookup('monthWeekdaySequence').setValue('');
            vw.lookup('rMonthlyInterval2').setValue('');
        }

        formRecord.recurrenceIsDirty = true;
    },

    onRangeRecurrenceChange: function () {
        var me = this,
            vw = me.getView(),
            formRecord = Ext.first('#fwaForm').getRecord();

        if (vw.lookup('endByCheckBox') && vw.lookup('endByCheckBox').getValue()) {
            vw.lookup('rRangeOccurences').setValue('');
            vw.lookup('rangeRecurrenceEndByDate').setDisabled(false);
            vw.lookup('rRangeOccurences').setDisabled(true);
        } else if(vw.lookup('rNoEndDate') && vw.lookup('rNoEndDate').getValue() ){
            vw.lookup('rRangeOccurences').setValue('');
            vw.lookup('rRangeOccurences').setDisabled(true);
            vw.lookup('rangeRecurrenceEndByDate').setValue('');
            vw.lookup('rangeRecurrenceEndByDate').setDisabled(true);
        } else if(vw.lookup('endAfterCheckBox') && vw.lookup('endAfterCheckBox').getValue()){
            vw.lookup('rangeRecurrenceEndByDate').setDisabled(true);
            vw.lookup('rRangeOccurences').setDisabled(false);
            vw.lookup('rangeRecurrenceEndByDate').setValue('');
        }
        formRecord.recurrenceIsDirty = true;
    },

    onRangeRecurrenceDateChange: function () {
        var me = this,
            vw = me.getView(),
            formRecord = Ext.first('#fwaForm').getRecord();
        if (vw.lookup('rangeRecurrenceEndByDate').getValue()) {
            vw.lookup('endByCheckBox').setValue(true);
            vw.lookup('rRangeOccurences').setValue('');
        }
        formRecord.recurrenceIsDirty = true;

    },

    setEndByRadioButton: function () {
        var me = this,
            vw = me.getView();
        vw.lookup('endByCheckBox').setValue(true);
        Ext.getCmp('OKbutton').focus(false, 200);
    },

    checkRequiredFields: function () {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            msg = '';
        if (vw.lookup('recurStart').getRawValue() == '') {
            msg += settings.fwaAbbrevLabel + ' Recurrence: "Start Time [time]"</br>';
        }

        if (vw.lookup('recurEnd').getRawValue() == '') {
            msg += settings.fwaAbbrevLabel + ' Recurrence: "End Time [time]"</br>';
        }

        if (vw.lookup('rDailyFreq').getValue()) {
            if (vw.lookup('rEveryDay').getValue() && !vw.lookup('rDailyInterval').getValue()) {
                msg += 'Daily Recurrence Pattern: "Every [n] day(s)"</br>';
            }
        } else if (vw.lookup('rWeeklyFreq').getValue()) {
            if (!vw.lookup('rWeeklyInterval').getValue() || !vw.lookup('rWeeklyInterval').getValue()) {
                msg += 'Weekly Recurrence Pattern: "Recur every [n] week(s) on"</br>';
            }
            if (!vw.lookup('cbSun').getValue() && !vw.lookup('cbMon').getValue() && !vw.lookup('cbTue').getValue() &&
                !vw.lookup('cbWed').getValue() && !vw.lookup('cbThu').getValue() && !vw.lookup('cbFri').getValue() &&
                !vw.lookup('cbSat').getValue()) {
                msg += 'Weekly Recurrence Pattern: Selection of days (Sunday, Monday, etc.)</br>';

            }
        } else { // Monthly Frequency
            if (vw.lookup('rMonthlyDay').getValue()) {
                if ((!vw.lookup('mlyDayNumber').getValue() || !vw.lookup('mlyDayNumber').getValue()) ||
                    (!vw.lookup('rMonthlyInterval').getValue() || !vw.lookup('rMonthlyInterval').getValue())) {
                    msg += 'Monthly Recurrence Pattern: "Day [n]" or "of every [n] month(s)"</br>';
                }
            } else {
                if (!vw.lookup('monthDaySequence').getValue() ||
                    !vw.lookup('monthWeekdaySequence').getValue() ||
                    (!vw.lookup('rMonthlyInterval2').getValue() || !vw.lookup('rMonthlyInterval2').getValue())) {
                    msg += 'Monthly Recurrence Pattern: " The" instance, day or "[n] of every month(s)"</br>';
                }
            }
        }

        if (vw.lookup('rangeRecurrenceStartDate').getRawValue() == '') {
            msg += 'Range of Recurrence: "Start" [date]</br>';
        }
        if (vw.lookup('endAfterCheckBox').getValue()) {
            if (!vw.lookup('rRangeOccurences').getValue() || !vw.lookup('rRangeOccurences').getValue()) {
                msg += 'Range of Recurrence: "End after [n] occurrence(s)</br>';
            }
        } else if (vw.lookup('endByCheckBox').getValue()) {
            if (vw.lookup('rangeRecurrenceEndByDate').getRawValue() == '') {
                msg += 'Range of Recurrence: "End by" [date]</br>';
            }
        }

        if (msg) {
            msg += '</br>Please correct or cancel recurrence.'
            Ext.Msg.alert('Missing required fields', msg);
            return false
        } else {
            return true;
        }
    },

    onEditRecurrenceDates: function () {
        var me = this,
            vw = me.getView(),
            fwa = vw.fwaRecord,
            formRecord = Ext.first('#fwaForm').getRecord(),
            recurrsionDates;

        if (me.recurrsionDates) {
            me.recurrsionDates.close();
        }

        me.recurrsionDates = Ext.create('TS.view.fwa.RecurrenceDates', {
            modal: true,
            fwa: fwa
        });

        me.recurrsionDates.show();
        formRecord.recurrenceIsDirty = true;
    },


    onDateChange: function (component, newValue, oldValue) {
        var me = this,
            vw = me.getView(),
            formRecord = Ext.first('#fwaForm').getRecord(),
            lastApprovedDate = formRecord.get('lastApprovedDate');
        if (!oldValue) { // || !lastApprovedDate || lastApprovedDate == 'Mon Jan 01 0001 00:00:00 GMT-0600 (Central Standard Time)'
            return;
        }
        if (formRecord.get('fwaStatusId') != FwaStatus.Create)
            Ext.Msg.alert('Warning', 'Changing the start date could result in records being lost, but not hours and units saved.');
        formRecord.recurrenceIsDirty = true;
    },

    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    onChange: function (component, newValue, oldValue) {
        var me = this,
            vw = me.getView(),
            formRecord = Ext.first('#fwaForm').getRecord();
        //vw.lookup('endAfterCheckBox').setValue(true);
        formRecord.recurrenceIsDirty = true;
    }

});