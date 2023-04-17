Ext.define('TS.model.shared.IdList', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'}
    ]
});
