export class PlayerManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    createPlayer(id, initialResources = {}) {
        const defaultResources = {
            energy: 100,
            materials: 50,
            score: 0,
            actionPoints: 5
        };
        
        const playerData = {
            id,
            ...defaultResources,
            ...initialResources
        };
        
        return playerData;
    }

    getPlayerResources(playerId) {
        const player = this.gameState.getPlayer(playerId);
        if (!player) return null;
        
        return {
            energy: player.energy,
            materials: player.materials,
            score: player.score
        };
    }

    updatePlayerResource(playerId, resource, amount) {
        return this.gameState.updatePlayerResource(playerId, resource, amount);
    }

    canPlayerAfford(playerId, costs) {
        const player = this.gameState.getPlayer(playerId);
        if (!player) return false;
        
        for (const [resource, cost] of Object.entries(costs)) {
            if (player[resource] < cost) {
                return false;
            }
        }
        return true;
    }

    chargePlayer(playerId, costs) {
        if (!this.canPlayerAfford(playerId, costs)) {
            return false;
        }
        
        for (const [resource, cost] of Object.entries(costs)) {
            this.gameState.updatePlayerResource(playerId, resource, -cost);
        }
        return true;
    }

    givePlayerResources(playerId, rewards) {
        for (const [resource, amount] of Object.entries(rewards)) {
            this.gameState.updatePlayerResource(playerId, resource, amount);
        }
    }

    getPlayerScore(playerId) {
        const player = this.gameState.getPlayer(playerId);
        return player ? player.score : 0;
    }

    getLeaderboard() {
        const players = this.gameState.getAllPlayers();
        return players.sort((a, b) => b.score - a.score);
    }
}