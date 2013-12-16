angular.module('bc.admin-role', []).service "AdminRole", ->
  class AdminRole
    constructor: (@value = adminRole.Roles.InvalidUserRole) ->
      if @value >= (adminRole.MaxRoleValue << 1)
        @value = 0

      @displayRole = if @value is adminRole.Roles.InvalidUserRole
          'Invalid Role'
        else if @value is adminRole.Roles.RestrictedUserRole
          'Restricted User'
        else if @value is adminRole.Roles.StandardUserRole
          'Standard User'
        else if @value is adminRole.Roles.AdminUserRole
          'Admin User'
        else if @value is adminRole.Roles.SuperUserRole
          'Super User'
        else
          'Unknown Role'

  # ADMIN USER ROLES
  # Admin user roles are attributed to an admin user. They define a category of
  # users who can only access the resources that are allowed to their role.
  # A basic role is a number with all its bit to 0 except for one. The position
  # of the bit defines the role.
  #
  # We can define roles that are made of of serveral roles. To do that
  # we merge the roles using the OR binary operator "|".
  adminRole =
    Roles:
      InvalidUserRole    : 0
      RestrictedUserRole : 1 << 0
      StandardUserRole   : 1 << 1
      AdminUserRole      : 1 << 2
      SuperUserRole      : 1 << 3

    FromRoleValue: (roleValue) ->
      new AdminRole(roleValue)

  adminRole.MaxRoleValue = adminRole.Roles.SuperUserRole
  adminRole.InvalidRole = adminRole.FromRoleValue(adminRole.Roles.InvalidUserRole)

  adminRole

