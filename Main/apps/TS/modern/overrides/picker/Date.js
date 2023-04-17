//https://sencha.jira.com/browse/EXTJS-20651
//DatePicker should preserve time when initialized with value
Ext.define('TS.overrides.picker.Date', {
    override: 'Ext.picker.Date',

    setValue: function (value, animated) {
        //https://sencha.jira.com/browse/EXTJS-20654
        //Datepicker should set today's date when no initial value is provided
        if (!value) {
            value = new Date();
        }

        if (Ext.isDate(value)) {
            value = {
                day: value.getDate(),
                month: value.getMonth() + 1,
                year: value.getFullYear(),
                hours: value.getHours(),
                minutes: value.getMinutes()
            };
            this.preservedDate = value;
        }

        this.callParent([value, animated]);
        this.onSlotPick();
    },

    getValue: function (useDom) {
        var values = {},
            items = this.getItems().items,
            ln = items.length,
            daysInMonth, day, month, year, item, i,
            minutes = 0, hours = 0;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }

        //if all the slots return null, we should not return a date
        if (values.year === null && values.month === null && values.day === null) {
            return null;
        }

        year = Ext.isNumber(values.year) ? values.year : 1;
        month = Ext.isNumber(values.month) ? values.month : 1;
        day = Ext.isNumber(values.day) ? values.day : 1;

        if (month && year && month && day) {
            daysInMonth = this.getDaysInMonth(month, year);
        }
        day = (daysInMonth) ? Math.min(day, daysInMonth) : day;

        if (this.preservedDate) {
            minutes = this.preservedDate.minutes;
            hours = this.preservedDate.hours;
        }
        return new Date(year, month - 1, day, hours, minutes);
    }
});