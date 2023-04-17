
Ext.define('TS.model.utilities.UtilitiesList', {
    extend: 'TS.model.Base',

    identifier: 'uuid',
    fields: [
        {
            name: 'app',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'path',
            type: 'string'
        },
        {
            name: 'icon',
            type: 'string'
        },
        {
            name: 'offline',
            type: 'bool'
        }
    ]
});