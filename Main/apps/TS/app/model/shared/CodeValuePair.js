Ext.define('TS.model.shared.CodeValuePair', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        }
    ]

    // no proxy, just a model used by ChargeTypes & LaborCodes
});
