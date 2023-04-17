Ext.define('TS.model.fwa.Work', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'workCodeId', type: 'auto'},
        {
            name: 'workCodeAbbrev',
            reference: 'workCodeId'
        },
        {name: 'scheduledHours', type: 'float'},
        {name: 'actualHours', type: 'float'},
        {name: 'comments', type: 'string'},
        {name: 'picRequired', type: 'bool'},
        {name: 'pctComplete', type: 'float'}
    ]
    
});
