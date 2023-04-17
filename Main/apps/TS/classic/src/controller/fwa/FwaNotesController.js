Ext.define('TS.controller.fwa.FwaNotesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.window-fwanotes',

    init: function () {
    },

    deleteNote: function (grid, rowIndex) {
        var form = Ext.first('#fwaForm').getForm(),
            store = grid.store,
            settings = TS.app.settings,
            record = store.getAt(rowIndex);
        form.dirty = true;
        store.remove(record);
        form.getRecord().set('notes', grid);
    },

    newNote: function () {
        var me = this,
            fwa = me.getView().fwa,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            form = Ext.first('#fwaForm').getForm(),
            message = Ext.first('#textAreaMessage').getValue(),
            data = Ext.first('#fwanotes').getData(),
            empStore = Ext.getStore('AllEmployees'),
            emp = empStore.getById(settings.empId),
            fwanotes = Ext.first('#fwanotes'),
            arr = [],
            placeholderRec;
        //add new message
        data.push({
            empId: settings.empId,
            contents: message,
            createDate: new Date(),
            modDate: new Date(),
            modUser: settings.usernameDisplay,
            createUser: settings.usernameDisplay,
            canEdit: true,
            formattedDateEmployee: 'Me',// Ext.Date.format(new Date(), 'D, M d, Y h:i A') + '   ' + emp.get('empName'),
            order: 0
        });
       //reload fwa notes
        Ext.each(data, function(note){
            placeholderRec = Ext.create('TS.model.fwa.FwaNote', {
                empId: note.empId,
                contents: note.contents,
                createDate: note.createDate,
                modDate: note.modDate,
                modUser: note.modUser,
                createUser: note.createUser,
                canEdit: note.canEdit,
                formattedDateEmployee: note.formattedDateEmployee
            });
            arr.push(placeholderRec);
        });
        //reload fwa notes
        fwa.set('notes', arr);
        //refresh tpl data
        Ext.first('#fwanotes').setData(data);
        //clear message field
        Ext.first('#textAreaMessage').setValue();
        //scroll to new entry
        fwanotes.getTargetEl().scroll('b', 100000, true);
        form.dirty = true;
    },

    doSaveNotes: function () {
        var me = this,
            vw = me.getView(),
            record = vw.fwaRecord,
            notes = record.get('notes'),
            grid = vw.lookup('fwanotes'),
            empStore = Ext.getStore('AllEmployees'),
            emp,
            store,
            data,
            notesData = [];

        //complete any edit first else will not see any new text if button clicked without tabbing
        grid.getPlugins()[0].completeEdit();
        //get store and data
        store = grid.getStore();
        data = store.getRange();
        //load notes
        Ext.each(data, function (obj) {
            emp = empStore.getById(obj.get('empId'));
            notesData.push({
                seq: obj.get('seq'),
                empId: obj.get('empId'),
                contents: obj.get('contents'),
                createDate: obj.get('createDate'),
                modDate: obj.get('modDate'),
                modUser: obj.get('modUser'),
                canEdit: obj.get('canEdit'),
                formattedDateEmployee: 'Me'// Ext.Date.format(new Date(obj.get('modDate')), 'D, M d, Y h:i A') + '   ' + emp.get('empName')
            });
        });
        //grid.getView().refresh();
        //load record
        record.set('notes', notesData);
        //store.reload();
        vw.close();
    },

    doCancelNotes: function () {
        this.getView().close();
    },

    onTextAreaChange: function (t, n, o) {
        if (n) {
            Ext.first('#postNoteButton').setDisabled(false);
        } else {
            Ext.first('#postNoteButton').setDisabled(true)
        }
    },

    closeWindow: function(t){
        this.getView().close();
    }

});