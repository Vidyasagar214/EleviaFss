/*
 *  Remote Printing Plugin
 */
Ext.define('TS.plugin.Printer', {
    extend: 'Ext.AbstractPlugin',

    alias: 'plugin.printer',

    pluginId: 'printer',

    config: {
        insertControls: false
    },

    init: function (component) {
        if (this.getInsertControls()) {
            this.setupControls(component);
        }
        this.getCmp().on('showprinter', this.showPrint, this);
    },

    setupControls: function (component) {
        if (component.title) {
            // Components with titles get a tool button in the header
            component.tools = Ext.Array.merge((component.tools || []), [{
                type: 'print',
                callback: 'showPrint',
                scope: this,
                tooltip: 'Print'
            }]);
        } else if (component.isXType('field')) {
            // Components that are fields get a tool button next to them
            component.on('render', this.insertFieldTool, this);
        } else {
            Ext.Logger.warn('Setting Printer plugin on a component type that is not supported: ' + component.getXTypes());
        }
    },

    // Render functions for various component types
    insertFieldTool: function (component) {
        if (component.inputEl && component.inputEl.parent('tr')) {
            component.inputEl.parent('tr').appendChild(Ext.create('Ext.panel.Tool', {
                type: 'print',
                callback: 'showPrint',
                scope: this,
                tooltip: 'Print'
            }).getRenderTree());
        }
    },

    showPrint: function (modelId, appType, title, empId) {
        var me = this;

        if (me.showPrinterWindow) {
            me.showPrinterWindow.destroy();
        }

        me.showPrinterWindow = Ext.create('TS.common.window.Print', {
            modelId: modelId,
            appType: appType,
            title: title,
            empId: empId
        });

        Ext.first('#singleFile').setHidden(true);
        me.showPrinterWindow.show();
    }

});
