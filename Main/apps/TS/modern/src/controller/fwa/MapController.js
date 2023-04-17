Ext.define('TS.controller.fwa.MapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fwa-map',

    config: {
        draggableMarker: null,
        suppressMessages: true
    },
    //https://developers.google.com/maps/documentation/javascript/reference

    init: function() {
        this.getView().add({
            xtype: 'map',
            reference: 'gmap',
            mapOptions: {
                center: null,
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            listeners: {
                maprender: 'onMapRender'
            }
        });
    },

    onMapRender: function(cmp) {
        var me = this,
            url = window.location.href, // Returns full URL
            isHttps = url.search("https:") > 0 || url.search('localhost') > 0, //check if has SSL (https)
            settings = TS.app.settings,
            record = cmp.up('sheet').dataRecord,
            store = cmp.up('sheet').store,
            loc,
            bounds,
            hasValues = false;

        if (record) {
            if (record.getLoc()) {
                loc = record.getLoc().getData();
                hasValues = (loc.address1 || loc.address2 || loc.city || loc.state || loc.country || loc.latitude || loc.longitude || loc.zip);
            } else if (record.loc) {
                loc = record.loc;
                hasValues = (loc.address1 || loc.address2 || loc.city || loc.state || loc.country || loc.latitude || loc.longitude || loc.zip);
            }
            if (!hasValues) {
                // if (isHttps) {
                //     // Fetch their current position
                //     navigator.geolocation.getCurrentPosition(Ext.bind(function (position) {
                //         // Override the empty coordinates in their record
                //         record.getLoc().set('latitude', position.coords.latitude);
                //         record.getLoc().set('longitude', position.coords.longitude);
                //         me.setMapMarkerForRecord(cmp, record, null, {
                //             latitude: position.coords.latitude,
                //             longitude: position.coords.longitude
                //         });
                //     }, me));
                // }
                // else {
                //     Ext.Msg.alert('FYI', 'If no Work Address values are entered, non-secure web sites will default to user\'s assigned State/Province.');
                //     record.getLoc().set('state', settings.empState);
                //     me.setMapMarkerForRecord(cmp, record);
                //     Ext.first('#stateField').setValue(loc.state);
                // }
                navigator.geolocation.getCurrentPosition(Ext.bind(function(position) {
                    // Override the empty coordinates in their record
                    record.getLoc().set('latitude', position.coords.latitude);
                    record.getLoc().set('longitude', position.coords.longitude);
                    me.setMapMarkerForRecord(cmp, record, null, {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                }, me));
            } else if ((loc.latitude && loc.longitude) && (loc.latitude != '0' && loc.longitude != '0')) {
                me.setMapMarkerForRecord(cmp, record, null, {
                    latitude: loc.latitude,
                    longitude: loc.longitude
                });
            } else {
                me.setMapMarkerForRecord(cmp, record);
            }
        } else if (store) {
            bounds = new google.maps.LatLngBounds();
            let records = store.getRange();
            let interval = settings.mapInterval;  // how much time should the delay between two iterations be (in milliseconds)?
            records.forEach(function (currentRecord, index) {
                setTimeout(function () {
                    loc = currentRecord.getLoc().getData();
                    // User could delete all fields, so check for them
                    hasValues = (loc.address1 || loc.address2 || loc.city || loc.state || loc.country || loc.latitude || loc.longitude);
                    // check lat/long first
                    if ((loc.latitude && loc.longitude) && (loc.latitude != '0' && loc.longitude != '0')) {
                        me.setMapMarkerForRecord(cmp, currentRecord, bounds, {
                            latitude: loc.latitude,
                            longitude: loc.longitude
                        });
                    } else {
                        me.setMapMarkerForRecord(cmp, currentRecord, bounds);
                    }
                }, index * interval);
            });
        }

    },
    //TODO Implement methods to show single / multiple markers and other goodies

    setMapMarkerForRecord: function(cmp, record, bounds, forcedCoords) {
        var me = this,
            location = (forcedCoords || (record ? record.getLoc().getData() :record.loc())),
            parsedLoc = this.parsedAddress(location),
            latLng = (location.latitude && location.longitude ? new google.maps.LatLng(location.latitude, location.longitude) : null),
            recordLoc,
            map = cmp.getMap();

        me.geocodeAddress(parsedLoc, latLng, Ext.bind(function(resPosition) {
            me.addMapMarker(record, resPosition);

            if (bounds) {
                bounds.extend(resPosition);
                me.getView().lookup('gmap').getMap().fitBounds(bounds);
                map.setCenter(bounds.getCenter());
            } else {
                map.setCenter(resPosition);
                map.setZoom(14);
            }

        }, me));

        // Forces an update of the UI fields
        if (forcedCoords && latLng) {

            recordLoc = (record.get('loc') || {});

            recordLoc.latitude = latLng.lat();
            recordLoc.longitude = latLng.lng();

            record.set('loc', recordLoc);
            me.fireEvent('positionUpdate', record);
        }
    },

    addMapMarker: function(record, gPos) {
        var me = this,
            marker,
            map = this.getView().lookup('gmap').getMap(),
            destination,
            infoWinRouteEl,
            path = 'resources/{0}-dot-marker.png',
            mapIcon,
            startDate = record.get('schedStartDate'),
            endDate = record.get('schedEndDate'),
            now = new Date(),
            color;

        if (record.get('availableForUseInField')) {
            switch (record.get('fwaStatusId')) {
                case FwaStatus.Approved:
                    mapIcon = 'grey';
                    break;
                case FwaStatus.Submitted:
                    mapIcon = 'green';
                    break;
                case FwaStatus.InProgress:
                    mapIcon = 'slateblue';
                    break;
                case FwaStatus.Create:
                    mapIcon = 'orange';
                    break;
                case FwaStatus.Scheduled:
                    mapIcon = 'yellow';
                    break;
                case FwaStatus.Saved:
                    mapIcon = 'blue';
                    break;
            }
            if (new Date(endDate) < now && (record.get('fwaStatusId') != FwaStatus.Submitted && record.get('fwaStatusId') != FwaStatus.Approved)) {
                mapIcon = 'red';
            }
            // if (Ext.Date.diff(startDate, now, Ext.Date.DAY) > 0 && (record.get('fwaStatusId') != 'S' && record.get('fwaStatusId') != 'A')) {
            //     mapIcon = 'red';
            // }

        } else {
            mapIcon = 'yelloworange';
        }

        marker = me.addMarker(Ext.Object.merge({
            position: gPos,
            title: record.get('fwaNum') + ': ' + record.get('fwaName'),
            icon: Ext.String.format(path, mapIcon || 'gray') //Use gray if no mapIcon
        }, me ? {
            draggable: true
        } : {}));

        destination = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        infoWinRouteEl = Ext.DomHelper.createDom({
            tag: 'div',
            children: [{
                tag: 'div',
                style: {
                    'padding-top': '5px',
                    'width': '100px',
                    'text-align': 'center'
                },
                children: [{ //saddr
                    html: '<a style="padding-top: 10px;" href="http://maps.google.com/maps?daddr=' +
                        destination + '" target="_blank">Get Directions</a>'
                }]
            }]

        });
        marker.infoWindow = new google.maps.InfoWindow({
            content: infoWinRouteEl
        });

        google.maps.event.addListener(marker, 'click', function() {
            marker.infoWindow.open(map, marker);
        });

        google.maps.event.addListener(marker, 'dragend', Ext.pass(me.onMapMarkerDragEnd, [record, marker]).bind(me));

        me.setDraggableMarker(marker);
    },

    geocodeAddress: function(addressData, latLng, callback) {
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

    onMapMarkerDragEnd: function(fwaRecord, marker, e) {
        var position = e.latLng,
            locData = fwaRecord.getLoc();

        locData.set('latitude', position.lat());
        locData.set('longitude', position.lng());

        this.fireEvent('positionUpdate');
        marker.setAnimation(4);
    },

    parsedAddress: function(location) {
        var data = location.isEntity ? location.getData() : location; //serve both model and object

        return [data.address1, data.address2, data.city, data.state, data.zip, data.country].filter(Boolean).join(', ');
    },

    addMarker: function(marker) {
        var maps = google.maps,
            o;

        marker = Ext.apply({
            map: this.getView().lookup('gmap').getMap()
        }, marker);

        if (!marker.position) {
            marker.position = new maps.LatLng(marker.lat, marker.lng);
        }

        o = new maps.Marker(marker);

        Ext.Object.each(marker.listeners, function(name, fn) {
            maps.event.addListener(o, name, fn);
        });

        return o;
    },

    onLookupComplete: function(data, response, callback) {
        //console.log(response);
        if (response != 'OK') {
            if (!this.getSuppressMessages()) {
                Ext.GlobalEvents.fireEvent('Message:Maps', response); //No address found
            }
            return;
        }
        callback(data[0].geometry.location);
    }

});