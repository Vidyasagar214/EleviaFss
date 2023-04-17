// Custom component query selectors
Ext.ComponentQuery.pseudos.last = function (items) {
    return items[items.length - 1];
};
Ext.ComponentQuery.pseudos.first = function (items) {
    return items[0];
};
