
Ext.define('TS.common.window.TreeListModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.tree-list',

    requires: [
        'TS.model.shared.WbsProjectTree'
    ],

    formulas: {
        selectionText: function(get) {
            var selection = get('treelist.selection'),
                settings = TS.app.settings,
                path;
            if (selection) {
                path = selection.getPath('qtip');
                path = path.replace(/^\/Root/, '');
                return 'Selected: ' + path;
            } else {
               // bind:{
                    return 'No ' + settings.wbs1Label + ' selected';
               // }
            }
        }
    },

    stores: {
        navItems: {
            type: 'tree',
            autoLoad: true,
            // So that a leaf node being filtered in
            // causes its parent to be filtered in too.
            filterer: 'bottomup',
            rootNode: {
                expanded: false
            },
            model: 'TS.model.shared.WbsProjectTree',
            proxy: {
                type: 'default',
                directFn: 'Wbs1.GetWbsProjectTree',
                paramOrder: 'dbi|username|empId|node|app',
                extraParams:{
                    app: 'FWA'
                }
            },
            remoteSort: false
        }
    }
});