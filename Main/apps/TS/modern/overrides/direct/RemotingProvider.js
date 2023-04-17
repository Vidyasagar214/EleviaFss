Ext.define('TS.overrides.direct.RemotingProvider', {
    override: 'Ext.direct.RemotingProvider',
    requires: ["TS.service.SynchronousCachedDirect"],

    // The remoting provider runs onData when it has backend data. This code
    // saves a local copy, then runs callParent(), and everything works as usual. 
    // TODO: Do we need this IS_OFFLINE test? Doing so implies we always use
    // the cached copy, even though the user is on the internet and could be getting
    // fresh data.
    onData: function (options, success, response) {
        var t = options.transaction;
        if (!IS_OFFLINE && navigator.onLine && t && t.action && t.method) {
            if (success) {
                var key = TS.service.SynchronousCachedDirect.constructKey(t);
                TS.service.SynchronousCachedDirect.set(key, response.responseText);
            }
        }
        this.callParent(arguments);

    }
});