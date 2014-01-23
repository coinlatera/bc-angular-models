angular.module('bc.unverified-withdrawal', []).service "UnverifiedWithdrawal", ->
  class UnverifiedWithdrawal
    constructor: (@id = '', @fundingSourceId = '', @amount = 0, @createdAt = '') ->
      @type = "Withdrawal"
      @status = "Unconfirmed"
      @history = [
        event: "Unconfirmed"
        timestamp: createdAt
      ]

    createdDate: -> moment(@createdAt)

  class UnverifiedFiatWithdrawal extends UnverifiedWithdrawal
  class UnverifiedBtcWithdrawal extends UnverifiedWithdrawal

  FromMessage: (msg) ->
    if msg?.result is "UNVERIFIED_FIAT_WITHDRAWAL"
      new UnverifiedFiatWithdrawal msg?._id, msg?.fundingSourceId, msg?.amount, msg?.createdAt
    else if msg?.result is "UNVERIFIED_BTC_WITHDRAWAL"
      new UnverifiedBtcWithdrawal msg?._id, msg?.destination, msg?.amount, msg?.createdAt

