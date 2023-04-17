//EXTJS-20288
//paramsAsHash should only be applied to Read operations
Ext.define('TS.overrides.direct.RemotingMethod', {
    override: 'Ext.direct.RemotingMethod',

    getArgs: function(config) {
        var me = this,
            params = config.params,
            paramOrder = config.paramOrder,
            paramsAsHash = config.paramsAsHash,
            metadata = config.metadata,
            options = config.options,
            args = [],
            i, len;

        if (me.ordered) {
            if (me.len > 0) {
                // If a paramOrder was specified, add the params into the argument list in that order.
                if (paramOrder) {
                    for (i = 0, len = paramOrder.length; i < len; i++) {
                        args.push(params[paramOrder[i]]);
                    }
                }
                else {
                    args.push(params);
                }
            }
        }
        else {
            args.push(params);
        }

        args.push(config.callback, config.scope || window);

        if (options || metadata) {
            options = Ext.apply({}, options);

            if (metadata) {
                // Could be either an object of named arguments,
                // or an array of ordered arguments
                options.metadata = metadata;
            }

            args.push(options);
        }

        return args;
    }
});