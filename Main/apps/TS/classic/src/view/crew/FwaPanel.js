/**
 * Created by steve.tess on 2/27/2018.
 */
Ext.define('TS.view.crew.FwaPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'panel-fwa',

    title: {_tr: 'fwaAbbrevLabel', tpl: '{0}s'},
    layout: 'border',
    closable: false,
    resizable: false,
    scrollable: true,

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                width: 70,
                iconCls: 'x-fa fa-home',
                align: 'left',
                handler: 'onBackToFSS',
                bind: {
                    hidden: '{!fromFSS}'
                },
                tooltip: 'FSS application list'
            },
            '->',
            {
                text: 'Print All',
                //ui: 'darkblue',
                handler: 'printAll',
                itemId: 'printAllButton',
                align: 'right'
            },
            {
                align: 'right',
                //ui: 'darkblue',
                text: 'Maps',
                itemId: 'showFwaMapButton',
                handler: 'showFwaMap'
            },
            //'->',
            {
                text: '< List View',
                itemId: 'fwaGridButtonNew',
                hidden: true,
                handler: 'backToGrid'
            },
            {
                text: '< List View',
                itemId: 'fwaGridButton',
                hidden: true,
                handler: 'backToGrid'
            },
            {
                align: 'right',
                text: {_tr: 'fwaAbbrevLabel', tpl: 'New {0}'},
                //ui: 'darkblue',
                handler: function () {
                    //TS.app.redirectTo('newfwa');
                    Ext.GlobalEvents.fireEvent('StartNewFwa');
                },
                width: 100,
                itemId: 'newFwaButton',
                bind: {
                    //hidden: '{settings.schedReadOnly}'
                }
            },
            {
                iconCls: 'x-fa fa-refresh',
                align: 'right',
                tooltip: 'Refresh screen',
                handler: 'refreshFwaPanel',
                itemId: 'refreshFwaListBtn',
                // bind: {
                //     disabled: '{newFwa}'
                // }
            },
            {
                iconCls: 'x-fa fa-cogs',
                handler: 'openSettingsWindow',
                tooltip: 'User Settings',
                width: 75
            },
            {
                iconCls: 'x-fa fa-info-circle',
                width: 25,
                handler: 'openAboutFss',
                tooltip: 'About FSS'
            }
        ]
    }],
    tbar: {
        cls: 'toolbar-background',
        itemId: 'schedFwaGridToolbar',
        items: [
            {
                text: {_tr: 'fwaAbbrevLabel', tpl: 'Search {0} list'},
                //iconCls: 'search',
                handler: 'showSearchListWindow',
                tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Search list for matching {0}s'},
                reference: 'searchButton',
                itemId: 'fwaSearchButton',
                margin: '0 10 0 0'
            },
            {
                text: 'Clear Grid Filters',
                tooltip: 'Clear all grid filters',
                handler: 'onClearFilters',
                reference: 'clearButton',
                itemId: 'clearButton',
            },
            '->',
            {
                xtype: 'button',
                itemId: 'btnViewLastWeek',
                iconCls: 'x-fa fa-arrow-left',
                handler: 'filterByWeekLast',
                tooltip: 'View Previous',
                reference: 'btnViewLastWeek',
                hidden: true
            },
            {
                xtype: 'label',
                itemId: 'labelFwaCurrentDate',
                style: 'color: white; font-size: 17px;',
                padding: '0 0 0 10',
                bind: {
                    html: '<b>{fwaListCurrentDate}</b>'
                },
                reference: 'labelFwaCurrentDate',
                hidden: true
            },
            {
                xtype: 'button',
                itemId: 'btnViewNextWeek',
                iconCls: 'x-fa fa-arrow-right',
                handler: 'filterByWeekNext',
                tooltip: 'View Next',
                reference: 'btnViewNextWeek',
                hidden: true
            },
            '->',
            {
                xtype: 'button',
                text: 'Week View',
                //iconCls: 'x-fa fa-calendar',
                itemId:'btnWeekView',
                handler: 'filterByWeek',
                width: 100,
                reference: 'btnWeekView'
            },
            {
                xtype: 'fixedspacer'
            },
            {
                xtype: 'displayfield',
                itemId: 'schedRowCtField'
            }
        ]
    },

    items: [
        {
            xtype: 'fwalist',
            resizable: false,
            height: '95%',
            width: window.screen.width,
            reference: 'schedulerFwaGrid',
            itemId: 'schedulerFwaGrid',
            region: 'center',
            isScheduler: true,
            expandToolText: '',
            collapseToolText: '',
            collapsible: false,
            collapsed: false,
            collapseMode: 'mini',
            hidden: false
        },
        {
            xtype: 'form-fwa',
            resizable: false,
            isScheduler: true,
            width: window.screen.width,
            //added below to deal with zoom +- by user in browser settings
            minWidth: window.screen.width,
            expandToolText: '',
            collapseToolText: '',
            collapsible: false,
            collapsed: true,
            region: 'south',
            collapseMode: 'mini',
            height: '100%',
            reference: 'fwaForm',
            itemId: 'fwaForm',
            //hidden: true
        }
    ],
    listeners: {
        beforerender: function(cmp){
            var form = Ext.first('form-fwa'),
                grid = Ext.first('fwalist');
            Ext.first('form-fwa').setHidden(true);
            Ext.first('fwalist').setHidden(false);
            grid.show();

          grid.stateId = STATEID;
          grid.getView().refresh();

        },
        afterrender: function(){
            var form = Ext.first('form-fwa'),
                grid = Ext.first('fwalist');
            form.setHidden(true);
            grid.expand();
            grid.show();
            //Ext.resumeLayouts(true);
        }
    }
});

