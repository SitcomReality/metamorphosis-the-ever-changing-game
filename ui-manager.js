export class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.elements = this.initializeElements();
        this.actionManager = null; // To be set by GameEngine
    }

    initializeElements() {
        return {
            turnNumber: document.getElementById('turn-number'),
            currentPlayer: document.getElementById('current-player'),
            player1AP: document.getElementById('player-1-ap'),
            player2AP: document.getElementById('player-2-ap'),
            transitionOverlay: document.getElementById('transition-overlay'),
            transitionMessage: document.getElementById('transition-message'),
            logEntries: document.getElementById('log-entries'),
            player1Panel: document.getElementById('player-1-panel'),
            player2Panel: document.getElementById('player-2-panel'),
            player1Energy: document.getElementById('player-1-energy'),
            player1Materials: document.getElementById('player-1-materials'),
            player1Score: document.getElementById('player-1-score'),
            player2Energy: document.getElementById('player-2-energy'),
            player2Materials: document.getElementById('player-2-materials'),
            player2Score: document.getElementById('player-2-score')
        };
    }

    updateUI() {
        this.updateTurnDisplay();
        this.updatePlayerPanels();
        this.updatePlayerResources();
        this.updateActionButtons();
        this.updateActionPoints();
    }

    updateTurnDisplay() {
        const currentPlayerId = this.gameState.getCurrentPlayerId();
        const turnNumber = this.gameState.getTurnNumber();
        
        this.elements.turnNumber.textContent = turnNumber;
        
        const playerIndicator = this.elements.currentPlayer.querySelector('.player-indicator');
        playerIndicator.textContent = `Player ${currentPlayerId}'s Turn`;
        playerIndicator.className = `player-indicator player-${currentPlayerId}`;
    }

    updatePlayerPanels() {
        const currentPlayerId = this.gameState.getCurrentPlayerId();
        
        // Update panel highlighting
        this.elements.player1Panel.classList.toggle('active', currentPlayerId === 1);
        this.elements.player2Panel.classList.toggle('active', currentPlayerId === 2);
    }

    updatePlayerResources() {
        const player1 = this.gameState.getPlayer(1);
        const player2 = this.gameState.getPlayer(2);
        
        if (player1) {
            this.elements.player1Energy.textContent = player1.energy;
            this.elements.player1Materials.textContent = player1.materials;
            this.elements.player1Score.textContent = player1.score;
        }
        
        if (player2) {
            this.elements.player2Energy.textContent = player2.energy;
            this.elements.player2Materials.textContent = player2.materials;
            this.elements.player2Score.textContent = player2.score;
        }
    }

    updateActionPoints() {
        const player1 = this.gameState.getPlayer(1);
        const player2 = this.gameState.getPlayer(2);
        const currentPlayerId = this.gameState.getCurrentPlayerId();

        const renderPips = (container, player, isActive) => {
            container.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const pip = document.createElement('div');
                const state = i < player.actionPoints ? 'active' : 'inactive';
                const activeClass = isActive ? state : 'inactive';
                pip.className = `ap-pip player-${player.id} ${activeClass}`;
                container.appendChild(pip);
            }
        };

        if (player1) {
            renderPips(this.elements.player1AP, player1, currentPlayerId === 1);
        }
        if (player2) {
            renderPips(this.elements.player2AP, player2, currentPlayerId === 2);
        }
    }

    updateActionButtons() {
        if (!this.actionManager) return;

        const currentPlayer = this.gameState.getCurrentPlayer();
        const actionButtons = document.querySelectorAll('.game-action-btn');
        
        actionButtons.forEach(btn => {
            const actionName = btn.dataset.action;
            if (actionName) {
                btn.disabled = !this.actionManager.canPlayerPerformAction(currentPlayer, actionName);
            }
        });
    }

    addLogEntry(message, className = '') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${className}`;
        logEntry.textContent = message;
        
        this.elements.logEntries.appendChild(logEntry);
        this.elements.logEntries.scrollTop = this.elements.logEntries.scrollHeight;
    }

    clearLog() {
        this.elements.logEntries.innerHTML = '';
    }

    showTransition(message, duration = 1000) {
        const overlay = this.elements.transitionOverlay;
        const messageElement = this.elements.transitionMessage;
        
        messageElement.textContent = message;
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, duration);
    }

    updateCustomElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        }
    }
}