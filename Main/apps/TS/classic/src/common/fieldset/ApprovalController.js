Ext.define('TS.common.fieldset.ApprovalController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fieldset-approval',

    listen: {
        controller: {
            'form-fwa': {
                'resetSignatures': 'resetApproval'
            }
        }
    },

    showSignatureWindow: function (component) {
        Ext.create('TS.common.window.Signature', {
            attType: (component.up('fieldset').signatureType === 'S' ? 'S' : 'E'),
            showEmailFunction: (component.up('fieldset')).signatureType === 'S',
            associatedRecordId: this.getView().up('form').getRecord().getId(),
            modal: true
        }).show();
    },

    resetApproval: function (type) {
        var me = this;
        me.lookup('signatureImage').hide().setSrc(null);
        //me.lookup('addSignatureButton').show();
        me.lookup('signatureDateField').setValue(null);
        me.lookup('deleteSignatureButton').hide();
    },

    refreshApproval: function (image, date) {
        var src;
        if (image.indexOf('octet-stream') > -1)
            src = image;
        else
            src = 'data:application/octet-stream;base64,' + image;

        this.lookup('signatureImage').show().setSrc(src);
        this.lookup('signatureImage').setHidden(false);
        //this.lookup('addSignatureButton').hide();
        if (date) {
            this.lookup('signatureDateField').setValue(Ext.Date.format(new Date(date), DATE_FORMAT + ' h:i A'));
        }
    },

    deleteApproval: function () {
        var me = this,
            vw = me.getView(),
            signatureType = vw.config.signatureType,
            record = vw.up('form').getRecord(),
            attachments = vw.up('form').getRecord().get('attachments'),
            attachmentsToDelete = me.getView().up('form').getRecord().get('attachmentsToDelete') || [],
            settings = TS.app.settings,
            approvalType = signatureType == 'E' ? settings.crewChiefLabel : settings.clientLabel,
            attachmentId = vw.config.attachmentId,
            id,
            signature,
            ct = 0;


        if (attachments && attachments.length > 0) {
            Ext.Array.each(attachments, function (obj) {
                if (signatureType == obj.attachmentType.substring(0, 1) && obj.attachmentId == attachmentId) {
                    attachmentId = obj.attachmentId;
                    id = obj.id;
                }
            }, me);
        }

        Ext.Msg.confirm('Signature Delete', 'Are you sure you want to delete the ' + approvalType + ' signature?', function (btn) {
            if (btn == 'yes') {
                //if loaded on get, need to flag as toDelete in BL/DAL
                if (attachmentId) {
                    attachmentsToDelete.push(attachmentId);
                }
                //if FWA not saved yet, there will be no attachmentId, so just delete it
                if (!attachmentId && id) {
                    for (var i = 0; i < attachments.length; i++) {
                        if (id == attachments[i].attachmentId) {
                            //remove from model
                            attachments.splice(i, 1);
                        }
                    }
                } else {
                    for (var i = 0; i < attachments.length; i++) {
                        if (attachmentId == attachments[i].attachmentId) {
                            //remove from model
                            attachments.splice(i, 1);
                        }
                    }
                }
                me.resetApproval(signatureType);
                //reset image screen
                if (attachments) {
                    signature = Ext.Array.findBy(attachments, function (attachment) {
                        return Ext.String.capitalize(attachment.attachmentType) == signatureType;
                    });
                    //reset config attachmentId
                    if (signature) {
                        vw.config.attachmentId = signature.attachmentId;
                    }
                    Ext.each(attachments, function (attachment) {
                        if (Ext.String.capitalize(attachment.attachmentType) == signatureType) {
                            ct++;
                        }
                    });
                    //reset signature screen
                    if (signature)
                        me.refreshApproval(Ext.util.Base64.decode(signature.attachmentItem), signature.dateAttached);
                    vw.lookup('viewAllSignaturesButton').setHidden(ct <= 1);
                }

                if(!me.getView().up('form').getRecord().get('attachmentsToDelete')){
                    me.getView().up('form').getRecord().set('attachmentsToDelete', attachmentsToDelete);
                } else {
                    me.getView().up('form').getRecord().get('attachmentsToDelete').push(attachmentId);
                }
            }
        }, me);
    },

    onSignatureImageRender: function () {
        var me = this;
        me.lookup('signatureImage').el.on({
            mouseover: function () {
                //cannot delete signatures if FWA submitted
                if (!me.getViewModel().get('isSubmitted')) {
                    me.lookup('deleteSignatureButton').show();
                }
            },

            touchstart: function () {
                //cannot delete signatures if FWA submitted
                if (!me.getViewModel().get('isSubmitted')) {
                    me.lookup('deleteSignatureButton').show();
                }
            },

            mouseout: {
                fn: function (e) {
                    if (Ext.get(e.relatedTarget)) {
                        if (!Ext.get(e.relatedTarget).hasCls('del-sig-btn') && !Ext.get(e.relatedTarget).up('.del-sig-btn')) {
                            me.lookup('deleteSignatureButton').hide();
                        }
                    }
                },
                buffer: 250
            },
            scope: me
        });
    },

    viewAllSignatures: function (component, e) {
        var me = this,
            windowSignatures,
            settings = TS.app.settings,
            list = (typeof component) == 'string' ? component : me.getView().up('form').getRecord().get('attachments'),
            arr = [],
            placeholderRec;

        if (me.windowSignatures) {
            me.windowSignatures.close();
        }

        Ext.each(list, function (signature) {
            var signatureImage = 'data:application/octet-stream;base64,' + signature.attachmentItem;
            if (signature.attachmentType == me.getView().config.signatureType && signature.owningModelType == 'Fwa') {
                placeholderRec = ({
                    attachmentId: signature.attachmentId,
                    dateAttached: signature.dateAttached,
                    attachmentItem: signatureImage,
                    attachedByEmpId: signature.attachedByEmpId
                });
                arr.push(placeholderRec);
            }
        });

        me.windowSignatures = Ext.create('TS.view.fwa.SignatureList', {
            modal: true,
            autoShow: true,
            attachmentsList: arr,
            signatureType: me.getView().config.signatureType
        });
    }
});
