export class ActionManager {
    constructor(gameState, resourceManager) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.actions = this.initializeActions();
    }

    initializeActions() {
        return {
            'gather-energy': {
                name: 'Gather Energy',
                description: 'Collect energy from the environment',
                cost: {},
                reward: { energy: 10 },
                execute: (player) => {
                    this.resourceManager.setPlayerResource(player.id, 'energy', 
                        this.resourceManager.getPlayerResource(player.id, 'energy') + 10);
                    return { success: true, message: `Player ${player.id} gathered 10 energy` };
                }
            },
            'collect-materials': {
                name: 'Collect Materials',
                description: 'Convert energy into materials',
                cost: { energy: 5 },
                reward: { materials: 5 },
                execute: (player) => {
                    if (player.energy < 5) {
                        return { success: false, message: 'Not enough energy' };
                    }
                    this.resourceManager.setPlayerResource(player.id, 'energy', player.energy - 5);
                    this.resourceManager.setPlayerResource(player.id, 'materials', player.materials + 5);
                    return { success: true, message: `Player ${player.id} collected 5 materials` };
                }
            },
            'convert-to-score': {
                name: 'Convert to Score',
                description: 'Convert materials into score points',
                cost: { materials: 10 },
                reward: { score: 1 },
                execute: (player) => {
                    if (player.materials < 10) {
                        return { success: false, message: 'Not enough materials' };
                    }
                    this.resourceManager.setPlayerResource(player.id, 'materials', player.materials - 10);
                    this.resourceManager.setPlayerResource(player.id, 'score', player.score + 1);
                    return { success: true, message: `Player ${player.id} converted materials to score` };
                }
            },
            'end-turn': {
                name: 'End Turn',
                description: 'End the current turn',
                cost: {},
                reward: {},
                execute: (player) => {
                    this.gameState.nextTurn();
                    return { success: true, message: `Player ${player.id} ended their turn` };
                }
            }
        };
    }

    executeAction(actionName, player) {
        const action = this.actions[actionName];
        if (!action) {
            return { success: false, message: 'Unknown action' };
        }

        return action.execute(player);
    }

    getAction(actionName) {
        return this.actions[actionName];
    }

    getAllActions() {
        return this.actions;
    }

    addAction(actionName, actionConfig) {
        this.actions[actionName] = actionConfig;
    }

    removeAction(actionName) {
        delete this.actions[actionName];
    }

    canPlayerPerformAction(player, actionName) {
        const action = this.actions[actionName];
        if (!action) return false;

        // Check if player has required resources
        for (const [resource, cost] of Object.entries(action.cost)) {
            if (player[resource] < cost) {
                return false;
            }
        }

        return true;
    }
}

