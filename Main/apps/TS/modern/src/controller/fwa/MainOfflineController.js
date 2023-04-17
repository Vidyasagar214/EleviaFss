/**
 * Created by steve.tess on 12/11/2018.
 */
Ext.define('TS.controller.fwa.MainOfflineController', {
    extend: 'Ext.Mixin',

    constructor: function () {
        // Local data store for all Save and Submit operations
        TS.localforage_fwa = TS.localforage_fwa || localforage.createInstance({
            driver: [localforage.WEBSQL,
                localforage.INDEXEDDB,
                localforage.LOCALSTORAGE], // Force WebSQL; same as using setDriver()
            name: 'CcgFieldApp',
            version: 1.0,
            size: Math.pow(2, 21), // Size of database, in bytes. WebSQL-only for now. 2**21 === 2MB
            storeName: 'FWA',
            description: 'FWA saves and submits while offline'
        });
        // Local data store for FWA GetList
        TS.localforage_fwastore = TS.localforage_fwastore || localforage.createInstance({
            driver: [localforage.WEBSQL,
                localforage.INDEXEDDB,
                localforage.LOCALSTORAGE], // Force WebSQL; same as using setDriver()
            name: 'CcgFieldApp',
            version: 1.0,
            size: Math.pow(2, 21), // Size of database, in bytes. WebSQL-only for now. 2**21 === 2MB
            storeName: 'FWALIST',
            description: 'Original FWA list when going offline'
        });
    },
    // Even though localforage allows us to store objects, we're storing the FWA list
    // as a string, becuase other code needs to format the date strings using a regex.
    _saveFwaListData: function (s) {
        if (typeof s !== "string") {
            Ext.error('Parameter must be a string');
        }
        TS.localforage_fwastore.setItem('fwastore', s).then();
    },
    /*
        @returns a Promise that resolves to the previously serialized FWA store.
        @param asObject true (default) returns an object, false to get the string
    */
    _getFwaListData: function (asObject) {
        // Use the passed boolean (either true or false), or otherwise, default to true.
        asObject = ((asObject === undefined) || (asObject === null)) ? true : !!asObject;
        return new Promise((resolve, reject) => {
            TS.localforage_fwastore.getItem('fwastore')
                .then(s => {
                    //console.log('_getFwaListData', Ext.JSON.decode(s));
                    resolve(asObject ? JSON.parse(s) : s);
                })
        });
    },
    // The arg list looks like this, although the code keeps that transparent
    // save: function (dbi, username, empId, data, isScheduler, isAuto) {
    saveFwa: function (data) {
        data.save = true;
        return this._saveOrSubmit(data);
    },
    submitFwa: function (data) {
        data.save = false;
        return this._saveOrSubmit(data);
    },

    _saveOrSubmit: function (data) {
        if (this.isWorkingOffline()) {
            return this._saveOrSubmitWhenWorkingOffline(data);
        } else {
            return this._saveOrSubmitToBackend(data);
        }
    },

    goOffline: function () {
        // When we go offline, get the FWA store and fetch additional data for each FWA attachment.
        // Then serialize and save the store natively. Working offline means the FWA store is
        // saved and edited locally. The user could still be on the internet. The FWA records will
        // only be uplaoded when users declare they are going back online.
        // We also need to populate the WBS1 WBS2 and WBS3 tree, .
        var sheet,
            settings = TS.app.settings;
        sheet = Ext.create('TS.view.fwa.GoOffline', {
            showAnimation: false,
            documents: false,
            photos: false,
            listeners: {
                continue: (sheet, values) => {
                    this._goOfflineProcessFwaStore(values.photos, values.documents);
                },
                cancel: () => {
                    this.goOnline(true);
                }
            }
        });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    /*
    Returns a Direct call into a Promise. The calling routine should omit the terminating callback param.
    The promise revolves with the response.data for successful responses, else it throws an exception.
    The first parameter is the namespace and method, followed by the normal params. OMIT the terminating callback.
    Example usage:
                              AttachmentData.GetAttachmentList(dbi, username, 'FWA', fwaId, true, 'P', function (response) {})
        this._directAsPromise(AttachmentData.GetAttachmentList, dbi, username, 'FWA', fwaId, true, 'P')
    */
    _directAsPromise: function (fn, ...args) {
        const params = args.slice();
        return new Promise((resolve, reject) => {
            fn(...params, (response => {
                if (response && response.success) {
                    resolve(response.data || []);
                } else {
                    throw response;
                }
            }))
        });
    },

    _goOfflineProcessFwaStore: function (getPhotos, getDocuments) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.get('fwalist'),
            equipmentStore = Ext.getStore('EquipmentList'),
            unitCodeStore = Ext.getStore('UnitCode');
        //Need to Save TS.APP.SETTINGS for when offline
        localStorage.setItem('TS.app.settings', Ext.JSON.encode(TS.app.settings));
        // ------- WARNING: This is weird and conceptually difficult code.
        // These are the records in the store. When going offline,
        const recordsArray = store.getData().items;
        // Reducer functions take the previous value
        // This entire expression -- a promise -- is returned and passed
        // to the next iteration of the reducer as "promise".
        const reducer = (promise, record) => promise.then(accumulatorArray => processFwaRecordPromise(record));

        // For every record in fwaArray, run the reducer function.
        recordsArray
            .reduce(reducer, Promise.resolve())
            .then(result => {
                this._saveFwaListData(store.serialize());
                //console.log('_saveFwaListData()', store.serialize(false)); // False returns an object rather than a string.
            })
            .then(() => me._flagOfflineList(recordsArray))
            .catch(error => Ext.GlobalEvents.fireEvent('Error', error));

        function processFwaRecordPromise(rec) {

            me._loadEquipmentForUnits(rec._units, equipmentStore);

            return me._loadAttachments(getPhotos, rec, 'P')
                .then(() => me._loadAttachments(getDocuments, rec, 'D'))
                .then(() => me._loadWorkCodeAttachments(getPhotos, rec, 'P'))
                .then(() => me._loadWorkCodeAttachments(getDocuments, rec, 'D'))
                .then(() => me._loadUnitCodeListByRecord(rec, unitCodeStore))
                .then(() => {
                    // console.log('Finished processing record');
                });
        }
    },

    _flagOfflineList: function (recordsArray) {
        var list = [],
            settings = TS.app.settings;

        Ext.each(recordsArray, function (rec) {
            list.push(rec.data.fwaId);
        });

        Fwa.FlagOfflineList(window.userGlobal.dbi, settings.username, settings.empId, list, function (response) {
           if (response && response.success) {
                //todo any followup
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
                //todo return error
            }
        });
    },

    _clearOfflineList: function (recordsArray) {
        var list = [],
            settings = TS.app.settings;

        Ext.each(recordsArray, function (rec) {
            list.push(rec.data.fwaId);
        });

        Fwa.ClearOfflineList(window.userGlobal.dbi, settings.username, settings.empId, list, function (response) {
            if (response && response.success) {
                //todo any followup
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
                //todo return error
            }
        });
    },
    /*
    Update the provided FWA record with attachments fetched from the backend.
    @return {Promise<>} Returns a promise
    @param getAttachments {boolean} True if we need to the attachment type
    @param record {TS.model.fwa.Fwa} The FWA record
    @param attachmentType {string} 'P' or 'D'
    */
    _loadAttachments: function (getAttachments, record, attachmentType) {
        if (getAttachments) {
            const existingAttachmentIds = Ext.Array.pluck(record.data.attachments, 'attachmentId');
            return this._directAsPromise(AttachmentData.GetAttachmentList, window.userGlobal.dbi, TS.app.settings.username, 'FWA', record.data.fwaId, true, attachmentType)
                .then(attachmentsFromBackend => {
                    //console.log(`AttachmentData.GetAttachmentList ${record.data.fwaId}`);
                    attachmentsFromBackend.forEach((attachment) => {
                        // Only add it if we don't already have the attachment.
                        if (!existingAttachmentIds.includes(attachment.attachmentId)) {
                            record.data.attachments.push(attachment);
                        }
                    });
                });
        } else {
            return Promise.resolve(); // Do nothing
        }
    },

    _loadWorkCodeAttachments: function(getAttachments, record, attachmentType){
        var me = this;
        if (getAttachments) {
            const existingAttachmentIds = Ext.Array.pluck(record.data.attachments, 'attachmentId');
            Ext.each(record.workSchedAndPerf().getRange(), function(wc){
                return me._directAsPromise(AttachmentData.GetAttachmentList, window.userGlobal.dbi, TS.app.settings.username, 'FWA', record.data.fwaId+'||'+wc.get('workCodeId'), true, attachmentType)
                    .then(attachmentsFromBackend => {
                        //console.log(`AttachmentData.GetAttachmentList ${record.data.fwaId}`);
                        attachmentsFromBackend.forEach((attachment) => {
                            // Only add it if we don't already have the attachment.
                            if (!existingAttachmentIds.includes(attachment.attachmentId)) {
                                record.data.attachments.push(attachment);
                            }
                        });
                    });
            });
        } else {
            return Promise.resolve(); // Do nothing
        }
    },

    _loadEquipmentForUnits: function (units, equipmentStore) {
        Ext.each(units.getRange(), function (unit) {
            //load equipment
            Equipment.GetList(window.userGlobal.dbi, TS.app.settings.username, 0, 25, unit.get('unitCodeId'), function (response) {
                //console.log('Equipment.GetList');
                if (response && response.success) {
                    if (response.data) {
                        Ext.each(response.data, function (e) {
                            var equip = {
                                equipmentId: e.equipmentId,
                                equipmentName: e.equipmentName,
                                unitCodeId: unit.get('unitCodeId'),
                                status: e.status
                            };
                            equipmentStore.add(equip);
                        });
                    }
                } else if (response) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                }
            });
        });
    },

    _loadUnitCodeListByRecord: function (rec, unitCodeStore) {
        const dbi = window.userGlobal.dbi;
        const username = TS.app.settings.username;
        const wbs1 = rec.data.wbs1;
        const wbs2 = (rec.data.wbs2 || '^');
        const wbs3 = (rec.data.wbs3 || '^');

        return this._directAsPromise(UnitCode.GetList, dbi, username, 0, 25, wbs1, wbs2, wbs3, true)
            .then(unitsFromBackend => {
                //console.log(`UnitCode.GetList ${rec.data.fwaId}`);
                unitsFromBackend.forEach((u) => {
                    const unit = {
                        applyToLabor: u.applyToLabor,
                        crewSize: u.crewSize,
                        equipSelection: u.equipSelection,
                        equipSource: u.equipSource,
                        howBilled: u.howBilled,
                        requireDetail: u.requireDetail,
                        status: u.status,
                        unitCodeAbbrev: u.unitCodeAbbrev,
                        unitCodeId: u.unitCodeId,
                        unitCodeName: u.unitCodeName,
                        unitCodeCombo: u.unitCodeAbbrev + ' : ' + u.unitCodeName
                    };
                    unitCodeStore.add(unit);
                })
            });
    },

    goOnline: function (isCancel) {
        var me = this,
            fwaDB = TS.localforage_fwa,
            settings = TS.app.settings,
            fwaArr = [],
            data,
            result,
            responses = '';
        if (!navigator.onLine) {
            Ext.Msg.alert('FYI', 'No internet connection available. Please try later.');
            return false;
        } else {
            settings.fwaSaveFails = [];
            localStorage.setItem('isOffline', false);
            localStorage.setItem('offlineDateTime', '');
            IS_OFFLINE = false;
            if (Ext.first('#offLineButton'))
                Ext.first('#offLineButton').setText(IS_OFFLINE ? 'Go Online' : 'Go Offline');
            if (isCancel) return false;
            fwaDB.iterate(function (value, key, iterationNumber) {
                // Resulting key/value pair -- this callback
                // will be executed for every item in the
                // database.
                fwaArr.push(key);
            })
                .then(() => {
                    Ext.each(fwaArr, function (key) {
                        fwaDB.getItem(key).then(function (value) {
                            data = Ext.JSON.decode(value);
                            //remove loaded attachments
                            data.attachments = [];
                            let txt = data.fwaNum + '-' + data.fwaName;
                            me._saveOrSubmitToBackend(data).then(result => {
                                if (!result.success) {
                                    let msg = result.message && result.message.mdBody !== '' ? mdBody : 'bob';
                                    settings.fwaSaveFails.push(txt + ': ' + msg);
                                    fwaDB.removeItem(key).then(function () {
                                        // Run any code once the key has been removed.
                                    });
                                } else {
                                    fwaDB.removeItem(key).then(function () {
                                        // Run any code once the key has been removed.
                                    });
                                }
                            });
                        });
                    });
                })
                .then(() => {
                    let fwaList = me.getViewModel().get('fwalist');
                    me._clearOfflineList(fwaList);
                })
                .then(() => {
                    me.reloadFwaListAfterGoingOnline(me.getViewModel(), fwaArr);
                });
        }

    },

    reloadFwaListAfterGoingOnline: function (vm, arr) {
        var me = this;
        setTimeout(function () {
            const fwaList = vm.get('fwalist');
            //check just in case user goes online at fss page
            if (!fwaList) {
                me.backOnlineMessage(arr);
                return;
            }

            let settings = TS.app.settings,
                text = '';
            fwaList.getProxy().setExtraParams({
                isPreparer: TS.app.settings.schedFwaPreparedByMe,
                isScheduler: false,
                startDate: new Date().toDateString()
            });
            fwaList.load({
                callback: function () {
                    TS.localforage_fwastore.clear();
                    if (settings.fwaSaveFails.length > 0) {
                        text += '<b>The following ' + settings.fwaAbbrevLabel + ' \'s failed to Save/Submit:</b></br></br>';
                        Ext.Array.each(settings.fwaSaveFails, function (rec) {
                            text += rec + '</br></br>';
                        });
                        text += 'Back Online';
                        Ext.Msg.show({
                            title: 'Saved w/Errors',
                            message: text,
                            width: 300,
                            buttons: Ext.Msg.OK,
                            style: 'text-align: center;'
                        });
                    } else {
                        me.backOnlineMessage(arr);
                    }
                }
            });
        }, 1000);
    },

    backOnlineMessage: function (arr) {
        if (arr.length > 0)
            Ext.Msg.alert('Success', TS.app.settings.fwaAbbrevLabel + ' changes saved and back online');
        else {
            Ext.Msg.show({
                title: 'FYI',
                message: 'Back Online',
                width: 500,
                buttons: Ext.Msg.OK,
                style: 'text-align: center;'
            });
        }
    },

    _saveOrSubmitWhenWorkingOffline: function (data) {
        // I'm assuming a key-value pair store.
        return new Promise((resolve, reject) => {
            const encodedData = Ext.JSON.encode(data);
            TS.localforage_fwa.setItem(data.id, encodedData).then();
            //console.log("Offline, run this " + (data.save ? 'Fwa.Save()' : 'Fwa.Submit()') + " operation for later");
            const store = this.getViewModel().get('fwalist');
            this._saveFwaListData(store.serialize());
            Ext.first('#mainSelectBtn').setDisabled(true);
            resolve({
                success: true,
                data: encodedData,
                message: {
                    mdBody: `${TS.app.settings.fwaAbbrevLabel} ${data.save ? 'saved' : 'submitted'} offline`,
                    mdTitleBarText: null,
                    mdType: 'info'
                }
            });
        });

    },

    /**
     * @returns an array with values to be sent to the backend via Fwa.Save() or Fwas.Submit().
     * Note that a Save has 6 parameters, and a submit has 5. (Not including the terminating callback.)
     *
     * Important: the terminating callback is omitted. It is needed to get the result from the
     * backend. Whatever calls this method has to push the callback onto this array.
     *
     * Example of the eventual backend calls.
     * Fwa.Submit(null, username, empId, data, vm.get('isScheduler'), function (response) {})
     * Fwa.Save(null, settings.username, settings.empId, data, isScheduler, false, function (response) {})

     */
    _getParameterList: function (data) {
        const result = [
            null,
            TS.app.settings.username,
            TS.app.settings.empId,
            data,
            this.getViewModel().get('isScheduler')
        ];
        if (data.save) {
            result.push(false);
        }
        return result;
    },

    _saveOrSubmitToBackend: function (data) {
        // Since save and submit do the same thing by design, just use a single routine.
        // The first param is a flag: true means it saves, else do a submit.
        // args is the set of normal params sent to the Fwa Direct controller.

        // For both save and submit, this is the parameter list for the backend Ext.Direct method:
        // (null, settings.username, settings.empId, data, isScheduler, false, function (response) {})

        const settings = TS.app.settings;
        const args = this._getParameterList(data);
        //clear any loaded attachments added when going off line
        data.attachments = [];

        let fn = data.save ? Fwa.Save : Fwa.Submit;
        const result = new Promise((resolve, reject) => {
            // The last is the callback with the values from the backend. We'll provide
            // that, and on callback we resolve the promise.
            var callback = (response =>
                    resolve(response)
            );
            if(Ext.first('fwa-submit-recurring')) Ext.first('fwa-submit-recurring').hide();
            args.push(callback);
            fn.apply(this, args);
            Ext.first('#mainSelectBtn').setDisabled(true);
        });
        return result;
    },

    isWorkingOffline: function () {
        return !navigator.onLine || IS_OFFLINE;
    },

    /**
     * Return true if
     */
    isOffline: function () {
        return !navigator.onLine || IS_OFFLINE;
    },
    /**
     * @param {Ext.data.Store} component
     * @param {Ext.data.Model[]} records
     * @param {Boolean} successful
     * @param {Ext.data.operation.Read} operation
     */
    onLoadFwaList: function (component, records, successful, operation) {
        // var key = 'Fwa-GetList-["__a2b8VeJPPhvprcdQPZ3Cm__a2b9P8ob66oj1xseQk9eMQJ7ZNvc__a2bi4f__a2b__a2fAGkZeb9enkDBy","Lfbxg1ffszI9XrfSdoC__a2bzw__a3d__a3d",0,25,"00001","",false,null]';
        // TS.localforage_direct.getItem(key).then(function (value) {
        //     console.log(Ext.JSON.decode(value));
        // });
        // console.log(records);
    }
});