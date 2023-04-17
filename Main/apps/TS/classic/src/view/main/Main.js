Ext.define('TS.view.main.Main', {
    extend: 'Ext.container.Viewport',


    controller: 'main',
    viewModel: 'main',
    mixins: [
        'Ext.mixin.Responsive'
    ],

    responsiveFormulas: {
        //Ipad portrait nd smaller screens
        small: 'width < 1024',
        //Ipad landscape and any bigger screens
        normal: 'width >= 1024'
    },

    //cls: 'mainPage'
});
//