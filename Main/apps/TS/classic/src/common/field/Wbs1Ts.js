/**
 * Created by steve.tess on 10/12/2016.
 */
Ext.define('TS.common.field.Wbs1Ts', {
    extend: 'Ext.form.field.ComboBox',

    requires: ['TS.model.shared.Wbs1'],

    xtype: 'field-wbs1ts',

    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
        '<div class="x-boundlist-item">{id} - {name}</div>',
        '</tpl>'
    ),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
        '{[typeof values === "string" ? values : values["id"]]}',
        '</tpl>'
    ),

    valueField: 'id',
    displayField: 'name',
    matchFieldWidth: false,
    typeAhead: false,

    forceSelection: false,

    constructor: function (config) {
        var me = this,
            settings = TS.app.settings;

        me.store = 'WBS1TsList';

        me.callParent(arguments);
    }
});