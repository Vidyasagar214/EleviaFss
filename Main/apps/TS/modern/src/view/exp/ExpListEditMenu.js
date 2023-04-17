/**
 * Created by steve.tess on 7/27/2018.
 */
Ext.define('TS.view.exp.ExpListEditMenu', {
    extend: 'TS.view.common.Menu',
    xtype: 'explist-editmenu',

    scrollable: 'y',
    //controller: 'exp-editor',

    items:[
        {
            text: 'New',
            iconCls: 'x-fa fa-file',
            reference: 'addNewExpenseButton',
            handler: 'addNewExpense'
        },
        {
            text: 'Copy',
            reference: 'expCopyButton',
            iconCls: 'x-fa fa-clone',
            handler: 'doCopyExpItem'
        }
        // {
        //     text: 'Delete',
        //     iconCls: 'x-fa fa-trash',
        //     reference: 'expListRemoveButton',
        //     handler: 'removeExpListItem'
        // }
    ]
});