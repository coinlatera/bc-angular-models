angular.module('bc.admin-account-info', ['bc.admin-role']).service "AdminAccountInfo", ['AdminRole', (AdminRole) ->
  class AdminName
    constructor: (@givenName = '', @familyName = '') ->

  class AdminAccountInfo
    constructor: (@_id = '', @displayName = '', @email = '', @role, @name) ->

  FromMessage: (msg) ->
    adminRole = AdminRole.FromRoleValue msg?.role
    adminName = new AdminName msg?.name?.givenName, msg?.name?.familyName
    new AdminAccountInfo(msg?._id, msg?.displayName, msg?.email, adminRole, adminName)
]

