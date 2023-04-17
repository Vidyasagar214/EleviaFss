Ext.define('TS.model.shared.Wbs3', {
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
            name: 'wbs1',
            type: 'string'
        },
        {
            name: 'wbs2',
            type: 'string'
        }
       
    ],

    proxy: {
        type: 'default',
        directFn: 'Wbs3.GetList',
        paramOrder: 'dbi|username|empId|wbs1|wbs2|includeInactive|app',
        extraParams: {
            includeInactive: false
        }
        /*extraParams: {
         employeeId : window.userGlobal.employeeId,
         username: window.userGlobal.username,
         dbi: window.userGlobal.dbi,
         wbs1: window.userGlobal.wbs1Id, //currently selectd value
         wbs2: window.userGlobal.wbs2Id, //currently selectd value
         includeInactive: window.userGlobal.includeInactive
         },*/
    }
});
