Ext.define('TS.view.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    listen: {
        global: {
            'loginReset': 'loginReset'
        }
    },

    requires: [
        'TS.view.LicenseAgreementController',
        'TS.common.Util'
    ],

    init: function () {
        window.userGlobal = {};
        TS.MISSING_FILE = false;
        if ((typeof SETTINGS) == 'undefined') {
            this.getView().lookup('loginSubmit').setHidden(true);
            TS.MISSING_FILE = true;
        } else {
            // if (SETTINGS.config.DBI !== Ext.Object.fromQueryString(location.search).dbi) {
            //     Ext.Msg.alert('ERROR', 'This Connection is incorrect, Please contact your Administrator')
            //     if (!Ext.isModern) {
            //         this.getView().close();
            //     } else {
            //         this.getView().lookup('loginSubmit').setHidden(true);
            //     }
            //     return false;
            // }
            var me = this,
                appName,
                storedUsername,
                usernameField = me.lookup('username'),
                pinField = me.lookup('pin'),
                domainField = me.lookup('domain'),
                integratedField = me.lookup('integrated'),
                email = TS.common.Util.getEmail(),
                language = TS.common.Util.getLanguage(),
                dbi = TS.common.Util.getDBI(),
                loginType = TS.common.Util.getLoginType(),
                hasStorage = (function () {
                    try {
                        localStorage.setItem('test', true);
                        localStorage.removeItem('test');
                        return true;
                    } catch (exception) {
                        return false;
                    }
                }());
            appName = Ext.Object.fromQueryString(location.search).app;
            // //skip right to UserConfig
            //console.log(location);
            if (appName == 'History') {
                window.userGlobal = {
                    dbi: SETTINGS.config.DBI || Ext.Object.fromQueryString(location.search).dbi, //me.getUrlParams().dbi,
                    email: me.getUrlParams().email,
                    encrypted_username: localStorage.getItem('encrypted_username'),
                    fwaId: me.getUrlParams().fwaId
                };
                me.getUserConfigByUserName();
            }

            if (hasStorage) { //added for check
                storedUsername = localStorage.getItem('username') || '';
                usernameField.setValue(storedUsername);
                domainField.setValue(localStorage.getItem('domain') && localStorage.getItem('domain') != '_none_' ? localStorage.getItem('domain') : '');
                integratedField.setValue(localStorage.getItem('integrated') || false);
            }

            me.checkSupportIntegratedLogin();

            /* ADD LANGUAGES at later date if needed*/
            // Config.GetInitialLangEntries(dbi, language, function (response, operation, success) {
            //     if (response.success && response.data) {
            //         Ext.Viewport.setMasked(false);
            //         for (x = 0; x < response.data.length; x++) {
            //             if (language == response.data[x].lang) {
            //                 window.userGlobal.translations = response.data[x];
            //                 localStorage.setItem('translations', Ext.JSON.encode(response.data));
            //             }
            //         }
            //         me.checkSupportIntegratedLogin();
            //     } else {
            //         Ext.Viewport.setMasked(false);
            //         Ext.Msg.alert('Critical Failure', 'Unable to load global settings from server. Contact support.');
            //     }
            //     me.setTranslations();
            // }, me, {
            //     autoHandle: true
            // });
        }
    },

    checkSupportIntegratedLogin: function () {
        if (localStorage.getItem('integratedLogin') == 'undefined')
            localStorage.setItem('integratedLogin', Ext.JSON.encode(false));
        var me = this,
            domain = me.lookup('domain'),
            integrated = me.lookup('integrated'),
            language = TS.common.Util.getLanguage(),
            dbi = TS.common.Util.getDBI(),
            loginType = TS.common.Util.getLoginType(),
            integratedLogin = JSON.parse(localStorage.getItem('integratedLogin')),
            pin = me.lookup('pin'),
            password = me.lookup('password');

        if ((IS_OFFLINE && MobileApp) || !navigator.onLine) {
            TS.app.settings = Ext.JSON.decode(localStorage.getItem('TS.app.settings'));
            if (loginType && loginType.toUpperCase() == 'PIN') {
                domain.setHidden(true);
                integrated.setHidden(true);
                if (MobileApp) {
                    integrated.setChecked(false);
                } else {
                    integrated.setValue(false);
                }
                //integrated.checked = false;
                pin.setHidden(false);
                password.setHidden(true);
                me.lookup('loginSubmit').setHidden(false);
                me.lookup('loginSubmit').setHandler('submitMyPin');
                //me.lookup('loginSubmitUsername').setHidden(true);
            } else {
                domain.setHidden(!integratedLogin);
                integrated.setHidden(!integratedLogin);
                if (MobileApp) {
                    integrated.setChecked(integratedLogin);
                } else {
                    integrated.setValue(integratedLogin);
                }
            }
        } else {
            if (loginType && loginType.toUpperCase() == 'PIN') {
                domain.setHidden(true);
                integrated.setHidden(true);
                if (MobileApp) {
                    integrated.setChecked(false);
                } else {
                    integrated.setValue(false);
                }
                pin.setHidden(false);
                password.setHidden(true);
                me.lookup('loginSubmit').setHidden(false);
                me.lookup('loginSubmit').setHandler('submitMyPin');
                //me.lookup('loginSubmitUsername').setHidden(true);
            } else {
                User.SupportIntegratedLogin(language, dbi, VERSION.config.appVersion, function (response, operation, success) {
                    if (response.success) {
                        //Ext.Viewport.setMasked(false);
                        localStorage.setItem('integratedLogin', Ext.JSON.encode(response.data == 'Y'));
                        localStorage.setItem('loginType', response.data);
                        //domain.setHidden(!response.data);
                        //integrated.setHidden(!response.data);
                        //integrated.setValue(response.data);
                        if (response.data == 'P') {
                            domain.setHidden(true);
                            integrated.setHidden(true);
                            if (MobileApp) {
                                integrated.setChecked(false);
                            } else {
                                integrated.setValue(false);
                            }
                            pin.setHidden(false);
                            password.setHidden(true);
                            me.lookup('loginSubmit').setHidden(false);
                            me.lookup('loginSubmit').setHandler('submitMyPin');
                            //me.lookup('loginSubmitUsername').setHidden(true);

                        } else if (response.data == 'Y') {
                            domain.setHidden(false);
                            integrated.setHidden(false);
                            if (MobileApp) {
                                integrated.setChecked(false);
                            } else {
                                integrated.setValue(false);
                            }
                            pin.setHidden(true);
                            password.setHidden(false);
                            me.lookup('loginSubmit').setHidden(false);
                            me.lookup('loginSubmit').setHandler('submitUsername');
                            //me.lookup('loginSubmitUsername').setHidden(false);
                            //loginSubmitUsername
                        } else if (response.data == 'N') {
                            domain.setHidden(true);
                            integrated.setHidden(true);
                            if (MobileApp) {
                                integrated.setChecked(false);
                            } else {
                                integrated.setValue(false);
                            }
                            pin.setHidden(true);
                            password.setHidden(false);
                            me.lookup('loginSubmit').setHidden(false);
                            me.lookup('loginSubmit').setHandler('submitUsername');
                            //me.lookup('loginSubmitUsername').setHidden(false);
                        }
                    } else {
                        //Ext.Viewport.setMasked(false);
                        Ext.Msg.alert('Critical Failure', 'Unable to check support for integrated login. Contact support.');
                    }
                }, me, {
                    autoHandle: true
                });
            }
        }
    },

    setTranslations: function () {
        // if (MobileApp) {
        //     Ext.getCmp('loginScreenTitle').setTitle(TS.common.Util.getTranslation("User Login"));
        //     Ext.getCmp('loginScreenEmail').setLabel(TS.common.Util.getTranslation("Username"));
        //     Ext.getCmp('loginScreenPin').setLabel(TS.common.Util.getTranslation("Password"));
        //     Ext.getCmp('loginScreenSubmit').setText(TS.common.Util.getTranslation("Login"));
        // }
    },

    getUrlParams: function () {
        return Ext.Object.fromQueryString(location.search);
    },

    submitMyPin: function () {
        var me = this,
            myLoadMask = new Ext.LoadMask({
                msg: 'Confirming user...',
                target: me.getView()
            }),
            username = me.lookup('username').getValue(),
            form = me.lookup('loginForm'),
            values = form.getValues(),
            hasStorage = (function () {
                try {
                    localStorage.setItem('test', true);
                    localStorage.removeItem('test');
                    return true;
                } catch (exception) {
                    return false;
                }
            }());

        if (!username) {
            Ext.Msg.alert('Warning', 'Username is a required field');
            return;
        }
        if (!values.pin) {
            Ext.Msg.alert('Warning', 'PIN is a required field');
            return;
        }

        myLoadMask.show();

        window.userGlobal = {
            dbi: (me.getUrlParams().dbi),
            username: username
        };

        User.CheckPin(window.userGlobal.dbi, window.userGlobal.username, function (response, operation, success) {
            if (hasStorage) {
                localStorage.setItem('username', username);
            }
            if (response) { //response.data
                me.showPinLogin(values, myLoadMask);
            } else {
                me.showPinCreate(myLoadMask);
            }

            me.getView().setLoading(false);

        }, me, {
            autoHandle: true
        });
        me.getView().setLoading(false);
    },

    submitUsername: function () {
        var me = this,
            myLoadMask = new Ext.LoadMask({
                msg: 'Confirming user...',
                target: me.getView()
            }),
            username = me.lookup('username').getValue(),
            domain = me.lookup('domain').getValue(),
            integrated = MobileApp ? me.lookup('integrated').getChecked() : me.lookup('integrated').checked,
            integratedParam = integrated ? 'Y' : 'N',
            form = me.lookup('loginForm'), //me.lookup('loginForm').getForm(),
            values = form.getValues(),
            hasStorage = (function () {
                try {
                    localStorage.setItem('test', true);
                    localStorage.removeItem('test');
                    return true;
                } catch (exception) {
                    return false;
                }
            }()),
            password;

        if (!username) {
            Ext.Msg.alert('Warning', 'Username is a required field');
            me.getView().setLoading(false);
            return;
        }

        if (integrated) {
            if (!domain) {
                Ext.Msg.alert('Warning', 'Domain is a required field');
                myLoadMask.hide();
                return;
            }
            password = me.cryptoEncrypt(values.password);

        } else {
            password = sha256_digest(username.toUpperCase() + values.password);
        }

        domain = domain == '' ? '_none_' : domain;

        localStorage.setItem('domain', domain);
        localStorage.setItem('integrated', integrated);
        localStorage.setItem('integratedLogin', integrated);
        localStorage.setItem('username', username);

        myLoadMask.show();

        var language = TS.common.Util.getLanguage(),
            dbi = TS.common.Util.getDBI(),
            username = username.toUpperCase();

        window.userGlobal = {
            dbi: dbi,
            language: language,
            username: username,
            password: password,
            encrypted_username: '',
            ssn: '',
            domain: domain,
            integrated: integrated,
            translations: window.userGlobal.translations
        };

        User.Login(window.userGlobal.dbi, window.userGlobal.username, window.userGlobal.password, domain, integratedParam, function (response, operation, success) {
            var message = response.message,
                username,
                ssn;
            if (success) {
                username = response.data.split('^^^')[0];
                ssn = response.data.split('^^^')[1];
                if (response.total == 1) {
                    if (hasStorage) {
                        //localStorage.setItem('username', username);
                        if (localStorage.getItem('userSettings') == undefined || localStorage.getItem('userSettings') == null)
                            localStorage.setItem('userSettings', '{"annotationMenu":{"menuTools":null,"menuPin":true}}');
                        localStorage.setItem('freeTextAnnotation', 'false');
                        localStorage.setItem('needSaveCheck', 'false');
                    }
                    window.userGlobal.encrypted_username = username;
                    localStorage.setItem('encrypted_username', username);
                    me.getUserConfig(myLoadMask);
                } else {
                    Ext.create('Ext.MessageBox').show(
                        {
                            title: 'Login Error',
                            message: 'Error on login, please call support.',
                            scrollable: true,
                            buttons: Ext.MessageBox.OK
                        }
                    );
                }
            } else {
                if (message.mdBody != '') {
                    me.showResponseMessage(message);
                } else {
                    Ext.create('Ext.MessageBox').show(
                        {
                            title: 'Login Error',
                            message: 'Error on login, please call support.',
                            scrollable: true,
                            buttons: Ext.MessageBox.OK
                        }
                    );
                }
            }
            myLoadMask.hide();
        }, me, {
            autoHandle: true
        });
        myLoadMask.hide();
    },

    cryptoEncrypt: function (value) {
        var key = CryptoJS.enc.Utf8.parse('7061737323313233'),
            iv = CryptoJS.enc.Utf8.parse('7061737323313233'),
            encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key,
                {
                    keySize: 128 / 8,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }),
            decrypted = CryptoJS.AES.decrypt(encrypted, key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        //
        return encrypted.toString();
    },


    showPinLogin: function (values, myLoadMask) {
        if (values.pin) {
            this.submitPin(values, myLoadMask);
        } else {
            this.getView().setActiveItem(2);
        }

    },

    showPinCreate: function (myLoadMask) {
        var me = this,
            vw = me.getView();
        vw.setActiveItem(1);
        if (myLoadMask)
            myLoadMask.hide();
        else
            vw.setLoading(false);
    },

    loginReset: function () {
        var me = this,
            usernameField = me.lookup('username'),
            storedUsername = localStorage.getItem('username') || '';

        me.getView().setLoading(false);
        me.getView().setActiveItem(0);
        me.lookup('pinCreateForm').reset();

        usernameField.setValue(storedUsername);
    },

    encodePin: function (pin) {
        var pos = 0,
            sValue,
            sHex = '',
            letter,
            shift = pin.toString().length + 1;
        //encodeURI(pin)
        Ext.each(pin.toString().split(''), function (c) {
            letter = c.charCodeAt(0);
            letter = letter - shift - (pos % 5);
            sValue = letter.toString(16).toUpperCase();
            sHex += sValue;
            pos++;
        });

        pin = Math.floor(Math.random() * 10).toString() + sHex + Math.floor(Math.random() * 10).toString();
        return pin;
    },

    submitPin: function (myvalues, myLoadMask) {
        var me = this,
            username = me.lookup('username').getValue(),
            pin = me.lookup('pin').getValue();

        window.userGlobal.username = username;
        pin = me.encodePin(pin);
        window.userGlobal.pin = pin;

        me.getView().setLoading(true, 'Validating PIN...');
        if (pin) {
            User.AuthenticatePin(window.userGlobal.dbi, pin, window.userGlobal.username, function (response, operation, success) {
                var message = response.message;
                if (response.data) {
                    me.getView().setLoading(false);
                    window.userGlobal.encrypted_username = response.data;
                    me.getUserConfig(myLoadMask);
                } else {
                    me.showPinCreate(myLoadMask); //TODO : Add itermediate dialog
                    me.getView().setLoading(false);
                    if (message.mdBody != '') {
                        //me.showResponseMessage(message);
                        Ext.Msg.alert(message.mdTitleBarText, message.mdBody);
                    }
                }
            }, me, {
                autoHandle: true
            });

        } else {
            Ext.GlobalEvents.fireEvent('Message:Code', 'authenticateWithPinMissingFields');
            me.getView().setLoading(false);
        }
    },

    showResponseMessage: function (message) {
        Ext.create('Ext.MessageBox').show(
            {
                //title: message.mdTitleBarText,
                message: message.mdBody,
                scrollable: true,
                buttons: Ext.MessageBox.OK
            }
        );
        this.getView().setLoading(false);
    },

    submitPinCreate: function (myLoadMask) {
        var me = this,
            form = me.lookup('pinCreateForm'),
            values = form.getValues(),
            hasPin = me.lookup('pinCreateField').getValue().length == 4,
            hasSSN = me.lookup('ssnCreateField').getValue().length == 4,
            url = Ext.Object.fromQueryString(location.search),
            language = TS.common.Util.getLanguage(),
            encodedSsn,
            encodedPin;

        if (hasPin && hasSSN) {
            encodedPin = me.encodePin(values.pin);
            encodedSsn = me.encodePin(values.ssn);
            //need to add language here if needed
            User.CreatePin(window.userGlobal.dbi, encodedPin, window.userGlobal.username, encodedSsn, function (response, operation, success) {
                if (response.total === 1) {
                    window.userGlobal.encrypted_username = response.data.split('^^^')[1];
                    //Ext.Msg.alert('Pin creation',response.data.split('^^^')[0]);
                    me.getUserConfig(myLoadMask);
                } else {
                    Ext.Msg.show({
                        title: 'Login Error',
                        message: response.message.mdBody + "\n Do you wish re-enter?",
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                me.loginReset();
                            } else {
                                localStorage.setItem('username', '');
                            }
                        }
                    });
                    Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response));
                }
            }, this, {
                autoHandle: true
            });
        } else {
            Ext.GlobalEvents.fireEvent('Message:Code', 'createPinMissingFields');
            me.getView().setLoading(false);
        }
    },


    getUserConfig: function (myLoadMask) {

        var me = this,
            url = Ext.Object.fromQueryString(location.search),
            appAccess,
            hasAccess = true,
            appName,
            message,
            dbi = Ext.Object.fromQueryString(location.search).dbi || window.userGlobal.dbi;

        UserConfig.GetByUsername(dbi, window.userGlobal.encrypted_username, 'FSS', function (response, operation, success) {
            //UserConfig.Get(window.userGlobal.dbi, window.userGlobal.email, url.app, function (response, operation, success) {
            if (response.success && response.data) {
                STATEID = response.data.empId + '_FwaList';
                appAccess = response.data.appAccess.split('^');
                switch (url.app) {
                    case 'FWA':
                    case 'fwa':
                        hasAccess = appAccess.indexOf('FF') >= 0;
                        appName = url.app;
                        break;
                    case 'TS':
                    case 'ts':
                        hasAccess = appAccess.indexOf('FT') >= 0;
                        appName = 'Timesheet';
                        break;
                    case 'TSA':
                    case 'tsa':
                        hasAccess = response.data.tsIsApprover;
                        appName = 'Timesheet Approval';
                        break;
                    case 'Scheduler':
                    case 'scheduler':
                        hasAccess = appAccess.indexOf('FS') >= 0;
                        appName = url.app;
                        break;
                    case 'EX':
                    case 'ex':
                        hasAccess = appAccess.indexOf('FE') >= 0;
                        appName = 'Expenses';
                        break;
                    case 'EXA':
                    case 'exa':
                        hasAccess = response.data.exIsApprover;
                        appName = 'Expense Approval';
                        break;
                }

                if (!hasAccess) {
                    message = TS.Messages.getByCode('notAuthorizedForApplication');
                    Ext.Msg.show({
                        title: message.title,
                        message: 'You have not been configured for access to the ' + appName,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                me.loginReset();
                            }
                        }
                    });
                } else if (!response.data.okdLicense) {
                    me.showLicenseAgreement(response.data);
                } else {
                    //me.showLicenseAgreement(response.data); //TODO uncomment this to force a call everytime
                    Ext.GlobalEvents.fireEvent('Settings:Loaded', response.data);
                }
                me.closeView();
            } else if (response.data == 'Not Authorized') {
                message = TS.Messages.getByCode('notAuthorizedForApplication');
                Ext.Msg.show({
                    title: message.title,
                    message: message.message + url.app,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING,
                    fn: function (btn) {
                        if (btn == 'ok') {
                            me.loginReset();
                        }
                    }
                });
            } else {
                Ext.Msg.alert('Critical Failure', 'Unable to load global settings from server. Contact support.');
            }
        }, me, {
            autoHandle: true
        });

        if (myLoadMask)
            myLoadMask.hide();
    },

    getUserConfigByUserName: function () {

        var me = this,
            url = Ext.Object.fromQueryString(location.search),
            dbi = Ext.Object.fromQueryString(location.search).dbi || window.userGlobal.dbi;

        UserConfig.GetByUsername(dbi, window.userGlobal.encrypted_username, url.app, function (response, operation, success) {
            if (response.success && response.data) {
                STATEID = response.data.empId + '_FwaList';
                me.closeView();
                Ext.GlobalEvents.fireEvent('Settings:Loaded', response.data);
            } else {
                Ext.Msg.alert('Critical Failure', 'Unable to load global settings from server. Contact support.');
            }
        }, me, {
            autoHandle: true
        });
    },

    showLicenseAgreement: function (data) {
        Ext.create({
            xtype: 'window-licenseagreement',
            modal: true,
            autoShow: true,
            viewModel: {
                data: data
            }
        });
    }
});
