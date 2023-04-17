//EXTJS-20464
//Allow tree list to work with filtering
Ext.define('TS.overrides.list.AbstractTreeItem', {
    override: 'Ext.list.AbstractTreeItem',
    compatibility: '6.0.2',

    updateNode: function (node) {
        if (node) {
            var me = this,
                map = me.itemMap,
                childNodes, owner, len, i, item, child;

            me.element.dom.setAttribute('data-recordId', node.internalId);

            if (!map) {
                childNodes = node.childNodes;
                owner = me.getOwner();
                me.itemMap = map = {};
                for (i = 0, len = childNodes.length; i < len; ++i) {
                    child = childNodes[i];
                    if (child.data.visible) {
                        item = owner.createItem(child, me);
                        map[child.internalId] = item;
                        me.insertItem(item, null);
                    }
                }
            }

            me.setExpanded(node.isExpanded());
            me.doNodeUpdate(node);
        }
    }
});