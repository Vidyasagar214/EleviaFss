//EXTJS-18639
//Ext.field.Text moves cursor to the end of the field when not appending
Ext.define('TS.overrides.field.Input', {
    override: 'Ext.field.Input',
    compatibility: '6.0.2',

    updateValue: function(newValue) {
        var input = this.input,
            dom = input && input.dom;

        if (dom && dom.value !== newValue) {
            dom.value = newValue;
        }
    },

    doBlur: function(e) {
        this.showMask();
        this.setIsFocused(false);
    }
});