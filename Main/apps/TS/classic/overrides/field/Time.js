/**
 * Created by steve.tess on 5/23/2017.
 */
Ext.define('TS.overrides.field.Time', {
    override:'Ext.picker.Time',

    statics: {
        /**
         * @private
         * Creates the internal {@link Ext.data.Store} that contains the available times. The store
         * is loaded with all possible times, and it is later filtered to hide those times outside
         * the minValue/maxValue.
         */
        createStore: function(format, increment) {
            var dateUtil = Ext.Date,
                clearTime = dateUtil.clearTime,
                initDate = this.prototype.initDate,
                times = [],
                min = clearTime(new Date(initDate[0], initDate[1], initDate[2])),
                max = dateUtil.add(clearTime(new Date(initDate[0], initDate[1], initDate[2])), 'mi', (24 * 60) - 1);

            while(min <= max){
                times.push({
                    disp: dateUtil.dateFormat(min, format),
                    date: min
                });                           // user configuration value for minute increments
                min = dateUtil.add(min, 'mi', TS.app.settings.schedTimeAxisGranularity);
            }

            return new Ext.data.Store({
                model: Ext.picker.Time.prototype.modelType,
                data: times
            });
        }
    }
});