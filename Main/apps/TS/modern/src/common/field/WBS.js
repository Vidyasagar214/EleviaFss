Ext.define('TS.common.field.WBS', {
    extend: 'Ext.field.Select',

    requires: [
        'TS.common.picker.TwoLinePicker',
        'TS.model.shared.Wbs1',
        'TS.model.shared.Wbs2',
        'TS.model.shared.Wbs3'
    ],

    xtype: 'field-wbs',

    //Topmost component when searching for references
    referenceRoot: 'formpanel', //custom property

    valueField: 'id',
    displayField: 'id',

    autoSelect: false, //prevent auto selection of store's first value (causes 2x call to set value)

    getPhonePicker: function () {
        var me = this,
            phonePicker = me.phonePicker,
            config;

        if (!phonePicker) {
            config = me.getDefaultPhonePickerConfig();
            me.phonePicker = phonePicker = Ext.create('TS.common.picker.TwoLinePicker', Ext.apply({
                slots: [{
                    align: 'left',
                    name: me.getName(),
                    valueField: me.getValueField(),
                    displayField: me.getDisplayField(),
                    value: me.getValue(),
                    store: me.getStore()
                }],
                listeners: {
                    change: me.onPickerChange,
                    scope: me
                }
            }, config));
        }

        return phonePicker;
    },
    
    isDirty: function () {
        var me = this,
            value = ((me.getValue() === '' || me.getValue() === ' ') ? null : me.getValue());
        return !me.disabled && !me.isEqual(value, me.originalValue);
    },

    initialize: function () {
        //STOP if offline
        if(IS_OFFLINE) return;
        var me = this,
            settings = TS.app.settings,
            cfg = me.config;

        if (!cfg.modelName) {
            Ext.Error.raise('Component of xtype "field-wbs" must have modelName config set.');
            return;
        }

        me.setStore({
            model: 'TS.model.shared.' + cfg.modelName,
            pageSize: 10000,
            sorters: [{
                property: (cfg.modelName == 'Wbs2' ? 'id' : 'name'),
                direction: 'ASC'
            }]
        });

        me.callParent(arguments);

        me.getStore().getProxy().extraParams['app'] = cfg.app;
        me.getStore().getProxy().extraParams['includeInactive'] = settings.tsAllowTimeOnInactive;

        if (cfg.deferredLoad) {
            me.getStore().load();
        }
    },

    /**
     * Custom setValue method.
     * @param newValue
     * @param clearChain used from picker to clear out values in chained combos below the hierarchy
     */
    setValue: function (newValue, clearChain) {
        //STOP if offline
        if(IS_OFFLINE) return;
        var me = this,
            value = Ext.isObject(newValue) ? newValue.get('id') : newValue,
            cfg = me.config,
            sets = cfg.sets ? me.up(me.referenceRoot).down('#' + cfg.sets) : false,
            clears = cfg.clears,
            store = sets ? sets.getStore() : null,
            depValue;

        me.callParent(arguments);

        //Clear out chain when value is received from picker and not set directly
        if (clearChain && clears && clears.length) {
            clears.forEach(function (id) {
                me.up(me.referenceRoot).down('#' + id).setValue('');
            });
        }

        // Set up dependencies
        if (sets && store && value) {
            for (var key in me.dependencyFilter) {
                if (key === me.modelName.toLowerCase()) {
                    depValue = value;
                } else {
                    depValue = me.up(me.referenceRoot).down('#' + me.dependencyFilter[key]).getValue();
                }
                store.getProxy().extraParams[key] = depValue;
            }
            store.load();
        }
    },

    onPickerChange: function (picker, value) {
        var me = this,
            newValue = value[me.getName()],
            store = me.getStore(),
            index = store.find(me.getValueField(), newValue, null, null, null, true),
            record = store.getAt(index);

        me.setValue(record, true); //Overridden
    }
});
