/**
 * Created by steve.tess on 2/13/2017.
 */
Ext.define('TS.common.grid.FwaNotesList', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-fwanotes',

    reference: 'fwaNotesGrid',

    store: {
        model: 'TS.model.fwa.FwaNote',
        autoDestroy: true,
        grouper: {
            groupFn: function (record) {
                return record.get('order');
            },
            direction: 'ASC'
        }
    },

    viewConfig: {
        columnLines: false,
        markDirty: false
    },

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
            edit: function(editor, e){
                e.record.commit();
            }
        }
    }],

    features: [
        {
            ftype: 'grouping',
            collapsible: false,
            collapseTip: '',
            groupHeaderTpl: [
                '<div style="color:black;font-weight:bold;">{[this.getTemplate(values)]}</div>', {
                    getTemplate: function (values) {
                        return values.rows[0].get('formattedDateEmployee');
                    }
                }
            ]
        }
    ],

    hideHeaders: true,
    columns: [
        {
            dataIndex: 'contents',
            getEditor: function (record) {
                if(!record.get('canEdit')){
                    return false;
                } else {
                    return Ext.create('Ext.grid.CellEditor', {
                        field: Ext.create('Ext.form.field.TextArea', {
                            allowBlank: true,
                            autoHeight: true,
                            autoWidth: true,
                            grow: true
                        })
                    });
                }
            },
            flex: 1,
            cellWrap: true
        },
        {
            dataIndex: 'canEdit',
            hidden: true
        },
        {
            dataIndex: 'seq',
            hidden: true
        },
        {
            xtype: 'actioncolumn',
            width: 30,
            resizable: false,
            menuDisabled: true,
            align: 'center',
            items: [
                {
                    reference: 'deleteNoteButton',
                    handler: 'deleteNote',
                    iconCls: 'workitem-delete',
                    tooltip: 'Delete',
                    isDisabled: function (view, rowIndex, colIndex, item, record){
                        return !record.get('canEdit');
                    }
                }
            ]
        }
    ]
});