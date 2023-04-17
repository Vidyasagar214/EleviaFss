/**
 * Created by steve.tess on 12/13/2018.
 */
Ext.define('TS.field.FssDate', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.fssdate',

    requires: [
        'TS.common.Util'
    ],

    convert: function (value, record) {
        return  TS.common.Util.getInUTCDate(value);
    }
});