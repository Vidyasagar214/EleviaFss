//TODO: Remove excessive references
// * Leave just one for the form, and even that would not be needed as you can obtain it via
// component query from main component .down('form')

// * Remove reference form the component itself

// Option 1)
// Access form fields via form names rather than creating references and looking up them one by one
// In controller
// Example: this.lookup('foo'), then this.lookup('bar'), then this.lookup('baz') - not optimal (because you are looking up every field)
// var form = this.getView().down('form').getForm();
// then you can set field values via method .setValues() and get values via getValues() method
// http://docs.sencha.com/extjs/6.0/6.0.1-classic/#!/api/Ext.form.Basic-method-setValues

//Option 2) Recommended way of implementing all views (windows, e.t.c.)
// * Introduce view model

// * bind form form/fields to model

// * in controller work with model not the view elements, any change will be reflected in the view automatically

Ext.define('TS.view.ts.ProjectEditor', {
    extend: 'Ext.window.Window',

    xtype: 'window-projecteditor',

    requires: [
        'TS.common.field.Wbs1',
        'TS.common.field.Wbs1Ts',
        'TS.common.field.Wbs3'
    ],

    controller: 'window-projecteditor',

    title: {_tr: 'wbs1Label', tpl: '{0} Editor'},
    width: 350,

    //TODO: These belong to ViewModel!
    config: {
        projectData: null,
        group: '',
        parentView: null,
        groupRecords: null
    },
    layout: 'fit',
    bodyPadding: 10,
    autoShow: true,
    items: [
        {
            xtype: 'form',
            reference: 'projectEditorForm',
            itemId: 'projectEditorForm',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            fieldLabel: {_tr: 'wbs1Label', tpl: '{0} #'},
                            xtype: 'field-wbs',
                            modelName: 'Wbs1',
                            name: 'wbs1',
                            itemId: 'fwawbs1id',
                            reference: 'fwawbs1id',
                            app: 'TS',
                            flex: 1,
                            nameField: 'fwawbs1name',
                            typeAhead: true,
                            queryParam: 'filter',
                            listeners: {
                                change: 'onWbs1ComboChange'
                            },
                            allowBlank: false,
                            forceSelection: true,
                            editable: true
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'button',
                            app: 'TS',
                            iconCls: 'x-fa fa-search', //'resources/images/icons/magnifier.png',
                            width: 24,
                            handler: 'showProjectLookupWindow'
                        }
                    ]
                },
                {
                    fieldLabel: {_tr: 'wbs2Label', tpl: '{0} #'},
                    xtype: 'field-wbs',
                    anchor: '-28',
                    itemId: 'fwawbs2id',
                    reference: 'fwawbs2id',
                    // clears: ['fwawbs3id'],
                    modelName: 'Wbs2',
                    name: 'wbs2',
                    app: 'TS',
                    bind: {
                        hidden: '{hideTsWbs2}'
                    },
                    nameField: 'fwawbs2name',
                    forceSelection: true,
                    editable: false,
                    listeners: {
                        change: 'onWbs2ComboChange'
                    }
                },
                {
                    fieldLabel: {_tr: 'wbs3Label', tpl: '{0} #'},
                    xtype: 'field-wbs',
                    itemId: 'fwawbs3id',
                    reference: 'fwawbs3id',
                    modelName: 'Wbs3',
                    name: 'wbs3',
                    app: 'TS',
                    bind: {
                        hidden: '{hideTsWbs3}'
                    },
                    anchor: '-28',
                    nameField: 'fwawbs3name',
                    forceSelection: true,
                    editable: false,
                    listeners: {
                        // change: 'onWbs3ComboChange'
                    }
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    name: 'clientId'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    name: 'clientName'
                },
                {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    bind: {
                        hidden: '{hideLaborCode}'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            editable: false,
                            readOnly: true,
                            flex: 1,
                            name: 'laborCode',
                            reference: 'fwalaborcode',
                            fieldLabel: {_tr: 'laborCodeLabel', tpl: '{0} #'}
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-search',
                            handler: 'showLaborCodeLookupWindow'
                        }
                    ]
                },
                {
                    xtype: 'field-billcat',
                    anchor: '-28',
                    reference: 'fwabillcatid',
                    nameField: 'fwabillcatname',
                    forceSelection: true,
                    fieldLabel: 'Bill Category', //TODO do we need to add a BillCategoryLabel to settings?
                    bind: {
                        hidden: '{hideBillCategory}',
                        // selection: {
                        //     twoWay: false
                        // }
                    },
                    name: 'billCategory'
                }
            ]
        }
    ],
    buttons: [{
        text: 'Update',
        handler: 'saveProjectDetails',
        reference: 'updateProjectBtn',
        formBind: true
    }, {
        text: 'Cancel',
        handler: 'cancelProjectEditing'
    }]
});
