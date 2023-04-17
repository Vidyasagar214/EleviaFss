Ext.define('TS.common.MyTimeAxis', {
    extend: 'Sch.data.TimeAxis',
    continuous: false,

    generateTicks: function (start, end, unit, increment) {
        // Use our own custom time intervals for day time-axis
        if (unit === Sch.util.Date.DAY) {
            var startTime = this.paramStart.getHours(),
                endTime = this.paramEnd.getHours(),
                ticks = [],
                intervalEnd;
            while (start < end) {
                start.setHours(startTime);
                intervalEnd = Sch.util.Date.add(start, Sch.util.Date.HOUR, (endTime - startTime));
                ticks.push({
                    start: start,
                    end: intervalEnd
                });
                start = Sch.util.Date.add(start, Sch.util.Date.DAY, 1);
            }
            return ticks;
        } else {
            return this.callParent(arguments);
        }
    }
});
