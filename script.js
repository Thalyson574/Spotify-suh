// Configuração da Playlist de Aniversário
let playlist = [
    {
        title: "Cigarette Daydreams",
        artist: "Cage The Elephant",
        cover: "covers/1.jpg",
        file: "songs/1.mp3",
        duration: "3:29",
        lyrics: [
            "So pra nao me perder",
            "algo aqui",
            "...",
            "bla bla bla",
            "🎉🎂🎁"
        ],
        loved: false
    },
    {
        title: "The Only Exception",
        artist: "Paramore",
        cover: "covers/2.jpg",
        file: "songs/2.mp3",
        duration: "4:27",
        lyrics: [
            "1",
            "2",
            "3",
            "4",
            "🎈🥳🎊"
        ],
        loved: false
    },
    {
        title: "Sua Música",
        artist: "Turma Da Vaquinha",
        cover: "covers/3.jpg",
        file: "songs/3.mp3",
        duration: "2:14",
        lyrics: [
            "voce vai ler isso?",
            "tudo bem entao",
            "eu avisei",
            "bocó",
            "💃🕺🎶"
        ],
        loved: false
    },
    {
        title: "Ainda Bem",
        artist: "Vanessa Da Mata",
        cover: "covers/4.jpg",
        file: "songs/4.mp3",
        duration: "4:31",
        lyrics: [
            "ah",
            "blz",
            "para com isso",
            "So br",
            "quero mimha mae"
        ],
        loved: false
    },
    {
        title: "Best Friend",
        artist: "Rex Orange Country",
        cover: "covers/5.jpg",
        file: "songs/5.mp3",
        duration: "4:23",
        lyrics: [
            "okay okay",
            "voce venceu",
            "ja estou maluco",
            "feliz agora maluco?"
        ],
        loved: false
    }
];

// Música bônus do Premium
const premiumSong = {
    title: "No.1 Party Anthem",
    artist: "Arctic Monkeys",
    cover: "covers/premium.jpg",
    file: "songs/premium.mp3",
    duration: "3:00",
    lyrics: [
        "Parabéns!",
        "Você desbloqueou",
        "o modo Premium!",
        "🎉🎉🎉",
        "Aproveite sua música exclusiva!"
    ],
    isPremium: true,
    loved: false
};

// Elementos do DOM
const audioPlayer = document.getElementById('audioPlayer');
const playButton = document.getElementById('playButton');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const heartBtn = document.getElementById('heartBtn');
const lyricsBtn = document.getElementById('lyricsBtn');
const closeLyrics = document.getElementById('closeLyrics');
const lyricsPanel = document.getElementById('lyricsPanel');
const lyricsContent = document.getElementById('lyricsContent');
const playlistContainer = document.getElementById('playlistContainer');
const miniPlayBtn = document.getElementById('miniPlayBtn');
const birthdayCard = document.querySelector('.birthday-card');
const confettiContainer = document.querySelector('.confetti-container');
const nowPlayingText = document.getElementById('nowPlayingText');
const premiumIcon = document.getElementById('premiumIcon');
const albumCover = document.getElementById('albumCover');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const coverImage = document.getElementById('coverImage');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const miniCover = document.getElementById('miniCover');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const birthdayMessage = document.getElementById('birthdayMessage');

// Variáveis de estado
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeated = false;
let originalPlaylist = [...playlist];
let shuffledPlaylist = [];
let isPremiumUnlocked = false;

// Mensagem personalizada de aniversário
const messages = [
    "Que seu dia seja incrível como você!",
    "Muitas felicidades e sonhos realizados!",
    "Que este novo ciclo traga muita alegria!",
    "Você merece todo o amor do mundo!",
    "Celebre muito, você é especial!"
];

// Inicialização
function init() {
    renderPlaylist();
    loadSong(currentSongIndex);
    setupEventListeners();
    setRandomBirthdayMessage();
    
    // Adiciona estilo para a animação de confete
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(confettiStyle);
}

// Renderiza a playlist na tela
function renderPlaylist() {
    playlistContainer.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.classList.add('playlist-item');
        if (index === currentSongIndex) songElement.classList.add('active');
        if (song.isPremium) songElement.classList.add('premium');
        
        songElement.innerHTML = `
            <div class="playlist-cover">
                <img src="${song.cover}" alt="${song.title}">
            </div>
            <div class="playlist-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <div class="playlist-duration">${song.duration}</div>
        `;
        
        songElement.addEventListener('click', () => playSelectedSong(index));
        playlistContainer.appendChild(songElement);
    });
}

// Carrega uma música específica
function loadSong(index) {
    // Verifica se o índice é válido
    if (index < 0 || index >= playlist.length) return;

    const song = playlist[index];
    
    // Atualiza informações da música
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    coverImage.src = song.cover;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    miniCover.src = song.cover;
    durationEl.textContent = song.duration;
    
    // Atualiza classes premium
    updatePremiumStyles(song);
    
    try {
        // Carrega o áudio
        audioPlayer.src = song.file;
        
        // Se a música for premium, mostra efeitos especiais
        if (song.isPremium) {
            showPremiumEffects();
        }
    } catch (error) {
        console.error("Erro ao carregar música:", error);
    }
    
    // Atualiza o coração
    updateHeartButton(song);
    
    // Atualiza a playlist visível
    updateActiveSongInPlaylist();
    
    // Se estava tocando, continua tocando
    if (isPlaying) {
        audioPlayer.play()
            .then(() => {
                updatePlayButtons(true);
            })
            .catch(error => {
                console.error("Erro ao reproduzir:", error);
            });
    }
}

// Atualiza os estilos premium
function updatePremiumStyles(song) {
    // Limpa classes premium
    document.body.classList.remove('premium');
    songTitle.classList.remove('premium');
    artistName.classList.remove('premium');
    progressBar.classList.remove('premium');
    currentTimeEl.classList.remove('premium-time');
    durationEl.classList.remove('premium-time');
    lyricsBtn.classList.remove('premium');
    albumCover.classList.remove('premium');
    playButton.classList.remove('premium');
    miniPlayBtn.classList.remove('premium');
    heartBtn.classList.remove('premium');
    premiumIcon.classList.remove('premium');
    
    // Se for música premium, adiciona classes
    if (song.isPremium || isPremiumUnlocked) {
        document.body.classList.add('premium');
        songTitle.classList.add('premium');
        artistName.classList.add('premium');
        progressBar.classList.add('premium');
        currentTimeEl.classList.add('premium-time');
        durationEl.classList.add('premium-time');
        lyricsBtn.classList.add('premium');
        albumCover.classList.add('premium');
        playButton.classList.add('premium');
        miniPlayBtn.classList.add('premium');
        heartBtn.classList.add('premium');
        premiumIcon.classList.add('premium');
    }
}

// Atualiza o botão de coração
function updateHeartButton(song) {
    if (song.loved) {
        heartBtn.classList.add('active');
        heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        heartBtn.classList.remove('active');
        heartBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
}

// Atualiza os botões de play/pause
function updatePlayButtons(playing) {
    const icon = playing ? 'pause' : 'play';
    playButton.innerHTML = `<i class="fas fa-${icon}"></i>`;
    miniPlayBtn.innerHTML = `<i class="fas fa-${icon}"></i>`;
}

// Atualiza o item ativo na playlist
function updateActiveSongInPlaylist() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// Toca a música selecionada da playlist
function playSelectedSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    playSong();
}

// Reproduz a música
function playSong() {
    isPlaying = true;
    audioPlayer.play()
        .then(() => {
            updatePlayButtons(true);
        })
        .catch(error => {
            console.error("Erro ao reproduzir:", error);
        });
}

// Pausa a música
function pauseSong() {
    isPlaying = false;
    audioPlayer.pause();
    updatePlayButtons(false);
}

// Próxima música
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Música anterior
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Ativa/desativa shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
    
    if (isShuffled) {
        // Cria uma playlist embaralhada
        shuffledPlaylist = [...playlist];
        const currentSong = shuffledPlaylist.splice(currentSongIndex, 1)[0];
        
        // Embaralha o resto
        for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
        }
        
        // Coloca a música atual no início
        shuffledPlaylist.unshift(currentSong);
        originalPlaylist = [...playlist];
        playlist = [...shuffledPlaylist];
        currentSongIndex = 0;
    } else {
        // Volta para a playlist original
        playlist = [...originalPlaylist];
        currentSongIndex = playlist.findIndex(song => song.title === songTitle.textContent);
    }
    
    renderPlaylist();
}

// Ativa/desativa repeat
function toggleRepeat() {
    isRepeated = !isRepeated;
    repeatBtn.classList.toggle('active');
    audioPlayer.loop = isRepeated;
}

// Atualiza a barra de progresso
function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    
    // Verifica se a duração é um número válido
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.setProperty('--progress', `${progressPercent}%`);
    currentTimeEl.textContent = formatTime(currentTime);
    
    // Atualiza a duração total se necessário
    if (durationEl.textContent === '0:00' || durationEl.textContent === 'NaN:NaN') {
        durationEl.textContent = formatTime(duration);
    }
}

// Formata o tempo (MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Define uma mensagem aleatória de aniversário
function setRandomBirthdayMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    birthdayMessage.textContent = messages[randomIndex];
}

// Verifica se todas as músicas foram curtidas
function checkPremiumUnlock() {
    const allLoved = playlist.every(song => song.loved);
    
    if (allLoved && !isPremiumUnlocked) {
        unlockPremium();
    }
}

// Desbloqueia o modo Premium
function unlockPremium() {
    isPremiumUnlocked = true;
    
    // Adiciona a música premium à playlist se ainda não estiver lá
    if (!playlist.some(song => song.isPremium)) {
        playlist.push(premiumSong);
        renderPlaylist();
    }
    
    // Mostra efeitos visuais
    showPremiumEffects();
    
    // Mensagem especial
    nowPlayingText.textContent = "Modo Premium Ativado!";
    nowPlayingText.classList.add('premium');
    premiumIcon.innerHTML = '<i class="fas fa-crown"></i>';
    premiumIcon.classList.add('premium');
    
    // Mostra badge de premium
    showPremiumBadge();
    
    // Efeito de confete especial
    createConfetti(true);
}

// Mostra efeitos visuais do Premium
function showPremiumEffects() {
    updatePremiumStyles(playlist[currentSongIndex]);
    createConfetti(true);
}

// Mostra badge de premium
function showPremiumBadge() {
    const badge = document.createElement('div');
    badge.className = 'premium-badge';
    badge.innerHTML = `
        <i class="fas fa-crown"></i>
        <div>MODO PREMIUM DESBLOQUEADO!</div>
        <small>Sua música exclusiva foi adicionada à playlist</small>
    `;
    document.body.appendChild(badge);
    
    // Mostra o badge
    setTimeout(() => {
        badge.classList.add('show');
    }, 100);
    
    // Esconde o badge após 3 segundos
    setTimeout(() => {
        badge.classList.remove('show');
        setTimeout(() => {
            badge.remove();
        }, 500);
    }, 3000);
}

// Configura os ouvintes de eventos
function setupEventListeners() {
    // Controles do player
    playButton.addEventListener('click', togglePlayPause);
    miniPlayBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Botão de coração
    heartBtn.addEventListener('click', () => {
        const currentSong = playlist[currentSongIndex];
        currentSong.loved = !currentSong.loved;
        
        if (currentSong.loved) {
            heartBtn.classList.add('active');
            heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
            createConfetti();
        } else {
            heartBtn.classList.remove('active');
            heartBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
        
        // Verifica se desbloqueou o Premium
        checkPremiumUnlock();
    });
    
    // Controles de letra
    lyricsBtn.addEventListener('click', () => {
        lyricsPanel.classList.add('active');
        lyricsContent.innerHTML = playlist[currentSongIndex].lyrics.map(line => `<p>${line}</p>`).join('');
    });
    
    closeLyrics.addEventListener('click', () => {
        lyricsPanel.classList.remove('active');
    });
    
    // Barra de progresso
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('durationchange', updateProgress);
    
    audioPlayer.addEventListener('ended', () => {
        if (!isRepeated) {
            nextSong();
        }
    });
    
    progressBar.addEventListener('click', (e) => {
        const progressWidth = e.target.clientWidth;
        const clickedPosition = e.offsetX;
        const duration = audioPlayer.duration;
        
        if (!isNaN(duration)) {
            audioPlayer.currentTime = (clickedPosition / progressWidth) * duration;
        }
    });
    
    // Cartão de aniversário
    birthdayCard.addEventListener('click', () => {
        birthdayCard.classList.toggle('flipped');
        if (birthdayCard.classList.contains('flipped')) {
            createConfetti();
        }
    });
    
    // Toque na capa do álbum para efeito especial
    coverImage.addEventListener('click', () => {
        createConfetti();
    });
}

// Alterna entre play e pause
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Cria efeito de confete
function createConfetti(isPremium = false) {
    // Limpa confetes existentes
    confettiContainer.innerHTML = '';
    
    // Cores dos confetes
    const colors = isPremium 
        ? ['gold', 'silver', '#ff6b9e', '#5bc0eb', '#ffd166']
        : ['#ff6b9e', '#5bc0eb', '#ffd166', '#06d6a0', '#ff9a8b'];
    
    // Quantidade de confetes
    const count = isPremium ? 100 : 50;
    
    // Cria os confetes
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // Animação
        const animationDuration = Math.random() * 3 + 2;
        confetti.style.animation = `confetti-fall ${animationDuration}s linear forwards`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove após a animação
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

// Inicializa o player quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);
