/**
 * Created by steve.tess on 4/12/2016.
 */
Ext.define('TS.view.fwa.ManageNotes', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-notes',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'panel',
            scrollable: false,
            layout: 'fit',
            items: [
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Notes'},
                    items: [
                        {
                            align: 'right',
                            text: 'Close',
                            handler: 'closeSheet'
                        }
                    ]
                },
                {
                    xtype: 'list',
                    itemId: 'notesList',
                    reference: 'notesList',
                    scrollable: 'y',
                    disableSelection: true,
                    bind: {
                        store: '{notesview}',
                        selection: '{selectedNote}'
                    },

                    itemTpl: new Ext.XTemplate(
                        '<tpl if="canEdit">',
                        '<div style="margin-left: 15%;">',
                        '	<div class="message-name-mine">{[this.getEmployee(values)]}</div>',
                        '	<div class="notes mine">',
                        '		<div style="word-wrap: break-word">{contents}',
                        '       <p class="message-datetime"><div class="message-datetime">{[this.getModDate(values)]}</div></p>',
                        '   </div>',
                        '</div>',
                        '<tpl else>',
                        '<div style="margin-right: 15%;">',
                        '	<div class="message-name-other">{[this.getEmployee(values)]}</div>',
                        '	<div class="notes other">',
                        '		<div style="word-wrap: break-word">{contents}',
                        '       <p class="message-datetime"><div class="message-datetime">{[this.getModDate(values)]}</div></p>',
                        '   </div>',
                        '</div>',
                        '</tpl>',{
                            getEmployee: function(values){
                                var emp = Ext.getStore('AllEmployees').getById(values.empId);
                                return emp.get('empName');
                            },
                            getModDate: function(values){
                                return Ext.Date.format(values.modDate, 'Y-m-d h:i A');
                            }
                        }
                    )
                },
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: [
                        {
                            xtype: 'textareafield',
                            // scrollable: {
                            //     directionLock: true,
                            //     x: false
                            // },
                            //height: 60,
                            flex: 5,
                            style: {
                                'border': '1'
                            },
                            name: 'message',
                            itemId: 'textAreaMessage',
                            listeners: {
                                change: 'onTextAreaChange'
                            }
                        }, {
                            xtype: 'button',
                            handler: 'onEditNotesSave',
                            itemId: 'postNoteButton',
                            ui: 'action',
                            flex: 1,
                            text: 'Update',
                            disabled: true
                        }
                    ]
                }
            ]
        }
    ]
});