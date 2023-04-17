/**
 * Created by steve.tess on 7/10/2018.
 */
Ext.define('TS.model.exp.ExpListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.explist',

    requires: [
        'TS.model.exp.Expense'
    ],

    stores: {
        explist: {
            model: 'TS.model.exp.Expense',
            proxy: {
                type: 'default',
                directFn: 'Exp.GetExpReport',
                paramOrder: 'dbi|username|expReportId',
                reader: {
                    type: 'default',
                    rootProperty: 'data.expLines'
                }
            }
        }
    },

    formulas:{
        hideExpWbs1: function (get) {
            if (get('settings.exDisplayWbs1') == 'B' || get('settings.exDisplayWbs1') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs1Name: function (get) {
            if (get('settings.exDisplayWbs1') == 'B' || get('settings.exDisplayWbs1') == 'A')
                return false;
            else
                return true;
        },

        hideExpWbs2: function (get) {
            if (get('settings.exDisplayWbs2') == 'B' || get('settings.exDisplayWbs2') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs2Name: function (get) {
            if (get('settings.fwaDisplayWbs3') == 'B' || get('settings.fwaDisplayWbs3') == 'A')
                return false;
            else
                return true;
        },

        hideExpWbs3: function (get) {
            if (get('settings.exDisplayWbs3') == 'B' || get('settings.exDisplayWbs3') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs3Name: function (get) {
            if (get('settings.exDisplayWbs3') == 'B' || get('settings.exDisplayWbs3') == 'A')
                return false;
            else
                return true;
        },

        hideAccount: function(get){
            return !(get('settings.exDisplayAccount') === 'B' || get('settings.exDisplayAccount') === 'U');
        },

        hideAccountName: function(get){
            return !(get('settings.exDisplayAccount') === 'B' || get('settings.exDisplayAccount') === 'A');
        },

        displayBillable: function(get){
            return get('settings.exDisplayBillable');
        },

        displayCompanyPaid: function(get){
            return get('settings.exDisplayCompanyPaid');
        }

    }
});