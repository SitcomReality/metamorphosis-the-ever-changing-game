export class GameState {
    constructor() {
        this.state = {
            currentPlayer: 1,
            turnNumber: 1,
            players: {
                1: { id: 1, energy: 100, materials: 50, score: 0 },
                2: { id: 2, energy: 100, materials: 50, score: 0 }
            },
            gameSettings: {
                maxPlayers: 2,
                gameStarted: true
            },
            customData: {}
        };
        
        this.subscribers = {};
    }

    initialize() {
        this.state = {
            currentPlayer: 1,
            turnNumber: 1,
            players: {
                1: { id: 1, energy: 100, materials: 50, score: 0 },
                2: { id: 2, energy: 100, materials: 50, score: 0 }
            },
            gameSettings: {
                maxPlayers: 2,
                gameStarted: true
            },
            customData: {}
        };
        this.notifyChange();
    }

    getCurrentPlayer() {
        return this.state.players[this.state.currentPlayer];
    }

    getPlayer(playerId) {
        return this.state.players[playerId];
    }

    getAllPlayers() {
        return Object.values(this.state.players);
    }

    getTurnNumber() {
        return this.state.turnNumber;
    }

    getCurrentPlayerId() {
        return this.state.currentPlayer;
    }

    nextTurn() {
        this.state.currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
        if (this.state.currentPlayer === 1) {
            this.state.turnNumber++;
        }
        this.notify('turnChanged');
        this.notifyChange();
    }

    updatePlayerResource(playerId, resource, amount) {
        if (this.state.players[playerId] && this.state.players[playerId].hasOwnProperty(resource)) {
            this.state.players[playerId][resource] = Math.max(0, this.state.players[playerId][resource] + amount);
            this.notifyChange();
            return true;
        }
        return false;
    }

    getCustomData(key) {
        return this.state.customData[key];
    }

    setCustomData(key, value) {
        this.state.customData[key] = value;
        this.notifyChange();
    }

    serialize() {
        return JSON.stringify(this.state);
    }

    loadState(serializedState) {
        try {
            this.state = JSON.parse(serializedState);
            this.notifyChange();
            return true;
        } catch (error) {
            console.error('Failed to load game state:', error);
            return false;
        }
    }

    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
    }

    notify(event, data) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(callback => callback(data));
        }
    }

    notifyChange() {
        this.notify('stateChanged');
    }
}

