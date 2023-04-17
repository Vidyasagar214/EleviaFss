Ext.define('TS.overrides.Component', {
    override: 'Ext.Component',

    setLoading: function (isLoading, msg) {
        isLoading ? this.mask({
            xtype: 'loadmask',
            message: msg || 'Loading',
            indicator: false // Set true to show loading indicator
        }) : this.unmask();
    },

    //https://sencha.jira.com/browse/EXTJS-20705
    //Component class is missing findPlugin
    findPlugin: function (type) {
        var i = 0,
            plugins = this.getPlugins(),
            ln = plugins && plugins.length;

        for (; i < ln; i++) {
            if (plugins[i].type === type) {
                return plugins[i];
            }
        }
    }
});