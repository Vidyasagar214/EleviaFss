/*
 * Error Controller
 * This controller handles all error messages, as well as any automated error capturing.
 * Any hookups to third-party error analytics services should be implemented here.
 */

Ext.define('TS.controller.Error', {
    extend: 'Ext.app.Controller',

    listen: {
        global: {
            'Error': 'handleGenericError',
            'Error:MsgBox': 'handleErrorWarningError',
            'Error:Critical': 'handleCriticalError',
            'Error:Server': 'handleServerError'
        }
    },

    init: function () {

        // Log Ext JS errors to TrackJS
        Ext.Error.handle = function (err) {

            if (window.trackJs) {
                var error = new Ext.Error(err);
                window.trackJs.track(error);
            }

            // In non-production environments still output to the console
            //<debug>
            Ext.log({
                msg: err.msg,
                level: 'warn',
                dump: err,
                stack: true
            });
            //</debug>

            // Return true to not throw the error to the browser
            // Avoids error tracking duplication
            return true;

        };

        //// Add handling to the telemetry timeline
        //Ext.mixin.Observable.prototype.fireEvent =
        //    Ext.Function.createInterceptor(Ext.mixin.Observable.prototype.fireEvent, function (msg, cmp) {
        //        if (window.trackJs) {
        //            window.trackJs.console.info(msg + ': ' + (cmp && cmp.getId ? cmp.getId() : ''));
        //        }
        //        return true;
        //    });

    },

    /*
     * Event Handlers
     */

    handleGenericError: function (errorEvent) {
        Ext.Msg.alert('Error', this.getErrorMessage(errorEvent));
    },

    handleErrorWarningError: function (errorEvent) {
        Ext.create('Ext.MessageBox').show(
            {
                cls: 'myWindowCls',
                title: 'Error',
                message: this.getErrorMessage(errorEvent),
                height: 350,
                scrollable: true,
                buttons: Ext.MessageBox.OK
            }
        );
    },

    handleCriticalError: function (errorEvent) {
        Ext.Msg.alert('Critical Error', this.getErrorMessage(errorEvent));
    },

    handleServerError: function (errorEvent) {
        if (errorEvent) {
            Ext.Msg.alert('Server Error', this.getErrorMessage(errorEvent));
        }
    },

    handleRawError: function (errorEvent) {
        // This should only be turned on during production if we are doing error analytics
        // <debug>
        console.warn(errorEvent);
        // </debug>
    },

    /*
     * Error Message Parsers
     */
    getErrorMessage: function (errorData) {
        // //TODO @Sencha
        //Added quickpatch
        // if(errorData && errorData.message) {
        //     return Ext.JSON.decode(errorData.message.mdBody);
        // }
        // //---

        // Convert from JSON string if necessary
        if (typeof errorData == 'string') {
            try {
                errorData = Ext.JSON.decode(errorData);
            } catch (e) {
                errorData = errorData;
            }
        }

        if (errorData && errorData.getError) {
            return errorData.getError();
        } else if (errorData) {

            if (errorData.message) {
                errorData = errorData.message;
            }

            // Message is array
            if (typeof errorData == 'object' && errorData.length > 0) {
                return Ext.Array.map(errorData, function (msg) {
                    //return msg.Type + ': ' + msg.Value;
                    return msg.Value;
                }).join('<br/>');

                // Message is object
            } else if (typeof errorData == 'object' && errorData.mdBody) {

                var message = '', responseArray = '';

                // Decode JSON object
                try {
                    responseArray = JSON.parse(errorData.mdBody);
                    // Concatinate the object's values
                    if (typeof responseArray === 'string' && !Array.isArray(responseArray)) {
                        message = responseArray;
                    } else
                        Ext.Array.each(responseArray, function (response) {
                            message += response.errorValue + '<br>';
                        });

                    // Not a JSON object
                } catch (exception) {
                    message = errorData.mdBody;
                }

                return message;

                // Message is string
            } else {
                return errorData.message || errorData;
            }
        } else {
            return (typeof errorData == 'string' ? errorData : 'Unknown Error - Please Contact Support');
        }
    }
});
