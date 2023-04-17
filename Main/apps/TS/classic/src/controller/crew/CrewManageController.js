/**
 * Created by steve.tess on 1/26/2018.
 */
Ext.define('TS.controller.crew.CrewManageController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.crewManage',

    init: function () {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            grid = me.lookup('gridCrewManagePopup'),
            store;

        grid.setStore(Ext.getStore('AllCrews'));
        store = grid.getStore();
    },

    onCloseWindow: function (component, e) {
        this.getView().close();
    },

    doSaveSelection: function (component, e) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            selectedGrid = vw.lookup('gridCrewManagePopup').getSelection(),
            ownerDropDown = vw.lookup('preparedByEmpIdField'),
            selectedOwner = ownerDropDown.getValue(),
            crewData;

        selectedGrid[0].set('preparedByEmpId', selectedOwner);
        crewData = selectedGrid[0].getData({
            serialize: true
        });

        Crew.Update(null, settings.username, crewData, function (response, operation, success) {
            me.getView().close();
        }, me, {
            autoHandle: true
        });
    },

    onGridSelectionChange: function (component, selected) {
        var me = this,
            vw = me.getView(),
            ownerDropDown = vw.lookup('preparedByEmpIdField');

        ownerDropDown.setValue(selected[0].get('preparedByEmpId'));
        vw.lookup('saveSelectionBtn').setDisabled(false);
    }
});