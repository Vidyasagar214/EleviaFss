/**
 * Created by steve.tess on 6/10/2016.
 */
Ext.define('TS.controller.crew.CrewAssignPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.crewassignpanel',

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            label = Ext.first('#currentDate');
        if (label) {
            label.html = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT);
            vm.set('currentDate', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
            vm.set('dateDisplay', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
        }
    },

    listen: {
        global: {
            'ResetCrewAssign': 'onResetCrewAssign',
            'ResetEmployeeCrewAssignList': 'filterEmployeeAssignGrid'
        }
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    onCrewAssignGridRender: function (grid) {
        new TS.common.dd.CrewAssignGridDropZone(grid.view.getEl(), {
            grid: grid
        });
    },

    fwaCrewSelect: function (crewGrid, record) {
        this.filterEmployeeAssignGrid(record);
    },

    fwaCrewDeselect: function (crewGrid) {
        //Ext.first('crewassigngrid').getStore().clearFilter();
    },

    filterEmployeeAssignGrid: function (record) {
        var me = this,
            grid = Ext.first('#employeeAssignGrid'),
            store = grid.getStore(),
            crew = [],
            assigned;

        grid.setTitle('Available employees for ' + record.get('fwaNum') + ' - ' + record.get('fwaName'));

        crew.push(record.get('crew1EmpId'));
        crew.push(record.get('crew2EmpId'));
        crew.push(record.get('crew3EmpId'));
        crew.push(record.get('crew4EmpId'));
        crew.push(record.get('crew5EmpId'));
        crew.push(record.get('crew6EmpId'));
        crew.push(record.get('crew7EmpId'));
        crew.push(record.get('crew8EmpId'));
        crew.push(record.get('crew9EmpId'));
        crew.push(record.get('crew10EmpId'));
        crew.push(record.get('crew11EmpId'));
        crew.push(record.get('crew12EmpId'));
        crew.push(record.get('crew13EmpId'));
        crew.push(record.get('crew14EmpId'));
        crew.push(record.get('crew15EmpId'));


        store.clearFilter(true);
        store.filterBy(function (obj) {
            return crew.indexOf(obj.get('empId')) === -1;
        });

        me.resetFilters();
    },

    priorityChange: function (obj, newValue, oldValue) {
        var selectedRow = obj.up('grid').getSelection()[0],
            fwaId = selectedRow.getId(),
            settings = TS.app.settings;

        Fwa.SaveFwaPriority(null, settings.username, fwaId, newValue, function (response) {
            if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, this, {
            autoHandle: true
        });
    },

    onChangeCrewMember: function (obj, newValue, oldValue, eOpts) {
        var vm = this.getViewModel(),
            grid = Ext.first('crewassigngrid'),
            selModel = grid.getSelectionModel(),
            settings = TS.app.settings,
            store = grid.getStore(),
            records = store.getRange(),
            row = store.getAt(newValue.rowIdx),
            chiefCt = 0,
            pos,
            empName,
            crewRoleId;

        if (!newValue.value) {
            //clear crew roll if employee is cleared
            if (newValue.field == 'crew1EmpId') row.set('crew1CrewRoleId', 0);
            if (newValue.field == 'crew2EmpId') row.set('crew2CrewRoleId', 0);
            if (newValue.field == 'crew3EmpId') row.set('crew3CrewRoleId', 0);
            if (newValue.field == 'crew4EmpId') row.set('crew4CrewRoleId', 0);
            if (newValue.field == 'crew5EmpId') row.set('crew5CrewRoleId', 0);
            if (newValue.field == 'crew6EmpId') row.set('crew6CrewRoleId', 0);
            if (newValue.field == 'crew7EmpId') row.set('crew7CrewRoleId', 0);
            if (newValue.field == 'crew8EmpId') row.set('crew8CrewRoleId', 0);
            if (newValue.field == 'crew9EmpId') row.set('crew9CrewRoleId', 0);
            if (newValue.field == 'crew10EmpId') row.set('crew10CrewRoleId', 0);
            if (newValue.field == 'crew11EmpId') row.set('crew11CrewRoleId', 0);
            if (newValue.field == 'crew12EmpId') row.set('crew12CrewRoleId', 0);
            if (newValue.field == 'crew13EmpId') row.set('crew13CrewRoleId', 0);
            if (newValue.field == 'crew14EmpId') row.set('crew14CrewRoleId', 0);
            if (newValue.field == 'crew15EmpId') row.set('crew15CrewRoleId', 0);
            //clear employee if crew role is cleared
            if (newValue.field == 'crew1CrewRoleId') row.set('crew1EmpId', '');
            if (newValue.field == 'crew2CrewRoleId') row.set('crew2EmpId', '');
            if (newValue.field == 'crew3CrewRoleId') row.set('crew3EmpId', '');
            if (newValue.field == 'crew4CrewRoleId') row.set('crew4EmpId', '');
            if (newValue.field == 'crew5CrewRoleId') row.set('crew5EmpId', '');
            if (newValue.field == 'crew6CrewRoleId') row.set('crew6EmpId', '');
            if (newValue.field == 'crew7CrewRoleId') row.set('crew7EmpId', '');
            if (newValue.field == 'crew8CrewRoleId') row.set('crew8EmpId', '');
            if (newValue.field == 'crew9CrewRoleId') row.set('crew9EmpId', '');
            if (newValue.field == 'crew10CrewRoleId') row.set('crew10EmpId', '');
            if (newValue.field == 'crew11CrewRoleId') row.set('crew11EmpId', '');
            if (newValue.field == 'crew12CrewRoleId') row.set('crew12EmpId', '');
            if (newValue.field == 'crew13CrewRoleId') row.set('crew13EmpId', '');
            if (newValue.field == 'crew14CrewRoleId') row.set('crew14EmpId', '');
            if (newValue.field == 'crew15CrewRoleId') row.set('crew15EmpId', '');
            row.set('changesMade', true);
        } else {
            //check for duplicate entries from a combo box change
            if (newValue.field == 'crew1EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew1EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew1CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew2EmpId') {
                if (newValue.value == newValue.record.get('crew1EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew2EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew2CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew3EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew1EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew3EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew3CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew4EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew1EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew4EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew4CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew5EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew1EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew5EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew5CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew6EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew1EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew6EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew6CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew7EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew1EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew7EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew7CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            }
            else if (newValue.field == 'crew8EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew1EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId')||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew8EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew8CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew9EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew1EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId') ||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew9EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew9CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            }
            else if (newValue.field == 'crew10EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew1EmpId') ||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew10EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew10CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew11EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId') ||
                    newValue.value == newValue.record.get('crew1EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew11EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew11CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew12EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId') ||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew1EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew12EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew12CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew13EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId') ||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew1EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew13EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew13CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew14EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId') ||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew1EmpId') ||
                    newValue.value == newValue.record.get('crew15EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew14EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew14CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else if (newValue.field == 'crew15EmpId') {
                if (newValue.value == newValue.record.get('crew2EmpId') || newValue.value == newValue.record.get('crew3EmpId')  ||
                    newValue.value == newValue.record.get('crew4EmpId') || newValue.value == newValue.record.get('crew5EmpId') ||
                    newValue.value == newValue.record.get('crew6EmpId') || newValue.value == newValue.record.get('crew7EmpId') ||
                    newValue.value == newValue.record.get('crew8EmpId') || newValue.value == newValue.record.get('crew9EmpId') ||
                    newValue.value == newValue.record.get('crew10EmpId') ||
                    newValue.value == newValue.record.get('crew11EmpId') || newValue.value == newValue.record.get('crew12EmpId') ||
                    newValue.value == newValue.record.get('crew13EmpId') || newValue.value == newValue.record.get('crew14EmpId') ||
                    newValue.value == newValue.record.get('crew1EmpId')) {
                    empName = Ext.getStore('Employees').getById(newValue.value).get('empName');
                    Ext.Msg.alert('Warning', empName.bold() + ' has already been assigned to this ' + settings.crewLabel.toLowerCase());
                    row.set('crew15EmpId', newValue.originalValue);
                } else {
                    crewRoleId = Ext.getStore('Employees').getById(newValue.value).get('defaultCrewRoleId');
                    row.set('crew15CrewRoleId', crewRoleId);
                    row.set('changesMade', true);
                }
            } else {
                //check for duplicate chief roles
                if (row.get('crew1CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew1CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew2CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew2CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew3CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew3CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew4CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew4CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew5CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew5CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew6CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew6CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew7CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew7CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew8CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew8CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew9CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew9CrewRoleId')).get('crewRoleIsChief')) chiefCt++;
                if (row.get('crew10CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew10CrewRoleId')).get('crewRoleIsChief')) chiefCt++
                if (row.get('crew11CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew11CrewRoleId')).get('crewRoleIsChief')) chiefCt++
                if (row.get('crew12CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew12CrewRoleId')).get('crewRoleIsChief')) chiefCt++
                if (row.get('crew13CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew13CrewRoleId')).get('crewRoleIsChief')) chiefCt++
                if (row.get('crew14CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew14CrewRoleId')).get('crewRoleIsChief')) chiefCt++
                if (row.get('crew15CrewRoleId') && Ext.getStore('Roles').getById(row.get('crew15CrewRoleId')).get('crewRoleIsChief')) chiefCt++
                if (chiefCt > 1) {
                    Ext.Msg.alert('Warning', row.get('fwaName') + ' has more than one(1) ' + settings.crewChiefLabel + ' assigned.');
                }
                //change value
                if (newValue.field == 'crew1EmpId') row.set('crew1EmpId', newValue.value);
                if (newValue.field == 'crew2EmpId') row.set('crew2EmpId', newValue.value);
                if (newValue.field == 'crew3EmpId') row.set('crew3EmpId', newValue.value);
                if (newValue.field == 'crew4EmpId') row.set('crew4EmpId', newValue.value);
                if (newValue.field == 'crew5EmpId') row.set('crew5EmpId', newValue.value);
                if (newValue.field == 'crew6EmpId') row.set('crew6EmpId', newValue.value);
                if (newValue.field == 'crew7EmpId') row.set('crew7EmpId', newValue.value);
                if (newValue.field == 'crew8EmpId') row.set('crew8EmpId', newValue.value);
                if (newValue.field == 'crew9EmpId') row.set('crew9EmpId', newValue.value);
                if (newValue.field == 'crew10EmpId') row.set('crew10EmpId', newValue.value);
                if (newValue.field == 'crew11EmpId') row.set('crew11EmpId', newValue.value);
                if (newValue.field == 'crew12EmpId') row.set('crew12EmpId', newValue.value);
                if (newValue.field == 'crew13EmpId') row.set('crew13EmpId', newValue.value);
                if (newValue.field == 'crew14EmpId') row.set('crew14EmpId', newValue.value);
                if (newValue.field == 'crew15EmpId') row.set('crew15EmpId', newValue.value);
                //change role field
                if (newValue.field == 'crew1CrewRoleId') row.set('crew1CrewRoleId', newValue.value);
                if (newValue.field == 'crew2CrewRoleId') row.set('crew2CrewRoleId', newValue.value);
                if (newValue.field == 'crew3CrewRoleId') row.set('crew3CrewRoleId', newValue.value);
                if (newValue.field == 'crew4CrewRoleId') row.set('crew4CrewRoleId', newValue.value);
                if (newValue.field == 'crew5CrewRoleId') row.set('crew5CrewRoleId', newValue.value);
                if (newValue.field == 'crew6CrewRoleId') row.set('crew6CrewRoleId', newValue.value);
                if (newValue.field == 'crew7CrewRoleId') row.set('crew7CrewRoleId', newValue.value);
                if (newValue.field == 'crew8CrewRoleId') row.set('crew8CrewRoleId', newValue.value);
                if (newValue.field == 'crew9CrewRoleId') row.set('crew9CrewRoleId', newValue.value);
                if (newValue.field == 'crew10CrewRoleId') row.set('crew10CrewRoleId', newValue.value);
                if (newValue.field == 'crew11CrewRoleId') row.set('crew11CrewRoleId', newValue.value);
                if (newValue.field == 'crew12CrewRoleId') row.set('crew12CrewRoleId', newValue.value);
                if (newValue.field == 'crew13CrewRoleId') row.set('crew13CrewRoleId', newValue.value);
                if (newValue.field == 'crew14CrewRoleId') row.set('crew14CrewRoleId', newValue.value);
                if (newValue.field == 'crew15CrewRoleId') row.set('crew15CrewRoleId', newValue.value);
                //flag as dirty
                row.set('changesMade', true);
            }
        }

        obj.completeEdit();
        // set the position
        selModel.setPosition({row: newValue.rowIdx, column: 2}, false);
        // get the newly established position
        pos = selModel.getPosition();
        // focus the cell so change will be seen in model
        grid.getView().focusCell(pos);
        ////use below if grid loses filter when changing values
        // if (vm.get('filterDt')) {
        //     store.filterBy(function (obj) {
        //         return Ext.Date.format(new Date(obj.get('schedStartDate')), DATE_FORMAT) == vm.get('filterDt');
        //     });
        //     store.sort('crew1EmpName', 'ASC');
        // }
    },

    resetFilters: function () {
        var filterEmployee = Ext.first('#filterCrewAssignEmpName'),
            filterRole = Ext.first('#filterCrewAssignCrewRoleName'),
            filterEmpGroup = Ext.first('#filterCrewAssignEmpGroupName');
        //reset filters
        if (filterEmployee.autoSearch) filterEmployee.setFilter(filterEmployee.up().dataIndex, filterEmployee.getValue());
        if (filterRole.autoSearch) filterRole.setFilter(filterRole.up().dataIndex, filterRole.getValue());
        if (filterEmpGroup.autoSearch) filterEmpGroup.setFilter(filterEmpGroup.up().dataIndex, filterEmpGroup.getValue());
    },

    onSaveClick: function () {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            settings = TS.app.settings,
            store = grid.getStore(),
            records = store.getRange(),
            fwaId,
            crew1EmpId,
            crew1CrewRoleId,
            crew2EmpId,
            crew2CrewRoleId,
            crew3EmpId,
            crew3CrewRoleId,
            crew4EmpId,
            crew4CrewRoleId,
            crew5EmpId,
            crew5CrewRoleId,
            crew6EmpId,
            crew6CrewRoleId,
            crew7EmpId,
            crew7CrewRoleId,
            crew8EmpId,
            crew8CrewRoleId,
            crew9EmpId,
            crew9CrewRoleId,
            crew10EmpId,
            crew10CrewRoleId,
            crew11EmpId,
            crew11CrewRoleId,
            crew12EmpId,
            crew12CrewRoleId,
            crew13EmpId,
            crew13CrewRoleId,
            crew14EmpId,
            crew14CrewRoleId,
            crew15EmpId,
            crew15CrewRoleId,
            saveCt = 0,
            ttlCt = 0;
        //get a ttlCt
        store.each(function (rec) {
            if (rec.get('changesMade')) ttlCt++;
        });

        Ext.each(records, function (rec) {
            if (rec.get('changesMade')) { //
                fwaId = rec.get('fwaId');
                crew1EmpId = rec.get('crew1EmpId');
                crew1CrewRoleId = rec.get('crew1CrewRoleId');// == 0 ? '' : rec.get('crew1CrewRoleId');
                crew2EmpId = rec.get('crew2EmpId');
                crew2CrewRoleId = rec.get('crew2CrewRoleId');// == 0 ? '' : rec.get('crew2CrewRoleId');
                crew3EmpId = rec.get('crew3EmpId');
                crew3CrewRoleId = rec.get('crew3CrewRoleId');// == 0 ? '' : rec.get('crew3CrewRoleId');
                crew4EmpId = rec.get('crew4EmpId');
                crew4CrewRoleId = rec.get('crew4CrewRoleId');
                crew5EmpId = rec.get('crew5EmpId');
                crew5CrewRoleId = rec.get('crew5CrewRoleId');
                crew6EmpId = rec.get('crew6EmpId');
                crew6CrewRoleId = rec.get('crew6CrewRoleId');
                crew7EmpId = rec.get('crew7EmpId');
                crew7CrewRoleId = rec.get('crew7CrewRoleId');
                crew8EmpId = rec.get('crew8EmpId');
                crew8CrewRoleId = rec.get('crew8CrewRoleId');
                crew9EmpId = rec.get('crew9EmpId');
                crew9CrewRoleId = rec.get('crew9CrewRoleId');
                crew10EmpId = rec.get('crew10EmpId');
                crew10CrewRoleId = rec.get('crew10CrewRoleId');
                crew11EmpId = rec.get('crew11EmpId');
                crew11CrewRoleId = rec.get('crew11CrewRoleId');
                crew12EmpId = rec.get('crew12EmpId');
                crew12CrewRoleId = rec.get('crew12CrewRoleId');
                crew13EmpId = rec.get('crew13EmpId');
                crew13CrewRoleId = rec.get('crew13CrewRoleId');
                crew14EmpId = rec.get('crew14EmpId');
                crew14CrewRoleId = rec.get('crew14CrewRoleId');
                crew15EmpId = rec.get('crew15EmpId');
                crew15CrewRoleId = rec.get('crew15CrewRoleId');

                Fwa.SaveCrewAssign(null, settings.username, fwaId,
                    crew1EmpId, crew1CrewRoleId, crew2EmpId, crew2CrewRoleId, crew3EmpId, crew3CrewRoleId,
                    crew4EmpId, crew4CrewRoleId, crew5EmpId, crew5CrewRoleId, crew6EmpId, crew6CrewRoleId,
                    crew7EmpId, crew7CrewRoleId, crew8EmpId, crew8CrewRoleId, crew9EmpId, crew9CrewRoleId,
                    crew10EmpId, crew10CrewRoleId, crew11EmpId, crew11CrewRoleId,crew12EmpId, crew12CrewRoleId,
                    crew13EmpId, crew13CrewRoleId,crew14EmpId, crew14CrewRoleId,crew15EmpId, crew15CrewRoleId, function (response) {
                    if (response && response.success) {
                        saveCt++;
                        rec.set('changesMade', false);
                        if (saveCt === ttlCt) {
                            Ext.Msg.alert('Status', settings.crewLabel + ' changes saved successfully.');
                            ////update scheduler grids
                            Ext.GlobalEvents.fireEvent('ReloadEventStores', settings);
                            ////update crew grids
                            //Ext.GlobalEvents.fireEvent('ResetCrews');
                            settings.crewNeedsRefresh = true;
                            ////update employee view //currenlty hidden
                            // Ext.GlobalEvents.fireEvent('ResetEmployeeView');
                            Ext.GlobalEvents.fireEvent('ResetEmployeeViewGantt');
                            //reset crew tasks
                            settings.crewTaskNeedsRefresh = true;
                            //reset fwa grid
                            settings.fwaListNeedsRefresh = true;
                            //// crew view tab
                            var crewStore = Ext.first('grid-crew').getStore();
                            crewStore.reload();
                            ////reload store ALLCrews
                            Ext.getStore('AllCrews').reload();
                        }
                    } else if (response) {
                        Ext.GlobalEvents.fireEvent('Error', response);
                        me.onResetCrewAssign();
                    }
                }, this, {
                    autoHandle: false
                });
            }
        });
    },

    onFwaCrewGridSelect: function (grid, td, rowIdx, colIdx) {
        var store = grid.getStore(),
            record = store.getAt(rowIdx);
        TS.app.redirectTo('fwa/' + record.get('fwaId'));
    },

    onResetCrewAssign: function (fwa, isDelete) {
        var crewGrid = Ext.first('crewassigngrid'),
            empGrid = Ext.first('grid-employeeassign'),
            empStore = empGrid.getStore(),
            crewStore = crewGrid.getStore();

        crewStore.getProxy().setExtraParams({
            startDate: new Date().toDateString(),
            isPreparer: TS.app.settings.schedFwaPreparedByMe,
            timeZoneOffset: new Date().getTimezoneOffset(),
            isScheduler: true
        });
        crewStore.load();
        empStore.load();
        crewGrid.getView().refresh();
        empGrid.getView().refresh();
    },

    filterReset: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore();

        //vm.set('currentDate', '');
        store.clearFilter(true);
        store.filter(function (rec) {
            return Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT)  == Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT);
        });
    },

    filterByToday: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            currentDt = Ext.Date.format(new Date(), DATE_FORMAT),
            dt;
        vm.set('currentDate', currentDt);
        vm.set('filterDt', currentDt);
        store.clearFilter(true);
        store.filterBy(function (obj) {
            dt = obj.get('schedStartDate');
            return Ext.Date.format(new Date(dt), DATE_FORMAT) == currentDt;
        });
        store.sort('crew1EmpName', 'ASC');
    },

    filterByNextDay: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            tomorrow = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT),
            dt;

        if (vm.get('filterDt')) {
            tomorrow = Ext.Date.format(Ext.Date.add(new Date(vm.get('filterDt')), Ext.Date.DAY, 1), DATE_FORMAT);
            vm.set('filterDt', tomorrow);
        } else {
            vm.set('filterDt', tomorrow);
        }

        store.clearFilter(true);
        store.filterBy(function (obj) {
            dt = obj.get('schedStartDate');
            return Ext.Date.format(new Date(dt), DATE_FORMAT) == tomorrow;
        });
        vm.set('currentDate', tomorrow);
        store.sort('crew1EmpName', 'ASC');
    },

    filterByLastDay: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            yesterday = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, -1), DATE_FORMAT),
            dt;

        if (vm.get('filterDt')) {
            yesterday = Ext.Date.format(Ext.Date.add(new Date(vm.get('filterDt')), Ext.Date.DAY, -1), DATE_FORMAT);
            vm.set('filterDt', yesterday);
        } else {
            vm.set('filterDt', yesterday);
        }
        store.clearFilter(true);
        store.filterBy(function (obj) {
            dt = obj.get('schedStartDate');
            return Ext.Date.format(new Date(dt), DATE_FORMAT) == yesterday;
        });
        vm.set('currentDate', yesterday);
        store.sort('crew1EmpName', 'ASC');
    },

    // priorityChange: function (obj, newValue, oldValue) {
    //     var selectedRow = obj.up('grid').getSelection()[0],
    //         fwaId = selectedRow.getId(),
    //         settings = TS.app.settings;
    //
    //     Fwa.SaveFwaPriority(null, settings.username, fwaId, newValue, function (response) {
    //         if (response && !response.success) {
    //             Ext.GlobalEvents.fireEvent('Error', response);
    //         }
    //     }, this, {
    //         autoHandle: true
    //     });
    // },

    udf_t1Change: function (obj, event, eOpts) {
        var selectedRow = obj.up('grid').getSelection()[0],
            fwaId = selectedRow.getId(),
            settings = TS.app.settings;
        if (obj.dirty) {
            Fwa.SaveFwaUdf(null, settings.username, fwaId, obj.dataIndex, obj.getValue(), function (response) {
                if (response && !response.success) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                }
            }, this, {
                autoHandle: true
            });
        }
    },

    exportToExcel: function () {
        var me = this,
            grid = me.lookup('crewassigngrid');
        //
        // grid.saveDocumentAs({
        //     type: 'excel',
        //     title: {_tr: 'crewLabel', tpl: ' Current {0} Assignments'},
        //     fileName: 'crewAssigments.xlsx'
        // });

    },

    openSettingsWindow: function (component, e) {
        Ext.create('TS.view.crew.window.UserSettings').show();
    },

    openAboutFss: function(){
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    refreshCrewAssign: function (component, e) {
        var grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            me = this,
            empGrid = Ext.first('#employeeAssignGrid'),
            empStore = empGrid.getStore();

        store.clearFilter(true);
        store.reload();

        grid.getView().refresh();

        empStore.reload();
        empGrid.getView().refresh();
    },

    deleteCrewMember2: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            vm = me.getViewModel(),
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew2EmpId') == record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew2EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 2)
        } else {
            record.set('crew2EmpId', '');
            record.set('crew2CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },

    deleteCrewMember3: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew3EmpId') == record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew3EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 3)
        } else {
            record.set('crew3EmpId', '');
            record.set('crew3CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },

    deleteCrewMember4: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew4EmpId') == record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew4EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 4)
        } else {
            record.set('crew4EmpId', '');
            record.set('crew4CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },

    deleteCrewMember5: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew5EmpId') == record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew5EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 5)
        } else {
            record.set('crew5EmpId', '');
            record.set('crew5CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },

    deleteCrewMember6: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew6EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew6EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');
        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }

        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 6)
        } else {
            record.set('crew6EmpId', '');
            record.set('crew6CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },

    deleteCrewMember7: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew7EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew7EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 7)
        } else {
            record.set('crew7EmpId', '');
            record.set('crew7CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember8: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew8EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew8EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 8)
        } else {
            record.set('crew8EmpId', '');
            record.set('crew8CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember9: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew9EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew9EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 9)
        } else {
            record.set('crew9EmpId', '');
            record.set('crew9CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember10: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew10EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew10EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');

        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 10)
        } else {
            record.set('crew10EmpId', '');
            record.set('crew10CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember11: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew11EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew11EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');
        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 11)
        } else {
            record.set('crew11EmpId', '');
            record.set('crew11CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember12: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew12EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew12EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');
        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 12)
        } else {
            record.set('crew12EmpId', '');
            record.set('crew12CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember13: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew13EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew13EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');
        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 13)
        } else {
            record.set('crew13EmpId', '');
            record.set('crew13CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember14: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew14EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew14EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');
        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 14)
        } else {
            record.set('crew14EmpId', '');
            record.set('crew14CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },
    deleteCrewMember15: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            chiefId = record.get('crew1EmpId'),
            isChief = record.get('crew15EmpId') === record.get('scheduledCrewChiefId'),
            crewMemberId = record.get('crew15EmpId'),
            fwaDate = record.get('nextDate') ? Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) : record.get('nextDate');
        if(record.get('hours').getRange().length > 0 || record.get('fwaStatusId') == 'S'){
            Ext.Msg.show({
                title: 'Warning',
                message: settings.fwaAbbrevLabel + 's with hours entered or submitted cannot remove crew members.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        if (isChief) {
            me.getAllCrewAssigmentsByChief(store, chiefId, fwaDate, crewMemberId, record, 15)
        } else {
            record.set('crew15EmpId', '');
            record.set('crew15CrewRoleId', '');
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },

    getAllCrewAssigmentsByChief: function (store, chiefId, fwaDate, crewMemberId, record, crewNo) {
        var me = this,
            settings = TS.app.settings;
        //check if remove from similar FWA's
        Ext.Msg.confirm(settings.crewLabel + ' Remove', "Remove from all " + settings.fwaAbbrevLabel + "'s for this " + settings.crewChiefLabel + " & date?", function (btn) {
            if (btn == 'yes') {
                Ext.each(store.getRange(), function (rec) {
                    var dt = Ext.Date.format(new Date(rec.get('nextDate')), DATE_FORMAT);
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew2EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew2EmpId', '');
                        rec.set('crew2CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew3EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew3EmpId', '');
                        rec.set('crew3CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew4EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew4EmpId', '');
                        rec.set('crew4CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew5EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew5EmpId', '');
                        rec.set('crew5CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew6EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew6EmpId', '');
                        rec.set('crew6CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew7EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew7EmpId', '');
                        rec.set('crew7CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew8EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew8EmpId', '');
                        rec.set('crew8CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew9EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew9EmpId', '');
                        rec.set('crew9CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew10EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew10EmpId', '');
                        rec.set('crew10CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew11EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew11EmpId', '');
                        rec.set('crew11CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew12EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew12EmpId', '');
                        rec.set('crew12CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew13EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew13EmpId', '');
                        rec.set('crew13CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew14EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew14EmpId', '');
                        rec.set('crew14CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                    if (dt == fwaDate && rec.get('crew1EmpId') == chiefId && rec.get('crew15EmpId') == crewMemberId && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                        rec.set('crew15EmpId', '');
                        rec.set('crew15CrewRoleId', '');
                        rec.set('changesMade', true);
                    }
                })
                me.popWarningMessage();
            } else {
                record.set('changesMade', true);
                record.set('crew' + crewNo + 'EmpId', '');
                record.set('crew' + crewNo + 'CrewRoleId', '');
                me.popWarningMessage();
            }
        });
    },

    popWarningMessage: function () {
        var settings = TS.app.settings;
        Ext.Msg.alert('FYI', 'To save your changes, remember to click the "Save ' + settings.crewLabel + 's" button.');
    },

    changeCrewMemberOne: function (obj, newValue, oldValue) {
        var me = this,
            settings = TS.app.settings,
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            record = obj.up('grid').getSelection()[0],
            fwaDate = Ext.Date.format(record.get('nextDate'), DATE_FORMAT),
            isChief = oldValue == record.get('scheduledCrewChiefId');

        if(isChief){
            Ext.Msg.confirm(settings.crewLabel + ' Update', "Change all " + settings.fwaAbbrevLabel + "'s for this " + settings.crewChiefLabel + " & date?", function (btn) {
                if (btn == 'yes') {
                    Ext.each(store.getRange(), function (rec) {
                        var dt = Ext.Date.format(new Date(rec.get('nextDate')), DATE_FORMAT);
                        if (dt == fwaDate && rec.get('crew1EmpId') == oldValue && rec.get('scheduledCrewChiefId') == rec.get('crew1EmpId')) {
                            rec.set('crew1EmpId', newValue);
                            rec.set('scheduledCrewChiefId', newValue);
                            rec.set('changesMade', true);
                        }
                    });
                    me.popWarningMessage();
                } else {
                    record.set('changesMade', true);
                    me.popWarningMessage();
                }
            });
        } else{
            record.set('changesMade', true);
            me.popWarningMessage();
        }
    },

    onGoToDate: function (component, e) {
        var me = this,
            goToDateWindow;

        if (me.goToDateWindow) {
            me.goToDateWindow.close();
        }

        goToDateWindow = Ext.create('TS.view.crew.GoToDate', {});
        goToDateWindow.setController('crewassignpanel');
        goToDateWindow.show();
    },

    goToDate: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('crewassigngrid'),
            store = grid.getStore(),
            goToDate = Ext.Date.format(new Date(Ext.first('#goToDateField').getValue()), DATE_FORMAT) ,
            dt;

        vm.set('filterDt', goToDate);

        store.clearFilter(true);
        store.filterBy(function (obj) {
            dt = obj.get('schedStartDate');
            return Ext.Date.format(new Date(dt), DATE_FORMAT) == goToDate;
        });
        vm.set('currentDate', goToDate);
        store.sort('crew1EmpName', 'ASC');
        me.getView().close();
    },

    cancelGoToDate: function (component, e) {
        this.getView().close();
    }

});