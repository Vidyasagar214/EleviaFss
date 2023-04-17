Ext.define('TS.model.shared.CrewRole', {
    extend: 'TS.model.Base',

    idProperty: 'crewRoleId',

    fields: [
        {
            name: 'crewRoleId',
            type: 'auto'
        },
        {
            name: 'crewRoleName',
            type: 'string'
        },
        {
            name: 'crewRoleIsChief',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'crewRoleStatus',
            type: 'auto' //A or I
        },
        {
            name: 'crewRoleBillCatReg',
            type: 'int'
        },
        {
            name: 'crewRoleLaborCodeMaskReg',
            type:'string'
        },
        {
            name: 'crewRoleLaborCodeMaskNonReg',
            type:'string'
        },
        {
            name: 'crewRoleLaborCodeMaskTravel',
            type:'string'
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'Role.GetList',
        paramOrder: 'dbi|username|start|limit',
        extraParams: {
            start: 0,
            limit: 25
        }
    }
});
