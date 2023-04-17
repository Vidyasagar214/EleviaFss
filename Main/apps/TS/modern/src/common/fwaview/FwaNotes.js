Ext.define('TS.common.fwaview.FwaNotes', {
    extend: 'Ext.Sheet',
    xtype: 'ts-fwanotes',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'panel',
            scrollable: false,
            layout: 'fit',
            items:[
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Notes'},
                    items: [
                        {
                            align: 'right',
                            text: 'Close',
                            //action: 'close'
                            handler: function(){
                                this.up('sheet').hide();
                            }
                        }
                    ]
                },
                {
                    xtype: 'list',
                    itemId: 'notesList',
                    reference: 'notesList',
                    scrollable: 'y',
                    disableSelection: true,
                    bind: {
                        store: '{fwa.notes}'
                    },

                    itemTpl: new Ext.XTemplate(
                        '<tpl if="canEdit">',
                        '<div style="margin-left: 15%;">',
                        '	<div class="message-name-mine">{[this.getEmployee(values)]}</div>',
                        '	<div class="notes mine">',
                        '		<div style="word-wrap: break-word">{contents}',
                        '       <p class="message-datetime"><div class="message-datetime">{[this.getModDate(values)]}</div></p>',
                        '   </div>',
                        '</div>',
                        '<tpl else>',
                        '<div style="margin-right: 15%;">',
                        '	<div class="message-name-other">{[this.getEmployee(values)]}</div>',
                        '	<div class="notes other">',
                        '		<div style="word-wrap: break-word">{contents}',
                        '       <p class="message-datetime"><div class="message-datetime">{[this.getModDate(values)]}</div></p>',
                        '   </div>',
                        '</div>',
                        '</tpl>',{
                            getEmployee: function(values){
                                var emp = Ext.getStore('Employees').getById(values.empId);
                                return emp.get('empName');
                            },
                            getModDate: function(values){
                                return Ext.Date.format(values.modDate, 'Y-m-d h:i A');
                            }
                        }
                    )
                }
            ]
        }
    ]

});