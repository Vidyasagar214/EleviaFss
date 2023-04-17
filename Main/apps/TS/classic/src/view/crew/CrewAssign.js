/**
 * Created by steve.tess on 8/14/2015.
 */
Ext.define('TS.view.crew.CrewAssign', {
    extend: 'Ext.window.Window',

    xtype: 'crewassign',

    controller: 'crewassign',
    selectedFwa: null,

    title: {_tr: 'crewLabel', tpl: 'Select {0}'},
    width: 500,
    height: 350,
    //scrollable: 'y',

    items: [
        {
            xtype: 'checkboxfield',
            reference: 'myCrewsOnlyButton',
            boxLabel: {_tr: 'crewLabelPlural', tpl: 'My {0} Only'},
            padding: '10 0 10 25',
            listeners: {
                change: 'onMyCrewsCheck'
            }
        },
        {
            xtype: 'grid-crewassign',
            scrollable: 'y',
            height: 250,
            reference: 'gridCrewAssignPopup'
        }
    ],

    buttons: [
        {
            text: 'Delete',
            handler: 'onDeleteCrew',
            reference: 'deleteCrewBtn',
            hidden: true,
            align: 'left'
        },'->', {
            text: 'Select',
            handler: 'onSaveCrewAssign',
            reference: 'selectCrewBtn',
            disabled: true
        }, {
            text: 'Cancel',
            handler: 'onCancelCrewAssign'
        }
    ],

    listeners: {
        close: 'onCloseCrew',
        resize: 'onResize'
    }
});
