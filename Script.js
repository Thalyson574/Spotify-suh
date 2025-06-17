// Configuração da Playlist de Aniversário
const playlist = [
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
        loved: true
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
        ]
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
        ]
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
        ]
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
        ]
    }
];

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

// Elementos de informação
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
}

// Renderiza a playlist na tela
function renderPlaylist() {
    playlistContainer.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.classList.add('playlist-item');
        if (index === currentSongIndex) songElement.classList.add('active');
        
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
    const song = playlist[index];
    
    // Atualiza informações da música
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    coverImage.src = song.cover;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    miniCover.src = song.cover;
    durationEl.textContent = song.duration;
    
    // Carrega o áudio
    audioPlayer.src = song.file;
    
    // Atualiza o coração
    if (song.loved) {
        heartBtn.classList.add('active');
        heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        heartBtn.classList.remove('active');
        heartBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
    
    // Atualiza a playlist visível
    updateActiveSongInPlaylist();
    
    // Se estava tocando, continua tocando
    if (isPlaying) {
        audioPlayer.play()
            .then(() => {
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(error => {
                console.error("Erro ao reproduzir:", error);
            });
    }
}

// Atualiza o item ativo na playlist
function updateActiveSongInPlaylist() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
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
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        })
        .catch(error => {
            console.error("Erro ao reproduzir:", error);
        });
}

// Pausa a música
function pauseSong() {
    isPlaying = false;
    audioPlayer.pause();
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
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
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.setProperty('--progress', `${progressPercent}%`);
    currentTimeEl.textContent = formatTime(currentTime);
}

// Formata o tempo (MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Define uma mensagem aleatória de aniversário
function setRandomBirthdayMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    birthdayMessage.textContent = messages[randomIndex];
}

// Configura os ouvintes de eventos
function setupEventListeners() {
    // Controles do player
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    miniPlayBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Botão de coração
    heartBtn.addEventListener('click', () => {
        heartBtn.classList.toggle('active');
        playlist[currentSongIndex].loved = heartBtn.classList.contains('active');
        
        if (heartBtn.classList.contains('active')) {
            heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
            createConfetti();
        } else {
            heartBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
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
    
    audioPlayer.addEventListener('ended', () => {
        if (!isRepeated) {
            nextSong();
        }
    });
    
    progressBar.addEventListener('click', (e) => {
        const progressWidth = e.target.clientWidth;
        const clickedPosition = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickedPosition / progressWidth) * duration;
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

// Cria efeito de confete
function createConfetti() {
    // Limpa confetes existentes
    confettiContainer.innerHTML = '';
    
    // Cores dos confetes
    const colors = ['#ff6b9e', '#5bc0eb', '#ffd166', '#06d6a0', '#ff9a8b'];
    
    // Cria 50 confetes
    for (let i = 0; i < 50; i++) {
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
    
    // Adiciona a animação de confete ao CSS dinamicamente
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Inicializa o player quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);

// Adiciona estilo para a animação de confete
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(confettiStyle);