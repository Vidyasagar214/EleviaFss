Ext.define('TS.model.ts.TsBreaks', {
    extend: 'TS.model.Base',

    idProperty: 'breakId', //in database key is BreakDate & EmployeeId
    identifier: 'uuid',

    fields: [
        {
            name: 'breakId',
            type: 'auto'
        },
        {
            name: 'breakDate',
            type: 'date'
        },
        {
            name: 'employeeId',
            type: 'string'
        },
        {
            name: 'numBreaks',
            type: 'int'
        },
        {
            name: 'meal1StartTime',
            type: 'date'
        },
        {
            name: 'meal1EndTime',
            type: 'date'
        },
        {
            name: 'meal2StartTime',
            type: 'date'
        },
        {
            name: 'meal2EndTime',
            type: 'date'
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'TsBreak.GetByDate',
        paramOrder: 'dbi|username|start|limit|empId|breakDate'
    }

    // extraparams declared on page needed
    /*
     var proxy = mystore.getProxy(),
     employeeId = window.userGlobal.employeeId,
     breakDate = window.userGlobal.breakDate;

     proxy.setExtraParam('employeeId', employeeId);
     proxy.setExtraParam('breakDate', breakDate);

     also for update:
     proxy: {
     type: 'direct',
     directFn: TsBreak.Update,
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     totalProperty: 'total'
     },
     paramOrder: 'timesheet|tsBreaks|username|dbi'
     }

     */
});
