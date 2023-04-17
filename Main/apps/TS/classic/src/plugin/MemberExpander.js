Ext.define('TS.plugin.MemberExpander', {

    extend: 'Ext.grid.plugin.RowExpander',

    alias: 'plugin.memberexpander',

    selectRowOnExpand: true,

    expandOnEnter: false,

    config: {
        readOnlyMembers: false
    },

    constructor: function (config) {

        var tv = Ext.view.Table.prototype,
            itemCls = tv.itemCls,
            viewCls = tv.baseCls;

        Ext.apply(this, {
            rowBodyTpl: new Ext.XTemplate(
                '<div data-crewid="{crewId}" class="crewmembergrid">',
                '<div class="' + viewCls + '">',
                '<div class="x-grid-item-container">',
                '<tpl for="crewMembers">',
                '{[this.member(values)]}',
                '</tpl>',
                '</div>',
                '</div>',
                '</div>',
                {
                    member: function (v) {
                        var crewRoleId = v.get('crewMemberRoleId');
                        var employee = Ext.getStore('Employees').getById(v.get('empId'));
                        var member = (employee ? (employee.get('lname') + ', ' + employee.get('fname')) : 'Unknown (' + v.get('empId') + ')');

                        return '<table data-empid="' + v.get('empId') + '" class="memberitem ' + itemCls + '"><tbody>' +
                            '<tr class="x-grid-row">' +
                            '<td class="memberfirstcell x-grid-cell">' +
                            '<div class="x-grid-cell-inner">' +
                            member +
                            '</div>' +
                            '</td>' +
                            '<td class="x-grid-cell">' +
                            '<div class="x-grid-cell-inner x-grid-cell-combobox-wrap" data-crewroleid="' + crewRoleId + '">' +
                            '</div>' +
                            '</td>' +
                            '<td class="memberlastcell x-grid-cell">' +
                            '<div class="x-grid-cell-inner">' +
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</tbody></table>';
                    }
                })
        });

        this.callParent(arguments);

        this.getCmp().on('render', function () {
            this.getCmp().getView().on('expandbody', this.renderExpanderGrid, this);
            //this.getCmp().getView().on('viewready', this.renderExpanderGrid, this);
            this.getCmp().getView().on('collapsebody', this.cleanExpanderGrid, this);
            this.getCmp().getView().on('itemupdate', function (r, i, n) {
                this.renderExpanderGrid(n, r, n);
            }, this);
        }, this, {
            single: true
        });


    },

    collapseRow: function (rowIdx) {
        var rowNode = this.view.getNode(rowIdx),
            row = Ext.get(rowNode);
        if (row) {
            var nextBd = Ext.get(row).down(this.rowBodyTrSelector),
                record = this.view.getRecord(rowNode),
                grid = this.getCmp();
            if (!row.hasCls(this.rowCollapsedCls)) {
                row.addCls(this.rowCollapsedCls);
                nextBd.addCls(this.rowBodyHiddenCls);
                this.recordsExpanded[record.internalId] = false;
                this.view.fireEvent('collapsebody', rowNode, record, nextBd.dom);
            }
        }
    },

    renderExpanderGrid: function (rowNode, record, expandRow) {
        this.cleanExpanderGrid(rowNode, record, expandRow);
        var wrapEls = Ext.get(expandRow).select('.x-grid-cell-combobox-wrap');
        wrapEls.each(function (el) {
            var crewRoleId = el.getAttribute('data-crewroleid');
            Ext.create('TS.common.field.CrewRole', {
                allowBlank: false,
                renderTo: el,
                value: crewRoleId,
                forceSelection: true,
                disabled: this.getReadOnlyMembers(),
                bind: {
                    disabled: '{settings.schedReadOnly}'
                },
                listeners: {
                    select: function (combo) {
                        this.onCrewRoleSelect(combo, record, rowNode, expandRow);
                    },
                    scope: this
                }
            });
        }, this);
    },

    cleanExpanderGrid: function (rowNode, record, expandRow) {
        Ext.get(expandRow).select('.x-field').each(function (field) {
            Ext.getCmp(field.dom.id).destroy();
        });
    },

    onCrewRoleSelect: function (combo, record, rowNode, expandRow) {
        var empId = combo.getEl().up('.memberitem').getAttribute('data-empid');
        var crewMemberRecord = record.get('crewMembers').getById(empId);
        crewMemberRecord.set('crewMemberRoleId', combo.getValue());
        this.getCmp().fireEvent('roleedit', record, rowNode, expandRow);
    }
});
