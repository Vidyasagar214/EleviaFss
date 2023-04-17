Ext.define('FSS.overrides.dom.Element', {
    override: 'Ext.dom.Element',

    inheritableStatics: {
        getViewportHeight: function () {
            return window.innerHeight;
        },

        getViewportWidth: function () {
            return window.innerWidth;
        }
    }
});