/**
 * Created by steve.tess on 8/3/2018.
 */
Ext.define('TS.common.field.ExpAccount', {
    extend: 'Ext.field.Select',

    requires: [
       'TS.common.picker.ExpTwoLinePicker'
    ],

    xtype: 'field-expaccount',

    autoSelect: false,
    referenceRoot: 'formpanel',
    valueField: 'account',
    displayField: 'account',

    store: 'ExpAccount',

    getPhonePicker: function () {
        var me = this,
            phonePicker = me.phonePicker,
            config;

        if (!phonePicker) {
            config = me.getDefaultPhonePickerConfig();
            me.phonePicker = phonePicker = Ext.create('TS.common.picker.ExpTwoLinePicker', Ext.apply({
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
        var me = this,
            settings = TS.app.settings,
            cfg = me.config;

        me.callParent(arguments);

        me.getStore().getProxy().extraParams['app'] = cfg.app;
        me.getStore().getProxy().extraParams['includeInactive'] = settings.tsAllowTimeOnInactive;

        me.getStore().load();
    },

    /**
     * Custom setValue method.
     * @param newValue
     * @param clearChain used from picker to clear out values in chained combos below the hierarchy
     */
    setValue: function (newValue, clearChain) {
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