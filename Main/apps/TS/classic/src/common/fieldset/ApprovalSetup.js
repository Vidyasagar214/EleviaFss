Ext.define('TS.common.fieldset.ApprovalSetup', {

    extend: 'Ext.form.FieldSet',

    xtype: 'fieldset-approvalsetup',

    title: 'Approval Requirements',

    items: [{
        xtype: 'container',

        plugins: 'responsive',
        responsiveConfig: {
            small: {
                layout: {
                    type: 'box',
                    vertical: true,
                    height: 150
                }
            },
            normal: {
                layout: {
                    type: 'box',
                    vertical: false,
                    height: 80
                }
            }
        },

        defaults: {
            xtype: 'checkboxfield',
            labelWidth: 150,
            flex: 1
        },

        items: [{
            fieldLabel: {_tr: 'clientLabel', tpl: '{0} Signature'},           
            name: 'clientSigReq',
            itemId: 'clientSigReqCheckbox',
            reference: 'clientSigReqCheckbox',
            listeners:{
                change: function( t , newValue , oldValue , eOpts){
                   var fwa = Ext.first('#fwaForm').getRecord();
                    fwa.set('clientSigReq', newValue);
                }
            }
        }, {
            fieldLabel: {_tr: 'crewChiefLabel', tpl: '{0} Signature'},
            name: 'chiefSigReq',
            itemId: 'chiefSigReqCheckbox',
            reference: 'chiefSigReqCheckbox',
            listeners:{
                change: function( t , newValue , oldValue , eOpts){
                    var fwa = Ext.first('#fwaForm').getRecord();
                    fwa.set('chiefSigReq', newValue);
                }
            }
        }]
    }],


    resetApprovalSetup: function () {
        this.down('checkboxfield').setValue(false);
    }

});