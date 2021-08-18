const path = require('path'); // Obtenmos la ruta de de la aplicación principal.
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 8000);

// Para obtener los datós estáticos.
app.use(express.static(path.join(__dirname, 'public')));

var usuarios = [];

app.get('/usuarios', (req, res) => {
    res.send(usuarios);
});

const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

const socketIO = require('socket.io');
const io = socketIO(server);

// Declaramos el websockets
io.on('connection', (socket) => {
    console.log('Nueva conección', socket.id);
    var newUser = "";
    socket.on('nuevouser', nick => {
        // newUser = nick+"_"+usuarios.length;
        newUser = nick;
        usuarios.push( { id:socket.id, nombre: newUser} );
        io.emit("idCliente", socket.id);
        // Avisamos que hay un nuevo usuario conectado
        io.emit("clienteconectado", usuarios);
    });

    socket.on('chat:message', data => {
        io.sockets.emit('chat:message', data);
    });


    // Este es para ver en el momento que está tipidando un usuario
    socket.on('chat:typing', data => {
        socket.broadcast.emit('chat:typing', data);
    });

    socket.on('disconnect', () => {
        eliminarUsuario(newUser);
        io.emit('usuariodesconectado', usuarios);
    });
});

// Eliminamos el usuario que se desconectó del chat.
function eliminarUsuario(valor) {
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre == valor) {
            usuarios.splice(i, 1);
            break;
        }
    }
}
