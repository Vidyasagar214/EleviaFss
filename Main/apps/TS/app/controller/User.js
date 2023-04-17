/*
 * User Controller
 * This controller handles all user authentication and permissions.
 * It also handles user management.
 */

Ext.define('TS.controller.User', {
    extend: 'Ext.app.Controller',

    listen: {
        global: {
            'ShowLicenseAgreement': 'showLicenseAgreement'
        }
    },

    //@Sencha VERY IMPORTANT! Add your views!
    views: [
        'TS.view.Login'
    ],

    init: function () {
        Ext.create('TS.view.Login');
    },

    showLicenseAgreement: function (data) {
        Ext.create('TS.common.window.LicenseAgreement', {
            modal: true,
            viewModel: {
                data: data
            }
        }).show();
    }

});
