//EXTJS-20464
//Allow tree list to work with filtering
Ext.define('TS.overrides.data.TreeStore', {
    override: 'Ext.data.TreeStore',
    compatibility: '6.0.2',

    onFilterEndUpdate: function(filters) {
        var me = this,
            length = filters.length,
            root = me.getRoot(),
            childNodes, childNode,
            filteredNodes, i;

        if (!me.getRemoteFilter()) {
            if (length) {
                me.doFilter(root);
            } else {
                root.cascadeBy({
                    after: function(node) {
                        // Set visible field silently: do not fire update events to views.
                        // Views will receive refresh event from onNodeFilter.
                        node.set('visible', true, me._silentOptions);
                    }
                });
            }
            if (length) {
                filteredNodes = [];
                childNodes = root.childNodes;
                for (i = 0, length = childNodes.length; i < length; i++) {
                    childNode = childNodes[i];
                    if (childNode.get('visible')) {
                        filteredNodes.push(childNode);
                    }
                }
            } else {
                filteredNodes = root.childNodes;
            }
            me.onNodeFilter(root, filteredNodes);
            root.fireEvent('filterchange', root, filteredNodes);

            // Inhibit AbstractStore's implementation from firing the refresh event.
            // We fire it in the onNodeFilter.
            me.suppressNextFilter = true;
            me.callParent([filters]);
            me.suppressNextFilter = false;
        } else {
            me.callParent([filters]);
        }
    }
});