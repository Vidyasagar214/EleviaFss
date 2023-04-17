/**
 * Created by steve.tess on 9/21/2016.
 */
Ext.define('TS.common.field.NonFieldActionItem', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-nonFieldActionItem',

    valueField: 'actionItemId',
    displayField: 'actionItemDescr',
    renderTo: Ext.getBody(),
    queryMode: 'local',

    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{actionItemDescr}</li>',
        '</tpl></ul>'
    ),

    matchFieldWidth: false,
    typeAhead: true,
    forceSelection: false,

    store: 'NonFieldActionItem',

    bind: {
        readOnly: '{!isScheduler}'
    },
    listeners:{
        focus: function(obj){
            var regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                match = regex.exec(obj.getValue());
            if(match){
                obj.setValue('');
            }
        }
    }
});