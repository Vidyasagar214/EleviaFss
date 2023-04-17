/*
 * Hour Editor ViewController
 * *.window.HourEditor
 */

Ext.define('TS.controller.ts.HourEditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-houreditor',

    init: function () {
        var me = this,
            cell = me.getView().getCell(),
            settings = TS.app.settings,
            record = me.getView().getTsRowRecord(),
            vm = me.getViewModel();

        if (settings.empId != record.get('empId') && !settings.tsCanEnterCrewMemberTime && !vm.get('isTimesheetApproval')) {
            me.setFormReadOnly();
        }

        if (vm.get('isTimesheetApproval') && !vm.get('tsApproverCanModify')) {
            me.setFormReadOnly();
        }

        if (cell != null) {
            me.lookup("hourEditorForm").getForm().setValues({
                //Set all form values according to existing data in cell
                regHrs: cell["regHrs"],
                ovtHrs: cell["ovtHrs"],
                ovt2Hrs: cell["ovt2Hrs"],
                travelHrs: cell["travelHrs"],
                comment: cell["comment"],
                fwaNum: cell["fwaNum"] || ''
            });

            if (cell['fwaId'] == null || cell["fwaNum"] == null) {
                me.lookup('fwaButton').hide();
                me.lookup('fwaNum').hide();
            } else {
                me.getView().height = 275;
                //if FWA check if user has edit rights
                if (!settings.tsCanModifyFwaHours) {
                    me.setFormReadOnly();
                }
            }
        } else {
            me.lookup('fwaButton').hide();
            me.lookup('fwaNum').hide();
        }
    },
    /*
     * Sets the Hour form as read only
     */
    setFormReadOnly: function () {
        // Set form fields as read only
        var editorForm = this.lookup('hourEditorForm');
        editorForm.getForm().getFields().each(function (field) {
            field.setReadOnly(true);
        });
        // Disable any buttons
        Ext.Array.each(this.getView().query('button'), function (button) {
            button.setDisabled(true);
        });
        //turn Cancel button back on
        this.getView().lookup('cancelTimesheetCellHoursButton').setDisabled(false);
        //turn FWA button back on
        this.getView().lookup('fwaButton').setDisabled(false);
        this.getView().title = 'Hours Editor - Read Only';
    },
    /*
     * Saves the hours for a specific timesheet cell
     */
    saveTimesheetCellHours: function () {

        if (this.lookup('hourEditorForm') != null) {
            var me = this,
                cellIndex,
                editorForm = me.lookup('hourEditorForm'),
                values = editorForm.getValues(), //Get edited form values
                record = me.getView().getTsRowRecord(),
                tsCells = record.get('cells') || [], //Get existing cells from the row record
                cell = me.getView().getCell(),
                workDate = me.getView().getTsWorkDate(); //User when cell is null for WorkDate in a new cell object
            if (!cell) {
                //Cell is null, create a new cell object
                cell = {
                    workDate: workDate,
                    //StartTime: "1900-01-01T08:00:00", // TODO - Update these at a later point, for now they are not used
                    //EndTime: "1900-01-01T17:00:00",
                    fwaId: null,
                    regHrs: parseFloat(values["regHrs"]) || 0,
                    ovtHrs: parseFloat(values["ovtHrs"]) || 0,
                    ovt2Hrs: parseFloat(values["ovt2Hrs"]) || 0,
                    travelHrs: parseFloat(values["travelHrs"]) || 0,
                    comment: values["comment"] || ""
                };
                tsCells.push(cell);
            }
            else {
                //Editing existing cell
                cellIndex = Ext.Array.pluck(tsCells, 'workDate').indexOf(cell.workDate);
                cell["regHrs"] = parseFloat(values["regHrs"]) || 0;
                cell["ovtHrs"] = parseFloat(values["ovtHrs"]) || 0;
                cell["ovt2Hrs"] = parseFloat(values["ovt2Hrs"]) || 0;
                cell["travelHrs"] = parseFloat(values["travelHrs"]) || 0;
                cell["comment"] = values["comment"] || "";
                tsCells[cellIndex] = cell;
            }
            //Update the record with new tsCells array
            record.set('cells', Ext.Array.clone(tsCells)); //TODO ?? why does this bomb?
            me.getView().close(); //Close HourEditor view.
        }
    },

    // Loads the FWA into a new browser window or popup
    showFwa: function () {
        var me = this;
        if (me.getView().getCell() && me.getView().getCell().fwaId) {
            //!Ext.os.is.Desktop
            me.getSelectedFwa(me.getView().getCell().fwaId);
        }
    },

    getSelectedFwa: function (id) {
        var settings = TS.app.settings,
            w = window,
            d = document,
            e = d.documentElement,
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        if (this.lookup('fwaForm') != null) {
            this.lookup('fwaForm').close();
        }
        Ext.create('TS.view.ts.FwaWindow', {
            title: settings.fwaAbbrevLabel + ' for ' + settings.tsTitle,
            fwaId: id,
            modal: true,
            isPopup: true,
            isFromTS: true,
            width: x * .90,
            height: y * .90
        }).show();
    },
    cancelTimesheetCellHours: function () {
        this.getView().close();
    }

});