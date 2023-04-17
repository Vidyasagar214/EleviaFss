/**
 * Created by steve.tess on 7/30/2018.
 */
Ext.define('TS.model.shared.ExpPeriodDates', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'value', type: 'auto'},
        {
            name: 'formattedDate',
            mapping: function (data) {
                return Ext.Date.format(new Date(data.value),DATE_FORMAT);
            }
        }
    ]
});