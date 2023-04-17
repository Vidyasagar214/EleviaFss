Ext.define('TS.model.shared.AttachmentData', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'attachmentId', type: 'int'},
        {name: 'attachmentItem', type: 'auto'} //byte array
    ],

    proxy: {
        type: 'direct',
        api: {
            read: 'AttachmentData.GetAttachmentDataById'
        },
        paramOrder: 'dbi|username|id'
    }
});
