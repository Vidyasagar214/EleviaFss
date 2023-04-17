Ext.define('TS.model.shared.Formatting', {
    extend: 'TS.model.Base',

    idProperty: 'formattingId',
    identifier: 'uuid',

    fields: [
        {name: 'formattingId', type: 'auto'},
        {name: 'dateFormat', type: 'string'},
        {name: 'currencyFormat', type: 'string'},
        {name: 'decimalFormat', type: 'string'}

    ]
    //called from with user model
});
