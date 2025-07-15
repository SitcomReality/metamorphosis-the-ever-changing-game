export class ResourceManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.resourceTypes = {
            energy: { name: 'Energy', min: 0, max: 999 },
            materials: { name: 'Materials', min: 0, max: 999 },
            score: { name: 'Score', min: 0, max: 9999 }
        };
    }

    getResourceTypes() {
        return this.resourceTypes;
    }

    addResourceType(key, config) {
        this.resourceTypes[key] = {
            name: config.name || key,
            min: config.min || 0,
            max: config.max || 999,
            ...config
        };
        
        // Add to all existing players
        this.gameState.getAllPlayers().forEach(player => {
            if (!player.hasOwnProperty(key)) {
                player[key] = config.defaultValue || 0;
            }
        });
        
        this.gameState.notifyChange();
    }

    removeResourceType(key) {
        if (this.resourceTypes[key]) {
            delete this.resourceTypes[key];
            
            // Remove from all players
            this.gameState.getAllPlayers().forEach(player => {
                if (player.hasOwnProperty(key)) {
                    delete player[key];
                }
            });
            
            this.gameState.notifyChange();
        }
    }

    validateResourceAmount(resource, amount) {
        const resourceType = this.resourceTypes[resource];
        if (!resourceType) return false;
        
        return amount >= resourceType.min && amount <= resourceType.max;
    }

    clampResourceAmount(resource, amount) {
        const resourceType = this.resourceTypes[resource];
        if (!resourceType) return amount;
        
        return Math.max(resourceType.min, Math.min(resourceType.max, amount));
    }

    getPlayerResource(playerId, resource) {
        const player = this.gameState.getPlayer(playerId);
        return player ? player[resource] || 0 : 0;
    }

    setPlayerResource(playerId, resource, amount) {
        const clampedAmount = this.clampResourceAmount(resource, amount);
        this.gameState.updatePlayerResource(playerId, resource, clampedAmount - this.getPlayerResource(playerId, resource));
    }

    transferResource(fromPlayerId, toPlayerId, resource, amount) {
        const fromPlayer = this.gameState.getPlayer(fromPlayerId);
        const toPlayer = this.gameState.getPlayer(toPlayerId);
        
        if (!fromPlayer || !toPlayer) return false;
        if (fromPlayer[resource] < amount) return false;
        
        this.gameState.updatePlayerResource(fromPlayerId, resource, -amount);
        this.gameState.updatePlayerResource(toPlayerId, resource, amount);
        
        return true;
    }
}

