/**
 * Created by steve.tess on 3/5/2018.
 */
Ext.define('TS.common.field.ProviderList', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-providerList',

    valueField: 'value',
    displayField: 'description',
    matchFieldWidth: false,
    //editable: false,
    queryMode: 'local',
    listConfig:{
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{description}</div></tpl>',
    displayTpl: '<tpl for=".">{description}</tpl>',

    store: 'Providers'
});