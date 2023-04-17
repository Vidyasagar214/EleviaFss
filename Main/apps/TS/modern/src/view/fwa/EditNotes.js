Ext.define('TS.view.fwa.EditNotes', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-editnotes',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            title: {_tr: 'fwaAbbrevLabel', tpl: 'Edit {0} Notes'},
            docked: 'top',
            items: [
                {
                    align: 'right',
                    text: 'Cancel',
                    handler: 'closeEditNotesSheet'
                }
            ]
        },
        {
            xtype: 'textareafield',
            reference: 'fwaNotes',
            maxRows: 100,
            // scrollable: {
            //     direction: 'vertical',
            //     x: false
            // },
            bind: {
                value: '{selectedNote.contents}',
                disabled: '{!isCrewChief}'
            }
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    align: 'left',
                    text: 'Update',
                    //ui: 'action',
                    iconCls: 'x-fa fa-save',
                    style: 'margin-right: 5px;',
                    handler: 'onEditNotesSave'
                },
                {
                    align: 'left',
                    text: 'Delete',
                    reference: 'fwaNotesDeleteBtn',
                    hidden: true,
                    ui: 'action',
                    iconCls: 'x-fa fa-times-circle-o',
                    handler: 'onEditNotesDelete'

                },
                {
                    text: 'Clear',
                    align: 'right',
                    iconCls: 'x-fa  fa-pencil-square-o',
                    ui: 'action',
                    handler: 'onClearNotes'
                }
            ]
        }
    ]
});