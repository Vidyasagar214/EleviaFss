Ext.define('TS.model.fwa.CrewMember', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'crewMemberEmpId', type: 'string', reference: 'TS.model.shared.Employee'},
        {name: 'crewMemberRoleId', type: 'string'},
        {name: 'crewMemberPhone', type: 'string'},
        {name: 'crewMemberEmail', type: 'string'}
    ]

});