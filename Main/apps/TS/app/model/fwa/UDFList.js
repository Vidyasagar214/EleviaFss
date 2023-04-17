Ext.define('TS.model.fwa.UDFList', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'udfId', type: 'auto'},
        {name: 'udfValue', type: 'auto'},
        {name: 'udfName', type: 'auto'},
        {name: 'udfSortOrder', type: 'auto'},
    ]
});
