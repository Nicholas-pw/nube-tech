const cards = document.querySelectorAll('.memory-card');
const timerDisplay = document.getElementById('timer');
const resultMessage = document.getElementById('result-message');
const resultText = document.getElementById('result-text');
const cover = document.getElementById('cover');
const playButton = document.getElementById('play-btn');
const backButtonCover = document.getElementById('back-btn-cover');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timer;
let timeLeft = 30; // 30 segundos
let isPaused = false;

// Função para iniciar o cronômetro
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0 && !isPaused) {
            timeLeft--;
            timerDisplay.textContent = `Tempo: ${timeLeft}s`;
        } else if (timeLeft === 0) {
            clearInterval(timer);
            showResult(false);
        }
    }, 1000);
}

// Função para parar o cronômetro
function stopTimer() {
    clearInterval(timer);
}

// Função para pausar o jogo
function pauseGame() {
    if (!isPaused) {
        isPaused = true;
        stopTimer(); // Para o cronômetro
        pauseButton.textContent = "Continuar"; // Altera o texto do botão para 'Continuar'
    } else {
        isPaused = false;
        startTimer(); // Retoma o cronômetro
        pauseButton.textContent = "Pausar"; // Altera o texto do botão de volta para 'Pausar'
    }
}

// Função para reiniciar o jogo
function restartGame() {
    location.reload(); // Reinicia a página
}

// Função para mostrar a mensagem de vitória ou derrota
function showResult(isWinner) {
    resultMessage.classList.remove('hidden');
    resultText.textContent = isWinner ? 'Você ganhou!' : 'Você perdeu!';
    resultMessage.classList.add('show'); // Exibe a mensagem
}

// Função para embaralhar as cartas
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
})();

// Função para lidar com o clique nas cartas
function flipCard() {
    if (lockBoard) return; // Impede mais de uma ação ao mesmo tempo
    if (this === firstCard) return; // Impede que a mesma carta seja clicada

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Primeira escolha
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segunda escolha
    secondCard = this;
    checkForMatch();
}

// Função para verificar se as cartas combinam
function checkForMatch() {
    const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

// Função para desabilitar as cartas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Função para desvirar as cartas
function unflipCards() {
    lockBoard = true; // Bloqueia o tabuleiro para evitar múltiplos cliques

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 800); // Espera 1.5 segundos antes de desvirar
}

// Função para redefinir o tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];

    // Verificar se todas as cartas foram combinadas
    if (Array.from(cards).every(card => card.classList.contains('flip'))) {
        stopTimer(); // Para o cronômetro
        showResult(true); // Exibe mensagem de vitória
    }
}

// Seleciona todos os elementos de carta e adiciona eventos de clique
cards.forEach(card => card.addEventListener('click', flipCard));

// Evento de clique no botão "Jogar"
playButton.addEventListener('click', () => {
    cover.style.display = 'none'; // Esconde a capa
    startTimer(); // Inicia o cronômetro
});

// Evento de clique no botão "Voltar"
backButtonCover.addEventListener('click', () => {
    window.location.href = "./index.html";
});

// Evento de clique no botão "Pausar"
pauseButton.addEventListener('click', pauseGame);

// Evento de clique no botão "Reiniciar"
resetButton.addEventListener('click', restartGame);
