/**
 * Created by steve.tess on 11/29/2016.
 */
Ext.define('TS.view.fwa.UnitDetailsPanel', {
    extend: 'Ext.window.Window',
    xtype: 'window-unitdetails',

    modal: true,
    layout: 'fit',

    controller: 'grid-unitdetails',

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
    title: 'Mileage Details',

    items: [
        {
            xtype: 'grid-unitdetails',
            flex: 1,
            reference: 'unitdetails',
            itemId: 'unitdetails'
        }
    ],

    buttons: [
        {
            text: 'Add',
            reference: 'detailsAdd',
            handler: 'addUnitDetails'
        },
        {
            text: 'Delete',
            reference: 'detailsDelete',
            handler: 'deleteUnitDetails',
            bind:{
                disabled: '{!unitdetails.selection}'
            }
        },
        '->',
        {
            text: 'Save',
            reference: 'detailsSave',
            handler: 'saveUnitDetails',
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            }
        },
        {
            text: 'Cancel',
            handler: 'cancelUnitDetails'
        }
    ],
    listeners:{
        //beforeclose: 'onUnitDetailsBeforeClose'
    }
});