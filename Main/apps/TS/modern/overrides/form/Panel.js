Ext.define('TS.overrides.form.Panel', {
    override: 'Ext.form.Panel',

    isValid: function() {
       return true;
    },

    getForm: function() {
        return this;
    }
});