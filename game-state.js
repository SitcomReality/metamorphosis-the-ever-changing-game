export class GameState {
    constructor() {
        this.state = {
            currentPlayer: 1,
            turnNumber: 1,
            players: {
                1: { id: 1, energy: 100, materials: 50, score: 0, ap: 5 },
                2: { id: 2, energy: 100, materials: 50, score: 0, ap: 5 }
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
                1: { id: 1, energy: 100, materials: 50, score: 0, ap: 5 },
                2: { id: 2, energy: 100, materials: 50, score: 0, ap: 5 }
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
        // Always refresh AP for both players (even though only one should get AP)
        // But only the player whose turn it is should get 5 fresh AP
        // All AP is refreshed for next player, current player keeps whatever AP, next active gets refilled
        // For this game: we will reset AP to 5 for the player whose turn is starting

        this.state.currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
        if (this.state.currentPlayer === 1) {
            this.state.turnNumber++;
        }
        // Reset AP to 5 for new player
        this.state.players[this.state.currentPlayer].ap = 5;
        this.notify('turnChanged');
        this.notifyChange();
    }

    updatePlayerResource(playerId, resource, amount) {
        // If it's AP, prevent AP below 0 or above 5
        if (
            this.state.players[playerId] &&
            this.state.players[playerId].hasOwnProperty(resource)
        ) {
            if (resource === "ap") {
                const newAp = Math.max(0, Math.min(5, this.state.players[playerId].ap + amount));
                this.state.players[playerId].ap = newAp;
                this.notifyChange();
                return true;
            } else {
                this.state.players[playerId][resource] = Math.max(0, this.state.players[playerId][resource] + amount);
                this.notifyChange();
                return true;
            }
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

            // On load, if AP is missing, patch it
            if (!this.state.players[1].hasOwnProperty("ap")) this.state.players[1].ap = 5;
            if (!this.state.players[2].hasOwnProperty("ap")) this.state.players[2].ap = 5;

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