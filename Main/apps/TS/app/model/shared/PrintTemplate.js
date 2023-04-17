Ext.define('TS.model.shared.PrintTemplate', {
    extend: 'TS.model.Base',

    idProperty: 'templateId',
    identifier: 'uuid',

    fields: [
        {
            name: 'templateId',
            type: 'auto'
        },
        {
            name: 'templateName',
            type: 'string'
        },
        {
            name: 'templateApp',
            type: 'string'
        },
        {
            name: 'templateType',
            type: 'string'
        },
        {
            name: 'templateOrigPath',
            type: 'string'
        },
        {
            name: 'filename',
            mapping: function (data) {
                var dt = Ext.Date.format(new Date(), 'Y-m-d h.i A');
                return dt + ' ' + data.templateName;
            }
        },
        {
            name: 'description',
            mapping: function (data) {
                var dt = Ext.Date.format(new Date(), 'Y-m-d h.i A');
                return dt + ' ' + data.templateName;
            }
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'Document.GetTemplateList',
        paramOrder: 'dbi|username|modelType|modelId'
    }
});
