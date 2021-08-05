/** @type {Person[]} */

const people = [
  {
    age: 20,
    city: '서울',
    pet: ['cat', 'dog']
  },
  {
    age: 40,
    city: '부산',
  },
  {
    age: 31,
    city: '대구',
    pet: ['cat', 'dog'],
  },
  {
    age: 36,
    city: '서울',
  },
  {
    age: 27,
    city: '부산',
    pet:  'cat',
  },
  {
    age: 24,
    city: '서울',
    pet: 'dog',
  },
]


// A: 30세 미만이 한 명이라도 사는 도시

function solveA() {
  /** @type {string[]} */
  const cities =[]

  for(const person of people) {
    if (person.age < 30) {
      if (!cities.find((city) => person.city === city)) {
        cities.push(person.city)
      }
    }
  }
  return cities
}

function solveAModern() {
  const allCities = people.filter((person) => person.age < 30).map((person) => person.city)
  const set = new Set(allCities)
  return Array.from(set)
}

function solveAModern2() {
  const allCities = people.filter(({age}) => age < 30).map(({ city }) => city)
  const set = new Set(allCities)
  return Array.from(set)
}

// console.log('solveA', solveA())
// console.log('solveANModern', solveAModern())
// console.log('solveAModern2', solveAModern2())

// B: 시티에 사는 총 강아지 수, 고양이 수

/**
 * {
 *   "서울": {
 *     "dog": 2,
 *     "cat": 1,
 *   },
 *   "대구": {
 *     "dog": 1,
 *     "cat": 1,
 *   },
 *   "부산": {
 *     "cat": 1,
 *   }
 * }
 */

/** @typedef  {Object. <string, Object.<string, number>>} PetsOfCities */

function solveB() {
  /** @type {PetsOfCities} */

  const  result = {}

  for (const person of people){
    const { city, pet : petOrPets} = person

    if (petOrPets) {
      const petsOfCity = result[city] || {}

      if (typeof petOrPets === 'string') {
        const pet = petOrPets
        const origNumPetsOfCity = petsOfCity[pet] || 0
        petsOfCity[pet] = origNumPetsOfCity + 1
      } else {
        for (const pet of petsOfCity) {
          const origNumPetsOfCity = petsOfCity[pet] || 0
          petsOfCity[pet] = origNumPetsOfCity + 1
        }
      }
      result[city] = petsOfCity
    }
  }

  return result
}

console.log('solveB', solveB())