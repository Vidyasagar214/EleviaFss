Ext.define('TS.controller.crew.CrewController', {
    extend: 'TS.common.grid.BaseGridController',

    alias: 'controller.grid-crew',

    requires: [
        'TS.common.dd.CrewGridDropZone'
    ],

    mixins: [
        'TS.mixin.CrewMember'
    ],

    listen: {
        global: {
            createcrew: 'createCrew',
            removecrew: 'removeCrew'
        },
        component: {
            'grid-crew': {
                edit: 'afterEdit',
                roleedit: 'afterRoleEdit'
            }
        }
    },

    init: function () {
        //this.getView().store = Ext.getStore('Employees');

    },

    /*
     Setup dropzone on crew grid and attach the store update listener
     */

    onCrewGridRender: function (grid) {
        new TS.common.dd.CrewGridDropZone(grid.view.getEl(), {
            grid: grid
        });
    },

    /*
     Add a new crew to the crewgrid store, will fire select event handled by the main controller
     */
    createCrew: function () {
        var me = this,
            crewGrid = me.getView(),
            store = crewGrid.getStore(),
            settings = TS.app.settings,
            model = store.getModel(),
            crew = new model({
                crewName: 'New Crew',
                preparedByEmpId: settings.empId,
                crewStatus: 'A'
            }),

            rowCount;

        store.add(crew);
        crewGrid.getSelectionModel().select(crew);
        Crew.Update(null, settings.username, crew.getData({serialize: true}), function (response, operation, success) {
            //do not call scheduler update(middle tab) because no crew members yet on create
            //Ext.GlobalEvents.fireEvent('updateSchedulerStores');
            crew.set('crewId', response.data);
            rowCount = store.getCount();
            crewGrid.getView().scrollRowIntoView(rowCount);
            me.resetFilters();
        }, me, {
            autoHandle: true
        });
    },

    /*
     Remove a crew from the crewgrid store
     */
    removeCrew: function (view, rowIndex, colIndex, item, e, record) {

        var me = this,
            crewGrid = me.getView(),
            store = crewGrid.getStore(),
            settings = TS.app.settings;

        Ext.Msg.confirm('Crew Delete', 'Are you sure you want to delete this crew?', function (btn) {
            if (btn == 'yes') {
                //if deleteing a new crew, we need to remove '-'
                var crewId = record.get('crewId').replace(/-/gi, '');
                Crew.Delete(null, settings.username, crewId, function (response, operation, success) {
                    store.remove(record);
                    Ext.GlobalEvents.fireEvent('updateCrewResource');
                    Ext.getStore('AllCrews').reload();
                    me.resetFilters();
                }, me, {
                    autoHandle: true
                });
            }
        })
    },

    resetFilters: function () {
        var filterLname = Ext.first('#filterCrewLName'),
            filterFname = Ext.first('#filterCrewFname'),
            filterRole = Ext.first('#filterCrewDefaultCrewRoleName'),
            filterEmpGroup = Ext.first('#filterCrewEmpGroupName');
        //reset filters
        if (filterLname.autoSearch) filterLname.setFilter(filterLname.up().dataIndex, filterLname.getValue());
        if (filterFname.autoSearch) filterFname.setFilter(filterFname.up().dataIndex, filterFname.getValue());
        if (filterRole.autoSearch) filterRole.setFilter(filterRole.up().dataIndex, filterRole.getValue());
        if (filterEmpGroup.autoSearch) filterEmpGroup.setFilter(filterEmpGroup.up().dataIndex, filterEmpGroup.getValue());
    },

    /*
     Called before enter in edit mode in the CrewGrid.
     Sets correct params on the CrewMembers Store
     */
    beforeEdit: function (editor, context, eOpts) {

        switch (context.field) {

            case 'CrewChief' :

                var field = context.column.field,
                    crewId = context.record.get('Id'),
                    store = field.store,
                    proxy = store.getProxy();

                proxy.setExtraParam('crewId', crewId);

                store.load({
                    callback: function () {
                        field.setValue(context.record.get('crewChief'));
                    }
                });
                break;
        }
    },

    /*
     Handles updates in the editable crewgrid
     */

    afterEdit: function (editor, context, eOpts) {
        var record = context.record;
        //record.commit(this.getView().getPlugin('memberExpander').getView());
        this.saveCrew(record);
        Ext.getStore('AllCrews').reload();
    },

    afterRoleEdit: function (record, rowNode, expandRow) {
        this.saveCrew(record);
    },

    //function (view, rowIndex, colIndex, item, e, record)
    setCrewStatus: function (view) {
        var crewGrid = this.getView(),
            store = crewGrid.getStore(),
            settings = TS.app.settings,
            record = view.getWidgetRecord(),
            crewData;
        if (record.get('crewStatus') == 'I') {
            record.set('crewStatus', 'A');
        } else {
            record.set('crewStatus', 'I');
        }

        crewData = record.getData({
            serialize: true
        });

        Crew.Update(null, settings.username, crewData, function (response, operation, success) {
            Ext.GlobalEvents.fireEvent('updateSchedulerStores');
            store.reload();
            Ext.getStore('AllCrews').reload();
        }, this, {
            autoHandle: true
        });

        Ext.first('#ShowInactiveButton').click();
        Ext.first('#ShowInactiveButton').click();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onResetSort: function (component, e) {
        var me = this,
            crewGrid = me.getView(),
            store = crewGrid.getStore();

        if (store.sorters) {
            store.sorters.removeAll();
            store.reload();
        }
    }

});
