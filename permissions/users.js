const AccessControl = require('role-acl')

const ac = new AccessControl()

ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('read').on('user', ['*', '!password', '!passwordSalt', '!workerid'])
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('update').on('user', ['firstname', 'lastname', 'about', 'password', 'email', 'avatarURL', '!workerid'])

// ac.grant('admin').extend('user')
ac.grant('admin').execute('read').on('user')
ac.grant('admin').execute('read').on('users')
ac.grant('admin').execute('create').on('user')
ac.grant('admin').execute('update').on('user')
ac.grant('admin').condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('user')
ac.grant('admin').execute('update').on('dogs')

ac.grant('worker').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('read').on('user', ['*', '!password', '!passwordSalt'])
ac.grant('worker').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('update').on('user', ['about', 'password', 'avatarURL'])

exports.readUser = (requester, id) => ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('user')

exports.readUserAll = (requester) => ac.can(requester.role).execute('read').sync().on('users')

// updateUser
exports.updateUser = (requester, id) => ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('user')

// deleteUser
exports.deleteUser = (requester, id) => ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('user')
