/**
 * Created by steve.tess on 8/6/2018.
 */
Ext.define('TS.common.picker.ExpTwoLinePicker', {
    extend: 'Ext.picker.Picker',

    xtype: 'exptwolinepicker',

    requires: [
        'TS.common.picker.ExpTwoLineSlot'
    ],

    config: {
        defaultType: 'exptwolinepickerslot'
    }
});