// Barebebones implementation.
// Expects:
// valueField: 'id'
// displayField: 'name'
Ext.define('TS.common.picker.TwoLineSlot', {
    extend: 'Ext.picker.Slot',
    xtype: 'twolinepickerslot',
    
    updateDisplayField: function() {
        if (!this.config.itemTpl) {
            this.setItemTpl(
                '<div class="' + Ext.baseCSSPrefix + 'picker-item {cls} <tpl if="extra">' + Ext.baseCSSPrefix + 'picker-invalid</tpl> ts-twolineslot">' +
                '<span>{id}</span>' +
                '<span> - {name}</span>' +
                '</div>'
            );
        }
    }
});
