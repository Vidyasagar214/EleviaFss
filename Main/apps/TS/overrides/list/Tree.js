//EXTJS-20464
//Allow tree list to work with filtering
Ext.define('TS.overrides.list.Tree', {
    override: 'Ext.list.Tree',
    compatibility: '6.0.2',

    updateStore: function (store, oldStore) {
        var me = this,
            root;

        if (oldStore) {
            if (oldStore.getAutoDestroy()) {
                oldStore.destroy();
            } else {
                me.storeListeners.destroy();
            }
            me.removeRoot();
            me.storeListeners = null;
        }

        if (store) {
            me.storeListeners = store.on({
                destroyable: true,
                scope: me,
                filterchange: 'onFilterChange',
                nodeappend: 'onNodeAppend',
                nodecollapse: 'onNodeCollapse',
                nodeexpand: 'onNodeExpand',
                nodeinsert: 'onNodeInsert',
                noderemove: 'onNodeRemove',
                rootchange: 'onRootChange',
                update: 'onNodeUpdate'
            });

            root = store.getRoot();
            if (root) {
                me.createRootItem(root);
            }
        }

        if (!me.destroying) {
            me.updateLayout();
        }
    },

    privates: {
        createItem: function (node, parent) {
            var me = this,
                item = Ext.create(me.getItemConfig(node, parent)),
                toolsElement = me.toolsElement,
                toolEl, previousSibling;

            if (parent.isRootListItem) {
                toolEl = item.getToolElement();
                if (toolEl) {
                    previousSibling = me.findVisiblePreviousSibling(node);
                    if (!previousSibling) {
                        toolsElement.insertFirst(toolEl);
                    } else {
                        previousSibling = me.getItem(previousSibling);
                        toolEl.insertAfter(previousSibling.getToolElement());
                    }
                    toolEl.dom.setAttribute('data-recordId', node.internalId);
                    toolEl.isTool = true;
                }
            }

            me.itemMap[node.internalId] = item;
            return item;
        },


        findVisiblePreviousSibling: function (node) {
            var sibling = node.previousSibling;
            while (sibling) {
                if (sibling.data.visible) {
                    return sibling;
                }
                sibling = sibling.previousSibling;
            }
            return null;
        },

        onFilterChange: function (store) {
            // Because the tree can use bottom up or top down filtering, don't try and figure out
            // what changed here, just do a global refresh
            this.onRootChange(store.getRoot());
        },

        onRootChange: function (root) {
            var me = this;

            me.removeRoot();

            if (root) {
                me.createRootItem(root);
            }

            me.updateLayout();
            me.fireEvent('refresh', me);
        }
    }

});