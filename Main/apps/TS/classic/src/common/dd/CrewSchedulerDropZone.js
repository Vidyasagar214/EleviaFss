/**
 * This class is a drop zone, allowing you to drop elements on the configured target element (see the constructor in the
 * When the drop happens, the onNodeDrop callback is called and the dropzone simply fires an event on behalf of the scheduler view
 * to let the world know about the drop.
 * */
Ext.define('TS.common.dd.CrewSchedulerDropZone', {
    extend: 'Ext.dd.DropZone',
    ddGroup: 'unplannedtasks',

    constructor: function () {
        this.callParent(arguments);
        var schedulerView = this.schedulerView;

        this.proxyTpl = this.proxyTpl || new Ext.XTemplate(
                '<span class="sch-dd-newtime">' +
                '{[ this.getText(values) ]}' +
                '</span>',
                {
                    getText: function (vals) {
                        var retVal = schedulerView.getFormattedDate(vals.startDate);

                        if (vals.Duration) {
                            retVal += ' - ' + schedulerView.getFormattedEndDate(Sch.util.Date.add(vals.startDate, Sch.util.Date.MILLI, vals.duration), vals.startDate);
                        }
                        return retVal;
                    }
                }
            );
    },

    getTargetFromEvent: function (e) {
        return e.getTarget('.' + this.schedulerView.timeCellCls);
    },

    onNodeOver: function (target, dragSource, e, data) {
        var s = this.schedulerView,
            date = s.getDateFromDomEvent(e, 'round'),
            newText;

        if (!date) return this.dropNotAllowed;

        this.proxyTpl.overwrite(dragSource.proxy.el.down('.sch-dd-proxy-hd'), {
            StartDate: date,
            Duration: data.duration
        });

        var targetRecord = s.resolveResource(e.getTarget('.' + s.timeCellCls));

        if (this.validatorFn.call(this.validatorFnScope || this, data.records, targetRecord, date, data.duration, e) !== false) {
            return this.dropAllowed;
        } else {
            return this.dropNotAllowed;
        }
    },

    // This method is called as mouse moves during a drag drop operation of an unplanned task over the schedule area
    validatorFn: function (draggedEventRecords, resource, date, durationMs) {
        return this.isValidDrop(resource, date, durationMs);
    },

    isValidDrop: function (resource, startDate, durationMs) {
        // TODO - Set this up properly
        return true;
        //return resource.isAvailable(startDate, Sch.util.Date.add(startDate, Sch.util.Date.MILLI, durationMs));
    },

    onNodeDrop: function (target, dragSource, e, data) {
        var view = this.schedulerView,
            resource = view.resolveResource(target),
            date = view.getDateFromDomEvent(e, 'round'),
            task = data.records[0];

        if (!this.isValidDrop(resource, date, data.duration)) {
            return false;
        }

        view.fireEvent('unplannedtaskdrop', view, task, resource, date);
    }
});
    