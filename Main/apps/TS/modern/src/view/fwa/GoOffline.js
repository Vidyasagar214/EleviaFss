/**
 * Created by steve.tess on 12/17/2018.
 */
Ext.define('TS.view.fwa.GoOffline', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-gooffline',

    //controller: 'fwa-edit',
    //viewModel: 'fwa-main',
    //stretchX: true,
    //stretchY: true,
    config: {
        documents: false,
        photos: false
    },

    // updateDocuments(value) {
    //     this.down('#documents').setChecked(value);
    // },
    // updatePhotos(value) {
    //     this.down('#photos').setChecked(value);
    // },

    layout: 'vbox',
    autoDestroy: true, //custom property implemented in the override

    title: 'Load Attachments?',

    items:[
        {
            xtype: 'panel',
            reference: 'checkboxPanel',
            items:[
                {
                    xtype: 'checkboxfield',
                    labelWidth: '75%',
                    name : 'documents',
                    label: 'Documents',
                    labelAlign: 'right',
                    itemId: 'documentCheckbox',
                    style: 'background-color: white',
                    listeners: {
                        change: function (checkbox, value) {
                            this.up('sheet').setDocuments(value);
                        },
                        painted : function(element){
                            var settings = TS.app.settings;
                            this.setLabel('Documents ('+ settings.documentCt + ')');
                        }
                    }
                },
                {
                    xtype: 'checkboxfield',
                    labelWidth: '75%',
                    name : 'photos',
                    label: 'Photos',
                    labelAlign: 'right',
                    itemId: 'photoCheckbox',
                    style: 'background-color: white',
                    listeners: {
                        change: function (checkbox, value) {
                            this.up('sheet').setPhotos(value);
                        },
                        painted : function(element){
                            var settings = TS.app.settings;
                            this.setLabel('Photos ('+ settings.photoCt + ')');
                        }
                    }
                },
            ]
        },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            cls: 'ts-navigation-header',
            items: [{
                text: 'Go Offline',
                ui: 'confirm',
                iconCls: 'fa fa-wifi',
                handler: function(button) {
                    var parent = this.up('sheet');
                    parent.fireEvent('continue', parent, {
                        documents: parent.getDocuments(),
                        photos: parent.getPhotos()
                    });
                    parent.destroy();
                },

            }, {
                text: 'Cancel',
                ui: 'decline',
                handler: function(button){
                    var parent = this.up('sheet');
                    parent.fireEvent('cancel', parent);
                    parent.destroy();
                }
            }]
        }
    ]

});