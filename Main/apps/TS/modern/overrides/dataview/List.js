//EXTJS-20703
//Avoid infinite loop when adding empty store to dataview.List
Ext.define('TS.overrides.dataview.List', {
    override: 'Ext.dataview.List',
    compatibility: '6.0.2',

    config: {
        //Ensure we have the height defined, rather than being calculated dynamically
        // This fixes some issues with grid not being able to determine the correct sizing
        itemHeight: 48
    },

    privates: {
        //Fix Grouping error on empty store
        isGrouping: function () {
            var store = this.getStore();

            return Boolean(store && this.getGrouped() && store.getGrouper());
        }
    },

    onContainerResize: function (container, size) {
        var me = this,
            store = me.getStore(),
            currentVisibleCount, newVisibleCount, minHeight, listItems, itemMap, itemConfig;

        if (!me.headerHeight) {
            me.headerHeight = parseInt(me.pinnedHeader.renderElement.getHeight(), 10);
        }

        if (me.getInfinite()) {
            itemMap = me.getItemMap();
            minHeight = itemMap.getMinimumHeight();

            if (!store || (!store.getCount() && !store.isLoaded())) {
                // If the store is not yet loaded we can't measure the height of the first item
                // to determine minHeight
                // TODO: refactor
                me._fireResizeOnNextLoad = true;
                return;
            }

            if (!minHeight) {
                listItems = me.listItems;

                // If there was no itemHeight/minHeight specified, we measure and cache
                // the height of the first item for purposes of buffered rendering
                // caluclations.
                // TODO: this won't handle variable row heights

                if (!listItems.length) {
                    // make sure the list contains at least one item so that we can measure
                    // its height from the dom.  Don't worry about ending up with the wrong
                    // number of items - it will be corrected when we invoke setItemsCount
                    // shortly
                    itemConfig = me.getListItemConfig();
                    me.createItem(itemConfig);
                    me.updateListItem(listItems[0], 0, me.getListItemInfo());
                    me.visibleCount++;

                }

                minHeight = listItems[0].element.getHeight();
                // cache the minimum height on the itemMap for next time
                itemMap.setMinimumHeight(minHeight);
                me.getItemMap().populate(me.getStore().getCount(), me.topRenderedIndex);
            }

            currentVisibleCount = me.visibleCount;

            // (minHeight || 1) here as a protection in case minHeight is 0 would assign Infinity to newVisibleCount
            newVisibleCount = Math.ceil(size.height / (minHeight || 1));

            if (newVisibleCount != currentVisibleCount) {
                me.visibleCount = newVisibleCount;
                me.setItemsCount(newVisibleCount + me.getBufferSize(), itemConfig);
                // This is a private event used by some plugins
                me.fireEvent('updatevisiblecount', this, newVisibleCount, currentVisibleCount);
            }
        } else if (me.listItems.length && me.getGrouped() && me.getPinHeaders()) {
            // Whenever the container resizes, headers might be in different locations. For this reason
            // we refresh the header position map
            me.updateHeaderMap();
        }
    }
});