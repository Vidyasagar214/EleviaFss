// @Sencha
// User on responsive Forms to correctly space out child components
// Typically you would opt for spacer, but in cases where responsive design is desired,
// this simplified version is better choice
Ext.define('TS.common.FixedSpacer', {
    extend: 'Ext.Component',
    xtype: 'fixedspacer',
    width: 4,
    height: 4
});
