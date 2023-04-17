/**
 * Created by steve.tess on 7/16/2018.
 */
Ext.define('TS.model.exp.ExpReportModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.expreport',

    stores: {
        expreportlist: {
            model: 'TS.model.exp.ExpenseReport',
            proxy: {
                type: 'default',
                directFn: 'Exp.GetOpenExpReports',
                paramOrder: 'dbi|username|empId'
            }
        }
    }
});