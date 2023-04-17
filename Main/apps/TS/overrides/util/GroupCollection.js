// // EXTJS-16685
// // Grouped grid does not respect store.insert(index)
// Ext.define('TS.overrides.util.GroupCollection', {
//     override: 'Ext.util.GroupCollection',
//    
//     onCollectionAdd: function (source, details) {
//         this.addItemsToGroups(source, details.items, details.at);
//     },
//    
//     addItemsToGroups: function (source, items, at) {
//         this.groupItems(source, items, true, at);
//     },
//
//     groupItems: function (source, items, adding, at) {
//         var me = this,
//             byGroup = {},
//             entries = [],
//             grouper = source.getGrouper(),
//             groupKeys = me.itemGroupKeys,
//             sourceStartIndex, entry, group, groupKey, i, item, itemKey, len, newGroups;
//
//         for (i = 0, len = items.length; i < len; ++i) {
//             groupKey = grouper.getGroupString(item = items[i]);
//             itemKey = source.getKey(item);
//
//             if (adding) {
//                 (groupKeys || (me.itemGroupKeys = groupKeys = {}))[itemKey] = groupKey;
//             } else if (groupKeys) {
//                 delete groupKeys[itemKey];
//             }
//
//             if (!(entry = byGroup[groupKey])) {
//                 if (!(group = me.getByKey(groupKey)) && adding) {
//                     (newGroups || (newGroups = [])).push(group = me.createGroup(source, groupKey));
//                 }
//
//                 entries.push(byGroup[groupKey] = entry = {
//                     group: group,
//                     items: []
//                 });
//             }
//
//             entry.items.push(item);
//         }
//
//         if (adding && me.length > 1 && at) {
//             sourceStartIndex = source.indexOf(entries[0].group.getAt(0));
//             at = Math.max(at - sourceStartIndex, 0);
//         }
//
//         for (i = 0, len = entries.length; i < len; ++i) {
//             entry = entries[i];
//             entry.group.insert(at != null ? at : group.items.length, entry.items);
//         }
//
//         if (newGroups) {
//             me.add(newGroups);
//         }
//
//         return entries;
//     }
// });