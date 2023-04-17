//https://sencha.jira.com/browse/EXTJS-19390
//Selectfield does not properly apply bind value when using a restful store
Ext.define('TS.overrides.field.Select', {
    override: 'Ext.field.Select',

    compatibility: '6.0.2',

    applyValue: function (value) {
        var ret = this.callParent(arguments),
            store = this.getStore();

        if(!store) return ret;

        if (ret === null && !store.isLoaded()) {
            this.getInitialConfig().value = value;
        }

        if(!store && (value || value === 0)){
            // the store might be updated later so we need to cache this value and apply it later
            this.cachedValue = value;
        }

        //Handle separately
        if(store && store.isLoading) {
            // if store is loading new data, let's cache it and apply when new data has arrived
            this.cachedValue = value;
        }

        return ret;
    },
    
    //https://sencha.jira.com/browse/EXTJS-19392
    //Selectfield published value for 'value' differs from combobox
    // Fixes issue where selectfield is publishing selection to viewModel rather than actual value
    publishState: function (property, value) {
        var me = this,
            binds = me.getBind(),
            binding = binds && property && binds[property];

        if (binding && !binding.syncing && !binding.isReadOnly()) {
            if (!(binding.calls === 0 && (value == null || value === me.getInitialConfig()[property]))) {
                if (value instanceof Ext.data.Model) {
                    value = value.get(me.getValueField());
                }
            }
        }
        this.callParent([property, value]);
    },

    onStoreDataChanged: function(store) {
        var me = this,
            initialConfig = me.getInitialConfig(),
            value = me.getValue();

        if(me.cachedValue) { //cached value has priority
            me.setValue(me.cachedValue);
            me.cachedValue = null;
        }
        else if (value || value === 0) {
            me.setValue(value);
        }

        if (me.getValue() === null) {
            if(me.cachedValue || me.cachedValue === 0){
                me.setValue(me.cachedValue);
                me.cachedValue = null;
            }else if (initialConfig.hasOwnProperty('value')) {
                me.setValue(initialConfig.value);
            }

            if (me.getValue() === null && me.getAutoSelect()) {
                if (store.getCount() > 0) {
                    me.setValue(store.getAt(0));
                }
            }
        }
    }
});