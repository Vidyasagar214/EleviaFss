/**
 * Created by steve.tess on 4/10/2016.
 */
Ext.define('TS.common.dataview.AttachmentsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.attachments',

    requires: [
        'TS.Util',
        'TS.common.field.Display'
    ],

    listen: {
        global: {
            'DeleteAttachment': 'onDeleteAttachment',
            'ViewEnlargedImage': 'onViewEnlargedImage',
            'ViewEnlargedDocument': 'onViewEnlargedDocument'
        }
    },

    init: function () {
        this.onLoadStore();
    },

    onLoadStore: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vw.getStore(),
            proxy = store.getProxy(),
            params = vw.attachmentParams,
            record = vm.get('selectedFWA') || vm.get('selectedEXP'), // || vm.get('swelectedExpReport'),
            attachments = record.get('attachments') || [],
            attachmentsToAdd = record.get('attachmentsToAdd') || [],
            attachmentsToDelete = record.get('attachmentsToDelete') || [],
            newItems;

        if (attachments.length > 0) {
            store.clearData();
            newItems = me.loadDynamicAttachments(params.attachmentType, params.modelId);
            Ext.each(newItems, function (item) {
                store.loadRawData(item, true);
            });
        }

        if (attachmentsToAdd.length > 0) {
            newItems = me.loadDynamicAttachmentsToAdd(params.attachmentType, params.modelId);
            Ext.each(newItems, function (item) {
                store.loadRawData(item, true);
            });
        }

        if (store.loadCount == 0 || (attachments.length == 0 && attachmentsToAdd == 0)) {
            proxy.setExtraParams({
                attachmentType: params.attachmentType,
                includeItem: params.includeItem,
                modelId: params.modelId,
                modelType: params.modelType
            });

            store.load(function (records, op, success) {
                if (success) {
                    store.clearFilter();
                    Ext.each(attachmentsToDelete, function (attachmentId) {
                        store.filterBy(function (obj) {
                            return obj.get('attachmentId') != attachmentId;
                        });
                    });
                    Ext.each(records, function (obj) {
                        attachments.push(obj.getData());
                    });
                }
            });
        }
    },

    loadDynamicAttachments: function (type, modelId) {
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('selectedFWA') || vm.get('selectedEXP'),
            attachments = record.get('attachments'),
            filtered = [];
        Ext.each(attachments, function (obj) {
            if (obj.attachmentType == type && obj.owningModelId == modelId) {
                filtered.push(obj);
            }
        });
        if (filtered.length > 0) {
            var arr = [];
            Ext.each(filtered, function (obj) {
                var item = Ext.create('TS.model.shared.Attachment', {
                    attachmentId: obj.attachmentId,
                    attachmentItem: obj.attachmentItem,
                    attachmentType: obj.attachmentType,
                    dateAttached: obj.dateAttached,
                    description: obj.description,
                    extension: obj.extension,
                    filename: obj.filename,
                    owningModelId: obj.owningModelId,
                    owningModelType: obj.owningModelType
                });
                if (obj.base64String) {
                    item.set('attachmentItem', obj.base64String);
                }
                arr.push(item);
            });
            return (arr);
        }
    },

    loadDynamicAttachmentsToAdd: function (type, modelId) {
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('selectedFWA') || vm.get('selectedEXP'),
            attachments = record.get('attachmentsToAdd'),
            filtered = [],
            base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            encOut = "",
            bits,
            i = 0;
        Ext.each(attachments, function (obj) {
            if (obj.attachmentType == type && obj.owningModelId == modelId) {
                filtered.push(obj);
            }
        });
        if (filtered.length > 0) {
            var arr = [];
            Ext.each(filtered, function (obj) {
                //convert from array to src string
                while (obj.attachmentItem.length >= i + 3) {
                    bits = (obj.attachmentItem[i++] & 0xff) << 16 | (obj.attachmentItem[i++] & 0xff) << 8 | obj.attachmentItem[i++] & 0xff;
                    encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + base64s.charAt((bits & 0x00000fc0) >> 6) + base64s.charAt((bits & 0x0000003f));
                }
                if (obj.attachmentItem.length - i > 0 && obj.attachmentItem.length - i < 3) {
                    var dual = Boolean(obj.attachmentItem.length - i - 1);
                    bits = ((obj.attachmentItem[i++] & 0xff) << 16) | (dual ? (obj.attachmentItem[i] & 0xff) << 8 : 0);
                    encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + (dual ? base64s.charAt((bits & 0x00000fc0) >> 6) : '=') + '=';
                }

                var item = Ext.create('TS.model.shared.Attachment', {
                    attachmentId: obj.attachmentId,
                    attachmentItem: encOut,
                    attachmentType: obj.attachmentType,
                    dateAttached: obj.dateAttached,
                    description: obj.description,
                    extension: obj.extension,
                    filename: obj.filename,
                    owningModelId: obj.owningModelId,
                    owningModelType: obj.owningModelType
                });
                if (obj.base64String) {
                    item.set('attachmentItem', obj.base64String);
                }
                arr.push(item);
            });
            return (arr);
        }
    },

    onDeleteAttachment: function (selectedItem) {

        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            owningModelId = selectedItem.get('owningModelId'),
            attachmentId = selectedItem.get('attachmentId'),
            attachmentType = selectedItem.get('attachmentType'),
            attachmentTypeString = selectedItem.get('attachmentType') == 'P' ? 'photo' : 'document',
            attachmentName = selectedItem.get('filename'),
            record = vm.get('selectedFWA') || vm.get('selectedEXP'),
            vw = me.getView(),
            store = vw.getStore(),
            attachments = record.get('attachments'),
            attachmentsToAdd = record.get('attachmentsToAdd') || [],
            attachmentsToDelete;
        me.getView().setLoading(true);

        if (!record.get('attachmentsToDelete')) {
            record.set('attachmentsToDelete', []);
        }
        attachmentsToDelete = record.get('attachmentsToDelete');

        Ext.Msg.confirm('Attachment Delete', 'Are you sure you want to delete the ' + attachmentTypeString + ' "' + attachmentName.substring(0, 15) + '"? ' +
            settings.fwaAbbrevLabel + ' must be saved or submitted to complete delete.', function (btn) {
            if (btn === 'yes') {
                // for (var i = 0; i < attachments.length; i++) {
                //     if (attachments[i].attachmentType == attachmentType && attachments[i].filename == attachmentName && attachments[i].owningModelId == owningModelId && attachments[i].attachmentId == attachmentId) {
                //         store.removeAt(store.findExact('attachmentId', attachmentId));
                //         attachments.splice(i, 1);
                //     }
                // }
                store.removeAt(store.findExact('attachmentId', attachmentId));
                //TODO THIS IS NEW
                if (attachmentId != 0) {
                    attachmentsToDelete.push(attachmentId);
                }
                // record.set('attachments', attachments);
                // for (var i = 0; i < attachmentsToAdd.length; i++) {
                //     if (attachmentsToAdd[i].attachmentType == attachmentType && attachmentsToAdd[i].filename == attachmentName && attachmentsToAdd[i].owningModelId == owningModelId && attachmentsToAdd[i].attachmentId == attachmentId) {
                //         store.removeAt(store.findExact('attachmentId', attachmentsToAdd[i].attachmentId));
                //         attachmentsToAdd.splice(i, 1);
                //     }
                // }

                me.onResetAttachmentCounts(attachmentType, true);
                //close popup
                if (attachmentType == AttachmentType.Photo) {
                    if (Ext.first('window-photo'))
                        Ext.first('window-photo').hide();
                } else {
                    if (Ext.first('window-document'))
                        Ext.first('window-document').hide();
                    else if(Ext.first('exp-window-document'))
                        Ext.first('exp-window-document').hide();
                }
            }
        });
        me.getView().refresh();
        me.getView().setLoading(false);
    },

    onResetAttachmentCounts: function (attachmentType, isDelete) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA') || vm.get('selectedEXP'),
            picCt = fwa.get('attachmentCtPhoto'),
            docCt = fwa.get('attachmentCtDoc');

        if (attachmentType == AttachmentType.Photo) {
            if (isDelete) {
                fwa.set('attachmentCtPhoto', (picCt - 1));
            } else {
                fwa.set('attachmentCtPhoto', (picCt + 1));
            }
        } else if (attachmentType == AttachmentType.Document) {
            if (isDelete) {
                fwa.set('attachmentCtDoc', docCt - 1)
            } else {
                fwa.set('attachmentCtDoc', docCt + 1)
            }
        }
    },

    onViewEnlargedImage: function (selectedItem) {
        this.getView().setLoading(true);
        var me = this,
            settings = TS.app.settings,
            attachmentName = selectedItem.get('filename'),
            attachmentItem = selectedItem.get('attachmentItem'),
            extension = selectedItem.get('extension'),
            baseSrc, // = 'data:image/' + extension + ';base64,' + attachmentItem,
            displayHeight = Ext.getBody().getViewSize().height - 5,
            displayWidth = Ext.getBody().getViewSize().width - 5,
            newImg = new Image(),
            deviceOrientation = Ext.Viewport.getOrientation(),
            hide = true,
            prettyInfo = '',
            imgStyle = '',
            sheet,
            gpsData,
            imgHeight;
        if (!attachmentItem) {
            AttachmentData.GetAttachmentDataById(null, settings.username, selectedItem.get('attachmentId'), function (response, success) {
                if (response && response.success) {
                    attachmentItem = selectedItem.get('attachmentItem');
                    baseSrc = 'data:image/' + extension + ';base64,' + attachmentItem;
                    imgHeight = deviceOrientation == 'portrait' ? '50%' : '90%';
                    newImg.src = baseSrc;
                    EXIF.getData(newImg, function () {
                        var allMetaData = EXIF.getAllTags(this);
                        if (allMetaData.GPSAltitude) {
                            hide = false;
                            gpsData = TS.Util.retrieveGPSData(allMetaData);
                        }
                        if (allMetaData.Orientation) {
                            imgStyle = TS.Util.getOrientation(allMetaData.Orientation);
                        }
                        gpsData = TS.Util.retrieveGPSData(allMetaData);
                        //console.log(JSON.stringify(allMetaData, null, "\t"));
                    });

                    sheet = Ext.create('Ext.Sheet', {
                        stretchX: true,
                        stretchY: true,
                        autoDestroy: true, //custom property implemented in the override
                        scrollable: true,
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'titlebar',
                                docked: 'top',
                                cls: 'ts-navigation-header',
                                title: attachmentName,
                                items: [
                                    {
                                        align: 'left',
                                        iconCls: 'x-fa  fa-refresh',
                                        handler: function () {
                                            var img = Ext.first('#myImage');
                                            if (img.getStyle() == '' || img.getStyle() == 'transform:rotate(360deg)') {
                                                img.setStyle('transform:rotate(90deg)');
                                            } else if (img.getStyle() === 'transform:rotate(90deg)') {
                                                img.setStyle('transform:rotate(180deg)');
                                            } else if (img.getStyle() === 'transform:rotate(180deg)') {
                                                img.setStyle('transform:rotate(270deg)');
                                            } else if (img.getStyle() === 'transform:rotate(270deg)') {
                                                img.setStyle('transform:rotate(360deg)');
                                            }
                                        }
                                    },
                                    {
                                        align: 'right',
                                        text: 'Close',
                                        handler: function () {
                                            this.up('sheet').hide();
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'toolbar',
                                docked: 'bottom',
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        value: '<b>No GPS Info Available</b>',
                                        hidden: !hide
                                    },
                                    {
                                        xtype: 'button',
                                        align: 'left',
                                        text: 'Show GPS Info',
                                        hidden: hide,
                                        reference: 'propertiesBtn',
                                        handler: function () {
                                            var me = this,
                                                exIfSheet = Ext.create('Ext.Sheet', {
                                                    stretchX: true,
                                                    stretchY: true,
                                                    autoDestroy: true,
                                                    scrollable: 'y',
                                                    layout: 'fit',
                                                    items: [
                                                        {
                                                            xtype: 'formpanel',
                                                            scrollable: 'y',
                                                            items: [
                                                                {
                                                                    xtype: 'titlebar',
                                                                    docked: 'top',
                                                                    cls: 'ts-navigation-header',
                                                                    title: attachmentName,
                                                                    items: [
                                                                        {
                                                                            align: 'right',
                                                                            text: 'Close',
                                                                            handler: function () {
                                                                                this.up('sheet').hide();
                                                                            }
                                                                        }
                                                                    ]
                                                                }, {
                                                                    xtype: 'fieldset',
                                                                    title: 'Properties (GPS Info)',
                                                                    items: [
                                                                        {
                                                                            xtype: 'displayfield',
                                                                            labelWidth: '45%',
                                                                            label: 'Date Taken',
                                                                            value: gpsData.data.dateTime
                                                                        }, {
                                                                            xtype: 'numberfield',
                                                                            labelWidth: '45%',
                                                                            label: 'Elevation(in feet)',
                                                                            value: gpsData.data.altitudeInFeet,
                                                                            readOnly: true
                                                                        }, {
                                                                            xtype: 'numberfield',
                                                                            labelWidth: '45%',
                                                                            label: 'Latitude',
                                                                            value: gpsData.data.latitude,
                                                                            readOnly: true
                                                                        }, {
                                                                            xtype: 'numberfield',
                                                                            labelWidth: '45%',
                                                                            label: 'Longitude',
                                                                            value: gpsData.data.longitude,
                                                                            readOnly: true
                                                                        }, {
                                                                            xtype: 'displayfield',
                                                                            labelWidth: '45%',
                                                                            label: 'Bearing</br>(degrees from N)',
                                                                            value: gpsData.data.bearingDirectionString,
                                                                            readOnly: true
                                                                        }, {
                                                                            xtype: 'displayfield',
                                                                            label: 'Bearing Direction Ref',
                                                                            value: gpsData.data.bearingDirectionRef,
                                                                            labelWidth: '45%',
                                                                            readOnly: true

                                                                        }, {
                                                                            xtype: 'displayfield',
                                                                            labelWidth: '45%',
                                                                            label: 'Image Direction</br>(degrees from N)',
                                                                            value: gpsData.data.imageDirectionString,
                                                                            readOnly: true
                                                                        }, {
                                                                            xtype: 'displayfield',
                                                                            label: 'Image Direction Ref',
                                                                            value: gpsData.data.imageDirectionRef,
                                                                            labelWidth: '45%',
                                                                            readOnly: true
                                                                        },
                                                                        {
                                                                            xtype: 'container',
                                                                            layout: 'fit',
                                                                            title: 'GMap Window',
                                                                            width: '100%',
                                                                            height: 150,
                                                                            items: [
                                                                                {
                                                                                    xtype: 'map',
                                                                                    reference: 'modernMap',
                                                                                    mapOptions: {
                                                                                        center: {
                                                                                            lat: gpsData.data.latitude,
                                                                                            lng: gpsData.data.longitude
                                                                                        },
                                                                                        mapTypeId: google.maps.MapTypeId.ROADMAP
                                                                                        //zoom: 8
                                                                                    },
                                                                                    listeners: {
                                                                                        maprender: function (cmp, gmap) {
                                                                                            var pos = new google.maps.LatLng(gpsData.data.latitude, gpsData.data.longitude),
                                                                                                marker = new google.maps.Marker({
                                                                                                    position: pos,
                                                                                                    map: gmap
                                                                                                });

                                                                                        }
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                });

                                            Ext.Viewport.add(exIfSheet);
                                            exIfSheet.show();
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                padding: '30 0 0 0',
                                layout: 'vbox',
                                items: [
                                    {
                                        xtype: 'image',
                                        itemId: 'myImage',
                                        padding: '200 0 0 0',
                                        frame: true,
                                        src: baseSrc,
                                        height: imgHeight,
                                        style: imgStyle
                                    }
                                ]
                            }
                        ]
                    });
                    Ext.Viewport.add(sheet);
                    sheet.show();
                    this.getView().setLoading(false);

                    Ext.Viewport.on('orientationchange', function (viewport, orientation, width, height) {
                        var myImage = Ext.first("#myImage");
                        if (myImage) {
                            if (orientation == 'portrait') {
                                myImage.setHeight('50%');
                            } else {
                                myImage.setHeight('90%');
                            }
                        }
                    });
                } else if (response) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                    this.getView().setLoading(false);
                }
            }, this, {
                autoHandle: true
            });
        } else {
            baseSrc = 'data:image/' + extension + ';base64,' + attachmentItem;
            imgHeight = deviceOrientation == 'portrait' ? '50%' : '90%';
            newImg.src = baseSrc;
            EXIF.getData(newImg, function () {
                var allMetaData = EXIF.getAllTags(this);
                if (allMetaData.GPSAltitude) {
                    hide = false;
                    gpsData = TS.Util.retrieveGPSData(allMetaData);
                }

                if (allMetaData.Orientation) {
                    imgStyle = TS.Util.getOrientation(allMetaData.Orientation);
                }
                gpsData = TS.Util.retrieveGPSData(allMetaData);
                //console.log(JSON.stringify(allMetaData, null, "\t"));
            });

            sheet = Ext.create('Ext.Sheet', {
                stretchX: true,
                stretchY: true,
                autoDestroy: true, //custom property implemented in the override
                scrollable: true,
                layout: 'fit',
                items: [
                    {
                        xtype: 'titlebar',
                        docked: 'top',
                        cls: 'ts-navigation-header',
                        title: attachmentName,
                        items: [
                            {
                                align: 'left',
                                iconCls: 'x-fa  fa-refresh',
                                handler: function () {
                                    var img = Ext.first('#myImage');
                                    if (img.getStyle() == '' || img.getStyle() == 'transform:rotate(360deg)') {
                                        img.setStyle('transform:rotate(90deg)');
                                    } else if (img.getStyle() === 'transform:rotate(90deg)') {
                                        img.setStyle('transform:rotate(180deg)');
                                    } else if (img.getStyle() === 'transform:rotate(180deg)') {
                                        img.setStyle('transform:rotate(270deg)');
                                    } else if (img.getStyle() === 'transform:rotate(270deg)') {
                                        img.setStyle('transform:rotate(360deg)');
                                    }
                                }
                            },
                            {
                                align: 'right',
                                text: 'Close',
                                handler: function () {
                                    this.up('sheet').hide();
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: '<b>No GPS Info Available</b>',
                                hidden: !hide
                            },
                            {
                                xtype: 'button',
                                align: 'left',
                                text: 'Show GPS Info',
                                hidden: hide,
                                reference: 'propertiesBtn',
                                handler: function () {
                                    var me = this,
                                        exIfSheet = Ext.create('Ext.Sheet', {
                                            stretchX: true,
                                            stretchY: true,
                                            autoDestroy: true,
                                            scrollable: 'y',
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'formpanel',
                                                    scrollable: 'y',
                                                    items: [
                                                        {
                                                            xtype: 'titlebar',
                                                            docked: 'top',
                                                            cls: 'ts-navigation-header',
                                                            title: attachmentName,
                                                            items: [
                                                                {
                                                                    align: 'right',
                                                                    text: 'Close',
                                                                    handler: function () {
                                                                        this.up('sheet').hide();
                                                                    }
                                                                }
                                                            ]
                                                        }, {
                                                            xtype: 'fieldset',
                                                            title: 'Properties (GPS Info)',
                                                            items: [
                                                                {
                                                                    xtype: 'displayfield',
                                                                    labelWidth: '45%',
                                                                    label: 'Date Taken',
                                                                    value: gpsData.data.dateTime
                                                                }, {
                                                                    xtype: 'numberfield',
                                                                    labelWidth: '45%',
                                                                    label: 'Elevation(in feet)',
                                                                    value: gpsData.data.altitudeInFeet,
                                                                    readOnly: true
                                                                }, {
                                                                    xtype: 'numberfield',
                                                                    labelWidth: '45%',
                                                                    label: 'Latitude',
                                                                    value: gpsData.data.latitude,
                                                                    readOnly: true
                                                                }, {
                                                                    xtype: 'numberfield',
                                                                    labelWidth: '45%',
                                                                    label: 'Longitude',
                                                                    value: gpsData.data.longitude,
                                                                    readOnly: true
                                                                }, {
                                                                    xtype: 'displayfield',
                                                                    labelWidth: '45%',
                                                                    label: 'Bearing</br>(degrees from N)',
                                                                    value: gpsData.data.bearingDirectionString,
                                                                    readOnly: true
                                                                }, {
                                                                    xtype: 'displayfield',
                                                                    label: 'Bearing Direction Ref',
                                                                    value: gpsData.data.bearingDirectionRef,
                                                                    labelWidth: '45%',
                                                                    readOnly: true

                                                                }, {
                                                                    xtype: 'displayfield',
                                                                    labelWidth: '45%',
                                                                    label: 'Image Direction</br>(degrees from N)',
                                                                    value: gpsData.data.imageDirectionString,
                                                                    readOnly: true
                                                                }, {
                                                                    xtype: 'displayfield',
                                                                    label: 'Image Direction Ref',
                                                                    value: gpsData.data.imageDirectionRef,
                                                                    labelWidth: '45%',
                                                                    readOnly: true
                                                                },
                                                                {
                                                                    xtype: 'container',
                                                                    layout: 'fit',
                                                                    title: 'GMap Window',
                                                                    width: '100%',
                                                                    height: 150,
                                                                    items: [
                                                                        {
                                                                            xtype: 'map',
                                                                            reference: 'modernMap',
                                                                            mapOptions: {
                                                                                center: {
                                                                                    lat: gpsData.data.latitude,
                                                                                    lng: gpsData.data.longitude
                                                                                },
                                                                                mapTypeId: google.maps.MapTypeId.ROADMAP
                                                                                //zoom: 8
                                                                            },
                                                                            listeners: {
                                                                                maprender: function (cmp, gmap) {
                                                                                    var pos = new google.maps.LatLng(gpsData.data.latitude, gpsData.data.longitude),
                                                                                        marker = new google.maps.Marker({
                                                                                            position: pos,
                                                                                            map: gmap
                                                                                        });

                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        });

                                    Ext.Viewport.add(exIfSheet);
                                    exIfSheet.show();
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        padding: '30 0 0 0',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'image',
                                itemId: 'myImage',
                                padding: '200 0 0 0',
                                frame: true,
                                src: baseSrc,
                                height: imgHeight,
                                style: imgStyle
                            }
                        ]
                    }
                ]
            });
            Ext.Viewport.add(sheet);
            sheet.show();
            this.getView().setLoading(false);

            Ext.Viewport.on('orientationchange', function (viewport, orientation, width, height) {
                var myImage = Ext.first("#myImage");
                if (myImage) {
                    if (orientation == 'portrait') {
                        myImage.setHeight('50%');
                    } else {
                        myImage.setHeight('90%');
                    }
                }
            });
        }

    },

    onViewEnlargedDocument: function (selectedItem) {
        this.getView().setLoading(true);
        var settings = TS.app.settings,
            attachmentName = selectedItem.get('filename'),
            attachmentItem = selectedItem.get('attachmentItem'),
            extension = selectedItem.get('extension'),
            displayHeight = Ext.getBody().getViewSize().height - 1,
            displayWidth = Ext.getBody().getViewSize().width - 1,
            canPrint = false,
            mimeType = '',
            blobType,
            ext,
            mimeTypeAbbrev = '',
            baseSrc,
            byteCharacters, // = atob(attachmentItem),
            byteArrays = [],
            sliceSize = 512,
            blob,
            blobUrl,
            iFrameSrc;

        if (!attachmentItem) {
            AttachmentData.GetAttachmentDataById(null, settings.username, selectedItem.get('attachmentId'), function (response, success) {
                if (response && response.success) {
                    attachmentItem = response.data.attachmentItem;
                    byteCharacters = atob(attachmentItem);
                    switch (extension) {
                        case 'pdf':
                            mimeType = 'data:application/pdf;base64,';
                            mimeTypeAbbrev = 'application/pdf';
                            blobType = 'application/pdf;base64,';
                            ext = '.pdf';
                            canPrint = true;
                            break;
                        case 'doc':
                            mimeType = 'data:application/msword;base64,';
                            mimeTypeAbbrev = 'application/msword';
                            blobType = 'application/msword;base64,';
                            ext = '.doc';
                            canPrint = true;
                            break;
                        case 'docx':
                            mimeType = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
                            mimeTypeAbbrev = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                            blobType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
                            ext = '.docx';
                            canPrint = true;
                            break;
                        case 'xls':
                        case 'xlt':
                        case 'xla':
                            mimeType = 'data:application/vnd.ms-excel;base64,';
                            mimeTypeAbbrev = 'application/vnd.ms-excel';
                            blobType = 'application/vnd.ms-excel;base64,';
                            ext = '.elx';
                            canPrint = true;
                            break;
                        case 'xlsx':
                            mimeType = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
                            mimeTypeAbbrev = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                            blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
                            ext = '.xlsx';
                            canPrint = true;
                            break;
                        case 'txt':
                            mimeType = 'data:text/plain;base64,';
                            mimeTypeAbbrev = 'text/plain';
                            blobType = 'text/plain;base64,';
                            ext = '.txt';
                            canPrint = true;
                            break;
                        case 'html':
                            mimeType = 'data:text/html;base64,';
                            mimeTypeAbbrev = 'text/html';
                            blobType = 'text/html;base64,';
                            ext = '.html';
                            canPrint = true;
                            break;
                        // case 'numbers':
                        //     mimeType = 'data:application/vnd.apple.numbers;base64,';
                        //     break;
                        // case 'pages':
                        //     mimeType = 'data:application/vnd.apple.pages;base64,';
                        //     break;
                        // case 'keynote':
                        //     mimeType = 'data:application/vnd.apple.keynote;base64,';
                        //     break;
                        default:
                            mimeType = 'data:text/plain;base64,';
                            mimeTypeAbbrev = 'text/plain';
                            blobType = 'text/plain;base64,';
                            ext = '.txt';
                            canPrint = true;
                            break;
                    }
                    baseSrc = mimeType + attachmentItem;
                    //window.open(mimeType + attachmentItem);
                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }
                    blob = new Blob(byteArrays, {type: mimeTypeAbbrev});
                    blobUrl = window.URL.createObjectURL(blob);

                    setTimeout(function () {
                        var me = this,
                            sheet;
                        //
                        iFrameSrc = extension == 'pdf' ? blobUrl : baseSrc;
                        sheet = Ext.create('Ext.Sheet', {
                            fullscreen: true,
                            stretchX: true,
                            stretchY: true,
                            autoDestroy: true,
                            //scrollable: true,
                            items: [
                                {
                                    xtype: 'titlebar',
                                    docked: 'top',
                                    cls: 'ts-navigation-header',
                                    title: 'Document View',
                                    items: [
                                        {
                                            align: 'left',
                                            text: 'Print',
                                            itemId: 'printButton',
                                            handler: function (button, e) {
                                                try {
                                                    var mypanel = button.up('panel').down('#documentWindow'),
                                                        iframe = mypanel.el.dom.getElementsByTagName("iframe")[0];
                                                    iframe.setAttribute('media', 'print');
                                                    iframe.focus();
                                                    iframe.contentWindow.print();
                                                } catch (err) {
                                                    Ext.Msg.alert('ERROR', err.message);
                                                }
                                            },
                                            hidden: true
                                        },
                                        {
                                            align: 'right',
                                            text: 'Close',
                                            handler: function () {
                                                this.up('sheet').hide();
                                            }
                                        }
                                    ]
                                },
                                {
                                    flex: 1,
                                    xtype: 'panel',
                                    scrollable: true,
                                    id: 'documentWindow',
                                    itemId: 'documentWindow',
                                    reference: 'documentWindow',
                                    layout: {
                                        type: 'fit',
                                    },
                                    style: {
                                        'overflow': 'visible !important'
                                    },
                                    html: "<div style=' width:" + displayWidth + "px;  height: " + displayHeight + "px; overflow-y: scroll; overflow-x: scroll; -webkit-overflow-scrolling: touch;'><iframe scrolling='auto' id='myIframe' width='100%' height='100%' src='" + blobUrl + "'></iframe></div>"

                                }
                            ]
                        });

                        Ext.Viewport.add(sheet);
                        //Ext.first('#printButton').setHidden(!canPrint);
                        sheet.show();

                    }, 400);

                    this.getView().setLoading(false);

                } else if (response) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                    this.getView().setLoading(false);
                }
            }, this, {
                autoHandle: true
            });
        } else {
            byteCharacters = atob(attachmentItem);
            switch (extension) {
                case 'pdf':
                    mimeType = 'data:application/pdf;base64,';
                    mimeTypeAbbrev = 'application/pdf';
                    blobType = 'application/pdf;base64,';
                    ext = '.pdf';
                    canPrint = true;
                    break;
                case 'doc':
                    mimeType = 'data:application/msword;base64,';
                    mimeTypeAbbrev = 'application/msword';
                    blobType = 'application/msword;base64,';
                    ext = '.doc';
                    break;
                case 'docx':
                    mimeType = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
                    mimeTypeAbbrev = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    blobType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
                    ext = '.docx';
                    canPrint = true;
                    break;
                case 'xls':
                case 'xlt':
                case 'xla':
                    mimeType = 'data:application/vnd.ms-excel;base64,';
                    mimeTypeAbbrev = 'application/vnd.ms-excel';
                    blobType = 'application/vnd.ms-excel;base64,';
                    ext = '.elx';
                    break;
                case 'xlsx':
                    mimeType = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
                    mimeTypeAbbrev = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
                    canPrint = true;
                    ext = '.xlsx';
                    break;
                case 'txt':
                    mimeType = 'data:text/plain;base64,';
                    mimeTypeAbbrev = 'text/plain';
                    blobType = 'text/plain;base64,';
                    ext = '.txt';
                    canPrint = true;
                    break;
                case 'html':
                    mimeType = 'data:text/html;base64,';
                    mimeTypeAbbrev = 'text/html';
                    blobType = 'text/html;base64,';
                    ext = '.html';
                    canPrint = true;
                    break;
                default:
                    mimeType = 'data:text/plain;base64,';
                    mimeTypeAbbrev = 'text/plain';
                    blobType = 'text/plain;base64,';
                    ext = '.txt';
                    canPrint = true;
                    break;
            }
            baseSrc = mimeType + attachmentItem;
            //window.open(mimeType + attachmentItem);
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            blob = new Blob(byteArrays, {type: mimeTypeAbbrev});
            blobUrl = window.URL.createObjectURL(blob);

            setTimeout(function () {
                var me = this,
                    sheet;
                //
                iFrameSrc = extension == 'pdf' ? blobUrl : baseSrc;
                sheet = Ext.create('Ext.Sheet', {
                    fullscreen: true,
                    stretchX: true,
                    stretchY: true,
                    autoDestroy: true,
                    //scrollable: true,
                    items: [
                        {
                            xtype: 'titlebar',
                            docked: 'top',
                            cls: 'ts-navigation-header',
                            title: 'Document View',
                            items: [
                                {
                                    align: 'left',
                                    text: 'Print',
                                    itemId: 'printButton',
                                    handler: function (button, e) {
                                        try {
                                            var mypanel = button.up('panel').down('#documentWindow'),
                                                iframe = mypanel.el.dom.getElementsByTagName("iframe")[0];
                                            iframe.setAttribute('media', 'print');
                                            iframe.focus();
                                            iframe.contentWindow.print();
                                        } catch (err) {
                                            Ext.Msg.alert('ERROR', err.message);
                                        }
                                    },
                                    hidden: true
                                },
                                {
                                    align: 'right',
                                    text: 'Close',
                                    handler: function () {
                                        this.up('sheet').hide();
                                    }
                                }
                            ]
                        },
                        {
                            flex: 1,
                            xtype: 'panel',
                            scrollable: true,
                            id: 'documentWindow',
                            itemId: 'documentWindow',
                            reference: 'documentWindow',
                            layout: {
                                type: 'fit',
                            },
                            style: {
                                'overflow': 'visible !important'
                            },
                            html: "<div style=' width:" + displayWidth + "px;  height: " + displayHeight + "px; overflow-y: scroll; overflow-x: scroll; -webkit-overflow-scrolling: touch;'><iframe scrolling='auto' id='myIframe' width='100%' height='100%' src='" + blobUrl + "'></iframe></div>"

                        }
                    ]
                });

                Ext.Viewport.add(sheet);
                //Ext.first('#printButton').setHidden(!canPrint);
                sheet.show();

            }, 400);

            this.getView().setLoading(false);
        }
    },

    closeSheet: function (bt) {
        bt.up('sheet').hide();
    },

    onOpenExIfData: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            fwa = vm.get('selectedFWA') || vm.get('selectedEXP'),
            sheet = Ext.create({
                xtype: 'fwa-exIfData',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            });

        Ext.Viewport.add(sheet);
        sheet.show();
    }

});

