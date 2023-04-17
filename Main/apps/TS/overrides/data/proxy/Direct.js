//EXTJS-20288
//paramsAsHash should only be applied to Read operations
Ext.define('TS.overrides.data.proxy.Direct', {
    override: 'Ext.data.proxy.Direct',
    doRequest: function(operation) {
        var me = this,
            writer, request, action, params, args, api, fn, callback, order, asHash;

        if (!me.methodsResolved) {
            me.resolveMethods();
        }

        request = me.buildRequest(operation);
        action  = request.getAction();
        api     = me.getApi();

        if (api) {
            fn = api[action];
        }

        fn = fn || me.getDirectFn();

        //<debug>
        if (!fn) {
            Ext.raise('No Ext Direct function specified for this proxy');
        }
        //</debug>

        writer = me.getWriter();

        if (writer && operation.allowWrite()) {
            request = writer.write(request);
        }

        // The weird construct below is due to historical way of handling extraParams;
        // they were mixed in with request data in ServerProxy.buildRequest() and were
        // inseparable after that point. This does not work well with CUD operations
        // so instead of using potentially poisoned request params we took the raw
        // JSON data as Direct function argument payload (but only for CUD!). A side
        // effect of that was that the request metadata (extraParams) was only available
        // for read operations.
        // We keep this craziness for backwards compatibility.
        if (action === 'read') {
            params = request.getParams();
            order = me.getParamOrder();
            asHash = me.getParamsAsHash();
        }
        else {
            params = request.getJsonData();
        }

        args = fn.directCfg.method.getArgs({
            params: params,
            paramOrder: order,
            paramsAsHash: asHash,
            metadata: me.getMetadata(),
            callback: me.createRequestCallback(request, operation),
            scope: me
        });

        request.setConfig({
            args: args,
            directFn: fn
        });

        fn.apply(window, args);

        // Store expects us to return something to indicate that the request
        // is pending; not doing so will make a buffered Store repeat the
        // requests over and over.
        return request;
    }
});