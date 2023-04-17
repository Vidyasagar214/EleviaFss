/**
 * Created by steve.tess on 8/24/2015.
 */
Ext.define('TS.view.ts.FwaWindow', {
    extend: 'Ext.window.Window',

    xtype: 'fwawindow',
    controller: 'window-fwawindow',
    scrollable: true,

    plugins: {
        ptype:'responsive'
    },
    responsiveConfig: {
        normal: {
            width: 1150,
            height: 550
        },
        small: {
            width: 300,
            height: 280
        }
    },

    items: [{
        xtype: 'form-fwa',
        reference: 'myFwa',
        isPopup: true,
        isFromTS: true
    }
    ],

   buttons:[
       '->',
       {
           text: 'Open',
           handler: 'doOpenFwa',
           reference: 'doOpenFwaButton',
           tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Open {0}'},
           bind:{
               hidden: '{!canWindowFwaCopyOpen}'
           }
       },
       {
           text: 'Copy',
           handler: 'doCopyFwa',
           tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Copy {0}'},
           bind:{
               hidden: '{!canWindowFwaCopyOpen}'
           },
           reference: 'doCopyFwaButton'
       },
       {
           text: 'Close',
           handler: 'doClose',
           reference: 'doCloseButton'
       }
   ]
});