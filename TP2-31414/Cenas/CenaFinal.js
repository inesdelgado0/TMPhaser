class CenaFinal extends Phaser.Scene {
    constructor() {
        super('CenaFinal');
    }

    create() {
        // Música de vitória
        this.sound.play('vitoria', { volume: 0.5, loop: false });

        // Fundo escuro
        this.cameras.main.setBackgroundColor('#1a1a1a');

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Imagem decorativa trofeu
        this.add.image(centerX, centerY - 120, 'trofeu') 
            .setScale(1)
            .setOrigin(0.5);

        // Texto "Parabéns!" animado
        const titulo = this.add.text(centerX, centerY - 20,
            'Parabéns!',
            {
                fontSize: '42px',
                fontFamily: 'PressStart2P',
                color: '#ffff66'
            })
            .setOrigin(0.5);

        // Para as letras se mexerem
        this.tweens.add({
            targets: titulo,
            scale: { from: 1, to: 1.1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Mensagem de vitória
        this.add.text(centerX, centerY + 30,
            'Conseguiste entregar todos os gatos!',
            {
                fontSize: '20px',
                fontFamily: 'monospace',
                color: '#cccccc'
            })
            .setOrigin(0.5);

        // Botão "Voltar ao Menu"
        const btnMenu = this.add.text(centerX, centerY + 100,
            '▶ Voltar ao Menu', {
                fontSize: '18px',
                fontFamily: 'monospace',
                color: '#ffffff',
                backgroundColor: '#1a1a1a',
                padding: { x: 12, y: 6 }
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => btnMenu.setStyle({ backgroundColor: '#222222' }))
            .on('pointerout', () => btnMenu.setStyle({ backgroundColor: '#1a1a1a' }))
            .on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.start('InicioJogo');
            });

        // Créditos no rodapé
        this.add.text(centerX, this.scale.height - 30,
            'Desenvolvido por: Inês Delgado',
            {
                fontSize: '20px',          
                fontFamily: 'monospace',
                color: '#ffffff',           
                fontStyle: 'italic',
                stroke: '#004400',          
                strokeThickness: 2,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 2,
                    stroke: true,
                    fill: true
                }
            })
            .setOrigin(0.5);
            }
}
