Ext.define('TS.controller.PrintController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-print',

    init: function () {
        // Used to set the window title
        this.getViewModel().set('printTitle', this.getView().title);

        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            templateSelectField = this.lookup('templateSelect'),
            templateSelectStore = templateSelectField.getStore();

        templateSelectStore.getProxy().setExtraParams({
            modelType: vw.appType,
            modelId: typeof vw.modelId != 'string' ? '_none_' : vw.modelId
        });

        templateSelectStore.load();
        // Filter templateSelect by appType
        vm.set('printTitle', vw.title);

        templateSelectStore.filterBy(function (record) {
            return (record.get('templateApp') === this.getView().appType);
        }, this);

        // Auto-select the first item in the store
        templateSelectStore.on('load', function () {
            //TODO Sencha Revisit this behaviour as it cause flicker and forces to reopen the combo to select other values
            //templateSelectField.setValue(this.getData().items[0].get('templateId'));
        });
    },

    print: function () {
        var me = this,
            printerView = me.getView(),
            settings = TS.app.settings,
            selectedTemplate = me.lookup('templateSelect').getValue(),
            templateName = me.lookup('templateSelect').getRawValue(),
            templateType = me.lookup('templateSelect').displayTplData[0].templateType,
            printAsSingleFile = me.lookup('singleFile').getValue(),
            modelId = printerView.modelId,
            empId = (printerView.empId || settings.empId),
            templateApp = printerView.appType,
            offset = new Date().getTimezoneOffset() / 60,
            isList = printerView.isList,
            form = Ext.first('#fwaForm'),
            fwa = form ? form.getRecord() : '',
            //cloneFwa = fwa ? fwa.clone() : '',
            saveFirst = fwa ? fwa.dirty : false,
            fwaUnitGrid = Ext.first('grid-unit'),
            fwaData,
            ct = 0,
            fwaList = '',
            idList = '',
            listCt,
            minDate;

        if (printerView.dateArray)
            minDate = new Date(Math.min.apply(null, printerView.dateArray));
        else
            minDate = new Date();

        if (!selectedTemplate) {
            Ext.GlobalEvents.fireEvent('Message:Code', 'noPrintTemplate');
            return;
        }
        //Ext.GlobalEvents.fireEvent('Loadmask', this.getView(), 'Printing FWAs');
        me.getView().setLoading(true);
        if (isList) {
            printAsSingleFile = true;
            if (printAsSingleFile) {
                Ext.each(printerView.idArray, function (id) {
                    idList += id + '^';
                });
                idList = idList.substr(0, idList.length - 1);
                Document.GetDocument(null, settings.username, empId, selectedTemplate, templateApp, idList, templateType, 'N', offset, printAsSingleFile, minDate, function (response, operation, success) {
                    //array of reports comes back
                    var dt = new Date();
                    Ext.Date.format(dt, DATE_FORMAT);
                    var rptArray = response.data,
                        index = 0,
                        interval,
                        isArray = Array.isArray(response.data);
                    if (isArray) {
                        interval = setInterval(function () {
                            if (templateType === 'X') {
                                me.sendToPrinter(rptArray[index], templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                            } else if (templateType === 'P') {
                                me.sendToPrinter(rptArray[index], templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                            } else {
                                me.sendToPrinter(rptArray[index], templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                            }
                            index++;
                            if (index === rptArray.length) {
                                clearInterval(interval);
                            }
                        }, 500);
                    } else {
                        if (templateType === 'X') {
                            me.sendToPrinter(rptArray, templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                        } else if (templateType === 'P') {
                            me.sendToPrinter(rptArray, templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                        } else {
                            me.sendToPrinter(rptArray, templateType, selectedTemplate + ' ' + Ext.Date.format(dt, DATE_FORMAT));
                        }
                    }

                }, me, {
                    autoHandle: true
                });
            } else {
                ct = 0;
                listCt = printerView.idArray.length;
                Ext.each(printerView.idArray, function (id) {
                    Document.GetDocument(null, settings.username, empId, selectedTemplate, templateApp, id, templateType, 'N', offset, printAsSingleFile, minDate, function (response, operation, success) {
                        if (templateType == 'X') {
                            me.sendToPrinter(response.data, templateType, printerView.fwaNumArray[ct]);
                            ct++;
                        } else if (templateType == 'P') {
                            me.sendToPrinter(response.data, templateType, printerView.fwaNumArray[ct]);
                            ct++;
                        } else {
                            fwaList += response.data + '</br><div style="page-break-before: always;"></div>';
                            ct++;
                            if (ct == listCt) me.sendToPrinter(fwaList, templateType, '');
                        }
                    }, me, {
                        autoHandle: true
                    });
                });
            }
        } else {
            // if (cloneFwa.data) {
            //     cloneFwa.set('schedStartDate', Ext.first('#schedStartDateField').getValue());
            //     cloneFwa.set('schedEndDate', Ext.first('#schedEndDateField').getValue());
            //     // fwaData = TS.Util.checkFwaForValidDates(fwa.data);
            //     fwaData = TS.Util.checkFwaGridObjects(cloneFwa.data, fwaUnitGrid);
            //     fwaData.attachments = [];
            //     me.sendToPrinter(fwaData, templateType, printerView.title);
            //     // Document.GetUnsavedFwaDocument(null, settings.username, empId, selectedTemplate, templateApp, modelId, fwaData, templateType, 'N', offset, saveFirst, function (response, operation, success) {
            //     //     if (success) {
            //     //         if (saveFirst) {
            //     //             //Ext.Msg.alert('FYI', Documenthas been saved.');
            //     //             fwa.set('attachmentsToAdd', []);
            //     //             fwa.dirty = false;
            //     //         }
            //     //         me.sendToPrinter(response.data, templateType, printerView.title);
            //     //     }
            //     //     //me.getView().setLoading(false);
            //     // }, me, {
            //     //     autoHandle: true
            //     // });
            // } else {
            printAsSingleFile = false;

            Document.GetDocument(null, settings.username, empId, selectedTemplate, templateApp, modelId, templateType, 'N', offset, printAsSingleFile, minDate, function (response, operation, success) {
                me.sendToPrinter(response.data, templateType, printerView.title);
                // me.getView().setLoading(false);
            }, me, {
                autoHandle: true
            });
            // }
        }

        printerView.close();
    },
    s2ab: function (s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    },

    sendToPrinter: function (template, templateType, templateName) {
        var frame,
            contentWindow,
            myWindow,
            sa;

        if (Ext.isIE || Ext.isEdge) {
            if (templateType == 'X') {
                // var ua = window.navigator.userAgent,
                //     sa;
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([this.s2ab(atob(template))], {
                        type: "'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'"
                    });
                    sa = navigator.msSaveBlob(blob, templateName + ".xlsx");
                }
            } else {
                myWindow = window.open('', 'printWindow');
                myWindow.document.write(template);
                myWindow.document.close();
                myWindow.focus();
                myWindow.print();
                myWindow.close();
            }
        } else {
            if (templateType == 'X') {
                var mimeType = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
                    ext = '.xlsx',
                    downloadLink = document.createElement("a");
                downloadLink.href = mimeType + template;
                downloadLink.download = templateName + ext;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else if (templateType == 'P') {
                var a = window.document.createElement('a');
                const data = atob(template);
                const array = Uint8Array.from(data, b => b.charCodeAt(0));
                let blob = new Blob([array], {
                    type: "application/pdf"
                });
                a.href = window.URL.createObjectURL(blob);
                a.download = templateName + Ext.Date.format(new Date(), DATE_FORMAT);
                // Append anchor to body.
                document.body.appendChild(a)
                a.click();
                // Remove anchor from body
                document.body.removeChild(a);
            } else if (templateType == 'H') {
                var mimeType = 'data:text/html;base64,',
                    ext = '.html',
                    downloadLink = document.createElement("a");
                downloadLink.href = 'data:text/html;charset=UTF-8,' + encodeURIComponent(template);
                downloadLink.download = templateName + ext;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                Ext.Msg.Alert('FYI', 'Non-recognized file type');
            }
        }
    },

    onClosePrint: function (component, e) {
        this.getView().close();
    },

    massageFwaData: function () {
        var me = this,
            action = arguments[arguments.length - 1],
            settings = TS.app.settings,
            view = this.getView(),
            form = Ext.first('#fwaForm'),
            fwaUnitGrid = Ext.first('grid-unit'),
            actionList,
            regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            startTime = form.lookup('schedStartTimeField').getValue(),
            endTime = form.lookup('schedEndTimeField').getValue(),
            startDate = form.lookup('schedStartDateField').getValue(),
            endDate = form.lookup('schedEndDateField').getValue(),
            match,
            obj,
            data;

        form.updateRecord();
        if (startTime && startDate) {
            Sch.util.Date.copyTimeValues(startDate, startTime);
            data.schedStartDate = startDate;
        } else {
            // Set to Date min value
            data.schedStartDate = new Date('1/1/0002 12:00:00 AM');
        }
        if (endTime && endDate) {
            var newDate = new Date(startDate);
            Sch.util.Date.copyTimeValues(endDate, endTime);
            data.schedEndDate = endDate;
        }
        data.availableForUseInField = form.lookup('availableCheckbox').getValue();
        data.wbsLocked = form.lookup('wbsLockedCheckbox').getValue();
        data.isContractWork = form.lookup('contractCheckbox').getValue();
        data.udf_c1 = form.lookup('udf_c1_Checkbox').getValue();
        //get emp hours store and clear filter since hours table could be filtered
        Ext.first('grid-employeehours').getStore().clearFilter();
        // // Update the store fields
        // data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');
        // data.notes = Ext.Array.pluck(data.notes.getRange(), 'data');
        //adjust for time zone
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });
        //add any signature
        Ext.each(data.attachmentsToAdd, function (att) {
            if (!data.attachments)
                data.attachments = [];
            data.attachments.push(att);
        });
        //remove any deleted
        Ext.each(data.attachmentsToDelete, function (att) {
            if (!data.attachments)
                data.attachments = [];
            data.attachments.splice(att);
        });
        //add any missing work code ids
        var wcStore = Ext.getStore('WorkCodes');
        Ext.Array.each(data.hours, function (item) {
            var wcId;
            wcStore = Ext.getStore('WorkCodes');
            wcStore.clearFilter();
            wcStore.filterBy(function (rec) {
                if (rec.get('workCodeAbbrev') == (item.workCodeAbbrev)) {
                    wcId = rec.get('workCodeId');
                    return true;
                }
            });
            item.isChief = Ext.getStore('Roles').getById(item.crewRoleId).get('crewRoleIsChief');
            item.workCodeId = (wcId ? wcId : '');
        });
        // //check if hours per day/ per employee exceed 24
        // if (me.checkDailyTtlHours(data.hours)) {
        //     me.getView().setLoading(false);
        //     return;
        // }
        //load non-field actions
        Ext.each(data.nonFieldActions.getRange(), function (item) {
            match = regex.exec(item.getId());
            if (!match) {
                obj = Ext.getStore('NonFieldActionItem').getById(item.getId());
                if (obj) {
                    item.set('actionItemDescr', obj.get('actionItemDescr'));
                    item.set('actionItemId', obj.get('actionItemId'));
                } else {
                    item.set('actionItemDescr', item.getId());
                    item.set('actionItemId', item.getId());
                }
            } else { // this is a UUID match
                obj = Ext.getStore('NonFieldActionItem').getById(item.getId());
                if (obj) {
                    item.set('actionItemDescr', obj.get('actionItemDescr'));
                    item.set('actionItemId', obj.get('actionItemId'));
                } else {
                    item.set('actionItemDescr', item.get('actionItemDescr'));
                    item.set('actionItemId', item.get('actionItemDescr'));
                    item.setId(item.get('actionItemDescr'));
                }
            }
        });

        Ext.each(data.nonFieldActions.getRange(), function (obj) {

            if (obj.get('actionDateCompleted')) {
                obj.set('actionTempSaveData', 'Completed');
            } else if (obj.get('actionOwnerId')) {
                obj.set('actionTempSaveData', 'Owner');
            } else {
                obj.set('actionTempSaveData', 'New');
            }
        });

        actionList = {
            fwaId: data.fwaId,
            nonFieldActions: Ext.Array.pluck(data.nonFieldActions.getRange(), 'data')
        };
        data.nonFieldActions = actionList.nonFieldActions;
        //create array
        data.workSchedAndPerf = Ext.Array.pluck(data.workSchedAndPerf.getRange(), 'data');
        //check for required grid values
        //add any missing work code ids
        var wcStore = Ext.getStore('WorkCodes');
        Ext.Array.each(data.workSchedAndPerf, function (item) {
            var wcId;
            wcStore = Ext.getStore('WorkCodes');
            wcStore.clearFilter();
            wcStore.filterBy(function (rec) {
                if (rec.get('workCodeAbbrev').match(item.workCodeAbbrev)) {
                    wcId = rec.get('workCodeId');
                    return true;
                }
            });
            item.workCodeId = (wcId ? wcId : '');
        });
        //create array of fwa units
        fwaUnitGrid.getStore().clearFilter();
        if (fwaUnitGrid && fwaUnitGrid.getStore().getRange().length >= data.units.getRange().length) {
            data.units = Ext.Array.pluck(fwaUnitGrid.getStore().getRange(), 'data');
        } else {
            data.units = Ext.Array.pluck(data.units.getRange(), 'data');
        }
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            if (unit.details.length == 0) {
                unit.details = []; //if no details, create empty array
            } else {
                if (!Ext.isArray(unit.details))
                    unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
            }
        });
        //check latitude/longitude
        if (!data.loc.latitude) data.loc.latitude = 0;
        if (!data.loc.longitude) data.loc.longitude = 0;
        //convert duration to minutes
        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
        //validate all dates
        data = TS.Util.checkFwaForValidDates(data);
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
        return data;
    }

});

