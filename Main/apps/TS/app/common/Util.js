Ext.define('TS.common.Util', {
    singleton: true,

    //---------------------------------------------------------------------------------
    // Returns client language preference, the language can specified 3 different ways
    // and take effect from the following chronological order:
    // 1. Specified in URL,
    // 2. Specified in the User Configuration call back
    // 3. Client default device specification
    //---------------------------------------------------------------------------------
    getLanguage: function () {
        //---------------------------------------------------------------------------------
        var lang, me = this;
        lang = Ext.Object.fromQueryString(location.search).language;
        if (lang === undefined || lang === null) {
            lang = SETTINGS.config.language;
            if (lang === undefined || lang === null) {
                lang = 'en-US';
            }
        }
        return lang;
    },

    //---------------------------------------------------------------------------------
    // Returns DBI from the URL
    //---------------------------------------------------------------------------------
    getDBI: function () {
        //---------------------------------------------------------------------------------
        var dbi, me = this;
        dbi = Ext.Object.fromQueryString(location.search).dbi || SETTINGS.config.DBI;///Ext.Object.fromQueryString(location.search).dbi;
        return dbi;
    },

    getLoginType: function () {
        //---------------------------------------------------------------------------------
        var dbi, me = this;
        dbi = Ext.Object.fromQueryString(location.search).loginType || Ext.Object.fromQueryString(location.search).logintype;

        return dbi;
    },

    //---------------------------------------------------------------------------------
    // Returns Email from the URL
    //---------------------------------------------------------------------------------
    getEmail: function () {
        //---------------------------------------------------------------------------------
        var email, me = this;
        email = Ext.Object.fromQueryString(location.search).email;

        return email;
    },

    /** Converts provided record with associated stores to plain object with key value pairs
     *
     * @param model
     */
    convertRecordToData: function (model) {
        var rec = model.getData(),
            data = {},
            subData,
            range;

        for (var key in rec) {
            if (rec[key] !== null && rec[key].$className && rec[key].$className === 'Ext.data.Store') {
                range = rec[key].getRange();
                subData = [];

                for (var i = 0; i < range.length; i++) {
                    subData.push(this.convertRecordToData(range[i]));
                }

                data[key] = subData;
            } else {
                data[key] = rec[key];
            }
        }
        return data;
    },

    getNewInUTCDate: function (dt) {
        var utcDt = new Date(dt), //new Date(dt + 'Z'),
            offset = new Date(dt).getTimezoneOffset() / 60;
        utcDt.setHours(utcDt.getHours() - offset);
        return utcDt;
    },

    getInUTCDate: function (dt) {
        var utcDt = new Date(dt), //new Date(dt + 'Z'),
            offset = new Date(dt).getTimezoneOffset() / 60;

        // if (offset < 0)
        //     utcDt.setHours(utcDt.getHours() - offset);
        // else
        //     utcDt.setHours(utcDt.getHours() + offset);
        utcDt.setHours(utcDt.getHours() - offset);
        return utcDt; // new Date(dt + 'Z');// utcDt;
    },

    getOutUTCDate: function (dt) {
        var utcDt = new Date(dt),
            //iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
            offset = new Date().getTimezoneOffset() / 60;
        // if (offset < 0)
        //     utcDt.setHours(utcDt.getHours() + offset);
        // else
        //     utcDt.setHours(utcDt.getHours() - offset);
        utcDt.setHours(utcDt.getHours() + offset);
        return utcDt;
    },

    createUTCDate: function (dt) {
        return new Date((dt.getUTCMonth() + 1) + '/' + dt.getUTCDate() + '/' + dt.getUTCFullYear())
    },

    createUTCDateWithTime: function (dt) {
        return new Date((dt.getUTCMonth() + 1) + '/' + dt.getUTCDate() + '/' + dt.getUTCFullYear() + ' ' + dt.getUTCHours() + ':' + dt.getUTCMinutes() + ':' + dt.getUTCSeconds());
    },

    createGroupHeader: function (mixed) {
        var data = mixed.hasOwnProperty('data') ? mixed.data : mixed,
            settings = TS.app.settings,
            wbs1Name = data.wbs1Name,
            wbs2Name = data.wbs2Name,
            wbs3Name = data.wbs3Name,
            wbs1 = data.wbs1,
            wbs2 = data.wbs2,
            wbs3 = data.wbs3,
            trim = Ext.String.trim,
            billCatTable = Ext.getStore('BillCategory'),
            billCategory = billCatTable.getById(data.billCategory),
            billCategoryName = billCategory ? billCategory.get('description') : '',
            arr = [];
        //WBS1
        switch (settings.tsDisplayWbs1) {
            case 'B':
                arr.push(trim(wbs1) ? (wbs1 + ': ' + wbs1Name) : '');
                break;
            case 'A':
                arr.push(trim(wbs1Name) ? wbs1Name : '');
                break;
            case 'U':
                arr.push(trim(wbs1) ? wbs1 : '');
                break;
            case 'N':
                arr.push('');
                break;
        }

        //WBS2
        switch (settings.tsDisplayWbs2) {
            case 'B':
                arr.push(trim(wbs2) ? (wbs2 + ': ' + wbs2Name) : '');
                break;
            case 'A':
                arr.push(trim(wbs2Name) ? wbs2Name : '');
                break;
            case 'U':
                arr.push(trim(wbs2) ? wbs2 : '');
                break;
            case 'N':
                arr.push('');
                break;
        }

        //WBS3
        switch (settings.tsDisplayWbs3) {
            case 'B':
                arr.push(trim(wbs3) ? (wbs3 + ': ' + wbs3Name) : '');
                break;
            case 'A':
                arr.push(trim(wbs3Name) ? wbs3Name : '');
                break;
            case 'U':
                arr.push(trim(wbs3) ? wbs3 : '');
                break;
            case 'N':
                arr.push('');
                break;
        }

        //CLIENT
        switch (settings.tsDisplayClient) {
            case 'B':
                arr.push(trim(data.clientNumber) ? (data.clientNumber + ': ' + data.clientName) : '');
                break;
            case 'A':
                arr.push(trim(data.clientName) ? data.clientName : '');
                break;
            case 'U':
                arr.push(trim(data.clientNumber) ? data.clientNumber : '');
                break;
            case 'N':
                arr.push('');
                break;
        }

        //LABOR CODE
        if (settings.tsDisplayLaborCode !== 'N') {
            arr.push(data.laborCode);
        }

        //BILL CATEGORY
        switch (settings.tsDisplayBillCat) {
            case 'A':
                arr.push(trim(billCategoryName) ? billCategoryName : '');
                break;
            case 'B':
                arr.push(trim(data.billCategory) + ': ' + trim(billCategoryName));
                break;
            case 'U':
                arr.push(trim(data.billCategory) ? data.billCategory : '');
                break;
            case 'N':
                arr.push('');
                break;
        }

        return Ext.Array.clean(arr).join(', ');
    },

    // Translation function takes a default string as a parameter. If this value has not been specified
    // it will return itself back to the requested method.
    // The translation is initially retrieved in the LoginController from init() before anything else
    // and stored in the localstorage to avoid an expensive payload.
    //----------------------------------------------------------------------------------
    getTranslation: function (param) {
        //----------------------------------------------------------------------------------
        var value;

        //TODO: check local storage here first

        if (window.userGlobal.translations) {
            value = window.userGlobal.translations.entries[param];
        }
        //console.log ('value:', value);
        if (value === undefined || value === null) {
            value = param;
        }
        return value;
    }
});