//TODO Sencha Check why it's not properly destroyed
// Console gives error: [W] Duplicate reference: "hourEditorWindow" on viewport-timesheetapproval-1024
Ext.define('TS.view.ts.HourEditor', {
    extend: 'Ext.window.Window',
    xtype: 'window-houreditor',

    controller: 'window-houreditor',

    title: 'Hour Editor',
    width: 300,
    //height: 250,
    bodyPadding: 10,
    scrollable: 'y',
    
    //TODO: Controller is using them
    // Should refactor so they are stored in ViewModel instead
    config: {
        tsRowRecord: null, // Custom config
        cell: null,
        tsWorkDate: null
    },

    items: [{
        xtype: 'form',
        reference: 'hourEditorForm',

        defaults: {
            xtype: 'numberfield',
            labelWidth: 60,
            minValue: 0,
            maxValue: 24,
            listeners: {
                spin: function(obj,direction ){
                    var s = TS.app.settings;
                    switch(s.tsIncrement){
                        case 15:
                            obj.step = .25;
                            break;
                        case 30:
                            obj.step = .5;
                            break;
                        default:
                            obj.step = 1;
                            break;
                    }
                }
            }
        },
        items: [{
            fieldLabel: 'Regular',
            name: 'regHrs'
        }, {
            fieldLabel: 'Overtime',
            name: 'ovtHrs',
            hidden: true,
            bind: {
                hidden: '{!settings.tsAllowOvtHrs}'
            }
        }, {
            fieldLabel: 'Overtime2',
            name: 'ovt2Hrs',
            hidden: true,
            bind: {
                hidden: '{!settings.tsAllowOvt2Hrs}'
            }
        }, {
            fieldLabel: 'Travel',
            name: 'travelHrs',
            hidden: true,
            bind: {
                hidden: '{!settings.tsAllowTravelHrs}'
            }
        },{
            fieldLabel: 'Comment',
            xtype: 'textarea',
            name: 'comment',
            enforceMaxLength: true
            //maxLength: 255
        }, {
            fieldLabel: {_tr: 'fwaAbbrevLabel'},
            xtype: 'displayfield',
            name: 'fwaNum',
            reference: 'fwaNum',
            tabIndex: -1
        }]
    }],

    buttons: [{
        text: {_tr: 'fwaAbbrevLabel'},
        reference: 'fwaButton',
        handler: 'showFwa'
    }, '->', {
        text: 'Update',
        handler: 'saveTimesheetCellHours',
        reference: 'saveTsCellHoursBtn'
    }, {
        text: 'Cancel',
        handler: 'cancelTimesheetCellHours',
        reference: 'cancelTimesheetCellHoursButton'
    }]

});
