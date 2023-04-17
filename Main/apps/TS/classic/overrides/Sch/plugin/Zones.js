/**
 * Created by SteveTess on 1/14/2022.
 */
Ext.define('TS.overrides.Sch.plugin.Zones', {
    override:'Sch.plugin.Zones',

    getElementData : function(viewStart, viewEnd, records, isPrint) {
        var schedulerView   = this.schedulerView,
            data            = [];
        var region          = schedulerView.getTimeSpanRegion(viewStart, viewEnd, this.expandToFitView);
        var record, spanStart, spanEnd, zoneData, width, templateData;

        records             = records || this.store.getRange();

        for (var i = 0, l = records.length; i < l; i++) {
            record       = records[i];

            //Override CHANGED FROM  record.getStartDate() TO  record.get('StartDate')
            spanStart    = record.get('StartDate');
            spanEnd      = record.get('EndDate');
            //END Override
            //test


            templateData = this.getTemplateData(record);

            if (spanStart && spanEnd && Sch.util.Date.intersectSpans(spanStart, spanEnd, viewStart, viewEnd)) {
                zoneData = Ext.apply({}, templateData);

                zoneData.id = this.getElementId(record);
                // using $cls to avoid possible conflict with "Cls" field in the record
                // `getElementCls` will append the "Cls" field value to the class
                zoneData.$cls = this.getElementCls(record, templateData);

                var mode = schedulerView.getMode();

                if (mode === 'calendar') {
                    var timeSpanRegion = schedulerView.getTimeSpanRegion(spanStart, spanEnd);

                    zoneData.left = timeSpanRegion.left;
                    zoneData.top = timeSpanRegion.top;
                    zoneData.height = timeSpanRegion.bottom - timeSpanRegion.top;
                    zoneData.width = timeSpanRegion.right - timeSpanRegion.left;
                }
                else {
                    var startPos = schedulerView.getCoordinateFromDate(Sch.util.Date.max(spanStart, viewStart));
                    var endPos = schedulerView.getCoordinateFromDate(Sch.util.Date.min(spanEnd, viewEnd));

                    if (mode === 'horizontal') {
                        zoneData.left = startPos;
                        zoneData.top = region.top;

                        zoneData.width = isPrint ? 0 : endPos - startPos;

                        zoneData.style = isPrint ? ('border-left-width:' + (endPos - startPos) + 'px') : "";
                    } else {
                        zoneData.left = region.left;
                        zoneData.top = startPos;

                        zoneData.height = isPrint ? 0 : endPos - startPos;

                        zoneData.style = isPrint ? ('border-top-width:' + (endPos - startPos) + 'px') : "";
                    }
                }

                data.push(zoneData);
            }
        }
        return data;
    },

});