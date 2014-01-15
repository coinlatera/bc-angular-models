angular.module('bc.logger', []).service 'logger', ['CONFIG', (CONFIG) ->
  @log = (args...) ->
    if CONFIG.debug
      console.log args

  return this
]
