// https://sencha.jira.com/browse/EXTJS-20590
//Note: Use only on non responsive forms without align:'stretch'
Ext.define('TS.overrides.resizer.Splitter', {
    override: 'Ext.resizer.Splitter',

    onRender: function() {
        var me = this,
            layout;

        me.callParent(arguments);

        layout = me.ownerCt && me.ownerCt.layout;

        // Subscribe to parent direction change for layout type 'box'
        // This is important when splitter is used in containers configured with responsiveConfig

        if(layout && layout.type === 'box') {
            me.ownerCt.layout.updateVertical = Ext.Function.createSequence(me.ownerCt.layout.updateVertical, function(){
                me.updateOrientation();
            });
        }
    },

    getCollapseDirection: function () {
        var me = this,
            dir = me.collapseDirection,
            collapseTarget, idx, items, type, isVertical, layoutName;

        if (!dir) {
            collapseTarget = me.collapseTarget;
            if (collapseTarget.isComponent) {
                dir = collapseTarget.collapseDirection;
            }

            if (!dir) {
                // Avoid duplication of string tests.
                // Create a two bit truth table of the configuration of the Splitter:
                // Collapse Target | orientation
                //        0              0             = next, horizontal
                //        0              1             = next, vertical
                //        1              0             = prev, horizontal
                //        1              1             = prev, vertical

                isVertical = me.ownerCt.layout.vertical;

                type = me.ownerCt.layout.type;

                if (type === 'box') {
                    layoutName = isVertical === true ? 'vbox' : 'hbox'
                } else {
                    layoutName = type;
                }

                if (collapseTarget.isComponent) {
                    items = me.ownerCt.items;
                    idx = Number(items.indexOf(collapseTarget) === items.indexOf(me) - 1) << 1 | Number(layoutName === 'hbox');
                } else {
                    idx = Number(me.collapseTarget === 'prev') << 1 | Number(layoutName === 'hbox');
                }

                // Read the data out the truth table
                dir = ['bottom', 'right', 'top', 'left'][idx];
            }

            me.collapseDirection = dir;
        }

        me.setOrientation((dir === 'top' || dir === 'bottom') ? 'horizontal' : 'vertical');

        return dir;
    }
});
