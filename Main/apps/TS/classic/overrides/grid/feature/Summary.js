/**
 * Created by steve.tess on 11/4/2019.
 */
Ext.define('TS.overrides.grid.feature.Summary', {
    override: 'Ext.grid.feature.Summary',

    emptySummaryRowSelector: '.' + Ext.baseCSSPrefix + 'grid-row-summary',
    onViewRefresh: function(view) {
        var me = this,
            record, row;
        // Only add this listener if in buffered mode, if there are no rows then
        // we won't have anything rendered, so we need to push the row in here
        if (!me.disabled && me.showSummaryRow && !view.all.getCount()) {
            record = me.createSummaryRecord(view);
            row = me.getSummaryRowPlaceholder(view);
            row.tBodies[0].appendChild(view.createRowElement(record, -1).querySelector(me.emptySummaryRowSelector));
        }
    },

    getSummaryRowPlaceholder: function(view) {
        var placeholderCls = this.summaryItemCls,
            nodeContainer, row;

        nodeContainer = Ext.fly(view.getNodeContainer());

        if (!nodeContainer) {
            return null;
        }

        row = nodeContainer.down('.' + placeholderCls, true);

        if (!row) {
            row = nodeContainer.createChild({
                tag: 'table',
                cellpadding: 0,
                cellspacing: 0,
                cls: placeholderCls,
                style: 'table-layout: fixed; width: 100%',
                children: [{
                    tag: 'tbody' // Ensure tBodies property is present on the row
                }]
            }, false, true);
        }

        return row;
    },
});