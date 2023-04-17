Ext.define('TS.model.fwa.FwaHours', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'empId',
            type: 'string',
            reference: {parent: 'TS.model.shared.Employee'},
            unique: true
        },
        {
            name: 'lastName',
            type: 'string'
        },
        {
            name: 'crewRoleId',
            type: 'string',
            reference: {parent: 'TS.model.shared.CrewRole'}
        },
        {
            name: 'isChief',
            type: 'bool'
        },
        {
            name: 'workDate',
            type: 'date'
            //dateFormat: 'c'
        },
        {
            name: 'workCodeId',
            type: 'string'
        },
        {
            name: 'workCodeAbbrev',
            type: 'string'
        },
        {
            name: 'regHrs',
            type: 'float'
        },
        {
            name: 'ovtHrs',
            type: 'float'
        },
        {
            name: 'ovt2Hrs',
            type: 'float'
        },
        {
            name: 'travelHrs',
            type: 'float'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'readOnly',
            type: 'bool'
        },
        {
            name: 'readOnlyReason',
            type: 'string'
        },
        {
            name: 'attributes',
            type: 'string'
        },
        {
            name: 'modified',
            type: 'auto'
        },
        {
            name:'laborCode',
            type: 'string'
        },
        {
            name: 'startTime',
            type: 'date',
            mapping: function(data){
                if(data.startTime <= '2001-01-01T00:00:00'){
                    return '';
                }
                return data.startTime;
            }
        },
        {
            name: 'endTime',
            type: 'date',
            mapping: function(data){
                if(data.endTime <= '2001-01-01T00:00:00'){
                    return '';
                }
                return data.endTime;
            }
        }
    ]
});
