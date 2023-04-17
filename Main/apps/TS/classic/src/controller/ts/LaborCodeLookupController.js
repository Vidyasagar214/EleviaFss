Ext.define('TS.controller.ts.LaborCodeLookupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-labor-code-lookup',

    //requires: [
    //    'TS.common.grid.LaborCode'
    //],

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

        // Create a new grid component for the given laborLevel
        var laborGrid = Ext.create('TS.common.grid.LaborCode');

        laborGrid.setStore(Ext.create('Ext.data.Store', {
            model: 'TS.model.ts.LaborCode',
            autoLoad: true,
            remoteFilter: false,
            filters: {
                property: 'lcLevel',
                value: laborLevel
            }
        }));

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
        var laborCode = this.getViewModel().get('laborCodeString'),
            callingPage = this.getView().callingPage; //getCallingPage();

        if (callingPage == 'TS') {
            //TODO: Sencha Fragile code
            Ext.first('grid-timesheetrow').getController().setLaborCode(laborCode);
        } else {
            Ext.first('window-projecteditor').getController().setLaborCode(laborCode);
        }
        this.getView().close();
    },

    onCancelLookup: function () {
        this.getView().close();
    }

});