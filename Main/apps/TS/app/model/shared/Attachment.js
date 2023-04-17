Ext.define('TS.model.shared.Attachment', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',
    fields: [
        {name: 'id', type: 'auto'},
        {name: 'attachmentId', type: 'int'},
        {name: 'attachedByEmpId', type: 'string'},
        {name: 'owningModelType', type: 'string'},
        {name: 'owningModelId', type: 'string'},
        {name: 'dateAttached', type: 'auto'},
        {name: 'attachmentType', type: 'string'},// S(ignature), P(hoto), D(ocument), E(mployee), R(eceipt - expense receipt)

{name: 'extension', type: 'string'},
        {name: 'filename', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'attachmentItem', type: 'auto'},
        {name: 'location', type: 'string'},
        {name: 'includeTemplates', type: 'bool'},
        {name: 'exIfData', type: 'auto'}
    ],
    proxy: {
        type: 'default',
        api: {
            read: 'AttachmentData.GetAttachmentById',
            create: 'AttachmentData.SaveAttachment'
        },
        paramOrder: 'dbi|username|attachmentid'
    }
});
