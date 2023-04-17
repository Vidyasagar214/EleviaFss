/**
 * Created by steve.tess on 7/23/2018.
 */
Ext.define('TS.common.field.ExpCategory', {
    extend: 'Ext.field.Select',
    xtype: 'field-expcategory',
    autoSelect: false,

    config: {
        valueField: 'category',
        displayField: 'description',
        store: 'ExpCategory'
    }
});