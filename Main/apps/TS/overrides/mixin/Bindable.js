//EXTJS-20533
//Unable to remove binding by setting property to null when configured for twoWay: true
Ext.define('TS.overrides.mixin.Bindable', {
    override: 'Ext.mixin.Bindable',
    compatibility: '6.0.2',

    privates: {
        applyBind: function (binds, currentBindings) {
            if (!binds) {
                return binds;
            }

            var me = this,
                viewModel = me.lookupViewModel(),
                twoWayable = me.getTwoWayBindable(),
                getBindTemplateScope = me._getBindTemplateScope,
                b, property, descriptor, destroy;

            me.$hasBinds = true;
            if (!currentBindings || typeof currentBindings === 'string') {
                currentBindings = {};
            }

            //<debug>
            if (!viewModel) {
                Ext.raise('Cannot use bind config without a viewModel');
            }
            //</debug>

            if (Ext.isString(binds)) {
                //<debug>
                if (!me.defaultBindProperty) {
                    Ext.raise(me.$className + ' has no defaultBindProperty - ' +
                        'Please specify a bind object');
                }
                //</debug>

                b = binds;
                binds = {};
                binds[me.defaultBindProperty] = b;
            }

            for (property in binds) {
                descriptor = binds[property];
                b = currentBindings[property];

                if (b && typeof b !== 'string') {
                    b.destroy();
                    b = null;
                    destroy = true;
                }

                if (descriptor) {
                    b = viewModel.bind(descriptor, me.onBindNotify, me);
                    b._config = Ext.Config.get(property);
                    b.getTemplateScope = getBindTemplateScope;

                    //<debug>
                    if (!me[b._config.names.set]) {
                        Ext.raise('Cannot bind ' + property + ' on ' + me.$className +
                            ' - missing a ' + b._config.names.set + ' method.');
                    }
                    //</debug>
                }

                if (destroy) {
                    delete currentBindings[property];
                } else {
                    currentBindings[property] = b;
                }

                if (twoWayable && twoWayable[property]) {
                    if (destroy) {
                        me.clearBindableUpdater(property);
                    } else if (!b.isReadOnly()) {
                        me.addBindableUpdater(property);
                    }
                }
            }

            return currentBindings;
        },

        clearBindableUpdater: function (property) {
            var me = this,
                configs = me.self.$config.configs,
                cfg = configs[property],
                updateName;

            if (cfg && me.hasOwnProperty(updateName = cfg.names.update)) {
                if (me[updateName].$bindableUpdater) {
                    delete me[updateName];
                }
            }
        },

        makeBindableUpdater: function (cfg) {
            var updateName = cfg.names.update,
                fn = function (newValue, oldValue) {
                    var me = this,
                        updater = me.self.prototype[updateName];

                    if (updater) {
                        updater.call(me, newValue, oldValue);
                    }
                    me.publishState(cfg.name, newValue);
                };

            fn.$bindableUpdater = true;

            return fn;
        },

        //Work around empty binding (not a part of the ticket)
        removeBindings: function () {
            var me = this,
                bindings, key, binding;

            if (me.$hasBinds) {
                bindings = me.getBind();
                if (bindings && typeof bindings !== 'string') {
                    for (key in bindings) {
                        binding = bindings[key];
                        if (binding) {
                            binding.destroy();
                            binding._config = binding.getTemplateScope = null;
                        }
                    }
                }
            }
            me.setBind(null);
        }
    }
});