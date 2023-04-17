/**
 * Created by steve.tess on 8/10/2018.
 */
Ext.define('TS.store.ExpFwaList', {
    extend: 'Ext.data.Store',

    requires: [
        'TS.model.fwa.ExpFwaModel'
    ],

    storeId: 'ExpFwaList',

    model: 'TS.model.fwa.ExpFwaModel',
    autoLoad: false,
    settingsDependency: true, //custom property

    proxy: {
        type: 'default',
        directFn: 'Fwa.GetExpenseFwaList',
        paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler',
        extraParams: {
            startDate: Ext.Date.add(new Date(), Ext.Date.DAY, -20).toDateString().replace('/', '-'),
            isPreparer: 'N',
            isScheduler: true
        },
        reader: {
            type: 'default',
            transform: {
                fn: function (data) {
                    // // do some manipulation of the raw data object
                    // var decommValue;
                    // decommValue = TS.Util.Decompress(data.data);
                    // data.data = [];
                    // Ext.each(decommValue, function (item) {
                    //     data.data.push(item);
                    // });
                    return data;
                },
                scope: this
            }
        }
    },
    sorters: [{
        property: 'fwaName',
        direction: 'ASC'
    }]

});