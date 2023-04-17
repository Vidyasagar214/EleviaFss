/*
 * Messenger Controller
 * This controller handles all UI/UX related user notifications, messages, indicators, progressbars, etc.
 * All Ext.Msg popups are routed through here so that localization can be applied as needed
 */

Ext.define('TS.controller.Messenger', {
    extend: 'Ext.app.Controller',

    listen: {
        global: {
            'Loadmask': 'handleLoadmask',
            // Messages
            'Message': 'handleMessage',
            'Message:Code': 'handleCodeMessage',
            'Message:Validate': 'handleValidation',
            'Message:Timeout': 'handleTimeout',
            'Message:Maps': 'handleGoogleMaps'
        }
    },

    handleValidation: function (record, callback, scope) {
        if (record.isValid()) {
            record.save({
                callback: function (rec, operation, success) {
                    if (success) {
                        Ext.pass(callback, rec, (scope || this))();
                    } else {
                        Ext.GlobalEvents.fireEvent('Message', 'Failed to perform update.');
                    }
                },
                scope: (scope || this)
            })
        } else {
            Ext.Msg.alert('Validation Error', record.validate().items);
        }
    },

    handleMessage: function (message) {
        Ext.Msg.alert('Message', message);
    },

    handleCodeMessage: function (code, callback) {
        var message = TS.Messages.getByCode(code),
            callback = (typeof callback == 'function' ? callback : Ext.emptyFn);
        if (message) {
            if(message.title == 'Success'){
                var bob = Ext.Msg.alert(message.title, message.message, callback);
                setTimeout(function(){
                    bob.close();
                }, MSG_CLOSE);
            } else {
                Ext.Msg.alert(message.title, message.message, callback);
            }
        }
    },

    handleTimeout: function (directEvent) {
        Ext.Msg.alert('Session Timeout', 'Session has timed out. Please log in again.', function () {
            document.location.reload();
        });
    },

    handleGoogleMaps: function (message) {
        // TODO -- Add localization support
        var codes = {
            ZERO_RESULTS: 'No map results found. Please verify address/latitude and longitude and try again.',
            INVALID_REQUEST: 'Required address data is missing. Please verify and try again.'
        };
        Ext.Msg.alert('Mapping Error', (codes[message] || message));
    },

    // Spinners / progressbars

    handleLoadmask: function (component, message) {
        var component = (component || this.getApplication().getViewport() );
        var message = ((TS.Messages.getByCode(message) || message) || 'Please wait...'); // TODO - Localization
        if (component.setLoading) {
            component.setLoading({
                xtype: 'loadmask',
                msg: message
            });
        }
    }

});
