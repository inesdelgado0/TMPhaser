window.onload = function() {

    var configuracoes = {
        type: Phaser.AUTO,
        width: 800,
        height: 624,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,    
                gravity: { y: 0 }
            }
        },
        audio: {
            disableWebAudio: false
        },
        scene: [AnimacoesPersonagens, UIScene, MenuScene, JogoScene, GameOver, CenaFinal],
    }

    var jogo = new Phaser.Game(configuracoes);

}

