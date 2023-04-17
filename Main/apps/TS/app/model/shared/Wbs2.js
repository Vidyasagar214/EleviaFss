Ext.define('TS.model.shared.Wbs2', {
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
            name: 'wbs3Required',
            type: 'auto'
        },
        {
            name: 'wbs1',
            type: 'string'
        }
  
    ],

    proxy: {
        type: 'default',
        directFn: 'Wbs2.GetList',
        paramOrder: 'dbi|username|start|limit|empId|wbs1|includeInactive|app'
        /*extraParams: {
         wbs1: window.userGlobal.wbs1Id, //current selected value
         employeeId : window.userGlobal.employeeId,
         username: window.userGlobal.username,
         dbi: window.userGlobal.dbi,
         includeInactive: window.userGlobal.includeInactive
         }*/
    }
});
