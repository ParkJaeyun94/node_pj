/* eslint-disable */

const https = require('https')

// 모든 가문의 캐릭터들을 놓고 봤을 때 가장 부정적인 가문과 가장 긍정적인 가문을 알아보자.
const resultsByHouseSlugs = {}

// API 요청 (가문)
https.get(`https://game-of-thrones-quotes.herokuapp.com/v1/houses`, (res) => {
  let jsonStr = ''
  res.setEncoding('utf-8')
  res.on('data', (data) => {
    // json 결과가 언제까지 올지 모르니 계속 appending
    jsonStr += data
  })
  // 응답이 끝나면 end 이벤트 호출
  res.on('end', () => {
    // 가문의 결과를 파싱
    const houses = JSON.parse(jsonStr)

    let numMembersDone = 0
    let numTotalMembers = 0

    // 가문마다 멤버가 몇명인지
    houses.forEach((house) => {
      numTotalMembers += house.members.length
    })

    houses.forEach((house) => {
      const houseSlug = house.slug
      const members = house.members

      members.forEach((member) => {
        const characterSlug = member.slug

        // 멤버별로 하는 말들을 뽑아낸다.
        setTimeout(() => {
          https.get(
            `https://game-of-thrones-quotes.herokuapp.com/v1/character/${characterSlug}`,
            (res) => {
              let jsonStr = ''
              res.setEncoding('utf-8')
              res.on('data', (data) => {
                jsonStr += data
              })
              res.on('end', () => {
                const json = JSON.parse(jsonStr)
                // 멤버의 quote를 하나로 뭉쳐줌
                const mergedQuotes = json[0].quotes
                  .join(' ')
                  .replace(/[^a-zA-Z0-9., ]/g, '')
                // quote를 뭉쳐서 JSON 바디로 만들어줌
                const body = JSON.stringify({
                  text: mergedQuotes,
                })

                // JSON을 request함
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
                  },
                  (res) => {
                    let jsonStr = ''
                    console.log(body, res.statusCode, res.statusMessage)
                    res.setEncoding('utf-8')
                    res.on('data', (data) => {
                      jsonStr += data
                    })
                    res.on('end', () => {
                      const result = JSON.parse(jsonStr)

                      // 가문마다 캐릭터의 polarity를 합쳐줌
                      // slug는 특징되는 문자열을 떼다가 별명처럼 붙여주는 것 (가문, 캐릭터의 슬러그로 저장해줌)
                      resultsByHouseSlugs[houseSlug] =
                        resultsByHouseSlugs[houseSlug] || []
                      resultsByHouseSlugs[houseSlug].push({
                        character: characterSlug,
                        polarity: result.result.polarity,
                      })

                      // 멤버 한 명 끝날때마다 1씩 더해줌. (모두 끝나는 시점을 파악해야하기 때문)
                      numMembersDone += 1

                      // 이 결과가 모든 멤버를 다 끝냈다는 조건문
                      if (numMembersDone === numTotalMembers) {
                        console.log('Finished', resultsByHouseSlugs)

                        const resultSlugs = Object.keys(resultsByHouseSlugs)
                        const finalResult = resultSlugs
                          .map((slug) => {
                            let sum = 0
                            resultsByHouseSlugs[slug].forEach(
                              (value) => (sum += value.polarity)
                            )

                            return {
                              slug,
                              polarity: sum / resultsByHouseSlugs[slug].length,
                            }
                          })
                          .sort((a, b) => a.polarity - b.polarity)

                        console.log('sorted', finalResult)
                      }
                    })
                  }
                )

                postReq.write(body)
              })
            }
          )
        }, Math.random() * 10000)
      })
    })
  })
})