//EXTJS-20127
//Modern mode on Touch devices: Animation requests keep running forever.
Ext.define('TS.overrides.scroll.Indicator', {
    override: 'Ext.scroll.Indicator',
    hidden: true,

    /**
     * Hides this scroll indicator
     */
    hide: function() {
        var me = this,
            delay = me.getHideDelay();

        if (me.hidden) {
            return;
        }

        me.hidden = true;
        if (delay) {
            me._hideTimer = Ext.defer(me.doHide, delay, me);
        } else {
            me.doHide();
        }
    },

    /**
     * Shows this scroll indicator
     */
    show: function() {
        var me = this,
            el = me.element,
            anim = el.getActiveAnimation();

        if (!me.hidden) {
            return;
        }

        me.hidden = false;
        // Stop the fade out animation for both toolkit animation types.
        // TODO: remove classic version when classic Ext.dom.Element overrides retire.
        if (anim) {
            anim.end();
        }
        if (el.stopAnimation) {
            el.stopAnimation();
        }

        if (!me._inDom) {
            // on first show we need to append the indicator to the scroller element
            me.getScroller().getElement().appendChild(el);
            me._inDom = true;

            if (!me.size) {
                me.cacheStyles();
            }
        }

        me.refreshLength();
        clearTimeout(me._hideTimer);
        el.setStyle('opacity', '');
    }
});