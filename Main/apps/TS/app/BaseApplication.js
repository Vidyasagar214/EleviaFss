Ext.define('TS.BaseApplication', {
    extend: 'Ext.app.Application',

    name: 'TS',

    requires: [
        'TS.common.TR',
        'TS.field.FssDate'
    ],

    listen: {
        global: {
            'App:Ready': 'appReady',
            'Route:Silent': 'silentRoute',
            'ChangeViewport': 'changeViewport'
        }
    },

    appName: null,

    //Application wide settings
    settings: {},

    config: {
        viewport: null
    },

    launch: function () {
        Ext.ariaWarn = Ext.emptyFn;

        Ext.fly('spinner-wrap').destroy();
        this.appName = Ext.Object.fromQueryString(location.search).app;

        // Add custom method to Ext.History to track one hash/route prior
        Ext.History.setHash = Ext.Function.createInterceptor(Ext.History.setHash, function () {
            this.lastToken = this.currentToken;
        });

        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
            timezone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1],
            tzSplit = timezone.split(' '),
            tzAbbrev = '';

        if (!iOS) {
            Ext.each(tzSplit, function (tz) {
                tzAbbrev += tz.substring(0, 1);
            });
        } else {
            tzAbbrev = tzSplit;
        }
        /* end get and set timezone abbreviation */
        Ext.get('appfooter').setHtml(' v:' + VERSION.config.appVersion + '  ' + '<b>' + tzAbbrev + '</b>');

        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, {passive: false});

        Ext.apply(Ext.util.Format, {
            defaultDateFormat: DATE_FORMAT
        });
    },

    appReady: function () {
        /* User Config settings are created at this point, load Google API Maps with user key*/
        if (!GOOGLE_MAPS_LOADED) {
            var scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.src = 'https://maps.googleapis.com/maps/api/js?key=' + TS.app.settings.mapApi;
            document.head.appendChild(scriptElement);
            GOOGLE_MAPS_LOADED = true;
        }

        this.createViewport();
    },

    createViewport: function () {
        var appName = this.appName == 'History' ? this.appName : 'FSS',//always default to FSS if not "History" here since it is the main entry point when first opening application,
            viewportAliases = {
                Scheduler: 'crew',
                Crew: 'crew',
                TS: 'ts',
                TSA: 'tsa',
                FWA: 'fwa',
                FSS: 'fss',
                EXP: 'exp',
                EXA: 'exa',
                UTILITIES: 'utilities',
                History: 'history'
            },
            module = (viewportAliases[appName] || appName),
            viewport = TS.view[module] && TS.view[module].Main,
            refClass,
            existingViewport = Ext.first('viewport');

        if (existingViewport && !Ext.isModern) {
            existingViewport.destroy();
        }

        // Create viewport if found, or throw an error
        if (viewport) {
            refClass = Ext.create(viewport);
            // Ext.app.route.Router.onStateChange(Ext.History.currentToken); // Forward the hash to the viewport controller for delayed routing
            this.setViewport(refClass);
        } else {
            if (appName == 'Scheduler') {
                Ext.GlobalEvents.fireEvent('Message:Code', 'viewportInitErrorScheduler');
            } else {
                Ext.GlobalEvents.fireEvent('Message:Code', 'viewportInitError');
            }

        }

        if(appName == 'FSS' && localStorage.getItem('version') != VERSION.config.appVersion){
            localStorage.setItem('version', VERSION.config.appVersion);
            this.onAppUpdate();
        }
    },

    changeViewport: function (app) {
        var appName = app,
            viewportAliases = {
                Scheduler: 'crew',
                Crew: 'crew',
                TS: 'ts',
                TSA: 'tsa',
                FWA: 'fwa',
                FSS: 'fss',
                EXP: 'exp',
                EXA: 'exa',
                UTILITIES: 'utilities',
                History: 'history'
            },
            module = (viewportAliases[appName] || appName),
            viewport = TS.view[module] && TS.view[module].Main,
            refClass,
            existingViewport = Ext.first('viewport');
        if (existingViewport && !Ext.isModern) {
            existingViewport.destroy();
        }
        // Create viewport if found, or throw an error
        if (viewport) {
            refClass = Ext.create(viewport);
            refClass.getViewModel().set('fromFSS', true);
            //Ext.app.route.Router.onStateChange(Ext.History.currentToken); // Forward the hash to the viewport controller for delayed routing
            this.setViewport(refClass);
        } else {
            Ext.GlobalEvents.fireEvent('Message:Code', 'viewportInitError');
        }
    },

    // This is a custom method that is used to push through a route that is immediately rejected via a before handler
    // We use this when we need to perform a "silent" route to update the URL hash
    silentRoute: function (token) {
        token = (typeof token == 'string' ? token : Ext.History.lastToken); // If no token is passed, set to the prior token/route
        // Ext.app.route.Router.routes.forEach(function (route) {
        //     if (route.recognize(token)) {
        //         var matchedRoute = route,
        //             beforeFn = route.before;
        //         route.before = function () {
        //             var a = arguments[arguments.length - 1];
        //             a.stop();
        //             matchedRoute.before = beforeFn;
        //             return false;
        //         };
        //         this.redirectTo(token);
        //     }
        // }.bind(this));
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }

});
//enums
var FwaStatus = {
    Create: 'C',
    Scheduled: 'D',
    InProgress: 'I',
    Saved: 'V',
    Submitted: 'S',
    Approved: 'A',
    Removed: 'X'
};

var ExpStatus = {
    Create: 'C',
    Scheduled: 'D',
    InProgress: 'I',
    Saved: 'V',
    Submitted: 'S',
    Approved: 'A',
    Removed: 'X',
    Rejected: 'R'
};

var TsStatus = {
    Missing: 'M',
    InProgress: 'I',
    Submitted: 'S',
    Approved: 'A',
    Saved: 'V',
    Rejected: 'R',
    Blank: 'B'
};

var AttachmentType = {
    EmpSignature: 'E',
    ClientSignature: 'S',
    Photo: 'P',
    Document: 'D',
    Expense: 'R'
};

// Ext.getBody().on('keydown', function (e) {
//     var key = e.getKey();
//     if (e.ctrlKey) {
//         if (Ext.isChrome || Ext.isEdge || Ext.isIE) {
//             e.preventDefault();
//         }
//     }
// });

Ext.getBody().on('keydown', function (e) {
    var key = e.getKey();
    if (e.ctrlKey) {
        if (Ext.isChrome || Ext.isEdge || Ext.isIE) {
            window.addEventListener("wheel", e => {
                if (e.ctrlKey)
                    e.preventDefault();
            }, {
                passive: false
            });
        }
    }
});

// window.visualViewport.addEventListener("resize", viewportHandler);
// function viewportHandler(event) {
//     console.log(document.firstElementChild);
//     document.firstElementChild.style.zoom = "reset";
// }

