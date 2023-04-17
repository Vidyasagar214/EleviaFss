Ext.define('TS.model.shared.Email', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'to',
            type: 'auto',
            validators: {
                type: 'email'
            }
        },
        {
            name: 'cc',
            type: 'auto',
            validators: {
                type: 'email'
            }
        },
        {
            name: 'bcc',
            type: 'auto',
            validators: {
                type: 'email'
            }
        },
        {
            name: 'subject',
            type: 'auto',
            validators: {
                type: 'presence'
            }
        },
        {
            name: 'body',
            type: 'auto',
            validators: {
                type: 'presence'
            }
        },
        {
            name: 'app',
            type: 'auto'
        },
        {
            name: 'modelId',
            type: 'auto'
        },
        {
            name: 'attachForm',
            type: 'bool'
        },
        {
            name: 'attachments',
            reference: 'TS.model.shared.Attachment' //this is a list
        }
    ],

    validators: {
        To: 'email',
        Cc: 'email',
        Bcc: 'email',
        Subject: 'presence',
        Body: 'presence'
    }

});