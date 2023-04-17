/**
 * Created by steve.tess on 2/21/2017.
 */
Ext.define('TS.controller.history.MainController', {
    extend: 'TS.view.main.MainController',

    alias: 'controller.history-main',

    init: function () {
        var me = this,
            vw = me.getView();
        vw.lookup('historyHeader').setText(Ext.Object.fromQueryString(location.search).fwaId + ' History');
    },

    getFwaInfo: function () {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            id = Ext.Object.fromQueryString(location.search).fwaId;
        //todo fix this date
        // TS.model.fwa.Fwa.getProxy().setExtraParams({
        //     fwaDate: Ext.Date.format(me.getView().schedStartDate, 'Ymd')
        // });
        TS.model.fwa.Fwa.load(id, {
            success: function (record) {
                vw.lookup('historyHeader').setText('History: ' + record.get('wbs1') + '  (' + record.get('fwaNum') + '-' + record.get('fwaName') + ')');
            },
            scope: me
        });
    },

    onCloseHistory: function (component, e) {
        window.close();
    }
});