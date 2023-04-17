Ext.define('TS.common.field.CrewChiefCombo', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-crewchiefcombo',

    valueField: 'empId',
    matchFieldWidth: false,

    displayTpl: [
        '<tpl for=".">',
        '{[this.getValue(values)]}',
        '</tpl>',
        {
            getValue: function (values) {
                return values['fname'] + ' ' + values['lname'];
            }
        }
    ],

    listConfig: {
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<li role="option" class="memberlist ' + Ext.baseCSSPrefix + 'boundlist-item' + '"> {[this.getValue(values)]}</li>',
            '</tpl>',
            {
                getValue: function (values) {
                    return values['fname'] + ' ' + values['lname'];
                }
            }
        )
    }
});
