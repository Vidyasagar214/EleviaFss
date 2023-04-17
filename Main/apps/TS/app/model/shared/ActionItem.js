/**
 * Created by steve.tess on 9/4/2016.
 */
Ext.define('TS.model.shared.ActionItem', {
    extend: 'TS.model.Base',

    idProperty: 'actionItemId',
    identifier: 'uuid',

    fields: [
        {name:'actionItemId', type:'string'},
        {name: 'actionItemStatus', type: 'string'},
        {name: 'actionItemDescr', type: 'string'},
        {name: 'actionItemDefaultTypeId', type: 'string'}

    ],
    proxy: {
        type: 'default',
        directFn: 'ActionItem.GetList',
        paramOrder: 'dbi|username'
    }
});