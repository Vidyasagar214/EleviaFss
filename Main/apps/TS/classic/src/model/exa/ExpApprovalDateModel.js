/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.model.exa.ExpApprovalDateModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.expapprovaldate',

    stores: {
        expapprovaldatelist: {
            model: 'TS.model.exp.Expense',
            proxy: {
                type: 'default',
                directFn: 'Exp.GetExpenseApprovalDates',
                paramOrder: 'dbi|username|empId'
            }
        }
    },

    formulas:{

    }
});