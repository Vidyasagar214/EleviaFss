

Ext.define('TS.model.fwa.FwaDailyList', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'fwaId', type: 'auto'},
        {
            name: 'schedStartDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function (data) {
                return TS.common.Util.getInUTCDate(data.schedStartDate);
            }
        },
        {name: 'scheduledCrewId', type: 'string'},
        {name: 'scheduledCrewChiefId', type: 'string'},
        {name: 'topLevelDescription', type: 'string'},
        {name: 'detailsDescription', type: 'auto'}
    ]
});