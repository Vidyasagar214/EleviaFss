Ext.define('TS.common.field.WBS', {

    extend: 'Ext.form.field.ComboBox',

    requires: ['TS.model.shared.Wbs1', 'TS.model.shared.Wbs2', 'TS.model.shared.Wbs3'],

    xtype: 'field-wbs',

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

    isDirty: function () {
        var me = this,
            value = ((me.getValue() === '' || me.getValue() === ' ') ? null : me.getValue());
        return !me.disabled && !me.isEqual(value, me.originalValue);
    },

    constructor: function (config) {
        var me = this,
            settings = TS.app.settings;
        if (!config.modelName) {
            Ext.Error.raise('Component of xtype "field-wbs" must have modelName config set.');
            return;
        }

        me.store = Ext.create('Ext.data.Store', {
            model: 'TS.model.shared.' + config.modelName,
            pageSize: 10000,
            sorters: [{
                property: (config.modelName == 'Wbs2' ? 'id' : 'name'),
                direction: 'ASC'
            }]
        });

        me.store.getProxy().extraParams['app'] = config.app;
        me.store.getProxy().extraParams['includeInactive'] = settings.tsAllowTimeOnInactive;
        //stop the database call for wbs2 & wbs3 if params are missing
        if (me.store.getProxy().url == '/shared.Wbs1' ||
            (me.store.getProxy().url == '/shared.Wbs2' && me.store.getProxy().extraParams['wbs1']) ||
            (me.store.getProxy().url == '/shared.Wbs3' && me.store.getProxy().extraParams['wbs1'] && me.store.getProxy().extraParams['wbs2'])) {
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
