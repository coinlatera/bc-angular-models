angular.module('bc.user-account-settings', []).service "UserAccountSettings", ->
  class SecuritySettings
    constructor: (@fiatWithdrawalConfirmation = true, @btcWithdrawalConfirmation = true) ->

    @FromMessage: (msg) ->
      new SecuritySettings(msg?.fiatWithdrawalConfirmation, msg?.btcWithdrawalConfirmation)

  class NotificationsSettings
    constructor: (@fiatDepositComplete = true, @btcDepositComplete = true, @pendingOrderComplete = true, @bankAccountAdded = true, @fundsWithdrawn = true) ->

    @FromMessage: (msg) ->
      new NotificationsSettings(msg?.fiatDepositComplete, msg?.btcDepositComplete, msg?.pendingOrderComplete, msg?.bankAccountAdded, msg?.fundsWithdrawn)

  class ContactSettings
    constructor: (@newsletters = false, @promotions = false) ->

    @FromMessage: (msg) ->
      new ContactSettings(msg?.newsletters, msg?.promotions)

  class UserAccountSettings
    constructor: (@security = {}, @notifications = {}, @contact = {}) ->

  FromMessage: (msg) ->
    securitySettings = SecuritySettings.FromMessage(msg?.security)
    notificationsSettings = NotificationsSettings.FromMessage(msg?.notifications)
    contactSettings = ContactSettings.FromMessage(msg?.contact)
    new UserAccountSettings(securitySettings, notificationsSettings, contactSettings)

