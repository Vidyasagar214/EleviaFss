/**
 * Created by steve.tess on 5/16/2017.
 */
Ext.define('TS.view.fwa.SignatureList', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-signaturelist',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'panel',
            scrollable: false,
            layout: 'fit',
            items: [
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    reference: 'signatureListTitle',
                    cls: 'ts-navigation-header',
                    title: 'Signature List',
                    items: [
                        {
                            align: 'right',
                            text: 'Close',
                            handler: 'closeSheet'
                        }
                    ]
                },
                {
                    xtype: 'list',
                    itemId: 'signatureList',
                    reference: 'signatureList',
                    scrollable: 'y',
                    disableSelection: true,
                    bind: {
                        store: '{signaturelist}'
                    },
                    itemTpl: new Ext.XTemplate(
                        '<tpl>',
                        '<div  style="margin:4px;"><img src="{[this.getValue(values)]}" title="{name:htmlEncode}"  style="width:100%;height:auto;" /></div>',
                        '<div style="font-size:85%;">' +
                        '   <div style="float:left">{[this.getPostedBy(values)]}</div>',
                        '   <div style="float:right">{[this.getAttachDate(values)]}</div>',
                        '</div>',
                        '<div class="x-clear"></div>',
                        '<div style="white-space:nowrap;">&nbsp;</div>',
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
            ]
        }
    ]
});