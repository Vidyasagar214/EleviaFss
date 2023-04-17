Ext.define('TS.model.ts.Tsheet', {
    extend: 'TS.model.Base',

    idProperty: 'tsheetId',

    fields: [
        {
            name: 'tsheetId',
            type: 'auto'
        },
        {
            name: 'tsEmpId',
            type: 'string'
        },
        {
            name: 'tsEmpName',
            type: 'string'
        },
        {
            name: 'tsPeriodId',
            type: 'int'
        },
        {
            name: 'startDate',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'endDate',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'visionStatus',
            type: 'string'
        },
        {
            name: 'statusString',
            type: 'string'
        },
        {
            name: 'submittedBy',
            type: 'string'
        },
        {
            name: 'submittedDate',
            type: 'auto'
            // type: 'date',
            // dateFormat: 'c',
            // mapping: function(data){
            //     return TS.common.Util.getInUTCDate(data.submittedDate);
            // }
        },
        {
            name: 'approvedBy',
            type: 'string'
        },
        {
            name: 'approvedDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function(data){
                return TS.common.Util.getInUTCDate(data.approvedDate);
            }
        },
        {
            name: 'signature',
            type: 'auto'
        },
        {
            name: 'rows',
            type: 'auto' //reference: 'TS.model.ts.TsRow'
        },
        {
            name: 'comments',
            type: 'string' //limit to 255 characters
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'TimeSheet.Save',
        paramOrder: 'dbi|username|timesheet'
    }

    //other proxies
    /*

     idProperty: 'TsheetId',
     proxy: {
     type: 'direct',
     directFn: TimeSheet.Submit,
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     messageProperty: 'message',
     totalProperty: 'total'
     },
     paramOrder: 'timesheet|username/dbi',
     extraParams: {
     username: window.userGlobal.username
     }
     }

     proxy: {
     type: 'direct',
     directFn: TimeSheet.Create,
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     messageProperty: 'message',
     totalProperty: 'total'
     }
     }

     proxy: {
     type: 'direct',
     directFn: TimeSheet.Copy,
     paramOrder: 'username|dbi|employeeId|tsDate',
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     messageProperty: 'message',
     totalProperty: 'total'
     },
     extraParams: {
     timesheet: //selected timesheet id
     }
     }

     proxy: {
     type: 'direct',
     directFn: TimeSheet.GetListByEmployee,
     paramOrder: 'start|limit|employeeId|username|dbi',
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     messageProperty: 'message',
     totalProperty: 'total'
     },
     extraParams: {
     employeeId: window.userGlobal.userId,
     username: window.userGlobal.username
     },
     pageSize: 25
     }

     proxy: {
     type: 'direct',
     directFn: TimeSheet.GetListByUsername,
     paramOrder: 'start|limit|username|dbi',
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     messageProperty: 'message',
     totalProperty: 'total'
     },
     extraParams: {
     username: window.userGlobal.username
     },
     pageSize: 25
     }

     proxy: {
     type: 'direct',
     directFn: TimeSheet.GetByEmployeeByDate,
     paramOrder: 'start|limit|username|dbi|employeeId|tsDate|includeCrewMembers',
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     messageProperty: 'message',
     totalProperty: 'total'
     },
     extraParams: {
     employeeId: window.userGlobal.userId,
     tsDate: window.userGlobal.tsDate, //selected date
     includeCrewMembers: window.userGlobal.includeCrewMembers
     },
     pageSize: 25
     }
     */

});
