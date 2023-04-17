/**
 * Created by steve.tess on 6/7/2019.
 */
Ext.define('TS.view.fwa.SubmitRecurring', {
    extend: 'Ext.window.Window',
    width: 360,
    layout: 'fit',
    modal: true,
    buttonAlign: 'center',
    title: {_tr: 'fwaAbbrevLabel', tpl: 'Recurring {0}'},
    fwa: null,
    itemId: 'fwaSubmitDate',
    closable: false,
    defaults: {
        xtype: 'form',
        bodyPadding: 10,
        labelWidth: 250
    },
    items:[
        {
            reference: 'fwaSubmitDate',
            defaultButton: 'fwaSubmit',
            items: [
                {
                    xtype: 'datefield',
                    reference: 'selectedDate',
                    itemId: 'selectedDate',
                    editable: false,
                    labelAlign: 'right',
                    name: 'selectedDate',
                    fieldLabel:  {_tr: 'fwaAbbrevLabel', tpl: ' Submit {0} through'},
                    value: new Date(),
                    labelWidth: 150,
                    width: '100%'
                },
                {
                    xtype: 'checkbox',
                    reference: 'submitAll',
                    labelAlign: 'right',
                    name: 'submitAll',
                    fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: ' Submit entire {0}'},
                    labelWidth: 150,
                    width: '100%',
                    listeners:{
                        change: function(obj, newValue, oldValue, eOpts){
                            Ext.first('#selectedDate').setDisabled(newValue);
                        }
                    }
                }
            ],
            fbar: [{
                text: 'Submit',
                handler: 'continueSubmitWithDate',
                reference: 'fwaSubmit'
            },{
                text: 'Cancel',
                handler: 'cancelSubmitWithDate'
            }]
        },
    ]

});