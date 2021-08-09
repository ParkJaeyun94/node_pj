// 프레임워크 없이 간단한 토이프로젝트 웹 서버 만들어보기
/* eslint-disable */
/**
 * 블로그 포스팅 서비스
 * - 로컬 파일을 데이터베이스로 활용할 예정 (JSON)
 * - 인증 로직은 넣지 않습니다.
 * - RESTful API를 사용합니다.
 */

const http = require('http')

const { routes } = require('./api')

const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.method === req.method
    )

    if (!req.url || !route) {
      res.statusCode = 404
      res.end('Not found.')
      return
    }

    const regexResult = route.url.exec(req.url)

    if (!regexResult) {
      res.statusCode = 404
      res.end('Not found.')
      return
    }

    /** @type {Object.<string, *> | undefined} */
    const reqBody =
      (req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', (data) => {
            try {
              resolve(JSON.parse(data))
            } catch {
              reject(new Error('Ill-formed json'))
            }
          })
        }))) ||
      undefined

    const result = await route.callback(regexResult, reqBody)
    res.statusCode = result.statusCode

    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result.body))
    }
  }
  main()
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`The server is listening at port : ${PORT}`)
})

// const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/
// const postIdRegexResult =
//   (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined
//
// if (req.url === '/posts' && req.method === 'GET') {
//   const result = {
//     posts: posts.map((post) => ({
//       id: post.id,
//       title: post.title,
//     })),
//     totalCount: posts.length,
//   }
//
//   res.statusCode = 200
//   res.setHeader('Content_Type', 'application/json; charset=utf-8')
//   res.end(JSON.stringify(result))
// } else if (postIdRegexResult && req.method === 'GET') {
//   // GET /posts/:id
//   const postId = postIdRegexResult[1]
//   const post = posts.find((_post) => _post.id === postId)
//
//   if (post) {
//     res.statusCode = 200
//     res.setHeader('Content_Type', 'application/json; charset=utf-8')
//     res.end(JSON.stringify(post))
//   } else {
//     res.statusCode = 404
//     res.end('Not found')
//   }
// } else if (req.url === '/posts' && req.method === 'POST') {
//   req.setEncoding('utf-8')
//   req.on('data', (data) => {
//     /** @typedef CreatePostBody
//      * @property {string} title
//      * @property {string} content
//      * */
//
//     /** @type {CreatePostBody} */
//     const body = JSON.parse(data)
//     console.log(body)
//     posts.push({
//       id: body.title.toLowerCase().replace(/\s/g, '_'),
//       title: body.title,
//       content: body.content,
//     })
//   })
//   res.statusCode = 200
//   res.end('Creating post')
// } else {
//   res.statusCode = 404
//   res.end('Not found')
// }
// })
