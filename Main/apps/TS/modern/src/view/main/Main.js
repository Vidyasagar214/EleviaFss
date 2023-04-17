//Watch for 6.0.2 Fixes
//https://sencha.jira.com/browse/EXTJS-19631
//https://sencha.jira.com/browse/EXTJS-19469
//https://sencha.jira.com/browse/EXTJS-19549

Ext.define('TS.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    fullscreen: true,
    tabBar: {
        hidden: true
    },

    requires: [
        'Ext.MessageBox'
    ],

    mixin: [
        'Ext.mixin.Responsive'
    ]
});
