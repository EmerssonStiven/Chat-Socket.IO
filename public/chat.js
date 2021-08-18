const socket  = io();

const message = document.getElementById('message');
let username = document.getElementById('username');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const actions = document.getElementById('actions');
const usuarios = document.getElementById('usuarios');

let datos = prompt('¿Cuál es tu nombre?');
username.textContent = datos;
let nombre = '';
username = datos;

socket.emit('nuevouser', username);


// Escuchamos el nuevo usuario conecatdo.
socket.on('idCliente', idUsuario => {

}); 

socket.on('clienteconectado', data => {
    getUsuarios(data);
});


// Escuchamos el usuario que se desconectó
socket.on('usuariodesconectado', data => {
    // Actualizar usuarios
    getUsuarios(data);
   
});

btn.addEventListener('click', () => {
    socket.emit('chat:message', {
        message: message.value,
        username: username
    });
});

// Verificamos si está escribiendo un mensaje
message.addEventListener('keypress', () => {
    socket.emit('chat:typing', username);
});

// Agregamos el mensajer en el campo
socket.on('chat:message', data => {
    // console.log(data);
    if (datos === data.username) {
        actions.innerHTML = '';
        output.innerHTML +=`
        <p class="mensaje">
            <strong>${ data.username }</strongs>: ${ data.message } 
        </p>`
        
    } else {
        actions.innerHTML = '';
        output.innerHTML +=`
        <p class="mensaje1">
            <strong>${ data.username }</strongs>: ${ data.message } 
        </p>`
    }
    message.value = "";
   
});

// Ponemos el nombre del usuario que está escribiendo
socket.on('chat:typing', data => {
    actions.innerHTML = `<p class="visualizar"><em class="color">${data} está escribiendo un mensaje...</em></p> `
});

// Cargamos los usuarios que se han conectado.
function getUsuarios (data) {
    // get('http://localhost:8000/usuarios', data => {
    //     usuarios.empty();
    //     data.forEach(agregarUsuarios);
    // })  
    usuarios.innerHTML = '';
    console.log(data);
    data.forEach(agregarUsuarios);
}

function agregarUsuarios(data) {
    usuarios.innerHTML += `<li class="lista"  id="${data.id}"> ${data.nombre} </li> `
}
