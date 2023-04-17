//https://sencha.jira.com/browse/EXTJS-20728
//Can't use Ext.Msg with icon config

//Temporary remove icon config until proper fix is released
Ext.define('TS.overrides.MessageBox', {
    override: 'Ext.MessageBox',

    show: function (initialConfig) {
        if (initialConfig && initialConfig.hasOwnProperty('icon')) {
            delete initialConfig.icon;
        }

        this.callParent(arguments);
    }
});
