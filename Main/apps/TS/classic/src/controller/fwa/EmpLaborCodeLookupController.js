/**
 * Created by steve.tess on 12/13/2018.
 */
Ext.define('TS.controller.fwa.EmpLaborCodeLookupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emp-window-labor-code-lookup',

    init: function () {

        var settings = TS.app.settings;

        for (var laborLevel = 1; laborLevel <= settings.tsLcLevels; laborLevel++) {

            this.addLaborCodeGrid(laborLevel);
        }

        if (settings.tsLcLevels > 2) {
            this.getView().setWidth(225 * settings.tsLcLevels);
        }

    },

    addLaborCodeGrid: function (laborLevel) {
        var laborGrid = Ext.create('TS.common.grid.LaborCode'),
            lcStore = Ext.getStore('LaborCodes');

        lcStore.clearFilter(true);
        lcStore.addFilter({
            filterFn: function (record) {
                return record.get('lcLevel') === laborLevel;
            }
        });
        laborGrid.setStore(Ext.create('Ext.data.Store', {
            model: 'TS.model.shared.LaborCode',
            remoteFilter: false
        }));
        //add each record
        Ext.each(lcStore.getRange(), function (rec) {
            laborGrid.getStore().add(rec);
        });
        this.lookup('laborCodeGridsContainer').add(laborGrid);
    },

    selectLaborCode: function (el, record, index, eOpts) {

        var viewModel = this.getViewModel(),
            settings = TS.app.settings,
            // Labor Code Level of this record
            level = record.get('lcLevel'),
            // If no laborCodes/laborLabels set, init a new array
            laborCodes = (viewModel.get('laborCodes') || []),
            laborLabels = (viewModel.get('laborLabels') || []);

        // Update the arrays of selected items on the viewModel
        laborCodes[level] = record.get('lcCode');
        laborLabels[level] = record.get('lcLabel');

        viewModel.set('laborCodes', laborCodes);
        viewModel.set('laborLabels', laborLabels);

        // For displaying on the view, we need to remove null values,
        // then collapse the arrays into strings using the delimiter setting.
        viewModel.set('laborCodeString', laborCodes.filter(function (e) {
            return e
        }).join(settings.tsLcDelimiter));
        viewModel.set('laborLabelString', laborLabels.filter(function (e) {
            return e
        }).join(' / '));
    },

    onOkLookup: function () {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            laborCode = vm.get('laborCodeString');
        if (vw.callingPage == 'EmpHoursNew') {
            Ext.first('#laborCodeField').setValue(laborCode);
        } else {
            Ext.first('grid-employeehours').getController().setLaborCode(laborCode);
        }
        this.getView().close();
    },

    onCancelLookup: function () {
        this.getView().close();
    }

});