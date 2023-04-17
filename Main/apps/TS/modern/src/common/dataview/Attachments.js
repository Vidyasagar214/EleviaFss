Ext.define('TS.common.dataview.Attachments', {
    extend: 'Ext.dataview.DataView',

    xtype: 'attachments',

    requires: [
        'TS.data.IconsSelector'
    ],

    layout: 'fit',
    controller: 'attachments',

    scrollable: true,
    itemTpl: new Ext.XTemplate(
        '<tpl exec="values.parent = this;" for=".">',

        '<table style="border: 1px solid black;border-collapse: collapse; width:100%">',
        '<tr>',
        '<td width="20%">', //<div class="thumb-wrap" data-attid="{attachmentId}" style="overflow:hidden;width:20%;text-align:center;float:left;margin-left:5px;margin-top:5px; height:175px"></div>',
        '    <div class="thumb" style="margin:4px;"><img src="{[this.getValue(values)]}" title="{name:htmlEncode}"  style="width:100%;height:auto;" /></div></td>',
        '<td width="40%">{[this.setFileName(values)]}</td>',
        '<td width="15%"><div class="x-button related-btn" btnType="enlarge" style="text-align: center; display: block; ">View</div>' +
        '<div class="x-button related-btn" btnType="delete" style="text-align: center; display: block;{[this.setDeleteHidden()]}">Delete</div></td>',
        '</tr>',
        '</table>',

        // '<div class="thumb-wrap" data-attid="{attachmentId}" style="overflow:hidden;width:20%;text-align:center;float:left;margin-left:5px;margin-top:5px; height:auto">',
        // '<div class="thumb" style="margin:4px;"><img src="{[this.getValue(values)]}" title="{name:htmlEncode}"  style="width:100%;height:100%;" /></div>',
        // //'<div style="font-size:85%;">{[this.getAttachDate(values)]}</div>',
        // '<div style="font-size:85%;word-wrap: break-word;">{[this.setFileName(values)]}</div>',
        // '<div style="white-space:nowrap;">',
        // //TODO Fix using iconCls  iconCls: 'x-fa fa-remove' //{[this.setHidden(values)]}
        // '<div class="x-button related-btn" btnType="enlarge" style="text-align: center; display: block; ">View</div>',
        // '<div class="x-button related-btn" btnType="delete" style="text-align: center; display: block;{[this.setDeleteHidden()]}">Delete</div>',
        // '</div>',
        // '</div>',

        '</tpl>',
        '<div class="x-clear"></div>',
        {
            setFileName: function (values) {
                //limit length of filename so it will not wrap
                // if (values.filename.length > 15)
                //     return values.filename.substring(0, 15) + '...';
                // else
                if(values.filename.indexOf('.') > -1)
                    return values.filename; // + '.'+ values.extension;
                else return values.filename + '.'+ values.extension;
            },
            getValue: function (values) {
                if (values.attachmentType == "P") {
                    if (values.attachmentItem) {
                        return 'data:image/' + values.extension + ';base64,' + (values.attachmentItem);
                    } else {
                        return TS.data.IconsSelector['PHOTO'];
                    }
                }
                else if (values.attachmentType == "D" || values.attachmentType == "R") {
                    //Document Attachment
                    var ext = values.extension.toUpperCase();
                    return TS.data.IconsSelector[ext] || TS.data.IconsSelector['Fallback'];
                }
            },
            getAttachDate: function (values) {
                return Ext.Date.format(new Date(values.dateAttached), 'Y-m-d');
            },
            setHidden: function (values) { // hide for now till window.open call resolved-;
                //return values.attachmentType == "D" && !Ext.os.is.Desktop ? 'visibility: hidden' : '';
            },
            setDeleteHidden: function () {
                var settings = TS.app.settings;
                return settings.fwaCanModify == 'N' || Ext.first('#attachFormFrame').isHidden() ? 'visibility: hidden' : '';
            }
        }
    ),

    listeners: {
        itemtap: function (t, index, target, record, e, eOpts) {
            var me = t,
                tappedItem = e.getTarget('div.x-button'),
                btnType,
                className;
            if (!tappedItem) return; // tapped image
            btnType = tappedItem.getAttribute('btnType');
            className = e.target.className;
            if (btnType == 'delete') {
                Ext.GlobalEvents.fireEvent('DeleteAttachment', record);
            } else if (btnType == 'enlarge') {
                if (record.get('attachmentType') == 'P') {
                    Ext.GlobalEvents.fireEvent('ViewEnlargedImage', record);
                }
                else if (record.get('attachmentType') == 'D' || record.get('attachmentType') == 'R') {
                    //turned off for now, no method for document view since so many types
                    Ext.GlobalEvents.fireEvent('ViewEnlargedDocument', record);
                }
            }
        }
    },

    itemSelector: 'div.thumb-wrap',
    emptyText: 'No attachments available',
    trackOver: true,
    alwaysOnTop: false,
    attachmentParams: null,

    store: {
        model: 'TS.model.shared.Attachment',
        autoLoad: false,
        proxy: {
            type: 'default',
            directFn: 'AttachmentData.GetAttachmentList',
            paramOrder: 'dbi|username|modelType|modelId|includeItem|attachmentType'
        }
    }
});