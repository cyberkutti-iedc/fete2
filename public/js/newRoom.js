let adjectives = [
    'small',
    'big',
    'large',
    'smelly',
    'new',
    'happy',
    'shiny',
    'old',
    'clean',
    'nice',
    'bad',
    'cool',
    'hot',
    'cold',
    'warm',
    'hungry',
    'slow',
    'fast',
    'red',
    'white',
    'black',
    'blue',
    'green',
    'basic',
    'strong',
    'cute',
    'poor',
    'nice',
    'huge',
    'rare',
    'lucky',
    'weak',
    'tall',
    'short',
    'tiny',
    'great',
    'long',
    'single',
    'rich',
    'young',
    'dirty',
    'fresh',
    'brown',
    'dark',
    'crazy',
    'sad',
    'loud',
    'brave',
    'calm',
    'silly',
    'smart',
];

let nouns = [
    'dog',
    'bat',
    'wrench',
    'apple',
    'pear',
    'ghost',
    'cat',
    'wolf',
    'squid',
    'goat',
    'snail',
    'hat',
    'sock',
    'plum',
    'bear',
    'snake',
    'turtle',
    'horse',
    'spoon',
    'fork',
    'spider',
    'tree',
    'chair',
    'table',
    'couch',
    'towel',
    'panda',
    'bread',
    'grape',
    'cake',
    'brick',
    'rat',
    'mouse',
    'bird',
    'oven',
    'phone',
    'photo',
    'frog',
    'bear',
    'camel',
    'sheep',
    'shark',
    'tiger',
    'zebra',
    'duck',
    'eagle',
    'fish',
    'kitten',
    'lobster',
    'monkey',
    'owl',
    'puppy',
    'pig',
    'rabbit',
    'fox',
    'whale',
    'beaver',
    'gorilla',
    'lizard',
    'parrot',
    'sloth',
    'swan',
];

let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
let noun = nouns[Math.floor(Math.random() * nouns.length)];
let num = getRandomNumber(5);
noun = noun.charAt(0).toUpperCase() + noun.substring(1);
adjective = adjective.charAt(0).toUpperCase() + adjective.substring(1);
document.getElementById('roomName').value = '';

// Typing Effect

let i = 0;
let txt = num + adjective + noun;
let speed = 100;

typeWriter();

/**
 * Get random number
 * @param {integer} length of string
 * @returns {string} random number
 */
function getRandomNumber(length) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Set room name with typewriter effect
 */
function typeWriter() {
    if (i < txt.length) {
        document.getElementById('roomName').value += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

router.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

router.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId, userName);

    socket.on('new-participant', (participantName) => {
      const participantId = uuidv4();
      io.to(roomId).emit('waiting-room', participantId, participantName);
    });

    socket.on('approve-participant', (participantId) => {
      io.to(roomId).emit('participant-approved', participantId);
    });

    socket.on('reject-participant', (participantId) => {
      io.to(roomId).emit('participant-rejected', participantId);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});

app.use('/peerjs', peerServer);

module.exports = router;