Ext.define('TS.model.shared.EmailTemplate', {
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
            validators: [
                {
                    type: 'email'
                },
                {
                    type: 'presence'
                }
            ]
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
            name: 'attachments',
            type: 'auto'
        },
        {
            name: 'attachForm',
            type: 'bool'
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