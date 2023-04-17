/**
 * Created by steve.tess on 9/12/2016.
 */
Ext.define('TS.model.shared.ActionType', {
    extend: 'TS.model.Base',

    idProperty: 'actionTypeId',
    identifier: 'uuid',

    fields: [
        {name: 'actionTypeId', type: 'string'},
        {name: 'actionTypeStatus', type: 'string'},
        {name: 'actionTypeDescr', type: 'string'}
    ],
    proxy: {
        type: 'default',
        directFn: 'ActionType.GetList',
        paramOrder: 'dbi|username'
    }

});