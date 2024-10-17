// Variáveis globais para controle do jogo
const player = document.getElementById('player');
const step = 9; // Tamanho do passo em pixels
let currentFrame = 0; // Usado para alternar os sprites
let frameCounter = 0; // Contador para controlar a frequência da troca de sprites
let isMoving = false; // Controle de movimento
let moveInterval;
let currentDirection = ''; // Direção atual do movimento

// Sprites de animação para cada direção
const sprites = {
    up: [
        '../assets/images/cima1.png',
        '../assets/images/cima.png',
        '../assets/images/cima2.png'
    ],
    down: [
        '../assets/images/baixo1.png',
        '../assets/images/baixo.png',
        '../assets/images/baixo2.png'
    ],
    left: [
        '../assets/images/esquerda1.png',
        '../assets/images/esquerda.png',
        '../assets/images/esquerda2.png'
    ],
    right: [
        '../assets/images/direita1.png',
        '../assets/images/direita.png',
        '../assets/images/direita2.png'
    ]
};

// Função para definir o sprite inicial ao iniciar o movimento
function setInitialSprite(direction) {
    player.style.backgroundImage = `url(${sprites[direction][0]})`;
}

// Função para iniciar a animação de movimento do personagem
function toggleMovement(direction) {
    if (isMoving && currentDirection === direction) return; // Evita múltiplos intervalos para a mesma direção
    stopMovement(); // Para qualquer movimento anterior

    isMoving = true;
    currentDirection = direction;
    setInitialSprite(direction);

    moveInterval = setInterval(() => {
        player.style.backgroundImage = `url(${sprites[direction][currentFrame]})`; // Define o sprite atual
        currentFrame = (currentFrame + 1) % sprites[direction].length; // Alterna os frames
    }, 100); // Intervalo de troca de sprites
}

// Para a animação de movimento assim que a tecla é solta
function stopMovement() {
    clearInterval(moveInterval); // Para a troca de sprites
    isMoving = false;
    currentFrame = 0;
    currentDirection = '';
}

// Função genérica para verificar colisões e realizar o movimento
function handleMovement(direction, left, top) {
    toggleMovement(direction); // Inicia a animação de movimento

    switch (direction) {
        case 'up':
            if (top > 0 && !checkCollisionWithHouseWalls(left, top - step, player.offsetWidth, player.offsetHeight)) {
                player.style.top = (top - step) + 'px';
                checkDoors();
            }
            break;
        case 'down':
            if (top < (962 - player.offsetHeight) && !checkCollisionWithHouseWalls(left, top + step, player.offsetWidth, player.offsetHeight)) {
                player.style.top = (top + step) + 'px';
                checkDoors();
            }
            break;
        case 'left':
            if (left > 0 && !checkCollisionWithHouseWalls(left - step, top, player.offsetWidth, player.offsetHeight)) {
                player.style.left = (left - step) + 'px';
                checkDoors();
                if (left - step <= 0 && player.parentElement.id !== 'empty-scene') {
                    switchScene('empty');
                } else if (player.parentElement.id === 'empty-scene' && left - step <= 0) {
                    switchScene('outdoor');
                }
            }
            break;
        case 'right':
            if (left < (1878 - player.offsetWidth) && !checkCollisionWithHouseWalls(left + step, top, player.offsetWidth, player.offsetHeight)) {
                player.style.left = (left + step) + 'px';
                checkDoors();
                if (left + step >= 1813 && player.parentElement.id !== 'empty-scene') {
                    switchScene('empty');
                }
            }
            break;
    }
}

// Função para verificar colisões com portas (externa, interna e pub)
function checkDoors() {
    checkDoorCollision();
    checkIndoorDoorCollision();
    checkPubDoorCollision();
    checkPubIndoorDoorCollision();
}

// Movimentação do jogador
document.addEventListener('keydown', function(event) {
    let left = parseInt(player.style.left) || 390;
    let top = parseInt(player.style.top) || 430;

    switch (event.key) {
        case 'ArrowUp':
            handleMovement('up', left, top);
            break;
        case 'ArrowDown':
            handleMovement('down', left, top);
            break;
        case 'ArrowLeft':
            handleMovement('left', left, top);
            break;
        case 'ArrowRight':
            handleMovement('right', left, top);
            break;
    }
});

// Para a animação de movimento assim que a tecla é solta
document.addEventListener('keyup', function(event) {
    // Apenas para as teclas de seta
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        stopMovement();
    }
});

// Função para alternar entre cenas
function switchScene(sceneName) {
    const emptyScene = document.getElementById('empty-scene');
    const outdoorScene = document.getElementById('outdoor-scene');
    const pubIndoorScene = document.getElementById('pub-indoor-scene');

    if (sceneName === 'empty') {
        emptyScene.style.display = 'block';
        outdoorScene.style.display = 'none';
        pubIndoorScene.style.display = 'none';
        emptyScene.appendChild(player);
        player.style.left = '10px'; // Ajuste para o lado esquerdo do cenário vazio
        player.style.top = '260px'; // Ajuste para a posição vertical no cenário vazio
    } else if (sceneName === 'outdoor') {
        outdoorScene.style.display = 'block';
        emptyScene.style.display = 'none';
        pubIndoorScene.style.display = 'none';
        outdoorScene.appendChild(player);
        player.style.left = '1813px'; // Ajuste para o lado direito do cenário principal
        player.style.top = '260px'; // Ajuste para a posição vertical no cenário principal
    } else if (sceneName === 'pub') {
        pubIndoorScene.style.display = 'block';
        emptyScene.style.display = 'none';
        outdoorScene.style.display = 'none';
        pubIndoorScene.appendChild(player);
        player.style.left = '250px'; // Posição inicial dentro do pub
        player.style.top = '290px'; // Posição inicial dentro do pub
    }
}

// Função para verificar colisão com as paredes da casa
function checkCollisionWithHouseWalls(left, top, width, height) {
    const house = document.getElementById('house');
    const houseRect = house.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Considerando a posição relativa dentro do container
    const houseLeft = houseRect.left;
    const houseRight = houseRect.right - width;
    const houseTop = houseRect.top;
    const houseBottom = houseRect.bottom - height;

    // Verifica se o player está dentro dos limites da casa
    if (left >= houseLeft && left <= houseRight && top >= houseTop && top <= houseBottom) {
        return true;
    }
    return false;
}

// Função para verificar colisão com a porta externa
function checkDoorCollision() {
    const door = document.getElementById('door');
    const playerRect = player.getBoundingClientRect();
    const doorRect = door.getBoundingClientRect();

    if (playerRect.right >= doorRect.left &&
        playerRect.left <= doorRect.right &&
        playerRect.bottom >= doorRect.top &&
        playerRect.top <= doorRect.bottom) {
        enterHouse();
    }
}

// Função para verificar colisão com a porta do pub
function checkPubDoorCollision() {
    const pubDoor = document.getElementById('pub-door');
    const playerRect = player.getBoundingClientRect();
    const pubDoorRect = pubDoor.getBoundingClientRect();

    if (playerRect.right >= pubDoorRect.left &&
        playerRect.left <= pubDoorRect.right &&
        playerRect.bottom >= pubDoorRect.top &&
        playerRect.top <= pubDoorRect.bottom) {
        enterPub();
    }
}

// Função para verificar colisão com a porta interna do pub
function checkPubIndoorDoorCollision() {
    const pubIndoorDoor = document.getElementById('pub-indoor-door');
    const playerRect = player.getBoundingClientRect();
    const pubIndoorDoorRect = pubIndoorDoor.getBoundingClientRect();

    if (playerRect.right >= pubIndoorDoorRect.left &&
        playerRect.left <= pubIndoorDoorRect.right &&
        playerRect.bottom >= pubIndoorDoorRect.top &&
        playerRect.top <= pubIndoorDoorRect.bottom) {
        exitPub();
    }
}

// Função para entrar na casa
function enterHouse() {
    const indoorScene = document.getElementById('indoor-scene');
    const outdoorScene = document.getElementById('outdoor-scene');
    const background = document.getElementById('game-container');

    background.style.backgroundImage = "url('../assets/images/black.png')";

    outdoorScene.style.opacity = '0';
    indoorScene.style.opacity = '1';

    setTimeout(() => {
        outdoorScene.style.display = 'none';
        indoorScene.style.display = 'block';
        player.style.left = '645px';
        player.style.top = '780px';
        indoorScene.appendChild(player);
    }, 1000);
}

// Função para entrar no pub
function enterPub() {
    const pubIndoorScene = document.getElementById('pub-indoor-scene');
    const emptyScene = document.getElementById('empty-scene');
    const background = document.getElementById('game-container');

    background.style.backgroundImage = "url('../assets/images/black.png')";

    pubIndoorScene.style.left = '50%';
    pubIndoorScene.style.top = '50%';
    pubIndoorScene.style.transform = 'translate(-50%, -50%)';

    emptyScene.style.opacity = '0';
    pubIndoorScene.style.opacity = '1';

    setTimeout(() => {
        emptyScene.style.display = 'none';
        pubIndoorScene.style.display = 'block';
        player.style.left = '918px';
        player.style.top = '780px';
        pubIndoorScene.appendChild(player);
    }, 100);
}

// Função para sair do pub
function exitPub() {
    const pubIndoorScene = document.getElementById('pub-indoor-scene');
    const emptyScene = document.getElementById('empty-scene');
    const background = document.getElementById('game-container');

    background.style.backgroundImage = "url('../assets/images/cenario_principal.png')";

    pubIndoorScene.style.opacity = '0';
    emptyScene.style.opacity = '1';

    setTimeout(() => {
        pubIndoorScene.style.display = 'none';
        emptyScene.style.display = 'block';
        player.style.left = '586px';
        player.style.top = '516px';
        emptyScene.appendChild(player);
    }, 1000);
}

// Função para verificar colisão com a porta interna
function checkIndoorDoorCollision() {
    const indoorDoor = document.getElementById('indoor-door');
    const playerRect = player.getBoundingClientRect();
    const indoorDoorRect = indoorDoor.getBoundingClientRect();

    if (playerRect.right >= indoorDoorRect.left &&
        playerRect.left <= indoorDoorRect.right &&
        playerRect.bottom >= indoorDoorRect.top &&
        playerRect.top <= indoorDoorRect.bottom) {
        exitHouse();
    }
}

// Função para sair da casa
function exitHouse() {
    const indoorScene = document.getElementById('indoor-scene');
    const outdoorScene = document.getElementById('outdoor-scene');
    const background = document.getElementById('game-container');

    background.style.backgroundImage = "url('../assets/images/cenario_principal.png')";

    indoorScene.style.opacity = '0';
    outdoorScene.style.opacity = '1';

    setTimeout(() => {
        indoorScene.style.display = 'none';
        outdoorScene.style.display = 'block';
        player.style.left = '230px';
        player.style.top = '380px';
        outdoorScene.appendChild(player);
    }, 1000);
}

// Função para verificar colisão com móveis e exibir diálogos (remover a chamada do evento de movimento)
function checkCollisionWithFurnitureOnClick() {
    const furnitureList = [
        { id: 'cama', dialogue: 'Esta é sua cama!' },
        { id: 'cama2', dialogue: 'Cama dos seus pais!' },
        { id: 'cama3', dialogue: 'Cama dos seus avós!' },
        { id: 'computador', dialogue: 'Seu computador! Parece antigo, mas funciona o bloco de notas.' },
        { id: 'trofeis', dialogue: 'Troféus brilhantes!' },
        { id: 'carro', dialogue: 'Carro antigo do vovô, precisa de uma limpeza!' },
    ];

    furnitureList.forEach(furniture => {
        const furnitureElement = document.getElementById(furniture.id);

        // Remove event listeners anteriores para evitar múltiplas chamadas
        furnitureElement.removeEventListener('click', furniture.clickHandler);
        // Define a nova função handler
        furniture.clickHandler = function() {
            showFurnitureDialogueOnClick(furniture.dialogue);
        };
        furnitureElement.addEventListener('click', furniture.clickHandler);
    });
}

// Função para mostrar o diálogo dos móveis ao clicar
function showFurnitureDialogueOnClick(dialogueText) {
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueTextElement = document.getElementById('dialogue-text');

    dialogueTextElement.innerText = dialogueText;
    dialogueBox.style.display = 'block';
    dialogueBox.style.opacity = '1';

    setTimeout(() => {
        dialogueBox.style.opacity = '0';
        setTimeout(() => {
            dialogueBox.style.display = 'none';
        }, 1000);
    }, 3000);
}

// Chamar a função para configurar os eventos de clique nos móveis
checkCollisionWithFurnitureOnClick();

// Diálogos dos NPCs
const npcDialogues = {
    'Vovô Arnaldo Fritz': [
        'Hoje está um belo dia, não acha meu netinho?',
        'Meu netinho, sabe o vinho que não tem álcool? Ovinho de codorna! HAHAHAHAH',
        'Tá gostando de passas as férias aqui no sítio meu netinho?',
        'Só estou aproveitando um pouco a vista!'
    ],
    'Mamãe Florence': [
        'Oii filho, está gostando da casinha do vovô?',
        'Tem bastante mosquito aqui! Cuidado filho passa o repelente.',
        'A vovó está fazendo uma comida muito boa, não vejo a hora de comer!'
    ],
    'Vovó Celestia': [
        'Oii meu netinho, tá com fome? A vó vai fazer um biscoitinho para você!',
        'O vovô tem cada história uma mais engraçada que a outra, e tem umas bem misteriosas!',
        'O clima tá bom para um bolinho, o que acha meu netinho?'
    ],
    'Sra. Aurora': [
        'Oii você deve ser o neto do Seu Arnaldo, certo?',
        'O seu avô é um homem muito bom, ele sempre me ajuda.',
        'Quer um pãozinho? Acabou de sair do forno!'
    ]

};

// Função para mostrar o diálogo dos NPCs
function showNPCDialogue(npcName) {
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueTextElement = document.getElementById('dialogue-text');

    dialogueBox.style.display = 'block';
    dialogueBox.style.opacity = '1';

    if (npcDialogues.hasOwnProperty(npcName)) {
        const dialogues = npcDialogues[npcName];
        const randomPhrase = dialogues[Math.floor(Math.random() * dialogues.length)];
        dialogueTextElement.innerHTML = `<strong>${npcName}:</strong> ${randomPhrase}`;

        setTimeout(() => {
            dialogueBox.style.opacity = '0';
            setTimeout(() => {
                dialogueBox.style.display = 'none';
            }, 1000);
        }, 5000);
    } else {
        dialogueTextElement.innerText = `${npcName} não tem nada a dizer no momento.`;

        setTimeout(() => {
            dialogueBox.style.opacity = '0';
            setTimeout(() => {
                dialogueBox.style.display = 'none';
            }, 1000);
        }, 5000);
    }
}

// Adicionar eventos de clique aos NPCs
document.getElementById('npc1').addEventListener('click', function() {
    console.log('Clicou no NPC 1');
    showNPCDialogue('Vovô Arnaldo Fritz');
});

document.getElementById('npc2').addEventListener('click', function() {
    console.log('Clicou no NPC 2');
    showNPCDialogue('Mamãe Florence');
});

document.getElementById('npc3').addEventListener('click', function() {
    console.log('Clicou no NPC 3');
    showNPCDialogue('Vovó Celestia');
});

document.getElementById('npc4').addEventListener('click', function() {
    console.log('Clicou no NPC 4');
    showNPCDialogue('Sra. Aurora');
});

// Inicialização do jogo após o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.getElementById('intro-screen');
    const gameContainer = document.getElementById('game-container');
    const backgroundMusic = document.getElementById('background-music');

    function startGame(event) {
        // Evita que a tecla usada para iniciar o jogo também mova o personagem
        event.preventDefault();
        introScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        backgroundMusic.play();
        document.removeEventListener('keydown', startGame);
    }

    document.addEventListener('keydown', startGame);

    gameContainer.style.display = 'none';
});
