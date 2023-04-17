/**
 * Created by steve.tess on 8/6/2018.
 */
Ext.define('TS.common.picker.ExpTwoLineSlot', {
    extend: 'Ext.picker.Slot',
    xtype: 'exptwolinepickerslot',

    updateDisplayField: function() {
        if (!this.config.itemTpl) {
            this.setItemTpl(
                '<div class="' + Ext.baseCSSPrefix + 'picker-item {cls} <tpl if="extra">' + Ext.baseCSSPrefix + 'picker-invalid</tpl> ts-twolineslot">' +
                '<span>{account}</span>' +
                '<span> - {accountName}</span>' +
                '</div>'
            );
        }
    }
});