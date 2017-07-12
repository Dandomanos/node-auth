let ioClient
module.exports = {
  initEvents() {
    ioClient.on('connection', (socket) => {
      console.log('a user connected', socket.id)

      socket.on('updated', (games) => {
        console.log('games updated')
        ioClient.sockets.in(games).emit('updated', games)
      })

      socket.emit('getid', socket.id)

      // // On conversation entry, join broadcast channel
      // socket.on('enter conversation', (conversation) => {
      //   socket.join(conversation);
      //   // console.log('joined ' + conversation);
      // });

      // socket.on('leave conversation', (conversation) => {
      //   socket.leave(conversation);
      //   // console.log('left ' + conversation);
      // })

      // socket.on('new message', (conversation) => {
      //   io.sockets.in(conversation).emit('refresh messages', conversation);
      //   });

      socket.on('disconnect', () => {
        console.log('user disconnected', socket.id)
      })
    })
  },
  set(io){
    ioClient = io
  },
  get(){
    return ioClient
  }
}