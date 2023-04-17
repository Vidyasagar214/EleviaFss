/**
 * Created by steve.tess on 4/25/2017.
 */
Ext.define('TS.view.fwa.FwaPost', {
    extend: 'Ext.panel.Panel',

    xtype: 'fwaPostNote',
    bodyPadding: 10,
    width: 300,
    height: 400,
    scrollable: true,
    border: 0,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
        '<tpl if="canEdit">',
        '<div style="margin-left: 15%;">',
        '	<div class="message-name-mine">{[this.getEmployee(values)]}</div>',
        '	<div class="notes mine">',
        '		<div class="message">{[this.getContents(values)]}',
        '        <p class="message-datetime">{[this.getModDate(values)]}</p>',
        '       </div>',
        '   </div>',
        '</div>',
        '<tpl else>',
        '<div style="margin-right: 15%;">',
        '	<div class="message-name-other">{[this.getEmployee(values)]}</div>',
        '	<div class="notes other">',
        '		<div class="message">{[this.getContents(values)]}',
        '       <p class="message-datetime">{[this.getModDate(values)]}</p>',
        '       </div>',
        '	</div>',
        '</div>',
        '</tpl>',
        '</tpl>', {
            getEmployee: function(values){
                var emp = Ext.getStore('AllEmployees').getById(values.empId);
                return emp.get('empName') ? emp.get('empName') : 'N/A';
            },

            getModDate: function(values){
                return Ext.Date.format(values.modDate, 'Y-m-d h:i A');
            },

            getContents: function (values) {
                return values.contents;
            }
        })
});