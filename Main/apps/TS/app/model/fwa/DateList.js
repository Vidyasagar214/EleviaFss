/**
 * Created by steve.tess on 3/14/2017.
 */
Ext.define('TS.model.fwa.DateList', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'thisDate',
            type: 'date',
            dateFormat: 'c'
        }
    ]
});