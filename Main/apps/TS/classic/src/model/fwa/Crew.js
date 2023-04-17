Ext.define('TS.model.fwa.Crew', {
    extend: 'Sch.model.Resource',

    requires: [
        'TS.data.field.CrewMemberList'
    ],
    idProperty: 'crewId',
    identifier: 'uuid',

    fields: [
        {
            name: 'crewId',
            type: 'auto'
        },
        {
            name: 'crewName',
            type: 'string'
        },
        {
            name: 'crewStatus',
            type: 'string'
        },
        {
            name: 'crewStatusString',
            type: 'string'
        },
        {
            name: 'crewAutoCreated',
            type: 'bool'
        },
        {
            name: 'hasFwaAttached',
            type: 'bool'
        },
        {
            name: 'crewChiefEmpId',
            type: 'string',
            reference: {parent: 'TS.model.shared.Employee'},
            unique: true
        },
        {
            name: 'crewChiefRoleId',
            type: 'string'
        },
        {
            name: 'crewMembers',
            type: 'crewmemberlist'
        },
        {
            name: 'crewCt',
            type: 'int',
            persist: false
        },
        {
            name: 'preparedByEmpId',
            type: 'string'
        },
        {
            name: 'hasEmpOrGroupMatch',
            type: 'bool'
        }
    ]
    // ,

    // proxy: {
    //     type: 'default',
    //     directFn: 'Crew.GetList',
    //     paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe',
    //     extraParams: {
    //         limit: 1000
    //     },
    //     api: {
    //         create: 'Crew.Update'
    //     }
    // }

});
