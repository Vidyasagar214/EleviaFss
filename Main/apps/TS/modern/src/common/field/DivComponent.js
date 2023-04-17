Ext.define('TS.common.field.DivComponent', {
    extend: 'Ext.Component',
    xtype: 'divcomponent',

    config: {
        cls: 'x-field-input ts-div-component'
    },

    getTemplate: function() {
        return [{
            reference: 'displayElement',
            tag: 'div'
        }]
    }
});
