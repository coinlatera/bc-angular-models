angular.module('bc.admin-role', []).service "AdminRole", ->
  class AdminRole
    constructor: (@roleValue) ->
      if @roleValue >= (Model.MaxRoleValue << 1)
        @roleValue = 0

      @displayRole = ->
        if @roleValue is Model.Roles.RestrictedUserRole
          'Restricted User'
        else if @roleValue is Model.Roles.StandardUserRole
          'Standard User'
        else if @roleValue is Model.Roles.AdminUserRole
          'Admin User'
        else if @roleValue is Model.Roles.SuperUserRole
          'Super User'
        else
          'Unknown Role'


  Model =
    Roles:
      InvalidUserRole    : 0
      RestrictedUserRole : 1 << 0
      StandardUserRole   : 1 << 1
      AdminUserRole      : 1 << 2
      SuperUserRole      : 1 << 3

    FromRoleValue: (roleValue) ->
      new AdminRole(roleValue)

  Model.MaxRoleValue = Model.Roles.SuperUserRole

  Model

