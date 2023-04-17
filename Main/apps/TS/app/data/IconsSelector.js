/**
 Icons Selector
 Every key refers to an icon file
 in the app resources
 */
//TODO refactor so it will return just icon name
//In usage places (Attachments) use iconCls rather than direct patch with image
Ext.define('TS.data.IconsSelector', {
    singleton: true,

    constructor: function () {
        var resFolder = !MobileApp ? './classic/resources/icons/' : './modern/resources/icons/',
            ext = '.png',
            cfg = {
                Fallback: resFolder + 'page_white_text' + ext,
                PHOTO: resFolder + 'photo' + ext,
                RTF: resFolder + 'text-document-file-icone-9088-96' + ext,
                PPT: resFolder + 'powerpoint-icone-4723-96' + ext,
                PDF: resFolder + 'adobe-acrobat-icone-6284-96' + ext,

                XLSX: resFolder + 'microsoft-office-excel-icone-6690-96' + ext,
                XLS: resFolder + 'microsoft-office-excel-icone-6690-96' + ext,
                XML: resFolder + 'microsoft-office-excel-icone-6690-96' + ext,
                XLA: resFolder + 'microsoft-office-excel-icone-6690-96' + ext,

                CLASS: resFolder + 'page_white_cup' + ext,
                SWF: resFolder + 'page_white_flash' + ext,
                PHP: resFolder + 'page_white_php' + ext,
                RBW: resFolder + 'page_white_ruby' + ext,
                TXT: resFolder + 'text-document-file-icone-9088-96' + ext,
                DOC: resFolder + 'microsoft-office-word-icone-9865-96' + ext,
                DOCX: resFolder + 'microsoft-office-word-icone-9865-96' + ext,
                ZIP: resFolder + 'page_white_zip' + ext
            };

        Ext.apply(this, cfg);
    }
});