/**
 * Created by steve.tess on 8/10/2018.
 */
Ext.define('TS.common.picker.ExpFwaTwoLinePicker', {
    extend: 'Ext.picker.Picker',

    xtype: 'expfwatwolinepicker',

    requires: [
        'TS.common.picker.ExpFwaTwoLineSlot'
    ],

    config: {
        defaultType: 'expfwatwolinepickerslot'
    }
});