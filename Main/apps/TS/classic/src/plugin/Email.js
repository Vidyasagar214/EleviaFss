Ext.define('TS.plugin.Email', {
    extend: 'Ext.AbstractPlugin',

    alias: 'plugin.email',

    pluginId: 'email',

    config: {
        insertControls: false
    },

    sendEmail: function (email) {
        window.location.href = "mailto:" + email.get('emailAddress') + "?subject=" + email.get('subject') + "&body=" + email.get('body');
    }

});
