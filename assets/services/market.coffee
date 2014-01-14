angular.module('bc.market-info', []).factory "MarketInfo", ->
  markets = {}

  class Market
    constructor: (@priceCurrency, @quantityCurrency) ->
      @bidLevels = []
      @askLevels = []

    acceptMessage: (message) =>
      if message.result is 'MARKET_DEPTH_INFO' and
          message.price.currency is @priceCurrency and
          message.quantity.currency is @quantityCurrency
        @handleMarketDepthInfo
      else
        undefined

    handleMarketDepthInfo: (message) =>
      console.log "Handling market depth:", message
      lvl = {price: Number(message.price.amount), quantity: message.quantity}

      [levels, sort] = if message.parity is 'bid'
        [@bidLevels, (x) -> -x.price]
      else
        [@askLevels, 'price']

      if Number(lvl.quantity.amount) > 0
        idx = _(levels).sortedIndex(lvl, sort)

        if levels[idx]?.price is lvl.price
          levels[idx].quantity = lvl.quantity
        else if levels[idx - 1]?.price is lvl.price
          levels[idx - 1].quantity = lvl.quantity
        else
          levels.splice(idx, 0, lvl)
      else
        idx = _(levels).sortedIndex(lvl, sort)
        if levels[idx]?.price is lvl.price
          levels.splice(idx, 1)
        else if levels[idx - 1]?.price is lvl.price
          levels.splice(idx - 1, 1)

  mkKey = (priceCurrency, quantityCurrency) ->
    "#{priceCurrency}|#{quantityCurrency}"

  builder = (priceCurrency, quantityCurrency) ->
    key = mkKey(priceCurrency, quantityCurrency)
    unless markets[key]
      markets[key] = new Market(priceCurrency, quantityCurrency)

     markets[key]

  builder.clear = (priceCurrency, quantityCurrency) ->
    key = mkKey(priceCurrency, quantityCurrency)
    delete markets[key]

  builder


