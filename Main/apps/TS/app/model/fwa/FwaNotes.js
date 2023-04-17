/**
 * Created by steve.tess on 10/19/2015.
 */
Ext.define('TS.model.fwa.FwaNote', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'seq',
            type: 'string'
        },
        {
            name: 'empId',
            type: 'string'
        },
        {
            name: 'contents',
            type: 'string'
        },
        {
            name: 'createDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function(data){
                return TS.common.Util.getInUTCDate(data.createDate);
            }
        },
        {
            name: 'modDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function(data){
                return TS.common.Util.getInUTCDate(data.modDate);
            }
        },
        {
            name: 'modUser',
            type: 'string'
        },
        {
            name: 'canEdit',
            type: 'bool'
        },
        {
            name: 'formattedDateEmployee',
            type: 'string'
        },
        {
            name: 'order',
            type: 'int'
        }
    ]
});
