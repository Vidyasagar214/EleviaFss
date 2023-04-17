Ext.define('TS.common.picker.Time', {
    extend: 'Ext.picker.Picker',
    requires: ['Ext.util.InputBlocker'],

    isPicker: true,

    enableAMPM: false,

    originalDate: null,

    /**
     * @event change
     * Fired when the value of this picker has changed and the done button is pressed.
     * @param {Ext.picker.Date} this This Picker
     * @param {Date} value The date value
     */

    config: {
        /**
         * @cfg {String} minuteText
         * The label to show for the minute column. Defaults to 'Minute'.
         */
        minuteText: 'Minute',

        /**
         * @cfg {String} hourText
         * The label to show for the hour column. Defaults to 'Hour'.
         */
        hourText: 'Hour',

        /**
         * @cfg {String} ampmText
         * The label to show for daytime column. Defaults to 'AM / PM'.
         */
        ampmText: 'AM / PM',

        slotOrder: [],

        useTitles: true,

        /**
         * @cfg {String/Mixed} doneButton
         * Can be either:
         *
         * - A {String} text to be used on the Done button.
         * - An {Object} as config for {@link Ext.Button}.
         * - `false` or `null` to hide it.
         * @accessor
         */
        doneButton: true
    },

    /**
     * @private
     */
    constructor: function () {
        this.callParent(arguments);
        this.createSlots();
    },

    createSlots: function () {
        var me = this,
            settings = TS.app.settings,
            increment = settings.schedTimeAxisGranularity,
            ampmSlots = ['hour', 'minute', 'daytime'],
            zuluSlots = ['hour', 'minute'],
            hours = [],
            minutes = [],
            daytime = [],
            slots = [],
            i;

        for (i = 0; i < 60; i += increment) {
            minutes.push({
                text: i < 10 ? '0' + i : i,
                value: i
            });
        }

        if (me.enableAMPM) {
            me.setSlotOrder(ampmSlots);

            for (i = 1; i <= 12; i++) {
                hours.push({
                    text: i,
                    value: i
                });
            }

            daytime.push({text: 'AM', value: 'AM'});
            daytime.push({text: 'PM', value: 'PM'});

            ampmSlots.forEach(function (item) {
                slots.push(me.createSlot(item, hours, minutes, daytime));
            }, me);

        } else {
            me.setSlotOrder(zuluSlots);

            for (i = 0; i <= 23; i++) {
                hours.push({
                    text: i,
                    value: i
                });
            }

            zuluSlots.forEach(function (item) {
                slots.push(me.createSlot(item, hours, minutes));
            }, me);
        }

        me.setSlots(slots);
    },

    createSlot: function (name, hours, minutes, daytime) {
        var useTitles = this.getUseTitles();

        switch (name) {
            case 'hour':
                return {
                    name: 'hour',
                    align: 'center',
                    data: hours,
                    title: useTitles ? this.getHourText() : false,
                    flex: 2
                };
            case 'minute':
                return {
                    name: 'minute',
                    align: 'center',
                    data: minutes,
                    title: useTitles ? this.getMinuteText() : false,
                    flex: 2
                };
            case 'daytime':
                return {
                    name: 'daytime',
                    align: 'center',
                    data: daytime,
                    title: useTitles ? this.getAmpmText() : false,
                    flex: 2
                };
        }
    },

    setValue: function (value, animated) {
        var me = this,
            hour,
            minutePosition;

        if (!value) {
            value = new Date();
        }

        if (Ext.isDate(value)) {
            //preserve original date
            me.originalDate = value;

            value = {
                hour: value.getHours(),
                minute: Math.floor(value.getMinutes() / 5) * 5, // Round down to closest 5 minutes so we can set correct slot
                daytime: value.getHours() >= 12 ? 'PM' : 'AM'
            };

            if (me.enableAMPM) {
                if (value.hour === 0 && value.daytime === 'AM') {
                    value.hour = 12;
                }

                if (value.hour > 12) {
                    value.hour -= 12;
                }
            }

        } else if (typeof value === 'string') {
            value = value.trim();
            minutePosition = value.indexOf(':');
            hour = value.substring(0, minutePosition);

            if (me.enableAMPM) {
                value = {
                    hour: hour,
                    minute: Math.floor(value.substring(minutePosition + 1, value.indexOf(' ')) / 5) * 5,
                    daytime: hour >= 12 ? 'PM' : 'AM'
                }
            } else {
                value = {
                    hour: hour,
                    minute: value.substring(minutePosition + 1)
                }
            }
        }

        me.callParent([value, animated]);
        me.onSlotPick();
    },

    getValue: function (useDom) {
        var me = this,
            values = {},
            items = me.getItems().items,
            ln = items.length,
            item, i, hour, minute,
            //Adjust day, month and year
            returnDate = new Date(me.originalDate ? me.originalDate : '');

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }

        hour = values.hour;

        if (me.enableAMPM) {
            if (values.daytime === 'PM' && hour < 12) {
                hour += 12;
            } else if (values.daytime === 'AM' && hour === 12) {
                hour = 0;
            }
        }

        returnDate.setHours(hour);
        returnDate.setMinutes(values.minute);

        return returnDate;
    },

    onDoneButtonTap: function () {
        var me = this,
            oldValue = me._value,
            newValue = me.getValue(true),
            testValue = newValue;

        if (Ext.isDate(newValue)) {
            testValue = newValue.toDateString();
        }
        if (Ext.isDate(oldValue)) {
            oldValue = oldValue.toDateString();
        }

        if (testValue != oldValue) {
            me.fireEvent('change', me, newValue);
        }

        me.hide();
        Ext.util.InputBlocker.unblockInputs();
    }
});
