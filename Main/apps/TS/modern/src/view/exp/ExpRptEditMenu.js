/**
 * Created by steve.tess on 7/27/2018.
 */
Ext.define('TS.view.exp.ExpRptEditMenu', {
    extend: 'TS.view.common.Menu',
    xtype: 'exprpt-editmenu',

    reference: 'expEditMenu',
    scrollable: 'y',

    items:[
        {
            text: 'Copy',
            xtype: 'button',
            reference: 'expCopyButton',
            itemId: 'expCopyButton',
            iconCls: 'x-fa fa-clone',
            handler: 'doCopyExpReport',
            hidden: true
        }, {
            text: 'Delete',
            iconCls: 'x-fa fa-trash',
            reference: 'expRemoveButton',
            itemId: 'removeExpButton',
            handler: 'removeExpReport'
        }
    ]
});