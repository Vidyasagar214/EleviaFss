/**
 * Created by steve.tess on 4/15/2016.
 */
Ext.define('TS.common.window.PrintController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.print',
    init: function () {
        var me = this,
            vwm = me.getViewModel(),
            vw = me.getView(),
            templateSelectField = this.lookup('templateSelect'),
            templateSelectStore = templateSelectField.getStore();

        templateSelectStore.getProxy().setExtraParams({
            modelType: vw.appType,
            modelId: vw.modelId
        });

        templateSelectStore.load();

        // Filter templateSelect by appType
        templateSelectStore.filterBy(function (record) {
            return (record.get('templateApp') === this.getView().appType);
        }, this);

        // Auto-select the first item in the store
        templateSelectStore.on('load', function () {
            //TODO Sencha Revisit this behaviour as it cause flicker and forces to reopen the combo to select other values
            templateSelectField.setValue(this.getData().items[0].get('templateId'));
        });

    },

    print: function (btn) {
        var me = this,
            printerView = me.getView(),
            settings = TS.app.settings,
            selectedTemplate = me.lookup('templateSelect').getValue(),
            printAsSingleFile = me.lookup('singleFile').getChecked(),
            templateType = me.lookup('templateSelect').getSelection().getData().templateType,
            extension = templateType == 'X' ? 'xlsx' : templateType == 'P' ? 'pdf' : templateType == 'D' ? 'docx' : 'html',
            isHtml = templateType == 'H',
            modelId = printerView.modelId,
            empId = (printerView.empId || settings.empId),
            templateApp = printerView.appType,
            offset = new Date().getTimezoneOffset() / 60,
            isList = printerView.isList,
            form = Ext.first('#fwaForm'),
            fwa = form ? form.getRecord() : '', //me.getViewModel().get('selectedFWA')
            saveFirst = fwa ? fwa.dirty : false,
            dt = new Date(),
            fwaData,
            ct = 0,
            fwaList = '',
            idList = '',
            minDate = new Date(),
            listCt;

        if (!selectedTemplate) {
            Ext.GlobalEvents.fireEvent('Message:Code', 'noPrintTemplate');
            return;
        }
        if (isList) {
            ct = 0;
            listCt = printerView.idArray.length;
            printAsSingleFile = true;
            if (printAsSingleFile) {
                Ext.each(printerView.idArray, function (id) {
                    idList += id + '^';
                });
                idList = idList.substr(0, idList.length - 1);
                Document.GetDocument(null, settings.username, empId, selectedTemplate, templateApp, idList, templateType, 'N', offset, printAsSingleFile, minDate, function (response, operation, success) {
                    Ext.each(response.data, function (rpt) {
                        if (templateType == 'X') {
                            me.sendToPrinter(rpt, templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                        } else if(templateType == 'P'){
                            me.sendToPrinter(rpt, templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                        } else {
                            //me.sendToPrinter(rpt, templateType, '');
                            fwaList += rpt + '</br><div style="page-break-before: always;"></div>';
                            ct++;
                            if (ct == listCt){
                                //this.getView().setLoading(true);
                                var ad = {attachmentItem: rpt},
                                    attachmentItem = fwaList,
                                    displayHeight = Ext.getBody().getViewSize().height - 1,
                                    displayWidth = Ext.getBody().getViewSize().width - 1,
                                    mimeType = '',
                                    blobType,
                                    ext,
                                    mimeTypeAbbrev = '',
                                    byteCharacters,
                                    byteArrays = [],
                                    sliceSize = 512,
                                    blob,
                                    blobUrl,
                                    sheet;
                                byteCharacters = attachmentItem;
                                switch (extension) {
                                    case 'pdf':
                                        mimeType = 'data:application/pdf;base64,';
                                        mimeTypeAbbrev = 'application/pdf';
                                        blobType = 'application/pdf;base64,';
                                        ext = '.pdf';
                                        // canPrint = true;
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
                                    default:
                                        mimeType = 'data:text/plain;base64,';
                                        mimeTypeAbbrev = 'text/plain';
                                        blobType = 'text/plain;base64,';
                                        ext = '.txt';
                                        break;
                                }

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
                                                        cls: 'button-white',
                                                        itemId: 'printButton',
                                                        handler: function (button, e) {
                                                            try {
                                                                var mypanel = button.up('panel').down('#documentWindow'),
                                                                    iframe = document.createElement('iframe'),
                                                                    myIframe = document.getElementById('myIframe');
                                                                document.body.appendChild(iframe);
                                                                iframe.src = blobUrl;
                                                                iframe.setAttribute('media', 'print');
                                                                iframe.focus();
                                                                iframe.contentWindow.print();
                                                                this.up('sheet').destroy();
                                                            } catch (err) {
                                                                Ext.Msg.alert('ERROR', err.message);
                                                            }
                                                        },
                                                        hidden: false

                                                    },
                                                    {
                                                        align: 'right',
                                                        text: 'Close',
                                                        cls: 'button-white',
                                                        handler: function () {
                                                            this.up('sheet').destroy();
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
                                                html: "<div style=' width:" + displayWidth + "px;  height: " + displayHeight + "px; overflow-y: scroll; overflow-x: scroll; -webkit-overflow-scrolling: touch;'><iframe id='myIframe' width='100%' height='100%' src='" + blobUrl + "'></iframe></div>"
                                            }
                                        ]
                                    });
                                    Ext.Viewport.add(sheet);
                                    //Ext.first('#printButton').setHidden(!isHtml);
                                    sheet.show();
                                }, 400);
                            }
                        }
                    });
                }, me, {
                    autoHandle: true
                });
            } else {
                ct = 0;
                listCt = printerView.idArray.length;
                Ext.each(printerView.idArray, function (id) {
                    Document.GetDocument(null, settings.username, empId, selectedTemplate, templateApp, id, templateType, 'N', offset, false, minDate, function (response, operation, success) {
                        if (templateType == 'X') {
                            me.sendToPrinter(response.data, templateType, printerView.fwaNumArray[ct]);
                            ct++;
                        } else if(templateType == 'P'){
                            me.sendToPrinter(response.data, templateType, printerView.fwaNumArray[ct]);
                            ct++;
                        } else {
                            fwaList += response.data + '</br><div style="page-break-before: always;"></div>';
                            ct++;
                            if (ct == listCt) {
                                // me.sendToPrinter(fwaList, templateType, '');
                                this.getView().setLoading(true);

                                var ad = {attachmentItem: response.data},
                                    attachmentItem = fwaList,
                                    displayHeight = Ext.getBody().getViewSize().height - 1,
                                    displayWidth = Ext.getBody().getViewSize().width - 1,
                                    mimeType = '',
                                    blobType,
                                    ext,
                                    mimeTypeAbbrev = '',
                                    byteCharacters,
                                    byteArrays = [],
                                    sliceSize = 512,
                                    blob,
                                    blobUrl,
                                    sheet;
                                byteCharacters = attachmentItem;
                                switch (extension) {
                                    case 'pdf':
                                        mimeType = 'data:application/pdf;base64,';
                                        mimeTypeAbbrev = 'application/pdf';
                                        blobType = 'application/pdf;base64,';
                                        ext = '.pdf';
                                        // canPrint = true;
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
                                    default:
                                        mimeType = 'data:text/plain;base64,';
                                        mimeTypeAbbrev = 'text/plain';
                                        blobType = 'text/plain;base64,';
                                        ext = '.txt';
                                        break;
                                }

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
                                                                    iframe = document.createElement('iframe');
                                                                document.body.appendChild(iframe);
                                                                iframe.src = blobUrl;
                                                                iframe.setAttribute('media', 'print');
                                                                iframe.focus();
                                                                iframe.contentWindow.print();
                                                                this.up('sheet').hide();
                                                            } catch (err) {
                                                                Ext.Msg.alert('ERROR', err.message);
                                                            }
                                                        },
                                                        hidden: false

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
                                                html: "<div style=' width:" + displayWidth + "px;  height: " + displayHeight + "px; overflow-y: scroll; overflow-x: scroll; -webkit-overflow-scrolling: touch;'><iframe  id='myIframe' width='100%' height='100%' src='" + blobUrl + "'></iframe></div>"
                                            }
                                        ]
                                    });
                                    Ext.Viewport.add(sheet);
                                    //Ext.first('#printButton').setHidden(!isHtml);
                                    sheet.show();
                                }, 400);
                                this.getView().setLoading(false);
                            }
                        }
                    }, me, {
                        autoHandle: true
                    });
                });
            }
        } else {
            if (fwa) {
                //fwaData = TS.Util.checkFwaForValidDates(fwa.data);
                fwaData = Ext.clone(fwa.data);
                fwaData = TS.Util.checkFwaGridObjects(fwaData, fwaUnitGrid);
                fwaData.attachments = [];
                Document.GetUnsavedFwaDocument(null, settings.username, empId, selectedTemplate, templateApp, modelId, fwaData, templateType, 'Y', offset, saveFirst, function (response, operation, success) {
                    if (saveFirst) {
                        fwa.set('attachmentsToAdd', []);
                        fwa.dirty = false;
                    }
                    //me.sendToPrinter(ad, templateType, printerView.title);
                    this.getView().setLoading(true);
                    var ad = {attachmentItem: response.data},
                        attachmentItem = ad.attachmentItem,
                        displayHeight = Ext.getBody().getViewSize().height - 1,
                        displayWidth = Ext.getBody().getViewSize().width - 1,
                        mimeType = '',
                        blobType,
                        ext,
                        mimeTypeAbbrev = '',
                        byteCharacters, // = atob(attachmentItem),
                        byteArrays = [],
                        sliceSize = 512,
                        blob,
                        blobUrl,
                        sheet;

                    byteCharacters = atob(attachmentItem);
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
                        default:
                            mimeType = 'data:text/plain;base64,';
                            mimeTypeAbbrev = 'text/plain';
                            blobType = 'text/plain;base64,';
                            ext = '.txt';
                            break;
                    }

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
                                                        iframe = document.createElement('iframe');
                                                    document.body.appendChild(iframe);
                                                    iframe.src = blobUrl;
                                                    iframe.setAttribute('media', 'print');
                                                    iframe.focus();
                                                    iframe.contentWindow.print();
                                                    this.up('sheet').hide();
                                                } catch (err) {
                                                    Ext.Msg.alert('ERROR', err.message);
                                                }
                                            },
                                            hidden: false

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
                                    html: "<div style=' width:" + displayWidth + "px;  height: " + displayHeight + "px; overflow-y: scroll; overflow-x: scroll; -webkit-overflow-scrolling: touch;'><iframe id='myIframe' width='100%' height='100%' src='" + blobUrl + "'></iframe></div>"
                                }
                            ]
                        });
                        Ext.Viewport.add(sheet);
                        //Ext.first('#printButton').setHidden(!isHtml);
                        sheet.show();
                    }, 400);
                    this.getView().setLoading(false);
                }, me, {
                    autoHandle: true
                });
            } else {
                Document.GetDocument(null, settings.username, empId, selectedTemplate, templateApp, modelId, templateType, 'Y', offset, false, minDate, function (response, operation, success) {
                    //me.sendToPrinter(response.data, templateType, printerView.title);
                    this.getView().setLoading(true);
                    var ad = {attachmentItem: response.data},
                        attachmentItem = ad.attachmentItem,
                        displayHeight = Ext.getBody().getViewSize().height - 1,
                        displayWidth = Ext.getBody().getViewSize().width - 1,
                        mimeType = '',
                        blobType,
                        ext,
                        mimeTypeAbbrev = '',
                        byteCharacters, // = atob(attachmentItem),
                        byteArrays = [],
                        sliceSize = 512,
                        blob,
                        blobUrl,
                        sheet;

                    byteCharacters = atob(attachmentItem);
                    switch (extension) {
                        case 'pdf':
                            mimeType = 'data:application/pdf;base64,';
                            mimeTypeAbbrev = 'application/pdf';
                            blobType = 'application/pdf;base64,';
                            ext = '.pdf';
                            // canPrint = true;
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
                        default:
                            mimeType = 'data:text/plain;base64,';
                            mimeTypeAbbrev = 'text/plain';
                            blobType = 'text/plain;base64,';
                            ext = '.txt';
                            break;
                    }

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
                                            cls: 'buttonWhite',
                                            text: 'Print',
                                            itemId: 'printButton',
                                            handler: function (button, e) {
                                                try {
                                                    // var mypanel = button.up('panel').down('#documentWindow'),
                                                    //     // iframe = mypanel.el.dom.getElementsByTagName("iframe")[0];
                                                    //     iframe = document.createElement('iframe');
                                                    // document.body.appendChild(iframe);
                                                    // iframe.src = blobUrl;
                                                    // iframe.setAttribute('media', 'print');
                                                    // iframe.focus();
                                                    // iframe.contentWindow.print();
                                                    // this.up('sheet').hide();

                                                    var mypanel = button.up('panel').down('#documentWindow'),
                                                        iframe = mypanel.el.dom.getElementsByTagName("iframe")[0];
                                                    //iframe = document.createElement('iframe');
                                                    iframe.setAttribute('media', 'print');
                                                    iframe.focus();
                                                    iframe.contentWindow.print();
                                                    this.up('sheet').hide();
                                                } catch (err) {
                                                    Ext.Msg.alert('ERROR', err.message);
                                                }
                                            },
                                            hidden: false
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
                                    html: "<div style=' width:" + displayWidth + "px;  height: " + displayHeight + "px; overflow-y: scroll; overflow-x: scroll; -webkit-overflow-scrolling: touch;'><iframe id='myIframe' width='100%' height='100%' src='" + blobUrl + "'></iframe></div>"
                                }
                            ]
                        });
                        Ext.Viewport.add(sheet);
                        //Ext.first('#printButton').setHidden(!isHtml);
                        sheet.show();
                    }, 400);
                    this.getView().setLoading(false);
                }, me, {
                    autoHandle: true
                });
            }
        }
        btn.up('sheet').hide();
    },

    s2ab: function (s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    },

    arrayToBase64String: function (byteData) {
        var base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            encOut = "",
            bits,
            i = 0;

        while (byteData.length >= i + 3) {
            bits = (byteData[i++] & 0xff) << 16 | (byteData[i++] & 0xff) << 8 | byteData[i++] & 0xff;
            encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + base64s.charAt((bits & 0x00000fc0) >> 6) + base64s.charAt((bits & 0x0000003f));
        }
        if (byteData.length - i > 0 && byteData.length - i < 3) {
            var dual = Boolean(byteData.length - i - 1);
            bits = ((byteData[i++] & 0xff) << 16) | (dual ? (byteData[i] & 0xff) << 8 : 0);
            encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + (dual ? base64s.charAt((bits & 0x00000fc0) >> 6) : '=') + '=';
        }
        return encOut;
    },

    sendToPrinter: function (template, templateType, templateName) {
        var me = this,
            displayHeight = Ext.getBody().getViewSize().height - 1,
            displayWidth = Ext.getBody().getViewSize().width - 1,
            byteCharacters,
            byteArrays = [],
            sliceSize = 512,
            blob,
            blobUrl,
            frame,
            contentWindow,
            mimeType,
            mimeTypeAbbrev,
            myWindow,
            blobType,
            ext,
            sa,
            sheet;

        switch (templateType) {
            case 'H':
                //byteCharacters = atob(template.attachmentItem);
                mimeType = 'data:text/html;base64,';
                mimeTypeAbbrev = 'text/html';
                blobType = 'text/html;';
                ext = '.html';
                byteCharacters = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n</head>\n<body>\n'+byteCharacters+'\n</body>\n</html>';
                break;
            case 'X':
                // byteCharacters = template;
                byteCharacters = atob(template);
                mimeType = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
                mimeTypeAbbrev = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
                ext = '.xlsx';
                break;
            case 'P':
                byteCharacters = atob(template);
                mimeType = 'data:application/pdf';
                mimeTypeAbbrev = 'application/pdf';
                blobType = 'application/pdf';
                ext = '.pdf';
                break;
            default:
                mimeType = 'data:text/plain;base64,';
                mimeTypeAbbrev = 'text/plain';
                blobType = 'text/plain;base64,';
                ext = '.txt';
                break;
        }

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
            sheet = Ext.create('Ext.Sheet', {
                fullscreen: true,
                stretchX: true,
                stretchY: true,
                autoDestroy: true,
                scrollable: true,
                //hidden: true,
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
                                handler: function (button, e) {
                                    // // WILL NOT WORK IF USING BASE64 WITH MIME TYPE CAUSES CROSS-ORIGIN
                                    // // BLOB SEEMS TO WORK FOR ALL
                                    var mypanel = button.up('panel').down('#docWindow'),
                                        iframe = document.createElement('iframe');
                                    document.body.appendChild(iframe);
                                    iframe.src = blobUrl;
                                    iframe.setAttribute('media', 'print');
                                    iframe.focus();
                                    iframe.contentWindow.print();
                                    this.up('sheet').hide();
                                },
                                hidden: false
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
                        id: 'docWindow',
                        itemId: 'docWindow',
                        reference: 'docWindow',
                        layout: {
                            type: 'fit',
                        },
                        style: {
                            'overflow': 'visible !important'
                        },
                        html: "<div style=' width:" + displayWidth + "px;  height: " + displayHeight + "px; overflow-y: scroll; overflow-x: scroll; -webkit-overflow-scrolling: touch;'><iframe id='myDocIframe' width='100%' height='100%' src='" + blobUrl + "'></iframe></div>"
                    }
                ]
            });

            Ext.Viewport.add(sheet);
            sheet.show();
        }, 400);

    },

    closeSheet: function (bt) {
        bt.up('sheet').hide();
    },

    convertFileToByteData: function (file, callback) {
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                // Convert to plain array for sending through to Ext.Direct
                var byteArray = new Uint8Array(e.target.result),
                    returnArray = [];
                for (var i = 0; i < byteArray.length; i++) {
                    returnArray[i] = byteArray[i];
                }
                callback(returnArray);
            };
        })(file);
        reader.readAsArrayBuffer(file);
    }

});