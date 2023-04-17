Ext.define('TS.store.BufferedFwaList', {
    extend: 'Ext.data.BufferedStore',

    alias: 'store.BufferedFwaList',
    //storeId: '',
    leadingBufferZone: 100,
    pageSize: 50,
    remoteSort: true,
    autoLoad: true,
    model: 'FSS.model.fwa.Fwa',
    proxy: {
        type: 'default',
        directFn: 'Fwa.GetList',
        paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler',
        extraParams: {
            startDate: new Date().toDateString()
        }
    },
    listeners: {
        load: function (store, records, successful, response) {
            var settings = FSS.app.settings;
            if (!successful) {
                var error = {mdBody: 'Load of ' + settings.fwaAbbrevLabel + ' failed ' + response.getResponse().result.message.mdBody},
                    title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                Ext.GlobalEvents.fireEvent(title, error);
            } else {
                if (Ext.first('#rowCtField')) {
                    Ext.first('#rowCtField').setValue('<div style="color:white;"><b>' + settings.fwaAbbrevLabel + ' Record Count: ' + store.getRange().length + '</b></div>');
                }
                if (Ext.first('#schedRowCtField')) {
                    Ext.first('#schedRowCtField').setValue('<div style="color:white;"><b>' + settings.fwaAbbrevLabel + ' Record Count: ' + store.getRange().length + '</b></div>');
                }
            }
        },
        filterchange: function (store) {
            var ct = store.getRange().length,
                settings = FSS.app.settings;
            if (Ext.first('#rowCtField')) {
                Ext.first('#rowCtField').setValue('<div style="color:white;"><b>' + settings.fwaAbbrevLabel + ' Record Count: ' + ct + '</b></div>');
            }
            if (Ext.first('#schedRowCtField')) {
                Ext.first('#schedRowCtField').setValue('<div style="color:white;"><b>' + settings.fwaAbbrevLabel + ' Record Count: ' + ct + '</b></div>');
            }
        }
    }
});