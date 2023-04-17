/**
 * Created by steve.tess on 4/17/2019.
 */
Ext.define('TS.view.fwa.FwaPanel', {
    extend: 'Ext.panel.Panel',

    xtype: 'fwa-panel',

    requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.Fit',
        'TS.view.fwa.AssignmentForm',
        'TS.view.fwa.FWAList',
        'TS.view.fwa.Header'
    ],
   
    layout: 'fit',
    border: false,
    closable: false,
    scrollable: 'x',

    cls: 'fwapanel',

    items: [
        {
            xtype: 'header-fwa',
            docked: true,
            region: 'north'
        },
        {
            xtype: 'fwalist',
            resizable: false,
            isScheduler: false,
            region: 'center',
            reference: 'fwaGrid',
            collapsed: false
        },
        {
            xtype: 'form-fwa',
            resizable: false,
            region: 'south',
            reference: 'fwaForm',
            //collapsible: false,
            split: false,
            expandToolText: '',
            collapseToolText: '',
            height: '100%',// '95%',
            collapseMode: 'mini',
            collapsed: true
        }
    ],
    listeners: {
        beforerender: function(cmp){
            var form = Ext.first('form-fwa'),
                grid = Ext.first('fwalist');
            Ext.first('form-fwa').collapse();
            Ext.first('fwalist').expand();
            Ext.first('form-fwa').setHidden(true);
            Ext.first('fwalist').setHidden(false);
        }
    }
});