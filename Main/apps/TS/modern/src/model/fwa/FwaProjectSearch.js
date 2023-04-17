Ext.define('TS.model.fwa.FwaProjectSearch', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'fwaId',
            type: 'string'
        },
        {
            name: 'fwaNum',
            type: 'string'
        },
        {
            name: 'fwaName',
            type: 'string'
        },
        {
            name: 'fwaStatusId',
            type: 'string'
        },
        {
            name: 'fwaStatusString',
            type: 'string'
        },
        {
            name: 'wbs1',
            type: 'string',
            allowNull: true,
            convert: function (value) {
                return ((value === " " || value === "") ? null : value);
            }
        },
        {
            name: 'wbs2',
            type: 'string',
            allowNull: true,
            convert: function (value) {
                return ((value === " " || value === "") ? null : value);
            }
        },
        {
            name: 'wbs3',
            type: 'string',
            allowNull: true,
            convert: function (value) {
                return ((value === " " || value === "") ? null : value);
            }
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
            name: 'workCodeDescr',
            type: 'string'
        },
        {
            name: 'schedStartDate',
            type: 'date',
            dateFormat: 'c'
        }

    ]
});