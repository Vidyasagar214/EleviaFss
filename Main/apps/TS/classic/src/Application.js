//Classic toolkit application differences
Ext.define('TS.Application', {
   extend: 'TS.BaseApplication',

   requires: [
       'Ext.data.identifier.Uuid',
       'Ext.state.CookieProvider',
       'Ext.state.Manager',
       'Ext.ux.layout.ResponsiveColumn'
   ],

   controllers: [
       // The load order of controllers matters for event handling in init methods
       'Error',
       'Direct',
       'Messenger',
       'User',
       'Settings',
       'Classic'
   ],

   // Global static stores only
   // None of these stores can require full authentication and autoLoad, as these will initialize before user auth
   stores: [
       'Holidays'
   ],

   //Define Main entry points for all 5 modules
   views: [
       'TS.view.crew.Main',
       'TS.view.fwa.Main',
       'TS.view.ts.Main',
       'TS.view.tsa.Main',
       'TS.view.fss.Main',
       'TS.view.exp.Main',
       'TS.view.history.Main',
       'TS.view.exa.Main',
       'TS.view.utilities.Main'
   ],

   launch: function() {
       //used to save state of FWA List grid
       Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
           expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), //30 days
       }));
       // Ext.ux.layout.ResponsiveColumn.states = {
       //     small: 1023,
       //     large: 0
       // };

       this.callParent();
   }

});