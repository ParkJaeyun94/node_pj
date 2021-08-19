// IIFE - 바로 정의해버리는 함수. 감싸지 않을 경우 크롬에서 바로 socket에 접근할 수 있게 되어 가려주는 것
// browser -> server
;(()=>{
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const formEl = document.getElementById('form')
  const chatsEl = document.getElementById('chats')
  /** @type {HTMLInputElement | null} */
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl || !chatsEl){
    throw new Error('Init failed!')
  }
  /**
   * @type Chat
   * @property {string} nickname
   * @property {string} message
   */

  /**
   * @type {Chat[]}
   */
  const chats = []

  const adjectives = ['멋진', '훌륭한', '친절한', '새침한']
  const animals = ['물범', '사자', '사슴', '돌고래', '독수리']

  /**
   * @param {string[]} array
   * @returns {string}
   */

  function pickRandom(array){
    const randomIdx = Math.floor(Math.random() * array.length)
    const result = array[randomIdx]
    if (!result) {
      throw new Error('array length is 0.')
    }
    return result
  }

  const myNickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`

  formEl.addEventListener('submit', (event) => {
    event.preventDefault()
    socket.send(JSON.stringify({
      nickname: myNickname,
      message: inputEl.value
    }))
    inputEl.value=''
  })

  const drawChats = () => {
    chatsEl.innerHTML=''
    chats.forEach(({ message, nickname }) => {
      const div = document.createElement('div')
      div.innerText = `${nickname}: ${message}`
      chatsEl.appendChild(div)
    })
  }
  socket.addEventListener('message', (event) => {
    const {type, payload} = JSON.parse(event.data)

    if(type === 'sync'){
      const { chats: syncedChats } = payload
      chats.push(...syncedChats)
    } else if (type === 'chat'){
      const chat = payload
      chats.push(chat)
    }
      drawChats()
  })
})()