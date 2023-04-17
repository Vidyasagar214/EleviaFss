/**
 * Created by steve.tess on 1/26/2018.
 */
Ext.define('TS.view.crew.CrewManagePanel', {
    extend: 'Ext.window.Window',

    xtype: 'panel-crewManage',

    layout: 'fit',
    closable: true,
    modal: true,

    requires: [
        'TS.controller.crew.CrewManageController',
        'TS.view.crew.CrewManage'
    ],

    controller: 'crewManage',

    title: 'Manage Crew Ownership',
    width: 500,

    items:[
        {
            xtype: 'form',
            bodyPadding: 10,
            items:[
                {
                    xtype: 'fieldset',
                    title: 'All Crews',
                    items:[
                        {
                            xtype: 'grid-crewManage',
                            scrollable: 'y',
                            height: 250,
                            reference: 'gridCrewManagePopup',
                            flex: 2,
                            listeners: {
                                selectionchange: 'onGridSelectionChange'
                            }
                        }
                    ]
                },{
                    xtype: 'fieldset',
                    title: 'Owner',
                    items:[
                        {
                            xtype: 'field-allemployeewithschedulers',
                            flex: 1,
                            fieldLabel: 'Crew Owner',
                            name: 'preparedByEmpId',
                            reference: 'preparedByEmpIdField'
                        }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save Selection',
            reference: 'saveSelectionBtn',
            disabled: true,
            handler: 'doSaveSelection',
            align: 'right'
        },
        {
            text: 'Cancel',
            handler: 'onCloseWindow',
            align: 'right'
        }
    ]
});