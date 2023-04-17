/**
 * Created by steve.tess on 10/8/2016.
 */
Ext.define('TS.common.field.Wbs1', {
    extend: 'Ext.form.field.ComboBox',

    requires: [
        'Ext.data.Store',
        'TS.model.shared.Wbs1'
    ],

    xtype: 'field-wbs1',

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
    bind:{
        displayField: '{settings.wbs1SearchBy}' // 'id',
    },

    matchFieldWidth: false,
    typeAhead: true,
    queryMode: 'local',
    anyMatch: true,
    listeners: {
        focus: function (t, event, eOpts) {
            var me = t,
                value = ((me.getValue() === '' || me.getValue() === ' ') ? null : me.getValue());
            if (value) {
                new Ext.ToolTip({
                    target: t.getEl(),
                    html: value
                });
            }
        }
    },
    forceSelection: false,

    constructor: function (config) {
        var me = this,
            settings = TS.app.settings;

        me.store = Ext.create('Ext.data.Store', {
            model: 'TS.model.shared.Wbs1',
            pageSize: 10000,
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }]
        });

        me.store.getProxy().extraParams['app'] = config.app;
        me.store.getProxy().extraParams['includeInactive'] = settings.tsAllowTimeOnInactive;
        me.store.load();

        me.callParent(arguments);

        me.on('change', function (field, newValue) {
            if (!newValue && this.getSelection()) {
                me.select(null);
            }
        });
    }
});
