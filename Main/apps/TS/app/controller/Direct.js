/*
 * Direct Controller
 * This controller handles all Ext Direct / API communication and related functions.
 */

Ext.define('TS.controller.Direct', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.direct.Manager',
        'Ext.direct.RemotingProvider'
    ],

    init: function () {
        var me = this;
        if (Ext.app.REMOTING_API === undefined) {
            Ext.GlobalEvents.fireEvent('Error:Critical', {
                message: 'Failed to load remote API.'
            });
            return;
        }

        // Direct Provider & associated listeners
        me.provider = Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);
        me.provider.on({
            beforecall: this.appendRequiredParams,
            beforecallback: this.handleDirectResponse,
            scope: this
        });

        //<debug>
        // Let each method have separate call to the server
        // This way you can identify failing method
        me.provider.enableBuffer = false;
        //</debug>

        // Exception handler
        Ext.direct.Manager.on({
            exception: function (e) {
                Ext.GlobalEvents.fireEvent((e.code == 401 ? 'Message:Timeout' : 'Error:Server'), e);
            },
            scope: me
        });

    },

    /*
     * Method to append required headers if they are missing
     * This is used as a fallback hook typically
     */
    appendRequiredParams: function (provider, transaction) {
        if (!window.userGlobal || !window.userGlobal.dbi) {
            return;
        }
        // Append dbi to all requests
        if (!transaction.args[0]) {
            transaction.args[0] = window.userGlobal.dbi;
            transaction.data[0] = window.userGlobal.dbi;
        }
    },

    /*
     * Hooks into every Ext.Direct response, and throws errors based on success
     */
    handleDirectResponse: function (provider, transaction, eOpts) {
        if (eOpts && eOpts.callbackOptions && eOpts.callbackOptions.autoHandle) {

            var response = transaction.result ? transaction.result : transaction,
                message = response.message;
            if (response && response.success) {
                return true; // Successful response, continue with standard callback
            } else if (response) {

                Ext.Msg.show({
                    title: 'Error',
                    message: message.mdBody ? message.mdBody : message,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });

                (eOpts.callbackOptions.failure || Ext.emptyFn)();
            }

            return false;
        } else {
            return true; // Autohandle is not set or set to false, continue as normal with callback
        }
    }


});
