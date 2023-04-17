Ext.define('TS.store.BufferedUnplannedFwa', {
    extend: 'Ext.data.Store',

    alias: 'store.BufferedUnplannedFwa',

    isBufferedStore: false,
    model: 'TS.model.fwa.Fwa',
    leadingBufferZone: 100,
    pageSize: 50,
    remoteSort: false,
    autoLoad: true,
    proxy: {
        type: 'default',
        directFn: 'Fwa.GetSchedulerFwaList',
        paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe|timeZoneOffset|scheduledFwas',
        extraParams: {
            scheduledFwas: false,
            isPreparedByMe: PREPARED_BY_ME,
            timeZoneOffset: new Date().getTimezoneOffset()
        }
    },
    listeners: {
        load: function (t, records, successful, response) {
            var settings = TS.app.settings;
            if (!successful) {
                var error = {mdBody: 'Load of Unscheduled ' + settings.fwaAbbrevLabel + 's failed. ' + response.getResponse().result.message.mdBody},
                    title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                Ext.GlobalEvents.fireEvent(title, error);
            }
        }
    }

});
