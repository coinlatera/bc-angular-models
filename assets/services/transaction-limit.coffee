angular.module('bc.transaction-limit', []).service 'TransactionLimit', ->
  class TransactionLimit
    constructor: (@amount = '', @currency = '', @time = '', @timeUnit = '', @userStatus = '') ->

  FromMessage: (msg) ->
    new TransactionLimit(msg.amount, msg.currency, msg.time, msg.timeUnit, msg.userStatus)
