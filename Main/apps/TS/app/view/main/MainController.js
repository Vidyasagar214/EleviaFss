Ext.define('TS.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    initViewModel: function () {
        var me = this,
            vm = me.getViewModel(),
            data = TS.app.settings; //TODO Remove , once localization changes are in place

        vm.set('user', data); //TODO Double check, seems to be safe to remove, not used anywhere!
        vm.set('settings', data); //TODO Remove , once localization changes are in place

        me.setDocumentTitle();

        PREPARED_BY_ME = TS.app.settings.isPreparedByMe;
    },

    setDocumentTitle: function () {
        //Each module implements getPageTitle method
        document.title = this.getViewModel().getPageTitle();
    },


});
