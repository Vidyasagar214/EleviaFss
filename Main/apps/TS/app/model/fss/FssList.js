
Ext.define('TS.model.fss.FssList', {
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