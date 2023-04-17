Ext.define('TS.view.fwa.WorkAuth', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-workauth',

    requires: [
        'TS.model.fwa.Work',
        'TS.common.field.WorkCode'
    ],

    cls: 'fwaunitgrid',
    style: 'border-top: 1px solid #c2c2c2 !important;',
    reference: 'fwaWorkGrid',
    itemId: 'fwaWorkGrid',
    controller: 'grid-workauth',

    listeners: {
        //select: 'workItemSelect',
        //deselect: 'workItemDeselect',
        edit: 'onWorkCodeEdit'
    },

    maxHeight: 250,
    config: {
        readOnlyGrid: true // Custom property
    },

    store: {
        model: 'TS.model.fwa.Work',
        sorters: [{
            property: 'workCodeId',
            direction: 'ASC'
        }],
        sortOnLoad: false
    },

    viewConfig : {
        columnLines: false,
        markDirty: false,
        listeners : {
            refresh : function (dataview) {
                Ext.each(dataview.panel.columns, function (column) {
                    if (column.autoSizeColumn === true)
                        column.autoSize();
                })
            }
        }
    },

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
        // ,listeners: {
        //     beforeedit: function (editor, context) {
        //         // Prevent any editing of existing records for specific fields
        //         //var fields = ['workCodeAbbrev'];
        //         // if (context.record.get('workCodeId') && Ext.Array.contains(fields, context.field)) {
        //         //     return false;
        //         // }
        //     }
        // }
    }],

    columns: [
        {
            dataIndex: 'workCodeId',
            hidden: true
        }, {
            text: {_tr: 'workCodeLabel'},
            style: 'border-left: 1px solid #b0b0b0 !important;',
            editor: {
                xtype:'field-workcode',
                listeners:{
                    //beforeselect: 'wcBeforeSelect',
                    change: 'workCodeChanged'
                },
            },
            sortable: true,
            dataIndex: 'workCodeAbbrev',
            autoSizeColumn: true,
            renderer: function (value, meta, record) {
                meta.style = "border-left: 1px solid #b0b0b0 !important;";
                return value;
            }

        }, {
            header: 'Scheduled',
            editor: {
                xtype: 'numberfield',
                minValue: 0,
                bind: {
                    readOnly: '{noWorkCodeRights}'
                },
                listeners:{
                    dirtychange: 'workCodeChanged'
                }
            },
            sortable: true,
            width: 90,
            dataIndex: 'scheduledHours',
            reference: 'scheduledHoursField'
        }, {
            header: 'Actual',
            editor: {
                xtype: 'numberfield',
                minValue: 0,
                bind: {
                    hidden: '{fwaHideActualHours}',
                    readOnly: '{fwaReadOnlyActualHours}'
                },
                listeners:{
                    dirtychange: 'workCodeChanged'
                }
            },
            sortable: true,
            width: 80,
            dataIndex: 'actualHours',
            renderer: function (value, meta) {
                if (parseInt(value) > 0) {
                    meta.style = "background-color:white;";
                } else {
                    meta.style = "background-color:##ffffad;";
                }
                return value;
            },
            bind: {
                hidden: '{fwaHideActualHours}'
            }
        }, {
            text: {_tr: 'workDescriptionLabel'},
            readOnly: true,
            sortable: true,
            flex: 2,
            dataIndex: 'workCodeId',
            renderer: function (value, metaData, record, rowIndex) {
                if (!record.get('workCodeAbbrev')) return '';
                var workCode = Ext.getStore('WorkCodes').getById(value);
                return (workCode ? workCode.get('workCodeDescr') : '');
            }
        }, {
            header: '% Complete',
            dataIndex: 'pctComplete',
            editor: {
                xtype: 'numberfield',
                minValue: 0,
                listeners:{
                    dirtychange: 'workCodeChanged'
                }
            },
            bind: {
               hidden: '{!settings.fwaDisplayWorkCodePctComplete}'
            },
            renderer: Ext.util.Format.numberRenderer('00.0%')
        }, {
            text: 'Comments',
            editor: {
                type: 'textfield',
                enforceMaxLength: true,
                maxLength: 255,
                listeners:{
                    dirtychange: 'workCodeChanged'
                }
            },
            width: 175,
            sortable: true,
            flex: 3,
            dataIndex: 'comments'
        },{
            xtype: 'checkcolumn',
            text: 'Photo Req',
            dataIndex: 'picRequired',
            flex: 1,
            tooltip: 'Photo Required',
            bind: {
                disabled: '{!isSchedulerOrNewFwa}'
            },
            listeners:{
                checkchange: function(){
                    dirtychange: 'workCodeChanged'
                }
            }
        }, {
            xtype: 'actioncolumn',
            reference: 'workCodeAttachPhotoButton',
            width: 30,
            resizable: false,
            menuDisabled: true,
            bind: {
                //hidden: '{settings.schedReadOnly}'
            },
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-camera blueIcon',
                tooltip: 'Attach Photo',
                handler: 'attachPhoto',
                isWorkCode: true
            }],
            renderer: function (value, metaData, rec, row, cell, store, view) {
                if (rec.get('attachmentCtPhoto') > 0) {
                    metaData.style = 'background-color:#ff6666;';
                }
                return;
            }
        }, {
            xtype: 'actioncolumn',
            reference: 'workCodeAttachDocButton',
            width: 30,
            resizable: false,
            menuDisabled: true,
            bind: {
                //jhidden: '{settings.schedReadOnly}'
            },
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-paperclip blackIcon',
                tooltip: 'Attach Document',
                handler: 'attachDocument'
            }],
            renderer: function (value, metaData, rec, row, cell, store, view) {
                if (rec.get('attachmentCtDoc') > 0) {
                    metaData.style = 'background-color:#ff6666;';
                }
                return;
            }
        },
        {
            xtype: 'actioncolumn',
            style: 'border-right: 1px solid #b0b0b0 !important;',
            width: 30,
            resizable: false,
            menuDisabled: true,
            align: 'center',
            bind:{
                hidden: '{noWorkCodeRights}'
            },
            items: [{
                reference: 'deleteWorkItemButton',
                handler: 'deleteWorkItem',
                iconCls: 'x-fa fa-trash redIcon',
                tooltip: 'Delete'
            }],
            renderer: function (value, meta, record) {
                meta.style = "border-right: 1px solid #b0b0b0 !important;";
                return;
            }
        }],

    dockedItems: [{
        xtype: 'toolbar',
        style: 'background: #e6e6e6 !important;',
        dock: 'bottom',
        items: [
            {
                xtype: 'button',
                //reference: 'newWorkItemButton',
                handler: 'newWorkItem',
                iconCls: 'x-fa fa-plus greenIcon',
                isWorkCode: true,
                bind:{
                    hidden: '{noWorkCodeRights}',
                    tooltip: ' Add {settings.workCodeLabel}'
                }
            }
        ]
    }]
});
