/* eslint disable no-new */
/* eslint disable no-console */

// import { resolve } from 'dns'

// new Promise((resolve, reject) => {
//   console.log('Inside promise')
//   console.log('before resolve')
//   reject(new Error('First reject'))
//   resolve('First resolve')
//   console.log('after resolve')
// })
//   .catch((error) => {
//     console.log('error', error)
//   })
//   .then((value) => {
//     console.log('Inside first then')
//     console.log('value', value)
//   })

// new Promise((resolve, reject) => {
//   console.log('Before timeout')
//   setTimeout(() => {
//     resolve(Math.random())
//     console.log('After resolve')
//   }, 1000)
// })
//   .then((value) => {
//     console.log('then 1')
//     console.log('value', value)
//   })
//   .then(() => {
//     console.log('then 2')
//   })
//   .then(() => {
//     console.log('then 3')
//   })
//

/* 활모양 코드를 막을 수 있음. 스코프를 분리시킬 수 있음 */

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random())
    }, duration)
  })
}

sleep(1000)
  .then((value) => {
    console.log(value)
    return sleep()
  })
  .then((value) => {
    console.log(value)
    return sleep()
  })
  .then((value) => {
    console.log(value)
    return sleep()
  })
  .then((value) => {
    console.log(value)
    return sleep()
  })

sleep()
