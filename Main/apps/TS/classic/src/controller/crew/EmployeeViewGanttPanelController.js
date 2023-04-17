/**
 * Created by steve.tess on 11/9/2017.
 */
Ext.define('TS.controller.crew.EmployeeViewGanttPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.employeeviewganttpanel',

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    openSettingsWindow: function (component, e) {
        Ext.create('TS.view.crew.window.UserSettings').show();
    }
});