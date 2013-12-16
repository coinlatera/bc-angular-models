angular.module('bc.access-level', ['bc.admin-role']).service "AccessLevel", ['AdminRole', (AdminRole) ->
  class AccessLevel
    constructor: (@value = accessLevel.AccessLevel.InvalidAccessLevel) ->
      @displayAccessLevel = if @value is accessLevel.AccessLevels.InvalidAccessLevel
          'Invalid Access Level'
        else if @value is accessLevel.AccessLevels.RestrictedOnly
          'Restricted Only'
        else if @value is accessLevel.AccessLevels.StandardOnly
          'Standard Only'
        else if @value is accessLevel.AccessLevels.AdminOnly
          'Admin Only'
        else if @value is accessLevel.AccessLevels.SuperOnly
          'Super Only'
        else if @value is accessLevel.AccessLevels.SuperOrAbove
          'Super or Above'
        else if @value is accessLevel.AccessLevels.AdminOrAbove
          'Admin or Above'
        else if @value is accessLevel.AccessLevels.StandardOrAbove
          'Standard or Above'
        else if @value is accessLevel.AccessLevels.Unrestricted
          'Unrestricted'
        else
          'Unknown Access Level'

      @allowedRole = (role) ->
        @value & role.value

      @displayAllowedRoles = ->
        roles = []
        angular.forEach AdminRole.Roles, (roleValue) =>
          role = AdminRole.FromRoleValue(roleValue)
          if @allowedRole(role)
            roles.push role.displayRole
        if roles.length is 0 then "None" else roles.join(', ')

  # ACCESS LEVELS
  # Access levels are attributed to resources. They are defined by a list of
  # roles that are allowed to access to this resource.
  #
  # To create a list of roles, we use the OR binary operator "|". Access level
  # can be combined together (or with other roles) using the OR operator as well.
  accessLevel =
    AccessLevels:
      InvalidAccessLevel   : AdminRole.Roles.InvalidUserRole
      RestrictedOnly       : AdminRole.Roles.RestrictedUserRole
      StandardOnly         : AdminRole.Roles.StandardUserRole
      AdminOnly            : AdminRole.Roles.AdminUserRole
      SuperOnly            : AdminRole.Roles.SuperUserRole

    FromAccessLevelValue: (accessLevelValue) ->
      new AccessLevel(accessLevelValue)

  accessLevel.AccessLevels.SuperOrAbove        = accessLevel.AccessLevels.SuperOnly
  accessLevel.AccessLevels.AdminOrAbove        = accessLevel.AccessLevels.SuperOrAbove | accessLevel.AccessLevels.AdminOnly
  accessLevel.AccessLevels.StandardOrAbove     = accessLevel.AccessLevels.AdminOrAbove | accessLevel.AccessLevels.StandardOnly
  accessLevel.AccessLevels.Unrestricted        = accessLevel.AccessLevels.StandardOrAbove | accessLevel.AccessLevels.RestrictedOnly

  accessLevel
]
