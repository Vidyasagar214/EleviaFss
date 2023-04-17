Ext.define('TS.controller.crew.CrewPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.panel-crew',

    listen: {
        global: {
            'ResetCrewGrid': 'filterEmployeeGrid',
            'ToggleCrewRow': 'onToggleCrewRow',
            'ResetCrews': 'onResetCrews'
        },

        component: {
            'crewgrid': {
                'delayedselect': 'crewSelect',
                'delayedeselect': 'crewDeselect'
            }
        },

        controller: {
            '#crewgridcontroller': {
                //'afterassignmembers'  : 'afterAssignMembers',
                //'afterunassignmember' : 'afterUnAssignMember'
            }
        }
    },

    init: function () {
        //this.getView().store = Ext.getStore('Employees');

    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    /*
     Select the crew where members are assigned to and filter employeegrid
     */

    afterAssignMembers: function (view, crew, members) {

        if (view.getSelectionModel().isSelected(crew)) {
            this.filterEmployeeGrid(crew);
        } else {
            view.getSelectionModel().select(crew);
        }
    },

    /*
     Select the crew where members are unassigned from and filter employeegrid
     */

    afterUnAssignMember: function (view, crew, memberId) {

        if (view.getSelectionModel().isSelected(crew)) {
            this.filterEmployeeGrid(crew);
        } else {
            view.getSelectionModel().select(crew);
        }
    },

    /*
     Handles a selection change on the crew grid for filtering employee grid
     */

    crewSelect: function (crewGrid, record) {
        this.filterEmployeeGrid(record);
    },

    crewDeselect: function (crewGrid) {
        this.lookup('employeeGrid').getStore().clearFilter();
    },

    /*
     Handles assign button click
     Fires assignmembers event which is handled by the CrewGridController
     */

    onAssignMembersClick: function (button) {

        var me = this,
            crewGrid = me.lookup('crewGrid'),
            employeeGrid = me.lookup('employeeGrid'),
            crew = crewGrid.getSelectionModel().getLastSelected(),
            employees = employeeGrid.getSelectionModel().getSelection();

        me.assignMembers(me, crew, employees);
    },

    /*
     * Toolbar Button Click Handlers
     */

    // Handles create button click. Fires createcrew event which is handled by the CrewGridController
    onCreateCrewClick: function (button) {
        Ext.GlobalEvents.fireEvent('createcrew', this, button);
    },

    // Handles remove button click. Fires removecrew event which is handled by the CrewGridController
    onRemoveCrewClick: function (button) {
        Ext.GlobalEvents.fireEvent('removecrew', this, button);
    },

    /*
     Filters the employee grid based on a selected crew record. Only unassigned employees are visible in the grid
     */

    filterEmployeeGrid: function (record) {
        var grid = this.lookup('employeeGrid'),
            store,
            crewStore = Ext.getStore('AllCrews'),
            assigned;

        grid.setTitle('Available employees for ' + record.get('crewName'));

        store = grid.getStore();
        assigned = record.get('crewMembers');

        store.clearFilter(true);

        store.filterBy(function (record) {
            return !assigned.getById(record.get('empId'));
        });
        //reload AllCrews store
        crewStore.reload();
    },

    onToggleCrewRow: function (record) {
        var grid = this.lookup('crewGrid'),
            store = grid.getStore(),
            plugin = grid.getPlugin('memberExpander'),
            idx,
            crewRecord;
        //remove any '-' in case it is a new crew
        crewRecord = store.getById(record.getId().replace(/-/g, ''));
        idx = store.indexOf(crewRecord);
        if (record) {
            plugin.toggleRow(idx, crewRecord);
        }
    },

    onResetCrews: function () {
        var me = this,
            vw = me.getView(),
            crewGrid = vw.lookup('crewGrid'),
            crewStore = crewGrid.getStore(),
            employeeGrid = Ext.first('grid-employee'),
            employeeGridStore = employeeGrid.getStore(),
            settings = TS.app.settings;

        employeeGridStore.getProxy().setExtraParams({
            fwaEmployeesOnly: true
        });
        employeeGridStore.load();
        employeeGrid.getView().refresh();

        crewStore.getProxy().setExtraParams({
            isPreparedByMe: settings.schedCrewPreparedByMe
        });
        crewStore.load();
        crewGrid.getView().refresh();
    },

    openSettingsWindow: function (component, e) {
        Ext.create('TS.view.crew.window.UserSettings').show();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onShowHideCrewClick: function (comp, e) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            crewGrid = vw.lookup('crewGrid'),
            crewStore = crewGrid.getStore(),
            rowExpander = crewGrid.getPlugin("memberExpander"),
            nodes = rowExpander.view.getNodes();

        // for (var i = 0; i < nodes.length; i++) {
        //     rowExpander.collapseRow(i);
        // }

        if (!settings.showInactiveCrew) {
            comp.setText('Hide Inactive');
            crewStore.clearFilter();
            settings.showInactiveCrew = true;
            crewGrid.getView().refresh();
        } else {
            comp.setText('Show Inactive');
            crewStore.filter('crewStatus', 'A');
            settings.showInactiveCrew = false;
            crewGrid.getView().refresh();
        }
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onManageCrewClick: function (component, e) {
        Ext.create('TS.view.crew.CrewManagePanel').show();
    },

    refreshCrewPanel: function () {
        var me = this,
            vw = me.getView(),
            crewGrid = vw.lookup('crewGrid'),
            crewStore = crewGrid.getStore(),
            employeeGrid = vw.lookup('employeeGrid'),
            employeeStore = employeeGrid.getStore(),
            settings = TS.app.settings;

        crewStore.getProxy().setExtraParams({
            isPreparedByMe: settings.schedCrewPreparedByMe
        });
        employeeStore.getProxy().setExtraParams({
            fwaEmployeesOnly: true
        });

        crewStore.load();
        crewGrid.getView().refresh();

        employeeStore.load();
        employeeGrid.getView().refresh();

    }

});
