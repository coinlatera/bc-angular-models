angular.module('bc.trade-fee', []).service "TradeFee", ->
  TradeFeeHelper =
    Upsert: (obj, msg) =>
      TradeFee.FromMessage(msg)

  class TradeFee
    constructor: (@id, @createdAt, @feeAmount, @feeRate, @fundedAmount, @orderId, @tradeType) ->

    @FromMessage: (msg) =>
      new TradeFee(msg._id, msg.createdAt, msg.feeAmount, msg.feeRate, msg.fundedAmount, msg.orderId, msg.tradeType)

  TradeFeeHelper

