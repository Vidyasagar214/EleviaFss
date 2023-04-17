Ext.define('TS.common.field.Display', {
    extend: 'Ext.field.Field',
    xtype: 'displayfield',

    config: {
        displayText: null,
        cls: 'ts-displayfield',
        component: {
            xtype: 'divcomponent'
        }
    },

    updateValue: function(value) {
        this.getComponent().displayElement.setHtml(value);
        this.fireEvent('change', value);
    }
});