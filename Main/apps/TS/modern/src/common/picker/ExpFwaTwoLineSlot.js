/**
 * Created by steve.tess on 8/10/2018.
 */
Ext.define('TS.common.picker.ExpFwaTwoLineSlot', {
    extend: 'Ext.picker.Slot',
    xtype: 'expfwatwolinepickerslot',

    updateDisplayField: function() {
        if (!this.config.itemTpl) {
            this.setItemTpl(
                '<div class="' + Ext.baseCSSPrefix + 'picker-item {cls} <tpl if="extra">' + Ext.baseCSSPrefix + 'picker-invalid</tpl> ts-twolineslot">' +
                '<span>{fwaNum}</span>' +
                '<span> - {fwaName}</span>' +
                '</div>'
            );
        }
    }
});