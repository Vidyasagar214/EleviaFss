/**
 * Created by steve.tess on 5/11/2017.
 */
Ext.define('TS.controller.crew.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.crew-main',

    init: function () {

    },

    onCloseSheet: function (bt) {
        bt.up('sheet').hide();
    },


    onBackToFSS: function () {
        // //reload user config in case scheduler has changed any settings for FWAs
        // this.reloadUserConfig();
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS', this);
        Ext.Viewport.setActiveItem('app-fss');
    }
});