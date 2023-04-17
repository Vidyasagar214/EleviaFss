/**
 * Created by steve.tess on 9/1/2016.
 */
Ext.define('TS.view.fwa.FwaActions', {
    extend: 'Ext.window.Window',
    xtype: 'window-fwaactions',

    modal: true,
    layout: 'fit',

    controller:'grid-fwaactions',
    constrainHeader: true,

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 500,
            height: 300
        },
        normal: {
            width: 750,
            height: 300
        }
    },

    scrollable: true,

    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Actions'},
    titleAlign: 'center',
    items: [{
        xtype: 'grid-fwaactions',
        flex: 1,
        reference: 'fwaactions',
        itemId: 'fwaactions',
        disabledCls: 'my-disabled-class',
        bind:{
            disabled: '{schedReadOnly}'
        }
    }],

    buttons: [
        {
            text: 'Add',
            handler: 'addFwaAction',
            bind:{
                hidden: '{schedReadOnlyAndNotScheduler}'
            }
        },
        {
            text: 'Delete',
            //iconCls: 'workitem-delete',
            handler: 'deleteFwaAction',
            bind:{
                hidden: '{schedReadOnlyAndNotScheduler}',
                disabled: '{!fwaactions.selection}'
            }
        },
        '->',
        {
            text: 'Save',
            //iconCls: 'save',
            handler: 'savePrePostActions',
            bind:{
                hidden: '{schedReadOnlyAndNotScheduler}'
            },
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            }
        },
        {
            text: 'Cancel',
            //iconCls: 'reject-ts',
            handler: 'cancelPrePostActions'
        }
    ],
    listeners:{
        // close: 'onActionItemsClose'
        beforeclose: 'onActionItemsBeforeClose'
    }


});