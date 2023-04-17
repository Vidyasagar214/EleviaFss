Ext.define('TS.model.Base', {
    extend: 'Ext.data.Model',
    
    schema: {
        // Turn automatic entity generation needed for associations
        namespace: 'TS.model'
    }
});
