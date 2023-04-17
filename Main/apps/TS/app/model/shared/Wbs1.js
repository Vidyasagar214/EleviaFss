Ext.define('TS.model.shared.Wbs1', {
    extend: 'TS.model.Base',

    idProperty: 'newId',
    identifier: 'uuid',

    fields: [
        {
            name: 'newId',
            type: 'auto'
        },
        {
            name: 'id',
            type: 'string',
            sortType: 'asUCText'
        },
        {
            name: 'name',
            type: 'string',
            sortType: 'asUCText'
        },
        {
            name: 'chargeType',
            type: 'string'
        },
        {
            name: 'clientId',
            reference: 'TS.model.shared.Client'
        },
        {
            name: 'clientName',
            type: 'string'
        },
        {
            name: 'wbs2Required',
            type: 'auto'
        }

    ],

    proxy: {
        type: 'default',
        autoLoad: false,
        directFn: 'Wbs1.GetList',
        paramOrder: 'dbi|username|start|limit|filter|empId|includeInactive|app'
    }
});
