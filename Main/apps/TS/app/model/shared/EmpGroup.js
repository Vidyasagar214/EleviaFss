Ext.define('TS.model.shared.EmpGroup', {
    extend: 'TS.model.Base',

    idProperty: 'empGroupId',
    identifier: 'uuid',

    fields: [
        {name: 'empGroupId', type: 'string'},
        {name: 'empGroupName', type: 'string'},
        {name: 'empGroupStatus', type: 'string'},
        {name: 'empIds', type: 'string'},
        {name: 'policies', type: 'auto'},
        {name: 'rules', type: 'auto'},
        {name: 'periods', type: 'auto'},
        {name: 'holidayScheduleId', type: 'string'},
        // Emp Group timesheet configurations:
        {name: 'tsApproverCanModify', type: 'bool'},
        {name: 'tsApprover', type: 'string'},
        {name: 'tsAuditLevel', type: 'int'},
        {name: 'tsIncrement', type: 'int'},
        {name: 'tsAllowHtmlComments', type: 'bool'},
        {name: 'tsAllowUnsubmit', type: 'bool'},
        {name: 'tsAllowTimeOnInactive', type: 'bool'},
        {name: 'tsReqSubmitSignature', type: 'bool'},
        {name: 'tsReqApprovalSignature', type: 'bool'},
        {name: 'tsReqApproval', type: 'bool'},
        {name: 'tsAutoCalcOvt', type: 'bool'},
        {name: 'tsAllowOvtHrs', type: 'bool'},
        {name: 'tsAllowOvt2Hrs', type: 'bool'},
        {name: 'tsAllowTravelHrs', type: 'bool'},
        {name: 'tsCanEnterCrewMemberTime', type: 'bool'},
        {name: 'tsDisplayWbs1', type: 'string'},
        {name: 'tsDisplayWbs2', type: 'string'},
        {name: 'tsDisplayWbs3', type: 'string'},
        {name: 'tsDisplayClient', type: 'string'},
        {name: 'tsDisplayLaborCode', type: 'string'},
        {name: 'tsDisplayBillCat', type: 'string'},
        // Emp Group FWA configurations:
        {name: 'fwaApprover', type: 'string'},
        {name: 'fwaApproversCanModify', type: 'bool'},
        {name: 'fwaAuditLevel', type: 'int'},
        {name: 'fwaAvailableForFwaAssignment', type: 'string'},
        {name: 'fwaDisplayWbs1', type: 'string'},
        {name: 'fwaDisplayWbs2', type: 'string'},
        {name: 'fwaDisplayWbs3', type: 'string'},
        {name: 'fwaDisplayClient', type: 'string'},
        {name: 'fwaReqClientSignature', type: 'string'}

    ]

    // proxy: {
    //     type: 'default',
    //     directFn: 'EmpGroup.Get',
    //     paramOrder: 'dbi|username|id',
    //     extraParams: {id: 'selectedEmpGroupId'}
    // }

    /*
     proxy: {
     type: 'direct',
     directFn: EmpGroup.GetList,
     reader: {
     type: 'json',
     rootProperty: 'data',
     successProperty: 'success',
     messageProperty: 'message',
     totalProperty: 'total'
     },
     paramOrder: 'username|dbi',
     extraParams:{username:window.userGlobal.username, dbi:window.userGlobal.dbi}
     }

     */

});
