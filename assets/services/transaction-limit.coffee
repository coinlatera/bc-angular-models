angular.modules('bc.transaction-limit', []).service 'TransactionLimit', ->
  class TransactionLimit
    constructor: (@amount = '', @currency = '', @time = '', @timeUnit = '', @unverified = true) ->

  FromMessage: (msg) ->
    new TransactionLimit(msg.amount, msg.currency, msg.time, msg.timeUnit, msg.unverified)
