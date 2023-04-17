/*
 * Either is passed an record to show a marker for a specific FWA
 * -OR-
 * No fwaRecord is passed, and shows location of all FWAs
 */

Ext.define('TS.view.fwa.FwaMap', {
    extend: 'Ext.window.Window',

    xtype: 'window-fwamap',

    controller: 'window-fwamap',
    modal: true,

    items: [{
        xtype: 'map-fwa'
    }],

    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Location'},
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    maximizable: true,

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 250,
            height: 280
        },
        normal: {
            width: 500,
            height: 350
        }
    },

    config: {
        fwaRecord: null,
        fwaStore: null,
        isSingleFwa: false,
        draggablePin: false
    },

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [{
                xtype: 'map-fwa',
                fwaStore: me.getFwaStore(),
                fwaRecord: me.getFwaRecord(),
                draggablePin: me.getDraggablePin(),
                isSingleFwa: me.getIsSingleFwa(),
                flex: 1
            }]
        });
        me.callParent(arguments);
    },

    buttons:[
        {
            text: 'Close',
            align: 'right',
            handler: 'mapCloseClick'
        }
    ],

    listeners:{
        close: 'onMapClose'
    }

});
