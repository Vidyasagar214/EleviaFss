/**
 * Created by steve.tess on 7/15/2018.
 */
Ext.define('TS.view.exp.ExpenseSelect', {
    extend: 'Ext.window.Window',
    xtype: 'expenseselect',

    modal: true,
    layout: 'fit',

    // tbar: [
    //     {
    //         xtype: 'displayfield',
    //         fieldLabel: 'Employee',
    //         labelStyle: 'font-weight: bold;',
    //         padding: '0 0 0 10',
    //         renderer: function () {
    //             var settings = TS.app.settings,
    //                 record = Ext.getStore('AllEmployees').getById(settings.empId);
    //             return (record ? record.get('lname') + ', ' + record.get('fname') : '');
    //         }
    //     }
    // ],

    items: [{
        xtype: 'expreportlist',

    }],

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 350,
            height: 300
        },
        normal: {
            width: 550,
            height: 500
        }
    },

    title: 'Select Time Period Expense Report'
});