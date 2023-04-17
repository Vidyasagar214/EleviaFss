Ext.define('TS.data.reader.Default', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.default',

    config: {
        rootProperty: 'data',
        // successProperty: 'success', //Default value
        //totalProperty: 'total', //Default value
        messageProperty: 'message'
    }
});
