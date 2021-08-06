/**
 * @param {number} duration
 * @returns
 */

function sleep(duration) {
  return new Promise((resolve) => {
    console.log('sleep start')
    setTimeout(() => {
      console.log('sleep done', duration)
      resolve(duration)
    }, duration)
  })
}

function alwaysReject() {
  return new Promise((resolve, reject) => {
    reject()
  })
}

Promise.allSettled([
  sleep(1000),
  sleep(1500),
  sleep(2000),
  alwaysReject(),
]).then((value) => {
  console.log('Promise.all done!', value)
})
