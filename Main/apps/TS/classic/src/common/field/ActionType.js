/**
 * Created by steve.tess on 9/12/2016.
 */
Ext.define('TS.common.field.ActionType', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-actiontype',

    valueField: 'actionTypeId',
    displayField: 'actionTypeDescr',
    renderTo: Ext.getBody(),
    queryMode: 'local',

    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{actionTypeDescr}</li>',
        '</tpl></ul>'
    ),

    matchFieldWidth: false,
    typeAhead: true,
    forceSelection: true,
    editable: false,

    store: 'ActionType',

    bind: {
        readOnly: '{!isScheduler}'
    }
});