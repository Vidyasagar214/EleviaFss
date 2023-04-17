/**
 * Created by steve.tess on 7/23/2018.
 */
Ext.define('TS.view.exp.ExpEditMenu', {
    extend: 'TS.view.common.Menu',
    xtype: 'exp-editmenu',

    reference: 'expEditMenu',
    scrollable: 'y',
    controller: 'exp-editor',
    items: [
        {
            text: 'Doc',
            xtype: 'button',
            reference: 'expDocButton',
            itemId: 'expDocButton',
            iconCls: 'x-fa fa-file-text-o',
            handler: 'onAttachExpDoc'
        }, {
            text: 'Delete',
            iconCls: 'x-fa fa-trash',
            reference: 'expRemoveButton',
            itemId: 'removeExpButton',
            handler: 'removeExpForm',
            bind:{
                disabled: '{!hasExpEditRights}'
            }
        }
    ]
});