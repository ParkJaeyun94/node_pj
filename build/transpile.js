;(() => {
  // transpile.js
  var objs = [
    {
      foo: {
        bar: {
          baz: 1,
        },
      },
    },
    {},
    {
      foo: {},
    },
  ]

  console.log(
    objs.map((obj) => {
      var _a, _b
      return (_b = (_a = obj.foo) == null ? void 0 : _a.bar) == null
        ? void 0
        : _b.baz
    })
  )
})()
