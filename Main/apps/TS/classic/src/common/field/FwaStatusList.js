/**
 * Created by steve.tess on 3/20/2017.
 */
Ext.define('TS.common.field.FwaStatusList', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-fwastatuslist',

    valueField: 'value',
    displayField: 'description',
    renderTo: Ext.getBody(),
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{description}</li>',
        '</tpl></ul>'
    ),
    matchFieldWidth: false,
    typeAhead: true,
    forceSelection: true,
    queryMode: 'local',

    store: 'FwaStatus'//,

    // bind: {
    //     readOnly: '{!isScheduler}'
    // }

});