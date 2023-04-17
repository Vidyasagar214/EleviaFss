Ext.define('TS.model.utilities.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.utilities-main',

    stores: {
        utilitieslist: {
            model: 'TS.model.utilities.UtilitiesList'
        }
    },

    //Main model will implement this method
    getPageTitle: function () {
        return 'Utilities';
    }

});