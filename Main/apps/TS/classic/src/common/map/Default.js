Ext.define('TS.common.map.Default', {
    extend: 'Ext.panel.Panel',

    xtype: 'map-default',

    requires: ['Ext.window.MessageBox'],

    plain: true,
    gmapType: 'map',
    border: false,

    config: {
        initialCenter: true,
        suppressMessages: false
    },

    plugins: {
        ptype: 'responsive'
    },

    responsiveConfig: {
        normal: {
            width: 375,
            height: 500
        },
        small: {
            width: 200,
            height: 300
        }
    },

    onBoxReady: function () {
        var me = this,
            center = this.center;
        me.callParent(arguments);

        if (center) {
            if (center.geoCodeAddr) {
                me.lookupCode(center.geoCodeAddr, center.marker);
            } else {
                me.createMap(center);
            }
        } else {
            Ext.Error.raise('center is required');
        }

        me.setLoading(true);
    },

    createMap: function (center, marker) {

        var me = this,
            options = Ext.apply({}, me.mapOptions);
        options = Ext.applyIf(options, {
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROAD
        });
        me.gmap = new google.maps.Map(me.body.dom, options);

        // If the center is not set, default it to the users current location
        if (!options.center) {
            me.getCurrentPosition(Ext.bind(function (center) {
                if (me.getInitialCenter()) {
                    me.setCenter(center);
                }
            }, me));
        }

        me.fireEvent('mapready', me, me.gmap);
    },

    addMarker: function (marker) {

        marker = Ext.apply({
            map: this.gmap
        }, marker);

        if (!marker.position) {
            marker.position = new google.maps.LatLng(marker.lat, marker.lng);
        }
        var o = new google.maps.Marker(marker);
        Ext.Object.each(marker.listeners, function (name, fn) {
            google.maps.event.addListener(o, name, fn);
        });
        return o;
    },

    afterComponentLayout: function (w, h) {
        this.callParent(arguments);
        this.redraw();
    },

    redraw: function () {
        var map = this.gmap;
        if (map) {
            google.maps.event.trigger(map, 'resize');
        }
    },

    /*
     * Sets the center of the Google Map
     */
    setCenter: function (position) {

        // Handles as pair array if not already a Google LatLng
        if (!(position instanceof google.maps.LatLng)) {
            position = new google.maps.LatLng(position[0], position[1]);
        }

        // Sets the center and removes the loading mask
        this.gmap.setCenter(position);
        this.setLoading(false);
        this.setInitialCenter(false);

    },

    /*
     * Sets the zoom level on the Google Map
     */
    setZoom: function (zoomLevel) {
        this.gmap.setZoom(zoomLevel);
    },

    /*
     * Returns Google LatLng
     */
    getCurrentPosition: function (callback) {
        navigator.geolocation.getCurrentPosition(function (geoPos) {
            if (geoPos) {
                var gPos = new google.maps.LatLng(geoPos.coords.latitude, geoPos.coords.longitude);
                callback(gPos);
            } else {
                // TODO - Error handling
            }
        });
    },

    /*
     * Takes an address object and sends it through Google geocoder
     */
    geocodeAddress: function (addressData, latLng, callback) {
        // No address or latLng data was passed
        if ((!addressData || addressData.length == 0) && !latLng) {
            return false;
        } else {
            addressData = (typeof addressData == 'object' ? Ext.Object.getValues(addressData).join(',') : addressData);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                address: addressData,
                location: latLng
            }, Ext.Function.bind(this.onLookupComplete, this, [callback], true));
        }
    },

    onLookupComplete: function (data, response, callback) {
        //console.log(response);
        if (response != 'OK') {
            if (!this.getSuppressMessages()) {
                Ext.GlobalEvents.fireEvent('Message:Maps', response);
            }
            return;
        }

        callback(data[0].geometry.location);
    }

});
