const objs = [
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
    const { foo } = obj
    if (foo) {
      const { bar } = foo
      if (bar) {
        return foo.bar.baz
      }
    }
    return undefined
  })
)

// optional chain ?.
console.log(objs.map((obj) => obj.foo?.bar?.baz))
