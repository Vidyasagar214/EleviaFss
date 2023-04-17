//EXTJS-19657
//form.reset() doesn't reset model in Modern
Ext.define('TS.overrides.field.Text', {
    override: 'Ext.field.Text',

    compatibility: '6.0.2',
    
    /**
     * @private
     */
    syncValueWithComponent: function () {
        this._value = this.getComponent().getValue();
    },

    reset: function() {
        var me = this;
        me.getComponent().reset();

        //we need to call this to sync the input with this field
        me.syncValueWithComponent();

        me.toggleClearIcon(me.isDirty());
    }
});