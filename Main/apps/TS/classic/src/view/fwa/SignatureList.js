/**
 * Created by steve.tess on 5/15/2017.
 */
Ext.define('TS.view.fwa.SignatureList', {
    extend: 'Ext.window.Window',

    xtype: 'window-signaturelist',

    requires: [
        'TS.controller.fwa.SignatureListController'
    ],

    controller: 'window-signaturelist',

    plugins: {
        ptype: 'responsive'
    },
    responsiveConfig: {
        normal: {
            width: 450,
            height: 400
        },
        small: {
            width: 275,
            height: 275
        }
    },

    title: 'Signature List',
    layout: 'fit',
    items: [
        {
            xtype: 'panel',
            reference: 'signatureTemplate',
            scrollable: true,
            bodyPadding: 10,
            border: 0,
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div  style="margin:4px;"><img src="{[this.getValue(values)]}" title="{name:htmlEncode}"  style="width:100%;height:auto;" /></div>',
                '<div style="font-size:85%;">' +
                    '<div style="float:left">{[this.getPostedBy(values)]}</div>',
                    '<div style="float:right">{[this.getAttachDate(values)]}</div>',
                '</div>',
                '<div class="x-clear"></div>',
                '<div style="white-space:nowrap;"></div>',
                '<hr>',
                '</tpl>',
                {
                    getValue: function (values) {
                        if (values.attachmentItem) {
                            return values.attachmentItem;
                        } else {
                            return TS.data.IconsSelector['TEXT'];
                        }
                    },
                    getAttachDate: function (values) {
                        return Ext.Date.format(new Date(values.dateAttached), 'Y-m-d h:i A');
                    },
                    getPostedBy: function (values) {
                        var emp = Ext.getStore('AllEmployees').getById(values.attachedByEmpId);
                        return emp? emp.get('empName') : '';
                    }
                }
            )
        }
    ],
    buttons: [
        {
            text: 'Close',
            handler: 'doCloseWindow',
            align: 'right'
        }
    ]
});