angular.module('bc.order-info', []).service "OrderInfo", () ->
  OrderInfoHelper =
    Upsert: (obj, msg) =>
      if obj
        obj.set_status(msg.order.status)
        obj.history = _(obj.history || []).concat
          event: msg.order.status
          timestamp: (new Date().getTime)
        obj
      else
        OrderInfo.FromMessage(msg)

  class OrderInfo
    constructor: (@id, @accountId, @offered, @received, @orderType, @status, @timestamp, @history) ->
      @original_offered = @offered
      @original_received = @received

    set_status: (stat) =>
      @status = stat
      if stat?.status is 'reopened'
        @status = 'reopened'
        @offered = stat.offered
        @received = stat.received
      else
        @offered = @original_offered
        @received = @original_received

    @FromMessage: (msg) =>
      order = msg.order
      status = order.status
      if order.status?.status is 'reopened'
        status = 'reopened'

      order = new OrderInfo(order.id, order.accountId, order.offered, order.received, order.order_type, status, order.timestamp, msg._history)
      OrderInfoHelper.Upsert(order, msg)

  OrderInfoHelper

