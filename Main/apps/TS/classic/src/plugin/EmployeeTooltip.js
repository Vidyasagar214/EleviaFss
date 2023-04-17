/*
 * Plugin that provides an employee information tooltip on various view component types
 */
Ext.define('TS.plugin.EmployeeTooltip', {
    extend: 'Ext.AbstractPlugin',

    alias: 'plugin.employeetooltip',

    pluginId: 'employeetooltip',

    tip: null,

    config: {
        itemSelector: null // If itemSelector is not passed through, attempts to use default/current view itemSelector
    },

    init: function (cmp) {
        // Initialize the plugin
        this.setCmp(cmp);
        if (!this.getItemSelector() && this.getCmp().getView) {
            this.setItemSelector(this.getCmp().getView().itemSelector);
        } else {
            //<debug>
            Ext.log('No itemSelector specified in plugin configuration and no DataView itemSelector available. Disabling EmployeeTooltip plugin.');
            //</debug>
            return;
        }
        var view = (this.getCmp().getView ? this.getCmp().getView() : this.getCmp());
        // Initialize tooltip on view render
        view.on('render', function () {
            this.tip = Ext.create('Ext.tip.ToolTip', {
                target: view.el,
                dismissDelay: 0,
                title: 'Employee Information',
                delegate: '.empId',// this.getItemSelector(),
                //trackMouse: true,
                //anchorToTarget: true,
                width: 400,
                renderTo: Ext.getBody(),
                listeners: {
                    beforeshow: function (tip) {
                        // Check the type of view and grab employee record
                        if (view.getRecord && view.getRecord(tip.triggerElement) && view.getRecord(tip.triggerElement).get('empId')) {
                            // DataView
                            var emp = Ext.getStore('Employees').getById(view.getRecord(tip.triggerElement).get('empId'));
                        } else {
                            // Other components
                            // TODO - Hook in a new source for the employee record for non-dataviews
                        }
                        // Update the tooltip
                        if (emp) {
                            var toolTipDataFn = this.getDataForTooltipTpl(tip, emp);
                            tip.update(this.ttTpl.apply(toolTipDataFn));
                        } else {
                            //<debug>
                            Ext.log('Failed to find employee record for use in tooltip.');
                            return false;
                            //</debug>
                        }
                    },
                    scope: this
                }
            });
        }, this, {
            single: true
        });
    },

    ttTpl: new Ext.XTemplate('<table>',
        '<tr><td><b>Title:</b></td><td colspan="3">{Title}</td></tr>',
        '<tr><td><b>Email Address:</b></td><td colspan="3">{EmailAddress}</td></tr>',
        '<tr><td><b>Office:</b></td><td>{OfficePhone}</td><td><b>Mobile:</b></td><td>{MobilePhone}</td></tr>',
        '<tr><td><b>City:</b></td><td>{City}</td><td><b>State:</b></td><td>{State}</td></tr>',
        '</table>'
    ),

    getDataForTooltipTpl: function (tip, employee) {
        var phoneNumbers = employee.get('phoneNumbers'),
            city = employee.get('city'),
            state = employee.get('state'),
            fax = '',
            mobile = '',
            office = '';
        for (var i = 0, l = phoneNumbers.length; i < l; i++) {
            if (phoneNumbers[i].phoneType == 'Fax') {
                fax = phoneNumbers[i].phoneNumber;
            }
            if (phoneNumbers[i].phoneType == 'Mobile') {
                mobile = phoneNumbers[i].phoneNumber;
            }
            if (phoneNumbers[i].phoneType == 'Office') {
                office = phoneNumbers[i].phoneNumber;
            }
        }
        return {
            Title: employee.get('title'),
            EmailAddress: employee.get('emailAddress'),
            FaxNumber: fax,
            MobilePhone: mobile,
            OfficePhone: office,
            City: city,
            State: state,
        }
    }
});
