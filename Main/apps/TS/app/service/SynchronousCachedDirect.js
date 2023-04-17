/**
 We're using localforage, but it's all async. That doesn't work out
 so well in our code, so we need a synchronous version. The only way
 to do that is to keep the data in both memory and in localforage. On
 startup, load everythint via init(). The set method updates both the
 copy in memory and the copy in localforage. The get method only
 returns the in-memory copy.
 */
Ext.define("TS.service.SynchronousCachedDirect", {
    requires: ['Ext.ux.ajax.SimManager', 'Ext.ux.ajax.JsonSimlet'],
    singleton: true,
    constructor: function() {
        this.callParent(arguments);
        this._map = new Map();
    },

    _getLocalForage: function() {
        // Lazily create the localforage store, and put it in a global variable.
        TS.localforage_direct = TS.localforage_direct || localforage.createInstance({
            driver: [localforage.WEBSQL,
                localforage.INDEXEDDB,
                localforage.LOCALSTORAGE], // Force WebSQL; same as using setDriver()
            name: 'CcgFieldApp',
            version: 1.0,
            size: Math.pow(2, 20), // Size of database, in bytes. WebSQL-only for now. 2**20 === 1MB
            storeName: 'Direct',
            description: 'Caches Ext.Direct results'
        });
        return TS.localforage_direct;
    },
    init: function() {
        Ext.ux.ajax.SimManager._directCache = this; // So our SimManager override can reference this.

        // The URL pattern matches anything. That means for literally any XHR call, the code will:
        // o When online, cache Direct calls using logic in the overrides/direct/RemoveProvider,
        // o When making a request, the logic in overrides/us/SimManger see if we have a cached copy,
        //   and if so, returns a value that results in the simlet data() below being run, or
        //   if not, returns a value that results in the normal backend call being made. (That
        //   logic actually runs the defaultSimlet configured below -- since it's null, the
        //   original backend call is made).
        Ext.ux.ajax.SimManager.init({
            delay: 10
        }).register({
            url: /.*/,
            type: 'json',
            defaultSimlet: null, // Uses original URL for those not registered.
            data: (ctx) => {
                const key = this.constructKey(ctx.xhr.options.jsonData);
                const value = Ext.JSON.decode(this.get(key));
                if (value)
                    value.tid = ctx.xhr.options.jsonData.tid; // Use the current transaction ID, rather than the cached one.
                return value;
            }
        });

        Ext.ux.ajax.SimManager.defaultSimlet.manager = Ext.ux.ajax.SimManager;

        return this._getLocalForage()
            .iterate((value, key, iterationNumber) => {
                this._map.set(key, value);
                // if (key.match(/Employee-GetAll/)) {
                //     console.log('SynchronousCachedDirect#init()', key);
                // }
            });

    },
    constructKey: function(config) {
        // config must have action, method and data properties.
        const actionMethod = `${config.action}-${config.method}`;
        const data = config.data ? config.data.slice() : ''; // Get a copy of the data

        if(!data) return `${actionMethod}`;
        if (actionMethod === 'Fwa-GetList') {
            data[5] = ""; // Ignore the date
        }
        return `${actionMethod}-${Ext.JSON.encode(data)}`;
    },

    /**
     * Returns an array of keys
     */
    keys() {
        return Array.from(this._map.keys());
    },

    set(key, value) {
        // if (key.match(/Fwa-GetList/)) {
        //     console.log('SynchronousCachedDirect#set(key,value)', key);
        // }

        this._getLocalForage().setItem(key, value);
        this._map.set(key, value);
        return this;
    },
    get(key) {
        // if (key.match(/Employee-GetAll/)) {
        //     console.log('SynchronousCachedDirect#get(key)', key);
        // }
        return this._map.get(key);
    },
    has(key) {
        return this._map.has(key);
    },
    length() {
        return this._map.size;
    }

});