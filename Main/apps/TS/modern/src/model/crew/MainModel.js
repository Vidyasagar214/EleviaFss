/**
 * Created by steve.tess on 5/11/2017.
 */
Ext.define('TS.model.crew.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.crew-main',

    data: {
        name: 'Scheduler',
        isScheduler: true,
        fromFSS: false
    },

    constructor: function (config) {

        this.callParent([config]);

    },

    //Main model will implement this method
    getPageTitle: function () {
        return TS.app.settings.schedTitle;
    }
});