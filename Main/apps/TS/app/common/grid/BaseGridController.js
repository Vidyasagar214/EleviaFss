Ext.define('TS.common.grid.BaseGridController', {
    extend : 'Ext.app.ViewController',

    alias: 'controller.grid',

    selectFn : undefined,

    selectDelay : 100,

    requires : [
        'Ext.util.DelayedTask'
    ],

    init : function() {
        this.selectFn = new Ext.util.DelayedTask(this.select, this);
        var view = this.getView();
        view.on('select', this.onSelect, this);
        view.on('deselect', this.onDeselect, this);
    },

    onSelect : function (sel, record, index, eOpts) {
        this.selectFn.delay(this.selectDelay, undefined, this, [sel.view.panel, record, true]);
    },

    onDeselect : function (sel, record, index, eOpts) {
        this.selectFn.delay(this.selectDelay, undefined, this, [sel.view.panel, record, false]);
    },

    select : function (grid, record, select) {

        if (select) {
            this.getView().fireEvent('delayedselect', grid, record);
        }
        else {
            this.getView().fireEvent('delayeddeselect', grid, record);
        }
    }

});
