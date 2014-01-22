angular.module('bc.unverified-withdrawal', []).service "UnverifiedWithdrawal", ->
  class UnverifiedFiatWithdrawal
    constructor: (@id = '', @fundingSourceId = '', @amount = 0, createdAt = moment()) ->
      @type = "Withdrawal"
      @status = "Unconfirmed"
      @createdAt = moment(createdAt)
      @history = [
        event: "Unconfirmed"
        timestamp: createdAt
      ]

  class UnverifiedBtcWithdrawal
    constructor: (@id = '', @destination = '', @amount = 0, createdAt = moment()) ->
      @type = "Withdrawal"
      @status = "Unconfirmed"
      @createdAt = moment(createdAt)
      @history = [
        event: "Unconfirmed"
        timestamp: createdAt
      ]

  FromMessage: (msg) ->
    if msg?.result is "UNVERIFIED_FIAT_WITHDRAWAL"
      new UnverifiedFiatWithdrawal msg?._id, msg?.fundingSourceId, msg?.amount, msg?.createdAt
    else if msg?.result is "UNVERIFIED_BTC_WITHDRAWAL"
      new UnverifiedBtcWithdrawal msg?._id, msg?.destination, msg?.amount, msg?.createdAt

