/**
 * Created by steve.tess on 7/24/2018.
 */
Ext.define('TS.view.exp.ExpList', {
    extend: 'Ext.container.Container', //extend: 'Ext.grid.Grid',
    xtype: 'exp-list',

    layout: 'fit',
    //scrollable: true,

    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            docked: 'top',
            title: 'Expenses',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    align: 'left',
                    iconCls: 'x-fa fa-chevron-left',
                    handler: 'navigateToGrid'

                },
                {
                    align: 'right',
                    iconCls: 'x-fa fa-bars',
                    handler: 'onEditListMenuTap',
                    bind: {
                        disabled: '{!hasExpEditRights}',
                        hidden: '{isExpApproval}'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            scrollable: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Report Values',
                    items: [
                        {
                            xtype: 'displayfield',
                            label: 'Rpt Date',
                            bind: '{selectedExpReport.formattedReportDate}',
                            reference: 'reportDateField',
                            listeners: {
                                change: 'onReportDateChange'
                            },
                            renderer: Ext.util.Format.dateRenderer(DATE_FORMAT)
                        },
                        {
                            xtype: 'textfield',
                            label: 'Rpt Name',
                            reference: 'reportNameText',
                            placeHolder: 'Enter Report Name',
                            bind: '{selectedExpReport.reportName}'
                        },
                        {
                            xtype: 'textfield',
                            label: 'Rpt Status',
                            reference: 'reportStatusText',
                            readOnly: true,
                            cls: 'border-bottom',
                            bind: '{selectedExpReport.statusText}'
                        }
                    ]
                },
                {
                    xtype: 'component',
                    height: 25,
                    html: '<div style="width:100%;">' +
                        '<div style="float:left;width:100px;padding-left:10px;font-weight:bold;">Date</div>' +
                        '<div style="float:right;width:100px;font-weight:bold;">Amount</div>' +
                        '<div style="margin:0 auto;width:100px;font-weight:bold;">Category</div>' +
                        '</div>',
                },

                {
                    xtype: 'list',
                    margin: '0 10 0 10',
                    //scrollable: true,
                    grouped: true,
                    reference: 'expenseList',
                    itemId: 'expenseList',
                    itemTpl: new Ext.XTemplate('<table style="width: 90%">' +
                        '<tr>' +
                        '<td style="width: 33%; text-align: left; {[this.getBackground(values)]} ">{[this.getExpenseDate(values)]}</td>' +
                        '<td style="width: 33%;text-align: center; {[this.getBackground(values)]} ">{[this.getExpenseCategory(values)]}</td>' +
                        '<td style="width: 33%; text-align: right; {[this.getBackground(values)]}">{[this.getExpenseAmount(values)]}</td>' +
                        '</tr>' +
                        '</table>', {

                        getBackground: function (values) {
                            if (values.modified == 'D')
                                return 'background: red; color: white;';
                            else
                                return '';
                        },

                        getExpenseDate: function (values) {
                            var d = Ext.Date;
                            return d.format(new Date(values.expDate), DATE_FORMAT)
                        },

                        getExpenseCategory: function (values) {
                            var category = Ext.getStore('ExpCategory').findRecord('category', values.category);
                            return category.get('description');
                        },

                        getExpenseAmount: function (values) {
                            return Ext.util.Format.currency(values.amount, '$', 2);
                        }

                    }),

                    preventSelectionOnDisclose: false, // Let the disclosure also selects the record in the list
                    // enables disclosure rendering and signifies recipient method
                    onItemDisclosure: true,

                    listeners: [
                        {
                            itemsingletap: 'editSelectedExpense',
                            itemdoubletap: 'onEditExpenseDoubleTap' //returns false so we can highlight row and use menu
                        }
                    ],

                    bind: {
                        store: '{explist}',
                        selection: '{selectedEXP}'
                    }
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Save',
                    align: 'left',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSaveExpReport',
                    style: 'margin-right: 5px;',
                    reference: 'saveExpButton',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    },
                    hidden: true
                },
                {
                    text: 'Submit',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    handler: 'doSubmitExpenseReport',
                    reference: 'submitExpButton',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                }
            ]
        },
        {
            xtype: 'component',
            docked: 'bottom',
            height: 24,
            style: 'text-align:center;border-top:1px solid #ccc',
            html: '* Double tap expense to highlight.'
        },
    ]
});