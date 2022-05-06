const AccessControl = require('role-acl')

const ac = new AccessControl()

ac.grant('worker').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('read').on('worker', ['*', '!password', '!passwordSalt'])
ac.grant('worker').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('create').on('worker')
ac.grant('worker').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('update').on('worker', ['about', 'password', 'avatarURL'])

ac.grant('admin').execute('read').on('workers')
ac.grant('admin').execute('read').on('worker')
ac.grant('admin').execute('create').on('worker')
ac.grant('admin').execute('update').on('worker')
ac.grant('admin').execute('delete').on('worker')

exports.readWorker = (requester, id) => ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('worker')

exports.readWorkerAll = (requester) => ac.can(requester.role).execute('read').sync().on('workers')

exports.createWorker = (requester) => ac.can(requester.role).execute('create').sync().on('workers')

// updateWorker
exports.updateWorker = (requester, id) => ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('worker')

// deleteUser
exports.deleteWorker = (requester, id) => ac.can(requester.role).execute('delete').sync().on('worker')
