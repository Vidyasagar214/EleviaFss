Ext.define('TS.model.shared.Error', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        }, {
            name: 'errorType',
            type: 'string'
        }, {
            name: 'errorValue',
            type: 'string'
        }
    ]

    //not used to call DB, no proxy needed
});
