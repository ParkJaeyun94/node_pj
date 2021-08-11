/**
 * @typedef Character
 * @property {string} slug
 * @property {number} polarity
 * @property {house} slug
 */

/**
 * @typedef House
 * @property {string} slug
 * @property {Character[]} members
 */

const https = require('https')

const GOTAPI_PREFIX = 'https://game-of-thrones-quotes.herokuapp.com/v1'

/**
 * @param {string} url
 * @return {*}
 */
async function getHttpsJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) =>{
      let jsonStr = ''
      res.setEncoding('utf-8')
      res.on('data', (data) => {
        // json 결과가 언제까지 올지 모르니 계속 appending
        jsonStr += data
      })
      // 응답이 끝나면 end 이벤트 호출
      res.on('end', () => {
        try {
          const parsed = JSON.parse(jsonStr)
          resolve(parsed)
        } catch {
          reject(new Error('The server responded was not a valid JSON document.'))
        }
      })
    })
  })
}

/**
 * @returns {Promise<House[]>}
 */

async function getHouse() {
  return getHttpsJSON(`${GOTAPI_PREFIX}/houses`)
}

/**
 * @param {string} quote
 * @returns {string}
 */
function sanitizeQuote(quote){
  return quote.replace(/[^a-zA-Z0-9., ]/g,'')

}

/**
 * @param {string} slug
 * @return {Promise<string>}
 */

async function getMergedQuotesOfCharacter(slug){
  const character = await getHttpsJSON(`${GOTAPI_PREFIX}/character/${slug}`)
  return sanitizeQuote(character[0].quotes.join(' '))
}

/**
 * @param {string} quote
 */
async function getSentimAPIResult(quote){
  return new Promise((resolve, reject)=> {
  const body = JSON.stringify({
    text: quote,
  })

  const postReq = https.request(
    {
      hostname: 'sentim-api.herokuapp.com',
      method: 'POST',
      path: '/api/v1/',
      headers: {
        Accept: 'application/json; encoding=utf-8',
        'Content-Type': 'application/json; encoding=utf-8',
        'Content-Length': body.length,
      },
    }, (res) => {
      let jsonStr = ''
      res.setEncoding('utf-8')
      res.on('data', (data) => {
        jsonStr += data
      })
      res.on('end', () => {
        try {
          resolve(JSON.parse(jsonStr))
        } catch {
          reject(
            new Error('The server response was not a valid JSON document.')
          )
        }
      })
    })
    postReq.write(body)
  })
}

/**
 * @param {number[]} numbers
 * @returns {number}
 */
function sum(numbers){
  return numbers.reduce((memo, curr) => memo + curr, 0)
}

async function main() {
  const houses = await getHouse()
  const characters = await Promise.all(
    houses
      .map(house =>
        house.members.map((member) => getMergedQuotesOfCharacter(member.slug).then((quote) => ({
          house: house.slug,
          character: member.slug,
          quote,
        }))
      )
    ).flat()
  )
   const charactersWithPolarity = await Promise.all(
     characters.map(async (character) => {
      const result = await getSentimAPIResult(character.quote)
      return ({
        ...character,
        polarity: result.result.polarity
      })
    })
  )

  /** @type {Object.<string, Characterp[]>} */
  const charactersByHouseSlugs = {}
  charactersWithPolarity.forEach(character => {
    charactersByHouseSlugs[character.house] = charactersByHouseSlugs[character.house] || []
    charactersByHouseSlugs[character.house].push(character)
  })

  const houseSlugs = Object.keys(charactersByHouseSlugs)
  const result = houseSlugs.map(houseSlug => {
    const charactersOfHouse = charactersByHouseSlugs[houseSlug]
    if (!charactersOfHouse){
      return undefined
    }
    const sumPolarity = sum(
      charactersOfHouse.map((character) => character.polarity)
    )
    const averagePolarity = sumPolarity / charactersOfHouse.length
    return [houseSlug, averagePolarity]
  }).sort((a, b) => a[1] - b[1])
  console.log(result)
}
main()