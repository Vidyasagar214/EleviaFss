/**
 * Created by steve.tess on 10/8/2016.
 */
Ext.define('TS.common.field.Wbs3', {
    extend: 'Ext.form.field.ComboBox',

    requires: ['TS.model.shared.Wbs3'],

    xtype: 'field-wbs3',

    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
        '<div class="x-boundlist-item">{id} - {name}</div>',
        '</tpl>'
    ),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
        '{[typeof values === "string" ? values : values["id"]]}',
        '</tpl>'
    ),

    valueField: 'id',
    displayField: 'name',
    matchFieldWidth: false,
    typeAhead: false,

    forceSelection: false,

    constructor: function (config) {
        var me = this,
            settings = TS.app.settings;

        me.store = Ext.create('Ext.data.Store', {
            model: 'TS.model.shared.Wbs3',
            pageSize: 10000,
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }]
        });

        me.store.getProxy().extraParams['app'] = config.app;
        me.store.getProxy().extraParams['includeInactive'] = settings.tsAllowTimeOnInactive;
        //check if in expenses grid
        if(Ext.first('#expListGrid')){
            me.store.getProxy().setExtraParams({
                app: 'FWA',
                includeInactive: settings.tsAllowTimeOnInactive,
                wbs1: Ext.first('#expListGrid').selection.get('wbs1'),
                wbs2: Ext.first('#expListGrid').selection.get('wbs2')
            });
        }

        //stop the database call for wbs3 if params are missing
        if (me.store.getProxy().url == '/shared.Wbs3' && me.store.getProxy().extraParams['wbs1'] && me.store.getProxy().extraParams['wbs2']) {
            me.store.load();
        }

        me.callParent(arguments);
    }
});