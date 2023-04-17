/**
 * Created by steve.tess on 10/8/2016.
 */
Ext.define('TS.common.field.Wbs2', {
    extend: 'Ext.form.field.ComboBox',

    requires: ['TS.model.shared.Wbs2'],

    xtype: 'field-wbs2',

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
            model: 'TS.model.shared.Wbs2',
            pageSize: 10000,
            sorters: [{
                property: 'id',
                direction: 'ASC'
            }]
        });
        me.store.getProxy().extraParams['app'] = config.app;
        me.store.getProxy().extraParams['includeInactive'] = settings.tsAllowTimeOnInactive;
        //stop the database call for wbs2 if params are missing
        if (me.store.getProxy().url == '/shared.Wbs2' && me.store.getProxy().extraParams['wbs1']) {
            me.store.load();
        }

        me.callParent(arguments);
        me.on('change', function (field, newValue) {
            if (!newValue && this.getSelection()) {
                me.select(null);
            }
        });

    }
});