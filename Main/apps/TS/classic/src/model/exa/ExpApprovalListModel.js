/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.model.exa.ExpApprovalListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.expapprovallist',

    stores: {
        expapprovallist: {
            model: 'TS.model.exp.ExpenseReport',
            proxy: {
                type: 'default',
                directFn: 'Exp.GetExpenseApprovalListByDate',
                paramOrder: 'dbi|username|expDate'
            }
        }
    },

    formulas:{

    }
});