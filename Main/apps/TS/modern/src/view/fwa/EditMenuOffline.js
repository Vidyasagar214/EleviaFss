/**
 * Created by steve.tess on 1/29/2019.
 */
Ext.define('TS.view.fwa.EditMenuOffline', {
    extend: 'TS.view.common.Menu',
    xtype: 'fwa-editmenu-offline',

    reference: 'fwaEditMenu',
    scrollable: 'y',
    //maxHeight: 300,
    items: [
        {
            text: 'Doc',
            xtype: 'button',
            reference: 'fwaDocButton',
            itemId: 'fwaDocButton',
            iconCls: 'x-fa fa-file-text-o',
            handler: 'onAttachDoc',
            bind: {
                hidden: '{newFwa}'
            }
        },
        {
            text: 'Photo',
            xtype: 'button',
            reference: 'fwaPhotoButton',
            itemId: 'fwaPhotoButton',
            iconCls: 'x-fa fa-camera',
            handler: 'onAttachPhoto',
            bind: {
                hidden: '{newFwa}'
            }
        },
        {
            text: 'Search',
            iconCls: 'x-fa fa-search',
            itemId: 'fwaSearchButton',
            handler: 'searchFwaForm',
            bind: {
                hidden: '{newFwa}' //TODO look at hide
            }
        }
    ]
});