Ext.define('TS.common.fieldset.Address', {
    extend: 'Ext.form.FieldSet',

    xtype: 'fieldset-address',

    title: 'Work Address',


    defaults: {
        xtype: 'textfield',
        labelWidth: 80,
        // anchor: '100%'
        flex: 1
    },

    items: [
        {
            xtype: 'fieldcontainer',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield'
            },
            items: [
                {
                    fieldLabel: 'Address1',
                    name: 'address1',
                    itemId: 'address1Field',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'udf_a1_Label'},
                    name: 'udf_a1',
                    reference: 'udf_a1_text',
                    itemId: 'udf_a1_text',
                    bind: {
                        hidden: '{hideUdf_a1_text}',
                        disabled: '{readOnlyUdf_a1}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    // height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },{
                    xtype: 'combobox',
                    editable: false,
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'value',
                    valueField: 'key',
                    fieldLabel: {_tr: 'udf_a1_Label'},
                    name: 'udf_a1',
                    reference: 'udf_a1_combo',
                    itemId: 'udf_a1_combo',
                    bind: {
                        hidden: '{hideUdf_a1_combo}',
                        disabled: '{readOnlyUdf_a1}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    // height: 25
                },
                {
                    xtype: 'fieldcontainer',
                    reference: 'udf_a1_filler',
                    itemId: 'udf_a1_filler',
                    flex: 1,
                    bind: {
                        hidden: '{!hideUdf_a1_all}'
                    },
                }
            ]
        }, {
            xtype: 'fieldcontainer',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield'
            },
            items: [
                {
                    fieldLabel: 'Address2',
                    name: 'address2',
                    itemId: 'address2Field',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'udf_a2_Label'},
                    name: 'udf_a2',
                    reference: 'udf_a2_text',
                    itemId: 'udf_a2_text',
                    bind: {
                        hidden: '{hideUdf_a2_text}',
                        disabled: '{readOnlyUdf_a1}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,   //break-word;
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    // height: 50,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },{
                    xtype: 'combo',
                    editable: false,
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'value',
                    valueField: 'key',
                    fieldLabel: {_tr: 'udf_a2_Label'},
                    name: 'udf_a2',
                    reference: 'udf_a2_combo',
                    itemId: 'udf_a2_combo',
                    bind: {
                        hidden: '{hideUdf_a2_combo}',
                        disabled: '{readOnlyUdf_a2}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    // height: 25
                },
                {
                    xtype: 'fieldcontainer',
                    reference: 'udf_a2_filler',
                    itemId: 'udf_a2_filler',
                    flex: 1,
                    bind: {
                        hidden: '{!hideUdf_a2_all}'
                    },
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield'
            },
            items: [
                {
                    fieldLabel: 'City',
                    name: 'city',
                    itemId: 'cityField',
                    flex: 1
                    ,
                    labelWidth: 125,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'udf_a3_Label'},
                    name: 'udf_a3',
                    reference: 'udf_a3_text',
                    itemId: 'udf_a3_text',
                    bind: {
                        hidden: '{hideUdf_a3_text}',
                        disabled: '{readOnlyUdf_a3}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    //height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },{
                    xtype: 'combo',
                    editable: false,
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'value',
                    valueField: 'key',
                    fieldLabel: {_tr: 'udf_a3_Label'},
                    name: 'udf_a3',
                    reference: 'udf_a3_combo',
                    itemId: 'udf_a3_combo',
                    bind: {
                        hidden: '{hideUdf_a3_combo}',
                        disabled: '{readOnlyUdf_a3}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    //height: 25
                },
                {
                    xtype: 'fieldcontainer',
                    reference: 'udf_a3_filler',
                    itemId: 'udf_a3_filler',
                    flex: 1,
                    bind: {
                        hidden: '{!hideUdf_a3_all}'
                    },
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield'
            },
            items: [
                {
                    fieldLabel: 'State',
                    name: 'state',
                    itemId: 'stateField',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'udf_a4_Label'},
                    name: 'udf_a4',
                    reference: 'udf_a4_text',
                    itemId: 'udf_a4_text',
                    bind: {
                        hidden: '{hideUdf_a4_text}',
                        disabled: '{readOnlyUdf_a4}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    //height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },{
                    xtype: 'combo',
                    editable: false,
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'value',
                    valueField: 'key',
                    fieldLabel: {_tr: 'udf_a4_Label'},
                    name: 'udf_a4',
                    reference: 'udf_a4_combo',
                    itemId: 'udf_a4_combo',
                    bind: {
                        hidden: '{hideUdf_a4_combo}',
                        disabled: '{readOnlyUdf_a4}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    //height: 25
                },
                {
                    xtype: 'fieldcontainer',
                    reference: 'udf_a4_filler',
                    itemId: 'udf_a4_filler',
                    flex: 1,
                    bind: {
                        hidden: '{!hideUdf_a4_all}'
                    },
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield'
            },
            items: [
                {
                    fieldLabel: 'Zip',
                    name: 'zip',
                    itemId: 'zipField',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'udf_a5_Label'},
                    name: 'udf_a5',
                    reference: 'udf_a5_text',
                    itemId: 'udf_a5_text',
                    bind: {
                        hidden: '{hideUdf_a5_text}',
                        disabled: '{readOnlyUdf_a5}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    //height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },{
                    xtype: 'combo',
                    editable: false,
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'value',
                    valueField: 'key',
                    fieldLabel: {_tr: 'udf_a5_Label'},
                    name: 'udf_a5',
                    reference: 'udf_a5_combo',
                    itemId: 'udf_a5_combo',
                    bind: {
                        hidden: '{hideUdf_a5_combo}',
                        disabled: '{readOnlyUdf_a5}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    //height: 25
                },
                {
                    xtype: 'fieldcontainer',
                    reference: 'udf_a5_filler',
                    itemId: 'udf_a5_filler',
                    flex: 1,
                    bind: {
                        hidden: '{!hideUdf_a5_all}'
                    },
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield',
            },
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Latitude',
                    name: 'latitude',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    height: 25,
                    decimalPrecision: 8,
                    maxValue: 90,
                    minValue: -90,
                    hideTrigger: true,
                    itemId: 'latitudeField',
                    listeners: {
                        change: function (t, newValue, oldValue, eOpts) {
                            var form = t.up('form'),
                                record = form.getRecord(),
                                loc = record.get('loc');
                            if (newValue == 0) t.setValue('');
                            loc.latitude = newValue;
                            t.dirty = true
                        }
                    }
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'udf_a6_Label'},
                    name: 'udf_a6',
                    reference: 'udf_a6_text',
                    itemId: 'udf_a6_text',
                    bind: {
                        hidden: '{hideUdf_a6_text}',
                        disabled: '{readOnlyUdf_a6}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                    //height: 25,
                    listeners: {
                        change: function(obj, newValue, oldValue){
                            obj.dirty = true;
                        }
                    }
                },{
                    xtype: 'combo',
                    editable: false,
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'value',
                    valueField: 'key',
                    fieldLabel: {_tr: 'udf_a6_Label'},
                    name: 'udf_a6',
                    reference: 'udf_a6_combo',
                    itemId: 'udf_a6_combo',
                    bind: {
                        hidden: '{hideUdf_a6_combo}',
                        disabled: '{readOnlyUdf_a6}'
                    },
                    disabledCls: '',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'overflow-wrap: break-word; padding-left: 5px;'
                    //height: 25
                },
                {
                    xtype: 'fieldcontainer',
                    reference: 'udf_a6_filler',
                    itemId: 'udf_a6_filler',
                    flex: 1,
                    bind: {
                        hidden: '{!hideUdf_a6_all}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Longitude',
                    name: 'longitude',
                    flex: 1,
                    labelWidth: 125,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    height: 25,
                    decimalPrecision: 8,
                    maxValue: 180,
                    minValue: -180,
                    hideTrigger: true,
                    itemId: 'longitudeField',
                    listeners: {
                        change: function (t, newValue, oldValue, eOpts) {
                            var form = t.up('form'),
                                record = form.getRecord(),
                                loc = record.get('loc');
                            if (newValue == 0) t.setValue('');
                            loc.longitude = newValue;
                            t.dirty = true;
                        }
                    }
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'vbox',
                        align: 'right',
                        pack: 'center'
                    },
                    flex: 1,
                    items: [
                        {
                            xtype: 'button',
                            minWidth: 130,
                            iconCls: 'x-fa fa-map-pin',
                            text: 'Map Location',
                            action: 'setlocation',
                            handler: 'setLocationAddress',
                            tooltip: 'Click to map work location',
                            itemId: 'mapLocationBtn'
                        }
                    ]
                }
            ]
        }
    ],
    //disabled Map & Save buttons if any fields are invalid
    listeners: {
        fieldvaliditychange: function (t, field, isValid) {
            t.down('button[action=setlocation]').setDisabled(!isValid);
            // t.down('button[action=save]').setDisabled(!isValid);
        }
    }
});
