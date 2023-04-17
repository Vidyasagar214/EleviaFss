/**
 * Created by steve.tess on 9/21/2016.
 */
Ext.define('TS.model.shared.NonFieldActionItem', {
    extend: 'Ext.data.Model',

    idProperty: 'actionItemId',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'actionItemId', type: 'string'},
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