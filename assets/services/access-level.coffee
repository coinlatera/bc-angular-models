angular.module('bc.access-level', ['bc.admin-role']).service "AccessLevel", ['AdminRole', (AdminRole) ->
  class AccessLevel
    constructor: (@value) ->

      @displayAccessLevel = ->
        if @value is accessLevel.AccessLevels.RestrictedOnly
          'Restricted Only'
        else if @value is accessLevel.AccessLevels.StandardOnly
          'Standard Only'
        else if @value is accessLevel.AccessLevels.AdminOnly
          'Admin Only'
        else if @value is accessLevel.AccessLevels.SuperOnly
          'Super Only'
        else if @value is accessLevel.AccessLevels.Super
          'Super'
        else if @value is accessLevel.AccessLevels.Admin
          'Admin'
        else if @value is accessLevel.AccessLevels.Standard
          'Standard'
        else if @value is accessLevel.AccessLevels.Restricted
          'Restricted'
        else
          'Unknown Access Level'

      @allowedRole = (role) ->
        @value & role.value

      @displayAllowedRoles = ->
        roles = []
        angular.forEach AdminRole.Roles, (roleValue) =>
          role = AdminRole.FromRoleValue(roleValue)
          if @allowedRole(role)
            roles.push role.displayRole()
        roles.join(', ')

  # ACCESS LEVELS
  # Access levels are attributed to resources. They are defined by a list of
  # roles that are allowed to access to this resource.
  #
  # To create a list of roles, we use the OR binary operator "|". Access level
  # can be combined together (or with other roles) using the OR operator as well.
  accessLevel =
    AccessLevels:
      RestrictedOnly    : AdminRole.Roles.RestrictedUserRole
      StandardOnly      : AdminRole.Roles.StandardUserRole
      AdminOnly         : AdminRole.Roles.AdminUserRole
      SuperOnly         : AdminRole.Roles.SuperUserRole

    FromAccessLevelValue: (accessLevelValue) ->
      new AccessLevel(accessLevelValue)

  accessLevel.AccessLevels.Super        = accessLevel.AccessLevels.SuperOnly
  accessLevel.AccessLevels.Admin        = accessLevel.AccessLevels.Super | accessLevel.AccessLevels.AdminOnly
  accessLevel.AccessLevels.Standard     = accessLevel.AccessLevels.Admin | accessLevel.AccessLevels.StandardOnly
  accessLevel.AccessLevels.Restricted   = accessLevel.AccessLevels.Standard | accessLevel.AccessLevels.RestrictedOnly

  accessLevel
]
