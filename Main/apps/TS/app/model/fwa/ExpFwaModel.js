/**
 * Created by steve.tess on 8/10/2018.
 */
Ext.define('TS.model.fwa.ExpFwaModel', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'fwaId',
            type: 'string'
        },
        {
            name: 'fwaNum',
            type: 'string'
        },
        {
            name: 'fwaName',
            type: 'string'
        }
    ]
});