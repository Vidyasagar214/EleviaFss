Ext.define('TS.common.map.FWAController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-fwa',

    config: {
        draggableMarker: null
    },

    listen: {
        controller: {
            '*': {
                refreshGeocoding: {
                    fn: 'refreshGeocoding',
                    buffer: 2100
                }
            },

            'form-fwa': {
                afterFwaSave: function () {
                    var win = this.getView().up('window');

                    if (win) {
                        win.close();
                    }
                }
            }
        }
    },

    handleMapReady: function () {
        this.setMapMarkers();
    },

    setMapMarkers: function (mapData) {

        var me = this,
            url = window.location.href,    // Returns full URL
            isHttps = url.search("https:") > 0 || url.search("localhost:") > 0, //check if has SSL (https)
            settings = TS.app.settings,
            record = me.getView().getFwaRecord(),
            store = me.getView().getFwaStore(),
            interval,
            loc,
            bounds,
            hasValues;

        // We have a single record
        if (record) {
            loc = record.get('loc');
            // User could delete all fields, so check for them
            hasValues = (loc.address1 || loc.address2 || loc.city || loc.state || loc.country || loc.latitude || loc.longitude || loc.zip);
            // User does not have any coordinate data set
            if (!hasValues) {
                // if (isHttps) {
                //     // Fetch their current position
                //     navigator.geolocation.getCurrentPosition(Ext.bind(function (position) {
                //         // Override the empty coordinates in their record
                //         me.setMapMarkerForRecord(record, null, {
                //             latitude: position.coords.latitude,
                //             longitude: position.coords.longitude
                //         });
                //
                //     }, me));
                // }
                // else {
                //     Ext.Msg.alert('FYI', 'If no Work Address values are entered, non-secure web sites will default to user\'s assigned State/Province.');
                //     loc.state = settings.empState;
                //     //me.setMapMarkerForRecord(record);
                //     Ext.first('#stateField').setValue(loc.state);
                // }
                // Fetch their current position
                navigator.geolocation.getCurrentPosition(Ext.bind(function (position) {
                    // Override the empty coordinates in their record
                    me.setMapMarkerForRecord(record, null, {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });

                }, me));
            } else if ((loc.latitude && loc.longitude) && (loc.latitude != '0' && loc.longitude != '0')) {
                me.setMapMarkerForRecord(record, null, {
                    latitude: loc.latitude,
                    longitude: loc.longitude
                });
            } else {
                me.setMapMarkerForRecord(record);
            }

            // We have a store full of records
        } else if (store) {
            bounds = new google.maps.LatLngBounds();

            let records = store.getRange();
            interval = settings.mapInterval; // how much time should the delay between two iterations be (in milliseconds)?
            records.forEach(function (currentRecord, index) {
                setTimeout(function () {
                    loc = currentRecord.get('loc');
                    // User could delete all fields, so check for them
                    hasValues = (loc.address1 || loc.address2 || loc.city || loc.state || loc.country || loc.latitude || loc.longitude);
                    // check lat/long first
                    if ((loc.latitude && loc.longitude) && (loc.latitude != '0' && loc.longitude != '0')) {
                        me.setMapMarkerForRecord(currentRecord, bounds, {
                            latitude: loc.latitude,
                            longitude: loc.longitude
                        });
                    } else {
                        me.setMapMarkerForRecord(currentRecord, bounds);
                    }
                }, index * interval);
            });
        }
    },

    // Supplying forcedCoords will override any coordinates found in the record
    setMapMarkerForRecord: function (record, bounds, forcedCoords) {
        var me = this,
            recordLoc,
            location = (forcedCoords || record.get('loc')),
            parsedLoc = me.parsedAddress(location),
            latLng = (location.latitude && location.longitude ? new google.maps.LatLng(location.latitude, location.longitude) : null);

        me.getView().geocodeAddress(parsedLoc, latLng, Ext.bind(function (resPosition) {
            me.addMapMarker(record, resPosition);

            if (bounds) {
                bounds.extend(resPosition);
                me.getView().gmap.fitBounds(bounds);
                me.getView().setCenter(bounds.getCenter());
            } else {
                me.getView().setCenter(resPosition);
                me.getView().setZoom(14);
            }

        }, me));

        // Forces an update of the UI fields
        if (forcedCoords && latLng) {

            recordLoc = (record.get('loc') || {});
            recordLoc.latitude = latLng.lat();
            recordLoc.longitude = latLng.lng();

            record.set('loc', recordLoc);
            //me.fireEvent('positionUpdate');
            me.refreshAddressValues(record);
        }

    },

    refreshAddressValues: function (record) {
        var rec = (record || this.getView().getRecord()),
            vm = this.getViewModel(),
            loc = rec.get('loc'),
            // latLng = (loc.latitude && loc.longitude ? new google.maps.LatLng(loc.latitude, loc.longitude) : null),
            // geocoder = new google.maps.Geocoder(),
            fwa = Ext.first('#fwaForm'),
            form = fwa.getForm();

        if (loc) {
            // geocoder.geocode({
            //     location: latLng
            // }, function (results, status) {
            //     if (status === 'OK') {
            //         if (results[0]) {
            //             if (results[0].address_components) {
            //                 loc.state =  results[0].address_components[5].short_name;
            //                 rec.set('loc',loc);
            //                 form.setValues(rec.get('loc'));
            //             }
            //         }
            //     }
            // });
            form.setValues(rec.get('loc'));
        }
    },

    addMapMarker: function (record, gPos) {
        var me = this,
            map = me.getView().gmap,
            startDate = record.get('schedStartDate'),
            endDate = record.get('schedEndDate'),
            now = new Date(),
            marker,
            destination,
            infoWinRouteEl,
            mapIcon = 'resources/grey-dot-marker.png'; // Default to grey
        if (record.get('availableForUseInField')) {
            switch (record.get('fwaStatusId')) {
                case 'A':
                    mapIcon = 'resources/grey-dot-marker.png';
                    break;
                case 'S':
                    mapIcon = 'resources/green-dot-marker.png';
                    break;
                case 'I':
                    mapIcon = 'resources/slateblue-dot-marker.png';
                    break;
                case 'C':
                    mapIcon = 'resources/orange-dot-marker.png';
                    break;
                case 'D':
                    mapIcon = 'resources/yellow-dot-marker.png';
                    break;
                case 'V':
                    mapIcon = 'resources/blue-dot-marker.png';
                    break;
            }
            //check if past due
            if (new Date(endDate) < now && (record.get('fwaStatusId') != 'S' && record.get('fwaStatusId') != 'A')) {
                mapIcon = 'resources/red-dot-marker.png';
            }
            // if (Ext.Date.diff(startDate, now, Ext.Date.DAY) > 0 && (record.get('fwaStatusId') != 'S' && record.get('fwaStatusId') != 'A')) {
            //     mapIcon = 'resources/red-dot-marker.png';
            // }
        } else {
            mapIcon = 'resources/yelloworange-dot-marker.png';
        }

        marker = this.getView().addMarker(Ext.Object.merge({
            position: gPos,
            title: record.get('fwaNum') + ': ' + record.get('fwaName'),
            icon: mapIcon
        }, me.getView().getDraggablePin() ? {
            draggable: true
        } : {}));

        //var originData = {
        //    lat: 0,
        //    long: 0
        //};

        //change below to limit when/where directions can be created
        //if (true) { //this.getView().isSingleFwa
        // Create the DOM element to be inserted into the map infowindow
        destination = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

        //navigator.geolocation.getCurrentPosition(function (success) {
        //    var latValue = success.coords.latitude,
        //        longValue = success.coords.longitude;
        //});

        infoWinRouteEl = Ext.DomHelper.createDom({
            tag: 'div',
            children: [
                {
                    tag: 'div',
                    style: {
                        'padding-top': '5px',
                        'width': '150px',
                        'text-align': 'center'
                    },
                    children: [{ //saddr
                        html: '<a style="padding-top: 10px;" href="http://maps.google.com/maps?daddr=' +
                        destination + '" target="_blank"><button style="moz-border-radius: 5px; -webkit-border-radius: 5px; width: 90%">Get Directions</button></a>'
                    }]
                }]

        });
        marker.infoWindow = new google.maps.InfoWindow({
            content: infoWinRouteEl
        });

        google.maps.event.addListener(marker, 'click', function () {
            marker.infoWindow.open(map, marker);
        });
        //} //uncomment above 'if' and enter bool statement to limit

        google.maps.event.addListener(marker, 'dragend', Ext.pass(this.onMapMarkerDragEnd, [record, marker]).bind(me));

        me.setDraggableMarker(marker);
    },

    geoError: function (error) {
        console.log('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
    },

    onMapMarkerDragEnd: function (fwaRecord, marker, e) {
        var me = this,
            position = e.latLng,
            locData = fwaRecord.get('loc');
        locData.latitude = position.lat();
        locData.longitude = position.lng();
        fwaRecord.set('loc', locData);
        //this.fireEvent('positionUpdate');
        me.refreshAddressValues(fwaRecord);
        marker.setAnimation(4);
    },

    refreshGeocoding: function (data) {
        var me = this;
        me.getView().geocodeAddress(data, false, function (position) {
            me.getView().setCenter(position);
            if (me.getDraggableMarker()) {
                me.getDraggableMarker().setPosition(position);
            }
        }.bind(me));
    },

    parsedAddress: function (location) {
        var parsedLoc = '';

        parsedLoc += (location.address1 ? location.address1 + ',' : '');
        parsedLoc += (location.address2 ? location.address2 + ',' : '');
        parsedLoc += (location.city ? location.city + ',' : '');
        parsedLoc += (location.state ? location.state + ',' : '');
        parsedLoc += (location.zip ? location.zip + ',' : '');
        parsedLoc += (location.country ? location.country + ',' : '');

        return parsedLoc;
    }

});
