Ext.define('TS.view.ts.Projects', {
    extend: 'Ext.Sheet',

    xtype: 'ts-projects',

    requires: [
        'TS.common.field.WBS'
    ],

    stretchX: true,
    stretchY: true,

    autoDestroy: true,
    headerArr: [],

    layout: 'fit',
    userCls: 'ts-delete-padding', //Eliminate padding for this sheet

    items: [
        {
            xtype: 'tabpanel',
            tabBar: {
                hidden: true
            },
            items: [
                {
                    xtype: 'container',
                    title: 'projects',//invisible
                    scrollable: 'y',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'titlebar',
                            cls: 'ts-navigation-header',
                            docked: 'top',
                            title: {_tr: 'wbs1LabelPlural', tpl: 'Current {0}'},
                            items: [
                                {
                                    align: 'left',
                                    iconCls: 'x-fa fa-plus',
                                    handler: 'onAddNewProject'
                                },
                                {
                                    align: 'right',
                                    text: 'Done',
                                    action: 'close'
                                }
                            ]
                        },
                        // List current projects
                        {
                            xtype: 'list',
                            itemId: 'ts-projectlist',
                            scrollable: 'y',
                            reference: 'projectlist',
                            tpl: '{projectName}',
                            headerArray: [],
                            bind: {
                                store: '{projects}',
                                selection: '{selectedProject}'
                            },
                            itemCls: 'ts-timesheet-row',
                            itemTpl: '{title}',
                            preventSelectionOnDisclose: false,
                            onItemDisclosure: true,
                            listeners: [
                                {
                                    disclose: 'onEditProject',
                                    itemsingletap: 'onEditProjectTap'
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            itemId: 'addTimesheetBtn',
                            docked: 'bottom',
                            items: [
                                {
                                    text: 'Add Timesheet',
                                    style: 'color: #fff',
                                    cls: 'ts-navigation-header',
                                    flex: 1,
                                    bind: {
                                        disabled: '{!projectlist.selection}'
                                    },
                                    handler: 'onAddTimesheet'
                                }
                            ]
                        }
                    ]
                },
                // Edit / add project card
                {
                    xtype: 'formpanel',
                    itemId: 'ts-wbsprojectlist',
                    title: 'edit',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'titlebar',
                            cls: 'ts-navigation-header',
                            docked: 'top',
                            title: 'Add Project' //Adjust title from controller to Edit / Add
                        },
                        {
                            xtype: 'titlebar',
                            docked: 'bottom',
                            items: [
                                {
                                    align: 'left',
                                    text: 'Update',
                                    ui: 'action',
                                    iconCls: 'x-fa fa-save',
                                    action: 'save-project'
                                },
                                {
                                    text: 'Cancel',
                                    align: 'right',
                                    iconCls: 'x-fa  fa-times-circle-o',
                                    handler: 'onProjectCancel'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            margin: '10 15 0 0',
                            layout: {
                                type: 'hbox',
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    align: 'right',
                                    ui: 'action',
                                    text: 'Projects',
                                    iconCls: 'x-fa fa-search',
                                    handler: 'onProjectLookup',
                                    bind: {
                                        disabled: '{wbsLocked}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            reference: 'wbslist',
                            items: [
                                {
                                    label: {_tr: 'wbs1Label', tpl: '{0} #'},
                                    xtype: 'field-wbs',
                                    modelName: 'Wbs1',
                                    name: 'wbs1',
                                    itemId: 'fwawbs1id',
                                    reference: 'wbs1combo', //we rely on referenced field selection in the view model
                                    deferredLoad: true, // Load the store until after initialization is complete
                                    clears: ['fwawbs2id', 'fwawbs3id'], //References of fields that should be receive blank value when this field sets new value
                                    sets: 'fwawbs2id', //Manipulates dependent store
                                    //WBS2 needs wbs1 value
                                    dependencyFilter: {
                                        wbs1: 'fwawbs1id' // Proxy ExtraParam. Will set to dependency value
                                    },
                                    app: 'TS',
                                    bind: {
                                        value: '{currentTSRow.wbs1}',
                                        readOnly: '{wbsLocked}'
                                    }
                                },
                                {
                                    label: {_tr: 'wbs2Label', tpl: '{0} #'},
                                    xtype: 'field-wbs',
                                    itemId: 'fwawbs2id',
                                    reference: 'wbs2combo',
                                    clears: ['fwawbs3id'],
                                    modelName: 'Wbs2',
                                    name: 'wbs2',
                                    app: 'TS',
                                    sets: 'fwawbs3id',
                                    //WBS3 needs both wbs1 and wbs2 values
                                    dependencyFilter: {
                                        wbs1: 'fwawbs1id',
                                        wbs2: 'fwawbs2id'
                                    },
                                    bind: {
                                        value: '{currentTSRow.wbs2}',
                                        readOnly: '{wbsLocked}',
                                        hidden: '{hideTsWbs2}'
                                    }
                                },
                                {
                                    label: {_tr: 'wbs3Label', tpl: '{0} #'},
                                    xtype: 'field-wbs',
                                    itemId: 'fwawbs3id',
                                    reference: 'wbs3combo',
                                    modelName: 'Wbs3',
                                    name: 'wbs3',
                                    app: 'TS',
                                    bind: {
                                        value: '{currentTSRow.wbs3}',
                                        readOnly: '{wbsLocked}',
                                        hidden: '{hideTsWbs3}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    itemId: 'fwawbs1name',
                                    userCls: 'ts-long-label',
                                    label: {_tr: 'wbs1Label', tpl: '{0} Name'},
                                    bind: '{wbs1combo.selection.name}' // this is automatic field and will adjust to whatever selection is in combo
                                },
                                {
                                    xtype: 'displayfield',
                                    hidden: true,
                                    userCls: 'ts-long-label',
                                    itemId: 'fwawbs2name',
                                    label: {_tr: 'wbs2Label', tpl: '{0} Name'},
                                    bind: {
                                        value: '{wbs2combo.selection.name}'
                                        //hidden: '{hideFwaWbs2}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    hidden: true,
                                    itemId: 'fwawbs3name',
                                    label: {_tr: 'wbs3Label', tpl: '{0} Name'},
                                    bind: {
                                        value: '{wbs3combo.selection.name}'
                                        //hidden: '{hideFwaWbs3}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    align: 'right',
                                    ui: 'action',
                                    margin: '0 15 0 0',
                                    text: {_tr: 'laborCodeLabelPlural'},
                                    iconCls: 'x-fa fa-search',
                                    handler: 'onLaborCodeLookup',
                                    bind: {
                                        disabled: '{wbsLocked}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            items: [
                                {
                                    xtype: 'textfield',
                                    readOnly: true,
                                    label: {_tr: 'laborCodeLabel', tpl: '{0} #'},
                                    labelWidth: 110,
                                    name: 'laborCode',
                                    itemId: 'fwalaborcode',
                                    bind: {
                                        value: '{currentTSRow.laborCode}',
                                        hidden: '{hideLaborCode}'
                                    },
                                    listeners: {
                                        focus: function (obj, e) {
                                            var scroller = obj.getParent().getParent().getScrollable();
                                            TS.app.settings.currentPosition = scroller.position.y;
                                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                                scroller.scrollTo(null, 300);
                                        },
                                        blur: function(obj, e){
                                            var scroller = obj.getParent().getParent().getScrollable();
                                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                                        }
                                    }
                                },
                                {
                                    xtype: 'field-billcategory',
                                    label: 'Bill Category',
                                    labelWidth: 110,
                                    bind: {
                                        hidden: '{hideBillCategory}',
                                        value: '{currentTSRow.billCategory}'
                                    },
                                    name: 'billCategory'
                                }
                            ]
                        }, {
                            xtype: 'button',
                            name: 'dummy',
                            text: '  ',
                            height: 300,
                            listeners: {
                                painted: function(obj){
                                    if(Ext.os.is.Android && Ext.os.is.Phone){
                                        obj.hidden = false;
                                    } else {
                                        obj.hidden = true;
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
});

