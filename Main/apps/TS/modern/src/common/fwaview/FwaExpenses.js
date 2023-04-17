/**
 * Created by steve.tess on 8/13/2018.
 */
Ext.define('TS.common.fwaview.FwaExpenses', {
    extend: 'Ext.Sheet',
    xtype: 'ts-fwaexpenses',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Employee Expenses',
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    //action: 'close'
                    handler: function () {
                        this.up('sheet').hide();
                    }
                }
            ]
        },
        {
            xtype: 'component',
            height: 25,
            docked: 'top',
            userCls: 'ts-user-details',
            bind: {
                data: {
                    settings: '{settings}'
                }
            },
            tpl: new Ext.XTemplate('<div class="hours-header">',
                '<span><h2>Date</h2></span><span><h2>Employee</h2></span><span><h2>Category</h2></span></div>')
        },
        {
            xtype: 'list',
            scrollable: 'y',
            itemCls: 'ts-day-view-item',
            itemTpl: new Ext.XTemplate('<div class="hours-detail"><span>{expDate:date("n/j/Y")}</span><span>{[this.getEmployeeName(values)]}</span><span>{[this.getCategoryName(values)]}</span></div>',
                '<div><b>Description:</b><span>&nbsp;{description}</span></div>',
                '<div><b>Amount:</b> {[this.getAmount(values)]}</div>',
                '<div><b>Reason:</b> {reason}</div>',
                {
                    //we need this because sometimes all we have is the empId
                    getEmployeeName: function (values) {
                        return Ext.getStore('Employees').getById(values.empId).get('empName');
                    },

                    getCategoryName: function (values) {
                        return Ext.getStore('ExpCategory').getById(values.category).get('description');
                    },

                    getAmount: function (values) {
                        return '$' + values.amount;// (values.amount).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    }


                }
            ),

            itemHeight: 80, //making up some extra space
            onItemDisclosure: false,
            bind: {
                store: '{fwa.expenses}'
            }
        }
    ]
});