/**
 * Created by steve.tess on 7/18/2018.
 */
Ext.define('TS.view.exp.Attachments', {
    extend: 'Ext.view.View',

    xtype: 'exp-attachments',

    controller: 'exp-attachments',

    scrollable: true,

    tpl: new Ext.XTemplate(
        '<tpl exec="values.parent = this;" for=".">',
        '<div class="thumb-wrap" data-attid="{attachmentId}" style="overflow:hidden;width:20%;text-align:center;float:left;margin-left:5px;margin-top:5px; height:175px">',
        '<div class="thumb" style="margin:4px;"><img src="{[this.getValue(values)]}" title="{name:htmlEncode}"  style="width:100%;height:auto;" /></div>',
        // '<div style="font-size:85%;">{[this.getAttachDate(values)]}</div>',
        '<div style="font-size:85%;word-wrap: break-word;">{[this.setFileName(values)]}</div>',
        '<div style="white-space:nowrap;">',
        //TODO Fix using iconCls
        '<input type="image" style="margin-left:5px;{[this.setHidden(values)]}"  src="./classic/resources/icons/zoom_in.png" title="View enlarged attachment" class="button-enlarge" alt="V" />',
        '<input type="image" style="margin-right:5px;{[this.setDeleteHidden(values)]}" src="./classic/resources/icons/delete.png" title="Delete attachment" class="button-delete" alt="D" />',
        '</div>',
        '</div>',
        '</tpl>',
        '<div class="x-clear"></div>',
        {
            setFileName: function (values) {
                //limit length of filename so it will not wrap
                if (values.filename.length > 15)
                    return values.filename.substring(0, 15) + '...';
                else if (values.filename.indexOf('.') > -1)
                    return values.filename; // + '.'+ values.extension;
                else return values.filename + '.' + values.extension;
            },
            getValue: function (values) {
                if (values.attachmentType == "P") {
                    if (values.attachmentItem) {
                        //console.log('data:image/' + values.extension + ';base64,' + (values.attachmentItem));
                        return 'data:image/' + values.extension + ';base64,' + (values.attachmentItem);
                    } else {
                        return TS.data.IconsSelector['PHOTO'];
                    }
                } else if (values.attachmentType == "D" || values.attachmentType == "R") {
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
            setDeleteHidden: function (values) {
                return Ext.first('#attachFormFrame').isHidden() ? 'visibility: hidden' : '';
            }
        }
    ),

    listeners: {
        itemclick: function (me, record, item, index, e, eOpts) {
            var className = e.target.className;
            if ("button-delete" == className) {
                Ext.GlobalEvents.fireEvent('ExpDeleteAttachment', record);
            } else if ("button-enlarge" == className) {
                if (record.get('attachmentType') == 'P') {
                    Ext.GlobalEvents.fireEvent('ExpViewEnlargedImage', record);
                } else if (record.get('attachmentType') == 'D' || record.get('attachmentType') == 'R') {
                    Ext.GlobalEvents.fireEvent('ExpViewEnlargedDocument', record);
                }
            }
        }
    },

    itemSelector: 'div.thumb-wrap',
    emptyText: 'No attachments available',
    trackOver: true,
    alwaysOnTop: false,
    config: {
        attachmentParams: null
    },

    initComponent: function () {

        Ext.apply(this, {
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

        this.callParent(arguments);
    }
});