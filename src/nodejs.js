// CommonJS: require
// - node standard library에 있는 모듈은 절대경로를 지정해 가져온다.
// - 이 프로젝트 내의 다른 파일은 상대경로를 지정해 가져온다.
// - 절대경로를 지정하면 module.paths의 경로들을 순서대로 검사하여 하나에서 해당 모듈이 있으면 가장 첫 번째 것을 검사해 가져온다.

/* eslint-disable */

const { paths } = module
console.log({ paths })

const animals = require('animals')
console.log(animals)
