/**
 * Created by steve.tess on 5/17/2016.
 */
Ext.define('TS.view.fss.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'ts-fss',
    style: 'background: white !important;',
    requires: [
        'TS.controller.fss.MainController',
        'TS.model.fss.MainModel',
        'TS.view.fss.FssList',
        'TS.view.fss.Header'
    ],

    controller: 'fss-main',
    viewModel: 'fss-main',

    layout: 'border',
    items: [
        {
            xtype: 'header-fss',
            region: 'north'
        },
        {
            xtype: 'header-two-fss',
            region: 'north'
        },
        {
            xtype: 'panel',
            scrollable: 'y',
            layout: 'hbox',
            region: 'center',
            defaults: {
                border: false
            },
            style: 'background: white !important;',
            items: [
               {
                    xtype: 'fss-list',
                    bind: {
                        store: '{fsslist}'
                    },
                    flex: 1
                },
                {
                    xtype: 'fss-list-east',
                    reference: 'fssListEastStore',
                    bind: {
                        store: '{fsslisteast}'
                    },
                    flex: 1
                }
            ]
        },
        {
            xtype: 'footer-fss',
            region: 'south'
        }

    ],
    listeners: {
        afterrender: function (comp) {
            var me = this,
                vm = me.getViewModel(),
                store = vm.getStore('fsslist'),
                storeEast = vm.getStore('fsslisteast');

            /* uncomment below to allow a direct call to the single application*/
            if (store.getRange().length + storeEast.getRange().length == 1) {
                Ext.GlobalEvents.fireEvent('ChangeViewport', store.getRange()[0].get('app'));
            }
        }

    }

});