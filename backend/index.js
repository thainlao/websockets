const http = require('http');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const url = require('url');

const PORT = 8000;
const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const connections = {};
const users = {};

const broadcastUsers = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    });
};

const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString());
    const user = users[uuid];
    if (user) {
        user.state = message;
        user.state.online = true
        broadcastUsers();
        console.log(`${users[uuid].username} updated their state: ${JSON.stringify(user.state)}`);
    } else {
        console.log(`User with UUID ${uuid} does not exist.`);
    }
};

const handleClose = uuid => {
    const user = users[uuid];
    if (user) {
        console.log(`${user.username} disconnected`);
        user.state.online = false;
        delete connections[uuid];
        delete users[uuid];
        broadcastUsers();
    }
};

wsServer.on('connection', (connection, request) => {
    const { username } = url.parse(request.url, true).query;

    // Проверяем, существует ли уже пользователь с таким же именем
    const existingUser = Object.values(users).find(user => user.username === username);

    let uuid;

    if (existingUser) {
        // Если пользователь уже существует, используем его существующее соединение и UUID
        uuid = existingUser.uuid;
        connections[uuid] = connection;
        users[uuid].state.online = true; // Устанавливаем состояние online в true при повторном подключении
        console.log(`${username} with uuid ${uuid} connected`);
    } else {
        // Если пользователь не существует, создаем нового пользователя с уникальным UUID
        uuid = uuidv4();
        users[uuid] = {
            uuid: uuid,
            username: username,
            state: {
                x: 0,
                y: 0,
                online: true,
                typing: false,
            },
        };

        console.log(`${username} with uuid ${uuid} connected`);

        // Добавляем соединение в объект соединений
        connections[uuid] = connection;
    }

    broadcastUsers();

    connection.on('message', message => handleMessage(message, uuid)); // Передаем uuid в обработчик сообщений
    connection.on('close', () => handleClose(uuid));
});

server.listen(PORT, () => {
    console.log(`WebSockets server in running on port ${PORT}`)
});