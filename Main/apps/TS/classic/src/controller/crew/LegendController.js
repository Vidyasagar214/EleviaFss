/**
 * Created by steve.tess on 4/19/2016.
 */
Ext.define('TS.controller.crew.LegendController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pie-basic',

    init: function (){

    },

    onPreview: function () {
        var chart = this.lookup('chart');
        chart.preview();
    },

    onDataRender: function (v) {
        return v + '%';
    },

    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('status'));
    },

    onCloseWindow: function (component, e) {
        this.getView().close();
    }
});