Ext.define('TS.view.fwa.FwaNotes', {
    extend: 'Ext.window.Window',
    xtype: 'window-fwanotes',

    controller: 'window-fwanotes',
    constrainHeader: true,
    plugins: {
        ptype: 'responsive'
    },
    responsiveConfig: {
        normal: {
            width: 700,
            height: 475
        },
        small: {
            width: 350,
            height: 250
        }
    },

    title: 'Notes',
    bodyPadding: 0,
    maximizable: false,
    layout: 'fit',
    items: [
        {
            xtype: 'fwaPostNote',
            flex: 1,
            reference: 'fwanotes',
            itemId: 'fwanotes'
        }
    ],

    buttons: [
        {
            xtype: 'textareafield',
            itemId: 'textAreaMessage',
            grow: false,
            name: 'message',
            anchor: '100%',
            flex: 5,
            listeners: {
                change: 'onTextAreaChange'
            }
        },
        {
            xtype: 'fieldcontainer',
            layout: 'vbox',
            itemId: 'notesButtons',
            reference: 'notesButtons',
            flex: 1,
            items: [
                {
                    xtype: 'button',
                    text: 'Update',
                    handler: 'newNote',
                    itemId: 'postNoteButton',
                    disabled: true,
                    margin: '0 0 10 0',
                    width: 100,
                    bind:{
                        hidden: '{settings.fwaReadOnly}'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Close',
                    handler: 'closeWindow',
                    width: 100
                }
            ]
        }

    ]
});
