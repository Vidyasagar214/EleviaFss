Ext.define('TS.overrides.app.ViewModel', {
    override: 'Ext.app.ViewModel',
    compatibility: '6.0.2',

    constructor: function (config) {
        this.bindings = {};

        this.initConfig(config);
        this.init();
    },

    init: Ext.emptyFn
});