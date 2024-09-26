    // Selecionando todos os cards de jogo
    const gameCards = document.querySelectorAll('.game-card');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const gameTitle = document.getElementById('game-title');
    const gameDescription = document.getElementById('game-description');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');

    // Dados fictícios dos jogos
    const gamesData = {
        'Jogo 1': 'Este é o Jogo 1, um jogo de estratégia envolvente.',
        'Jogo 2': 'Este é o Jogo 2, um emocionante jogo de aventura.',
        'Jogo 3': 'Este é o Jogo 3, um divertido jogo de quebra-cabeças.'
    };

    // Função para abrir o modal com detalhes do jogo
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameName = card.getAttribute('data-game');
            gameTitle.textContent = gameName;
            gameDescription.textContent = gamesData[gameName];
            modal.style.display = 'block';
        });
    });

    // Fechar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    })});


