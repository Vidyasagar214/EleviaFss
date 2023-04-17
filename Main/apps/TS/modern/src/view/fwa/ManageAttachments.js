/**
 * Created by steve.tess on 7/18/2016.
 */
Ext.define('TS.view.fwa.ManageAttachments', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-attachments',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items:[
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',

            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                }
            ]
        },
        {
            xtype: 'grid',
            itemId: 'emailAttachmentGrid',
            plugins: {
                type: 'gridmultiselection',
                selectionColumn: {
                    width:50  // Change column width from the default of 60px
                }
            },
            store: {
                model: 'TS.model.shared.Attachment',
                autoLoad: false,
                proxy: {
                    type: 'default',
                    directFn: 'AttachmentData.GetAttachmentList',
                    paramOrder: 'dbi|username|modelType|modelId|includeItem|attachmentType'
                }
            },
            title: 'Attachment(s)',
            reference: 'emailAttachmentGrid',
            columns: [
                {
                    text: 'Type',
                    dataIndex: 'attachmentType',
                    renderer: function (value) {
                        return (value == 'P' ? 'Photo' : 'Doc');
                    },
                    flex: 1
                },
                {
                    text: 'Description',
                    dataIndex: 'description',
                    renderer: function (value, rec) {
                        return ( value == '' ? rec.get('filename') : value);
                    },
                    flex: 3
                }
            ]
        },

        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Attach',
                    align: 'right',
                    iconCls: 'x-fa fa-envelope-o',
                    handler: 'saveAttachmentList'
                }
            ]
        }
    ]

});