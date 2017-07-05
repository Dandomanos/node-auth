exports = module.exports = function(io) {  
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('updated', (games)=>{
        console.log('games updated')
        io.sockets.in(games).emit('updated', games)
    })

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

    // socket.on('disconnect', () => {
    //   //console.log('user disconnected');
    // });
  });
}