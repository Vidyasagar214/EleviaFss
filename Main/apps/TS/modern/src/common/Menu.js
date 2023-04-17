Ext.define('TS.view.common.Menu', {
    extend: 'Ext.Panel',

    isTSMenu: true, //custom

    modal: true,
    hideOnMaskTap: true,

    right: 0, //position the menu and float it
    top: 5,

    bodyPadding: 5,
    width: 160,
    //maxHeight: 300,
    defaults: {
        xtype: 'button'
    },

    scrollable: true,
    
    hide: function () {
        this.callParent(arguments);
        this.destroy();
    },

    destroy: function () {
        var me = this;

        me.callParent(arguments);

        if (me.parent) {
            me.parent.remove(me);
        }
    }
});