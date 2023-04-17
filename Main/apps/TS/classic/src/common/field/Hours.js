/**
 * Created by steve.tess on 3/20/2017.
 */
Ext.define('TS.common.field.Hours', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-hours',

    valueField: 'value',
    displayField: 'description',
    matchFieldWidth: false,
    queryMode: 'local',
    listConfig: {
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{description}</div></tpl>',
    displayTpl: '<tpl for=".">{description}</tpl>',

    store: 'HoursList'
});