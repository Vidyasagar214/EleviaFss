Ext.define('TS.controller.fwa.FwaMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-fwamap',

    listen: {
        controller: {
            '*': {
                'UpdateMapRoute': 'updateMapRoute'
            }
        }
    },

    updateMapRoute: function (directionsRenderer, response) {

        if (response.routes.length > 0 && response.routes[0].legs.length > 0) {
            var start = response.routes[0].legs[0].start_address,
                end = response.routes[0].legs[0].end_address,
                link = 'http://maps.google.com/maps?daddr=' + end;
            //var link = 'http://maps.google.com/maps?saddr='+start+'&daddr='+end;
        }

        if (link) {
            //TODO@Sencha
            setTimeout(function () {
                Ext.DomHelper.insertBefore(Ext.get(directionsRenderer.panel).down('.adp'), '<div align="center" style="padding-top: 10px;"><a style="padding-top: 10px;" href="' +
                    link + '" target="_blank"><button style="moz-border-radius: 15px; -webkit-border-radius: 15px;">Open in Google Maps</button></a></div>');
            }, 1000);
        }

        this.getView().setWidth(600);
    }
    ,
    onMapClose: function (panel, eOpts) {
        var scheduler = Ext.first('scheduler-crew'),
            view,
            store;
        if (scheduler) {
            view = scheduler.getSchedulingView();
            store = view.getEventStore();
            store.clearFilter(true);
        }
    },

    mapCloseClick: function (component, e) {
        this.getView().close();
    }
});