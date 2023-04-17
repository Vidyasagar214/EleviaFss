/**
 * Created by steve.tess on 8/29/2016.
 */
Ext.define('TS.common.field.PriorityList', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-prioritylist',

    valueField: 'priorityId',
    displayField: 'priorityDescr',
    renderTo: Ext.getBody(),
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item" >{priorityDescr}</li>',
        '</tpl></ul>'
    ),
    matchFieldWidth: false,
    typeAhead: true,
    forceSelection: true,
    queryMode: 'local',
    selectOnFocus: true,

    store: 'PriorityList',

    bind: {
        readOnly: '{!isScheduler}'
    },
    listeners: {
        change: function (element, newValue) {
            var priority,
                colors,
                inputEl = element.inputWrap.child('input'),
                fontColor = 'color:#000',
                bgColor,
                record,
                luma,
                r,
                g,
                b;
            if (newValue) {
                priority = Ext.getStore('PriorityList').findRecord('priorityId', newValue);
                colors = priority.get('priorityHighlightColor');
            }

            if (colors && colors != 'Transparent') {
                bgColor = 'background:rgb(' + colors + ');';
                inputEl.applyStyles('background-color:rgb(' + colors + ')');
                colors = colors.split(',');
                r = colors[0] & 0xff;
                g = colors[1] & 0xff;
                b = colors[2] & 0xff;
                luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
                if (luma < 40) {
                    fontColor = 'color:#fff !important;';
                } else {
                    fontColor = 'color:#000';
                }
               //inputEl.applyStyles('background-image: none');
            }

            if (this.up('grid')) {
                record = this.up('grid').getSelectionModel().getSelection()[0];
                record.set('fieldPriorityColor', bgColor);
                record.set('fieldPriorityFontColor', fontColor);
            }
        }
    }
});