Ext.define('TS.controller.utilities.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.utilities-main',

    init: function () {
        var data = [],
            settings = TS.app.settings,
            vm = this.getViewModel();
        data.push({
            "name": "Update Cache",
            "path": SETTINGS.tools.cache,
            "icon": "fss-utilities-cache",
            "callWindowOpen": false
        });
        data.push({
            "name": "Show Configuration", //tools.config
            "path": SETTINGS.tools.config,
            "icon": "fss-utilities-config",
            "callWindowOpen": false
        });
        data.push({
            "name": "Set Logging to Debug", //tools.debug
            "path": SETTINGS.tools.debug,
            "icon": "fss-utilities-debug",
            "callWindowOpen": false
        });
        data.push({
            "name": "Set Logging to Error", //tools.error
            "path": SETTINGS.tools.error,
            "icon": "fss-utilities-error",
            "callWindowOpen": false
        });
        data.push({
            "name": "Show Logging", //tools.logging
            "path": SETTINGS.tools.logging,
            "icon": "fss-utilities-logging",
            "callWindowOpen": false
        });
        if (settings.canAccessUtilitiesPageConfig)
            data.push({
                "name": "Launch Configuration Utility", //tools.config.app
                "path": SETTINGS.tools.configApp,
                "icon": "fss-utilities-config-app",
                "callWindowOpen": true
            });
        if (settings.canAccessUtilitiesPageAdmin)
            data.push({
                "name": "Launch Import Utility", //tools.import.app
                "path": SETTINGS.tools.importApp,
                "icon": "fss-utilities-import-app",
                "callWindowOpen": true
            })
        //load table
        vm.get('utilitieslist').setData(data);
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },
//https://demo3.eleviasoftware.com/EleVia/EleViaLaunchFAC.aspx?ws=WS.XML
    onApplicationSelection: function (rowModel, record) {
        var isIE = /*@cc_on!@*/false || !!document.documentMode,
            isEdge = !isIE && !!window.StyleMedia,
            me = this,
            vw = me.getView(),
            iframe,
            path = record.get('path');
        if (record.get('callWindowOpen')) {
            // if (!isEdge)
            //     window.open('microsoft-edge:' + path);
            // else
            //     window.open(path);
            window.open(path);
        } else {
            if (record.get('name') == 'Show Logging') {
                Ext.Msg.prompt('Rows ', 'Please enter number of rows to return:', function (btn, text) {
                    if (btn == 'ok') {
                        path += text;
                        if (vw.lookup('iframeDisplay').el.dom.childNodes.length != 0)
                            vw.lookup('iframeDisplay').el.dom.childNodes[0].remove()

                        iframe = Ext.DomHelper.createDom('<iframe id="myIframe" src="' + path + '" width="100%" height="100%">');
                        vw.lookup('iframeDisplay').el.dom.appendChild(iframe);
                    }
                }, window, false, 100);
            } else {
                if (vw.lookup('iframeDisplay').el.dom.childNodes.length != 0)
                    vw.lookup('iframeDisplay').el.dom.childNodes[0].remove()

                iframe = Ext.DomHelper.createDom('<iframe src="' + path + '" width="100%" height="100%">');
                vw.lookup('iframeDisplay').el.dom.appendChild(iframe);
            }
        }
        Ext.first('utilities-list').getSelectionModel().deselectAll();
    },

    onActionSelection: function (view, rowIndex, colIndex, item, e, record) {
        var isIE = /*@cc_on!@*/false || !!document.documentMode,
            isEdge = !isIE && !!window.StyleMedia,
            me = this,
            vw = me.getView(),
            iframe,
            path = record.get('path');
        if (record.get('callWindowOpen')) {
            // if (!isEdge)
            //     window.open('microsoft-edge:' + path);
            // else
            //     window.open(path);
            window.open(path);
        } else {
            if (record.get('name') == 'Show Logging') {
                Ext.Msg.prompt('Rows ', 'Please enter number of rows to return:', function (btn, text) {
                    if (btn == 'ok') {
                        path += text;
                        if (vw.lookup('iframeDisplay').el.dom.childNodes.length != 0)
                            vw.lookup('iframeDisplay').el.dom.childNodes[0].remove()

                        iframe = Ext.DomHelper.createDom('<iframe id="myIframe" src="' + path + '" width="100%" height="100%">');
                        vw.lookup('iframeDisplay').el.dom.appendChild(iframe);
                    }
                });
            } else {
                if (vw.lookup('iframeDisplay').el.dom.childNodes.length != 0)
                    vw.lookup('iframeDisplay').el.dom.childNodes[0].remove()

                iframe = Ext.DomHelper.createDom('<iframe src="' + path + '" width="100%" height="100%">');
                vw.lookup('iframeDisplay').el.dom.appendChild(iframe);
            }
        }
        Ext.first('utilities-list').getSelectionModel().deselectAll();
    }

});