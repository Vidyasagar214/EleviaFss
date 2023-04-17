Ext.define('TS.model.fwa.FWAListModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.fwalist',

    stores: {
        fwalist: {
            leadingBufferZone: 100,
            pageSize: 50,
            remoteSort: false,
            model: 'TS.model.fwa.Fwa',
            autoLoad: false,
            proxy: {
                type: 'default',
                directFn: 'Fwa.GetList',
                paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler',
                extraParams: {
                    startDate: new Date().toDateString()
                },
                reader: {
                    type: 'default',
                    transform: {
                        fn: function (data) {
                            console.log('data downloaded at'+new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds());
                            // // do some manipulation of the raw data object
                              var decommValue;
                             decommValue = TS.Util.Decompress(data.data);
                             console.log('data Decompressed at'+new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds());
                              data.data =decommValue;
                            //   Ext.each(decommValue, function (item) {
                            //      data.data.push(item);
                            //   });
                            return data;
                        },
                        scope: this
                    }
                }
            },
            listeners: {
                load: function (store, records, successful, response) {
                    var settings = TS.app.settings;

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

                    if(Ext.first('fwalist').getViewModel().get('isScheduler')){
                        store.remoteFilter = false;
                        //store.clearFilter();

                        var allRecords = [];
                        //debugger;
                        // Ext.each(store.getData().items, function (rec) {
                        //     allRecords.push(rec.get('fwaId'));
                        // });
                    console.log('data Filteration started at'+new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds());
                        store.filterBy(function (rec) {
                            if(rec.get('recurrenceConfig') && rec.get('recurrCt') > 1){
                                return false;
                            } else {
                                return true;
                            }
                        });
console.log('data Filteration Ended at'+new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds());

console.log('data Sort started at'+new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds());
                        store.sort([
                            {property: 'schedStartDate', direction: 'ASC'},
                            {property: 'fwaName', direction: 'ASC'}
                        ]);

                        if (settings.fwaListSorters) {
                            var sort = settings.fwaListSorters.split('^');
                            store.sort(sort[0], sort[1]);
                        }
console.log('data Sort Ended at'+new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds());
                        Ext.first('#btnViewLastWeek').setHidden(true);
                        Ext.first('#btnViewNextWeek').setHidden(true);
                        Ext.first('#labelFwaCurrentDate').setHidden(true);
                        Ext.first('#btnWeekView').setText('Week View')
                    }
                },
                filterchange: function (store) {
                    var ct = store.getRange().length,
                        settings = TS.app.settings;
                    if (Ext.first('#rowCtField')) {
                        Ext.first('#rowCtField').setValue('<div style="color:white;"><b>' + settings.fwaAbbrevLabel + ' Record Count: ' + ct + '</b></div>');
                    }
                    if (Ext.first('#schedRowCtField')) {
                        Ext.first('#schedRowCtField').setValue('<div style="color:white;"><b>' + settings.fwaAbbrevLabel + ' Record Count: ' + ct + '</b></div>');
                    }
                }
            }
        }
    }
});
