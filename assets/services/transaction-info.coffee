angular.module('bc.transaction-info', []).service "TransactionInfo", () ->
  TransactionInfoHelper =
    Upsert: (obj, msg) =>
      if obj
        obj.status = msg.status
        obj.history = _(obj.history || []).concat
          event: msg.status
          timestamp: (new Date().getTime)
        obj
      else
        TransactionInfo.FromMessage(msg)

  class TransactionInfo
    constructor: (@id, @type, @fundingSourceId, @orderType, @status, @history) ->

    @FromMessage: (msg) =>
      transaction = new TransactionInfo(msg._id, msg._type, msg.fundingSourceId, msg.amount, msg.status, msg._history)
      TransactionInfoHelper.Upsert(transaction, msg)

  TransactionInfoHelper
