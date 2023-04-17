Ext.define('TS.common.field.TimePicker', {
    extend: 'Ext.field.DatePicker',
    xtype: 'timepickerfield',

    requires: [
        'TS.common.picker.Time'
    ],

    config:{
        dateFormat: 'g:i A',
        destroyPickerOnHide: true,
        picker: {
            xclass: 'TS.common.picker.Time',
            enableAMPM : true
        }
    }
});