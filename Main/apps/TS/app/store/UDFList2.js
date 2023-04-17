Ext.define('TS.store.UDFList2', {
    extend: 'Ext.data.Store',

    storeId: 'UdfList2',

    model: 'TS.model.fwa.UDFList',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'UserConfig.GetUserDefinedFieldList',
        paramOrder: 'dbi|username'
    },
    remoteFilter: false,
    filters: [{
        property: 'udfId',
        value: 'UDFL2'
    }]
});