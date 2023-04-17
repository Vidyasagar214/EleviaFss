/**
 * Created by steve.tess on 2/21/2017.
 */
Ext.define('TS.model.history.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.history-main',

    requires: [
        'TS.model.shared.History'
    ],

    data: {
        name: 'History',
        isScheduler: false
    },

    stores: {
        'fwaHistoryList': {
            model: 'TS.model.shared.History',
            proxy: {
                type: 'default',
                directFn: 'History.GetFwaHistory',
                paramOrder: 'dbi|username|fwaId'
            }
        }
    },

    init: function () {
    },

    constructor: function (config) {
        var me = this,
            store,
            username = Ext.Object.fromQueryString(location.search).username,
            fwaId = Ext.Object.fromQueryString(location.search).fwaId;

        me.callParent([config]);
        //load history
        store = me.getStore('fwaHistoryList');
        store.getProxy().setExtraParams({
            username: username,
            fwaId: fwaId
        });
        store.reload();
    },

    //Main model will implement this method
    getPageTitle: function () {
        return 'History';
    }
});