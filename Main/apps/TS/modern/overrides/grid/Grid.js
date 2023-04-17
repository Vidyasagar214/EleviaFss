//https://sencha.jira.com/browse/EXTJS-20722
//Store with one record does not update Grid that is wrapped in Sheet
Ext.define('TS.overrides.grid.Grid', {
    override: 'Ext.grid.Grid',
    compatibility: '6.0.2',
    
    initialize: function() {
        var me = this,
            store,
            titleBar = me.getTitleBar(),
            headerContainer = me.getHeaderContainer(),
            scrollable = me.getScrollable(),
            container;

        me.callParent();

        if (scrollable) {
            headerContainer.getScrollable().addPartner(scrollable, 'x');
        }
        container = me.container;
        if (titleBar) {
            container.add(me.getTitleBar());
        }
        container.add(headerContainer);

        // We add a class here because we want to control the width of the scroll
        // element, we don't want it to be auto
        me.scrollElement.addCls(me.customScrollCls);

        store = me.getStore();

        if (store) {
            store.on({
                add: 'adjustSize',
                scope: me
            });
        }
    },

    adjustSize: function(store) {
        var me = this;
        if (store.getCount() === 1) {
            me.onContainerResize(me.container, {
                height: me.container.element.getHeight()
            });
        }
    }
});