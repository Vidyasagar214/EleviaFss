/**
 * Created by steve.tess on 9/13/2016.
 */
Ext.define('TS.model.fwa.FwaActionList', {
    extend: 'TS.model.Base',

    idProperty: 'fwaId',
    identifier: 'uuid',

    fields: [
        {name: 'fwaId', type: 'string'},
        {name: 'nonFieldActions', reference: 'TS.model.fwa.FwaAction'}
    ]
});