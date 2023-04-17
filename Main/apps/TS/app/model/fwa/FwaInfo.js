/**
 * Created by steve.tess on 12/19/2016.
 */
Ext.define('TS.model.fwa.FwaInfo', {
    extend: 'Ext.data.Model',

    requires: [
        'TS.model.fwa.Unit',
        'TS.model.fwa.Work'
    ],

    fields: [
        {
            name: 'fieldInfo', type: 'string'
        },
        {
            model: 'TS.model.fwa.Work',
            role: 'workInfo'
        },
        {
            model: 'TS.model.fwa.Unit',
            role: 'unitsInfo'
        },
        {
            model: 'TS.model.fwa.FwaAction',
            role: 'actionsInfo'
        }
    ]
});