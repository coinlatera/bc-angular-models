angular.module('bc.order-info', []).factory "OrderInfo", ->
  class OrderInfo
    constructor: (@id, @offered, orderType, @parity, @createdAt, @history) ->
      @parseType(orderType)
      @processHistory(_(@history).reverse())

    parseType: (type) =>
      if type._kind is 'market'
        @received = type.received
      else if type._kind is 'limit'
        @price = type.price
        @quantity = type.quantity
      else throw "Invalid OrderType: #{type}"

      @offered.amount = @offered.amount
      @orderType = type._kind

    processEvent: (evt, timestamp) =>
      @updatedAt = timestamp
      @status = evt._kind || evt
      if evt._kind is 'reopened' or evt._kind is 'filled'
        @spent.currency ||= evt.spent.currency
        @earned.currency ||= evt.earned.currency
        @spent.amount += Number(evt.spent.amount)
        @earned.amount += Number(evt.earned.amount)

    processHistory: =>
      @spent = {amount: 0}
      @earned = {amount: 0}
      _(@history).each (e) => @processEvent(e.event, e.timestamp)

    handleEvent: (e) =>
      timestamp = new Date().getTime()
      @history.unshift
        event: e
        timestamp: timestamp
      @processEvent(e, timestamp)

    getRemaining: =>
      currency: @offered.currency
      amount: Number(@offered.amount) - @spent.amount

    getPrice: =>
      @price ||
        if @earned.amount > 0 and @spent.amount > 0
          currency: @earned.currency
          amount: @earned.amount / @spent.amount
        else
          undefined

    @FromMessage: (msg) =>
      order = msg.order
      new OrderInfo(
        order.orderId,
        order.offered,
        order.orderType,
        order.parity,
        order.createdAt,
        msg._history)

