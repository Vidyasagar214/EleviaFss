//https://sencha.jira.com/browse/EXTJS-20674
//Sheet should support destroy after animation end

Ext.define('TS.overrides.Sheet', {
    override: 'Ext.Sheet',

    config: {
        /**
         * Destroy Sheet once the animation is done
         */
        autoDestroy: false
    },

    initialize: function () {
        var me = this;
        me.callParent(arguments);

        if (me.getAutoDestroy()) {
            me.getHideAnimation().on({
                animationend: me.destroy,
                scope: me
            });
        }
    }
});
