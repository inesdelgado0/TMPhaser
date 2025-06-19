window.onload = function() {

    var configuracoes = {
        type: Phaser.AUTO,
        width: 800,
        height: 624,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,    
                gravity: { y: 0 }
            }
        },
        audio: {
            disableWebAudio: false
        },
        scene: [AnimacoesPersonagens, MenuScene, JogoScene, UIScene, GameOver, CenaFinal],
    }

    var jogo = new Phaser.Game(configuracoes);

}

