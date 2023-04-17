Ext.define('TS.common.picker.TwoLinePicker', {
    extend: 'Ext.picker.Picker',
    xtype: 'twolinepicker',

    requires: [
        'TS.common.picker.TwoLineSlot'
    ],
    
    config: {
        defaultType: 'twolinepickerslot'
    }
});
