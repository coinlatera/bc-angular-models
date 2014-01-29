angular.module('bc.transaction-limit', []).service 'TransactionLimit', ['BigNumber', (BigNumber) ->
  class TransactionLimit
    constructor: (amount = '', @currency = '', @time = '', @timeUnit = '', @userStatus = '') ->
      @amount = BigNumber(amount)

  FromMessage: (msg) ->
    new TransactionLimit(msg.amount, msg.currency, msg.time, msg.timeUnit, msg.userStatus)
]
