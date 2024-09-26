function playGame(path) {
    const messageDiv = document.getElementById('message');
    messageDiv.classList.remove('hidden'); // Mostra o modal

    setTimeout(() => {
        messageDiv.classList.add('hidden'); // Esconde o modal após 3 segundos
        // Navegando para o caminho específico
        window.location.href = path;
    }, 3000);
}
