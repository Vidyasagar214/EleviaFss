Ext.define('TS.model.shared.WorkCode', {
    extend: 'TS.model.Base',

    idProperty: 'workCodeId',
    identifier: 'uuid',

    fields: [
        {
            name: 'workCodeId',
            type: 'auto'
        },
        {
            name: 'workCodeAbbrev',
            type: 'auto'
        },
        {
            name: 'workCodeDescr',
            type: 'string'
        },
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'workCodeCombo',
            mapping: function (data) {
                return data.workCodeAbbrev + ' : ' + data.workCodeDescr
            }
        },
        {
            name: 'pctComplete',
            type: 'float'
        },
        {
            name: 'workCodeLaborCodeMaskReg',
            type: 'string'
        },
        {
            name: 'workCodeLaborCodeMaskNonReg',
            type: 'string'
        },
        {
            name: 'workCodeLaborCodeMaskTravel',
            type: 'string'
        },
        {
            name: 'workCodeBillCatReg',
            type: 'int'
        }
    ],


    proxy: {
        type: 'default',
        directFn: 'WorkCode.GetList',
        paramOrder: 'dbi|username|start|limit|includeInactive',
        extraParams: {
            start: 0,
            limit: 25,
            includeInactive: true
        }
    }

});