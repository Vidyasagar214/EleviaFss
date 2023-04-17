/*
 *  This plugin is set on components that need to be permission controlled in some way.
 */
Ext.define('TS.plugin.Permission', {
    extend: 'Ext.AbstractPlugin',

    alias: 'plugin.permission',

    pluginId: 'permission',

    config: {

        // Component states
        disableCmp: false,
        hideCmp: false,
        readOnlyCmp: false,

        // User roles that the permission plugin *allows*
        // If an active user's roles do not match, we will apply the above states if set to true
        // Roles can be an array of names, or a reversal for exclusions prepended with !, for example:
        // roles: ['!CrewMember']
        roles: []
    },

    init: function (component) {
        this.reset();
    },

    reset: function () {
        this.checkPermission();
    },

    checkPermission: function () {
        var userRole = (TS.app.getViewport() || TS.app.settings.userRole);
        if (Ext.Array.contains(this.getRoles(), userRole) || !Ext.Array.contains(this.getRoles(), '!' + userRole)) {
            this.destroy(); // Allowed role, destroy the plugin
        } else {
            this.setPermissionStatus(false);
        }
    },

    // Sets the state of the permission
    // True removes any permissions handled, false enforces the permission
    setPermissionStatus: function (state) {
        if (this.getCmp().rendered && this.getHideCmp()) {
            this.getCmp()[(Boolean(state) ? 'show' : 'hide')]();
        } else if (this.getDisableCmp()) {
            this.getCmp().setDisabled(!Boolean(state));
        } else if (this.getReadOnlyCmp()) {
            this.getCmp().setReadOnly(!Boolean(state));
        }
    }
});