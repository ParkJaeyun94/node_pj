let numConters = 0
function getCounter() {
  numConters += 1

  const result = { count, total: 0 }
  function count() {
    result.total += 1
  }
  return result
}

const counterA = getCounter()
counterA.count()
counterA.count()

const counterB = getCounter()
counterB.count()

console.log(counterA.total, counterB.total, numConters)
