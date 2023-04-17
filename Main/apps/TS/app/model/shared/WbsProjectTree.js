Ext.define('TS.model.shared.WbsProjectTree', {
    extend: 'Ext.data.TreeModel',

    entityName: 'Projects',

    idProperty: 'id',

    fields: [
        {
            name: 'id', // wbs id (as well parent wbs id concatenated)
            type: 'auto',
            sortType: 'asUCText'
        },
        {
            name: 'model', // wbs1 wbs2 wbs3
            type: 'auto'
        },
        {
            name: 'displayId', // display wbs id
            type: 'auto',
            sortType: 'asDisplayId'
        },
        {
            name: 'text', // wbs name
            type: 'auto',
            sortType: 'asUCText',
            // mapping: function (data) {
            //     if (IS_TABLET)
            //         return data.displayId + '-' + data.text;
            //     else
            //         return data.text;
            // }
        },
        {
            name: 'iconCls',
            type: 'auto'
        },
        {
            name: 'mtype',
            type: 'auto'
        },
        {
            name: 'leaf', // bool value, true if end of tree
            type: 'auto'
        },
        {
            name: 'parentId', // id of wbs parent or 'root' for wbs1's
            type: 'auto'
        },
        {
            name: 'children', // this is list of WbsProjectTree's
            type: 'auto'
        },
        {
            name: 'clientId', // client Id for wbs1 only, otherwise null
            type: 'auto'
        },
        {
            name: 'originalQTip',
            mapping: 'qtip'
        },
        {
            name: 'qtip',
            mapping: function (data) {
                return data.displayId + ' : ' + data.text
            }
        }
    ]
});