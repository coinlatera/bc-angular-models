angular.module('bc.admin-role', []).service "AdminRole", ->
  class AdminRole
    constructor: (@value = adminRole.RoleValues.InvalidUserRoleValue) ->
      @value = Number(@value)
      if @value >= (adminRole.MaxRoleValue << 1)
        @value = 0

      @displayRole = adminRole.RoleValueToDisplayRoleMap[@value] or 'Unknown Role'

  # ADMIN USER ROLES
  # Admin user roles are attributed to an admin user. They define a category of
  # users who can only access the resources that are allowed to their role.
  # A basic role is a number with all its bit to 0 except for one. The position
  # of the bit defines the role.
  #
  # We can define roles that are made of of serveral roles. To do that
  # we merge the roles using the OR binary operator "|".
  adminRole =
    RoleValues:
      InvalidUserRoleValue    : 0
      RestrictedUserRoleValue : 1 << 0
      StandardUserRoleValue   : 1 << 1
      AdminUserRoleValue      : 1 << 2
      SuperUserRoleValue      : 1 << 3

    FromRoleValue: (roleValue) ->
      new AdminRole(roleValue)

    FromDisplayRole: (displayRole) ->
      adminRole.DisplayRoleToRoleValueMap[displayRole] or adminRole.RoleValues.InvalidUserRoleValue

  adminRole.MaxRoleValue = adminRole.RoleValues.SuperUserRoleValue

  adminRole.RoleValueToDisplayRoleMap = {}
  adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.InvalidUserRoleValue] = 'Invalid Role'
  adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.RestrictedUserRoleValue] = 'Restricted User'
  adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.StandardUserRoleValue] = 'Standard User'
  adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.AdminUserRoleValue] = 'Admin User'
  adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.SuperUserRoleValue] = 'Super User'

  adminRole.DisplayRoleToRoleValueMap = {}
  angular.forEach adminRole.RoleValueToDisplayRoleMap, (displayRole, roleValue) ->
    this[displayRole] = roleValue
  , adminRole.DisplayRoleToRoleValueMap

  adminRole.Roles =
    InvalidUserRole    : adminRole.FromRoleValue(adminRole.RoleValues.InvalidUserRoleValue)
    RestrictedUserRole : adminRole.FromRoleValue(adminRole.RoleValues.RestrictedUserRoleValue)
    StandardUserRole   : adminRole.FromRoleValue(adminRole.RoleValues.StandardUserRoleValue)
    AdminUserRole      : adminRole.FromRoleValue(adminRole.RoleValues.AdminUserRoleValue)
    SuperUserRole      : adminRole.FromRoleValue(adminRole.RoleValues.SuperUserRoleValue)


  adminRole

