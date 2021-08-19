const Koa = require('koa');
const Pug = require('koa-pug')
const path = require('path')
const route = require('koa-route')
const serve = require('koa-static')
const websockify = require('koa-websocket');
const mount = require('koa-mount');
const mongoClient = require('./mongo')

const app = websockify(new Koa());

new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app, // Binding `ctx.render()`, equals to pug.use(app)
})

app.use(serve(__dirname, './public'));

app.use(mount('/public', serve('./public')));

app.use(async (ctx) => {
  await ctx.render('main')
});
/* eslint-disable-next-line no-underscore-dangle */
const _client = mongoClient.connect()

async function getChatsCollection() {
  const client = await _client
  return client.db('chat').collection('chats')
}

app.ws.use(
  route.all('/ws', async (ctx) => {
    const chatsCollection = await getChatsCollection()
    const chatsCursor = chatsCollection.find({},{
      sort: {
        createdAt: 1,
      }
    })
    const chats = await chatsCursor.toArray()
    ctx.websocket.send(JSON.stringify({
      type: 'sync',
      payload: {
        chats,
      }
    })
    )


    ctx.websocket.on('message', async (data) => {
      if (typeof data !== 'string'){
        return
      }

      /** @type {Chat} */
      const chat = JSON.parse(data)

      await chatsCollection.insertOne({
        ...chat,
        createdAt: new Date(),
      })

      const { nickname, message } = chat

      const { server } = app.ws

      if (!server) {
        return
      }

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type:'chat',
            payload: {
              message,
              nickname
            }
          })
        )
      })
    });
  })
);


app.listen(5000);