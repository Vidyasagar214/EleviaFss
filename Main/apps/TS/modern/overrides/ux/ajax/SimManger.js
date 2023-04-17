Ext.define('TS.overrides.ux.ajax.SimManager', {
    override: 'Ext.ux.ajax.SimManager',

    getXhr: function(method, url, options, async) {

        // Return undefined to have SimManager make the normal backend call. Run callParent
        // to have SimManager use the logic set up in SynchronousCachedDirect.
        // TODO: Do we really want this IS_OFFLINE test? The code could work two ways:
        //!navigator.online ||
        if ((IS_OFFLINE) && options.jsonData && options.jsonData.action && options.jsonData.method) {
            // User is offline, so try to use a locally cached copy.
            var key = this._directCache.constructKey(options.jsonData);
            if (this._directCache.has(key)) {
                return this.callParent(arguments);
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }

    }
});



