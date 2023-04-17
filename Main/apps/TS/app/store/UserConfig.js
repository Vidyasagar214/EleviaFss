Ext.define('TS.store.UserConfig', {
    extend: 'Ext.data.Store',

    alias: 'store.remote-userconfig',

    storeId: 'remote-userconfig',
    model: 'TS.model.admin.UserConfig',
    autoLoad: true,

    pageSize: 25
});
