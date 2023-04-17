Ext.define('TS.model.shared.Client', {
    extend: 'TS.model.Base',

    idProperty: 'clientId',
    identifier: 'uuid',

    fields: [
        {name: 'clientId', type: 'string'},
        {name: 'clientAbbrev', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'addresses', type: 'auto'}
    ],
    proxy: {
        type: 'default',
        api: {
            read: 'Client.Get'
        },
        paramOrder: 'dbi|username|id'
    }

});
