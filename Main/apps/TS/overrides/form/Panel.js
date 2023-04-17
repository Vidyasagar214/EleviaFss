Ext.define('TS.overrides.form.Panel', {
    override: 'Ext.form.Panel',

    // Custom method to force the form isDirty to return false
    resetDirtyState: function() {
        this.getForm().isDirty = function() { return false; }
    }

});