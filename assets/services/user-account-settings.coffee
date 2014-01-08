angular.module('bc.user-account-settings', []).service "UserAccountSettings", ->
  class SecuritySettings
    constructor: (@fiatWithdrawalConfirmation = true, @btcWithdrawalConfirmation = true) ->

    @FromMessage: (msg) ->
      new SecuritySettings(msg?.fiatWithdrawalConfirmation, msg?.btcWithdrawalConfirmation)

  class NotificationsSettings
    constructor: (@fiatDepositComplete = true, @btcDepositComplete = true, @bankAccountAdded = true, @fundsWithdrawn = true) ->

    @FromMessage: (msg) ->
      new NotificationsSettings(msg?.fiatDepositComplete, msg?.btcDepositComplete, msg?.bankAccountAdded, msg?.fundsWithdrawn)

  class UserAccountSettings
    constructor: (@security = {}, @notifications = {}) ->

  FromMessage: (msg) ->
    securitySettings = SecuritySettings.FromMessage(msg?.security)
    notificationsSettings = NotificationsSettings.FromMessage(msg?.notifications)
    new UserAccountSettings(securitySettings, notificationsSettings)

