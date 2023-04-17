/**
 * Created by steve.tess on 7/18/2018.
 */
Ext.define('TS.controller.exp.AttachmentsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.exp-attachments',

    listen: {
        global: {
            'ExpDeleteAttachment': 'onDeleteAttachment',
            'ExpViewEnlargedImage': 'onViewEnlargedImage',
            'ExpViewEnlargedDocument': 'onViewEnlargedDocument'
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            store = me.getView().getStore(),
            settings = TS.app.settings,
            vm = me.getViewModel(),
            params = me.getView().getAttachmentParams(),
            exp,
            attachments,
            attachmentsToAdd,
            newItems;

        if (params.record) {
            exp = params.record.getData();
        } else {
            exp = Ext.first('#expenseEditorForm').getForm().getValues();
        }

        attachments = exp.attachments || [];
        attachmentsToAdd = exp.attachmentsToAdd || [];

        if (attachments && attachments.length != 0) {
            Ext.each(attachments, function (item) {
                    if (item.owningModelId == params.modelId && item.attachmentType == params.attachmentType) {
                        if (item.base64String) {
                            item.attachmentItem = item.base64String;
                        }
                        store.add(item);
                    }
                }
            );
        }

        if (store.count() == 0) {
            store.getProxy().setExtraParams({
                attachmentType: params.attachmentType,
                includeItem: true,
                modelId: params.modelId,
                modelType: params.modelType
            });
            store.load(function (records, op, success) {
                if (success) {
                    if (attachmentsToAdd.length > 0) {
                        var base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                            encOut = "",
                            filtered = [],
                            bits,
                            i = 0;

                        Ext.each(attachmentsToAdd, function (obj) {
                            if (obj.attachmentType == params.attachmentType && obj.owningModelId == params.modelId) {
                                filtered.push(obj);
                            }
                        });

                        Ext.each(filtered, function (obj) {
                            if (obj.attachmentType != AttachmentType.Document) {
                                while (obj.attachmentItem.length >= i + 3) {
                                    bits = (obj.attachmentItem[i++] & 0xff) << 16 | (obj.attachmentItem[i++] & 0xff) << 8 | obj.attachmentItem[i++] & 0xff;
                                    encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + base64s.charAt((bits & 0x00000fc0) >> 6) + base64s.charAt((bits & 0x0000003f));
                                }
                                if (obj.attachmentItem.length - i > 0 && obj.attachmentItem.length - i < 3) {
                                    var dual = Boolean(obj.attachmentItem.length - i - 1);
                                    bits = ((obj.attachmentItem[i++] & 0xff) << 16) | (dual ? (obj.attachmentItem[i] & 0xff) << 8 : 0);
                                    encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + (dual ? base64s.charAt((bits & 0x00000fc0) >> 6) : '=') + '=';
                                }
                                obj.attachmentItem = encOut;
                            }
                            store.add(obj);
                        });
                    }
                }
            });
        }
    },

    onDeleteAttachment: function (selectedItem) {
        var me = this,
            vw = me.getView(),
            expense = vw.attachmentParams.record,
            settings = TS.app.settings,
            owningModelId = selectedItem.get('owningModelId'),
            attachmentId = selectedItem.get('attachmentId'),
            attachmentType = selectedItem.get('attachmentType'),
            attachmentTypeString = selectedItem.get('attachmentType') == AttachmentType.Photo ? 'photo' : 'document',
            attachmentName = selectedItem.get('filename'),
            attachments = expense.get('attachments') || [],
            attachmentsToAdd = expense.get('attachmentsToAdd') || [],
            attachmentsToDelete = expense.get('attachmentsToDelete') || [];
        expense.set('attachmentsToDelete',attachmentsToDelete);
        // exp = Ext.first('#expenseEditorForm').getForm(),
        //     record = exp.getValues(),
        //     attachments = record.attachments,
        //     attachmentsToAdd = record.attachmentsToAdd || [],
        //     attachmentsToDelete;
        // if (!record.attachmentsToDelete) {
        //     record.attachmentsToDelete = [];
        // }
        // attachmentsToDelete = record.attachmentsToDelete;

        me.getView().setLoading(true);
        //added timeout so message box will be on top
        setTimeout(function () {
            Ext.Msg.show({
                alwaysOnTop: true,
                toFrontOnShow: true,
                title: 'Attachment Delete',
                message: 'Are you sure you want to delete the ' + attachmentTypeString + ' "' + attachmentName + '"? Expense must be saved or submitted to complete delete.',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function (btn) {
                    if (btn === 'yes') {
                        for (var i = 0; i < attachments.length; i++) {
                            //need to check if constructor or object
                            if (!attachments[i].attachmentType) {
                                if (attachments[i].get('attachmentType') == attachmentType && attachments[i].get('filename') == attachmentName && attachments[i].get('attachmentId') ==
                                    attachmentId) {
                                    attachments.splice(i, 1);
                                }
                            } else {
                                if (attachments[i].attachmentType == attachmentType && attachments[i].filename == attachmentName && attachments[i].attachmentId == attachmentId) {
                                    attachments.splice(i, 1);
                                }
                            }
                        }
                        // //do attachment add also
                        // for (var i = 0; i < attachmentsToAdd.length; i++) {
                        //     //need to check if constructor or object
                        //     if (!attachmentsToAdd[i].attachmentType) {
                        //         if (attachmentsToAdd[i].get('attachmentType') == attachmentType && attachmentsToAdd[i].get('filename') == attachmentName && attachmentsToAdd[i].get('attachmentId') ==
                        //             attachmentId) {
                        //             attachmentsToAdd.splice(i, 1);
                        //         }
                        //     } else {
                        //         if (attachmentsToAdd[i].attachmentType == attachmentType && attachmentsToAdd[i].filename == attachmentName && attachmentsToAdd[i].attachmentId == attachmentId) {
                        //             attachmentsToAdd.splice(i, 1);
                        //         }
                        //     }
                        // }

                        //TODO THIS IS NEW
                        if (attachmentId != 0) {
                            attachmentsToDelete.push(attachmentId);
                        }
                        Ext.first('window-expenseattachment').close();
                    }
                }
            });
        }, 400);
        me.getView().refresh();
        me.getView().setLoading(false);
    },

    onViewEnlargedImage: function (selectedItem) {
        this.getView().setLoading(true);
        var settings = TS.app.settings,
            attachmentName = selectedItem.get('filename'),
            attachmentItem = selectedItem.get('attachmentItem'),
            extension = selectedItem.get('extension'),
            baseSrc = 'data:image/' + extension + ';base64,' + attachmentItem,
            displayHeight = Ext.getBody().getViewSize().height - 40,
            displayWidth = Ext.getBody().getViewSize().width - 40,
            newImg = new Image(),
            hide = true,
            padding = '10 0 0 0',
            gpsData,
            imgStyle = '',
            extraHeight = 0,
            imageWidth = '100%',
            orientation;

        newImg.src = baseSrc;

        EXIF.getData(newImg, function () {
            var allMetaData = EXIF.getAllTags(this);
            if (allMetaData.GPSAltitude) {
                hide = false;
            }
            if (allMetaData.Orientation) {
                orientation = allMetaData.Orientation;
                imgStyle = TS.Util.getOrientation(orientation);
                if (orientation == 6) {
                    padding = '400 0 0 0';
                }
            }
            gpsData = TS.Util.retrieveGPSData(allMetaData);

        });

        setTimeout(function () {
            Ext.create('Ext.window.Window', {
                title: attachmentName,
                reference: 'parentWindow',
                modal: true,
                layout: 'fit',
                height: displayHeight,
                width: displayWidth,
                minWidth: 750,
                scrollable: true,
                items: [{
                    xtype: 'panel',
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: 5,
                    border: false,
                    items: [
                        {
                            xtype: 'form',
                            region: 'north',
                            reference: 'exIfDataWindow',
                            hidden: true,
                            scrollable: true,
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'Properties (GPS Info)',
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: {
                                                type: 'hbox'
                                            },
                                            defaults: {
                                                labelWidth: 200
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Date Taken',
                                                    value: gpsData.data.dateTime,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }, {
                                                    xtype: 'tbspacer',
                                                    width: 10
                                                }, {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Elevation (in feet)',
                                                    value: gpsData.data.altitudeInFeet,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }
                                                , {
                                                    flex: 1
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: {
                                                type: 'hbox'
                                            },
                                            defaults: {
                                                labelWidth: 200
                                            },
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    id: 'latitude',
                                                    fieldLabel: 'Latitude',
                                                    value: gpsData.data.latitude,
                                                    decimalPrecision: 12,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }, {
                                                    xtype: 'tbspacer',
                                                    width: 10
                                                }, {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Longitude',
                                                    value: gpsData.data.longitude,
                                                    decimalPrecision: 12,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }
                                                , {
                                                    flex: 1
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: {
                                                type: 'hbox'
                                            },
                                            defaults: {
                                                labelWidth: 200
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Bearing (degrees from N)',
                                                    value: gpsData.data.bearingDirectionString,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }, {
                                                    xtype: 'tbspacer',
                                                    width: 10
                                                }, {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Image Direction (degrees from N)',
                                                    value: gpsData.data.imageDirectionString,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }
                                                , {
                                                    flex: 1
                                                }
                                            ]
                                        }, {
                                            xtype: 'fieldcontainer',
                                            layout: {
                                                type: 'hbox'
                                            },
                                            defaults: {
                                                labelWidth: 200
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Bearing Direction Ref',
                                                    value: gpsData.data.bearingDirectionRef,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }, {
                                                    xtype: 'tbspacer',
                                                    width: 10
                                                }, {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Image Direction Ref',
                                                    value: gpsData.data.imageDirectionRef,
                                                    flex: 1,
                                                    minWidth: 300,
                                                    readOnly: true
                                                }
                                                , {
                                                    flex: 1
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: {
                                                type: 'hbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    layout: 'fit',
                                                    title: 'GMap Window',
                                                    width: '100%',
                                                    height: 100,
                                                    items: [
                                                        {
                                                            xtype: 'gmappanel',
                                                            gmapType: 'map',
                                                            center: {
                                                                lat: gpsData.data.latitude,
                                                                lng: gpsData.data.longitude,
                                                                marker: {
                                                                    title: attachmentName
                                                                }
                                                            },
                                                            mapOptions: {
                                                                mapTypeId: google.maps.MapTypeId.ROADMAP
                                                                //zoom: 8
                                                            },
                                                            markers: [{
                                                                lat: gpsData.data.latitude,
                                                                lng: gpsData.data.longitude
                                                            }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            padding: '10 0 0 0',
                            layout: 'fit',
                            border: 1,
                            items: [
                                {
                                    xtype: 'image',
                                    reference: 'myImage',
                                    padding: padding,
                                    frame: true,
                                    src: baseSrc,
                                    shrinkWrap: 1,
                                    style: imgStyle
                                    // width: imageWidth,
                                    // height: 'auto'
                                }
                            ]
                        }
                    ],
                    buttons: [
                        {
                            text: 'Show GPS Info',
                            reference: 'showHideProperties',
                            handler: 'onShowHideProperties',
                            tooltip: 'Display GPS info',
                            hidden: hide,
                            align: 'left'
                        },
                        {
                            xtype: 'displayfield',
                            value: '<b>No GPS Info Available</b>',
                            hidden: !hide,
                            align: 'left'
                        },
                        '->',
                        {
                            text: 'Close',
                            align: 'right',
                            handler: function (btn) {
                                this.up('window').close();
                            }
                        }
                    ]
                }]
            }).show();
        }, 400);
        this.getView().setLoading(false);
    },

    s2ab: function (s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    },
    onViewEnlargedDocument: function (selectedItem) {
        this.getView().setLoading(true);
        var me = this,
            settings = TS.app.settings,
            attachmentName = selectedItem.get('filename'),
            attachmentItem = selectedItem.get('attachmentItem'),
            extension = selectedItem.get('extension'),
            displayHeight = Ext.getBody().getViewSize().height - 40,
            displayWidth = Ext.getBody().getViewSize().width - 40,
            mimeType = '',
            mimeTypeAbbrev = '',
            blobType = '',
            ext = '',
            baseSrc,
            sa;

        if (!attachmentItem) {
            AttachmentData.GetAttachmentDataById(null, settings.username, selectedItem.get('attachmentId'), function (response, success) {
                if (response && response.success) {
                    attachmentItem = response.data.attachmentItem;
                    switch (extension) {
                        case 'pdf':
                            mimeType = 'data:application/pdf;base64,';
                            mimeTypeAbbrev = 'application/pdf';
                            blobType = 'application/pdf;base64,';
                            ext = '.pdf';
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
                            ext = '.xlsx';
                            break;
                        case 'txt':
                            mimeType = 'data:text/plain;base64,';
                            mimeTypeAbbrev = 'text/plain';
                            blobType = 'text/plain;base64,';
                            ext = '.txt';
                            break;
                        case 'html':
                            mimeType = 'data:text/html;base64,';
                            mimeTypeAbbrev = 'text/html';
                            blobType = 'text/html;base64,';
                            ext = '.html';
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
                            break;
                    }
                    baseSrc = mimeType + attachmentItem;
                    setTimeout(function () {
                        if (Ext.isIE || Ext.isEdge) {
                            if (window.navigator.msSaveBlob) {
                                var blob = new Blob([me.s2ab(atob(attachmentItem))], {
                                    type: blobType
                                });
                                sa = navigator.msSaveBlob(blob, attachmentName + '.' + ext);
                            }
                        } else {
                            var downloadLink = document.createElement("a");
                            downloadLink.href = baseSrc;
                            downloadLink.download = attachmentName + '.' + ext;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        }
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
            switch (extension) {
                case 'pdf':
                    mimeType = 'data:application/pdf;base64,';
                    mimeTypeAbbrev = 'application/pdf';
                    blobType = 'application/pdf;base64,';
                    ext = '.pdf';
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
                    ext = '.xlsx';
                    break;
                case 'txt':
                    mimeType = 'data:text/plain;base64,';
                    mimeTypeAbbrev = 'text/plain';
                    blobType = 'text/plain;base64,';
                    ext = '.txt';
                    break;
                case 'html':
                    mimeType = 'data:text/html;base64,';
                    mimeTypeAbbrev = 'text/html';
                    blobType = 'text/html;base64,';
                    ext = '.html';
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
                    break;
            }
            baseSrc = mimeType + attachmentItem;
            setTimeout(function () {
                if (Ext.isIE || Ext.isEdge) {
                    if (window.navigator.msSaveBlob) {
                        var blob = new Blob([me.s2ab(atob(attachmentItem))], {
                            type: blobType
                        });
                        sa = navigator.msSaveBlob(blob, attachmentName + ext);
                    }
                } else {
                    var downloadLink = document.createElement("a");
                    downloadLink.href = baseSrc;
                    downloadLink.download = attachmentName + ext;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);

                    /* old way */
                    // var iframe = "<iframe width='100%' height='100%' src='" + baseSrc + "'></iframe>",
                    //     x = window.open();
                    // x.document.open();
                    // x.document.write(iframe);
                    // x.document.close();
                }
            }, 400);
        }

        this.getView().setLoading(false);
    }
});