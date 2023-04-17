/**
 * Created by steve.tess on 8/29/2016.
 */
Ext.define('TS.model.shared.Priority', {
    extend: 'TS.model.Base',

    idProperty: 'priorityId',
    identifier: 'uuid',

    fields: [
        {name:'priorityId', type:'string'},
        {name: 'priorityValue', type: 'int'},
        {name: 'priorityDescr', type: 'string'},
        {name: 'priorityDefault', type: 'bool'},
        {name: 'priorityHighlightColor', type: 'auto'},
        {
            name: 'priorityCombo',
            mapping: function (data) {
                return data.priorityValue + ' : ' + data.priorityDescr
            }
        }
    ],
    proxy: {
        type: 'default',
        directFn: 'PriorityList.GetList',
        paramOrder: 'dbi|username'
    }
});