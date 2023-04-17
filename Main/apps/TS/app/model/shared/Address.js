Ext.define('TS.model.shared.Address', {
    extend: 'TS.model.Base',

    idProperty: 'addressId',
    identifier: 'uuid',

    fields: [
        {
            name: 'addressId',
            type: 'auto'
        },
        {
            name: 'address1',
            type: 'string'
        },
        {
            name: 'address2',
            type: 'string'
        },
        {
            name: 'city',
            type: 'string'
        },
        {
            name: 'state',
            type: 'string'
        },
        {
            name: 'zip',
            type: 'string'
        },
        {
            name: 'country',
            type: 'string'
        },
        {
            name: 'latitude',
            type: 'auto',
            default: 0
        },
        {
            name: 'longitude',
            type: 'auto',
            default: 0
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'Address.GetAddress',
        paramOrder: 'dbi|username|clientId|addressId',
        writer: {
            type: 'json',
            writeAllFields: true
        }
        /*
         params set at page level, either clientId (returns all client addresses) or with clientId & addressId (returns specific client address)
         use
         extraParams:{param:value, etc......}
         */
    }
});
