Ext.define('TS.overrides.app.bind.Stub', {
    override: 'Ext.app.bind.Stub',
    compatibility: '6.0.2',

    afterAssociatedRecordSet: function(record, associated, role) {
        var children = this.children,
            key = role.role;

        if (children && key in children) {
            children[key].invalidate(true);
        }
    }
});