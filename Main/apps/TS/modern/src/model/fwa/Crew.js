/**
 * Created by steve.tess on 6/3/2016.
 */
Ext.define('TS.model.fwa.Crew', {
    extend: 'Ext.data.Model',

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
        }
    ]
});