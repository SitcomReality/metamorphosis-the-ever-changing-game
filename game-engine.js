import { StorageManager } from 'storage-manager';
import { PlayerManager } from 'player-manager';
import { TurnManager } from 'turn-manager';
import { ResourceManager } from 'resource-manager';
import { ActionManager } from 'action-manager';
import { UIManager } from 'ui-manager';
import { GameState } from 'game-state';

class GameEngine {
    constructor() {
        this.storageManager = new StorageManager();
        this.gameState = new GameState();
        this.playerManager = new PlayerManager(this.gameState);
        this.resourceManager = new ResourceManager(this.gameState);
        this.turnManager = new TurnManager(this.gameState);
        this.actionManager = new ActionManager(this.gameState, this.resourceManager);
        this.uiManager = new UIManager(this.gameState);
        
        this.initialize();
    }

    initialize() {
        // Load saved game or initialize new game
        const savedGame = this.storageManager.loadGame();
        if (savedGame) {
            this.gameState.loadState(savedGame);
            this.uiManager.addLogEntry('Game loaded from storage', 'system-message');
        } else {
            this.initializeNewGame();
        }

        this.setupEventListeners();
        this.uiManager.updateUI();
        this.uiManager.addLogEntry('Game initialized - Player 1\'s turn', 'system-message');
    }

    initializeNewGame() {
        this.gameState.initialize();
        this.uiManager.addLogEntry('New game started', 'system-message');
    }

    setupEventListeners() {
        // Game action buttons
        document.querySelectorAll('.game-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action) {
                    this.handleAction(action);
                }
            });
        });

        // System buttons
        document.getElementById('save-game').addEventListener('click', () => {
            this.saveGame();
        });

        document.getElementById('reset-game').addEventListener('click', () => {
            this.resetGame();
        });

        // Subscribe to game state changes
        this.gameState.subscribe('stateChanged', () => {
            this.uiManager.updateUI();
            this.autoSave();
        });

        this.gameState.subscribe('turnChanged', () => {
            this.handleTurnChange();
        });
    }

    handleAction(actionName) {
        const currentPlayer = this.gameState.getCurrentPlayer();
        const result = this.actionManager.executeAction(actionName, currentPlayer);
        
        if (result.success) {
            this.uiManager.addLogEntry(result.message, `player-${currentPlayer.id}-action`);
            this.gameState.notifyChange();
        } else {
            this.uiManager.addLogEntry(`Error: ${result.message}`, 'system-message');
        }
    }

    handleTurnChange() {
        this.turnManager.transitionToNextTurn(() => {
            this.uiManager.updateUI();
            const currentPlayer = this.gameState.getCurrentPlayer();
            this.uiManager.addLogEntry(`Player ${currentPlayer.id}'s turn begins`, 'system-message');
        });
    }

    saveGame() {
        const gameData = this.gameState.serialize();
        this.storageManager.saveGame(gameData);
        this.uiManager.addLogEntry('Game saved successfully', 'system-message');
    }

    autoSave() {
        // Auto-save every state change
        const gameData = this.gameState.serialize();
        this.storageManager.saveGame(gameData);
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
            this.storageManager.clearGame();
            this.initializeNewGame();
            this.uiManager.updateUI();
            this.uiManager.clearLog();
            this.uiManager.addLogEntry('Game reset - Player 1\'s turn', 'system-message');
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
});

