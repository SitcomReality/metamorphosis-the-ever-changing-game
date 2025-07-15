import { PlayerManager } from "./player-manager.js";

export class ActionManager {
    constructor(gameState, resourceManager) {
        this.gameState = gameState;
        this.resourceManager = resourceManager; // This might be redundant if we use PlayerManager
        this.playerManager = new PlayerManager(gameState);
        this.actions = this.initializeActions();
    }

    initializeActions() {
        return {
            'gather-energy': {
                name: 'Gather Energy',
                description: 'Collect energy from the environment',
                cost: { actionPoints: 1 },
                reward: { energy: 10 },
                execute: (player) => {
                    this.playerManager.givePlayerResources(player.id, { energy: 10 });
                    return { success: true, message: `Player ${player.id} gathered 10 energy` };
                }
            },
            'collect-materials': {
                name: 'Collect Materials',
                description: 'Convert energy into materials',
                cost: { energy: 5, actionPoints: 1 },
                reward: { materials: 5 },
                execute: (player) => {
                    this.playerManager.givePlayerResources(player.id, { materials: 5 });
                    return { success: true, message: `Player ${player.id} collected 5 materials` };
                }
            },
            'convert-to-score': {
                name: 'Convert to Score',
                description: 'Convert materials into score points',
                cost: { materials: 10, actionPoints: 1 },
                reward: { score: 1 },
                execute: (player) => {
                    this.playerManager.givePlayerResources(player.id, { score: 1 });
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
                    return { success: true, message: `Player ${player.id} ended their turn`, skipCost: true };
                }
            }
        };
    }

    executeAction(actionName, player) {
        const action = this.actions[actionName];
        if (!action) {
            return { success: false, message: 'Unknown action' };
        }

        if (!this.canPlayerPerformAction(player, actionName)) {
            return { success: false, message: 'Cannot afford action' };
        }

        // Charge player for action, unless skipped
        if (!action.execute.toString().includes('skipCost: true')) { // A bit of a hack, but works for the current setup
             if(!this.playerManager.chargePlayer(player.id, action.cost)) {
                 return { success: false, message: 'Could not charge player for action' };
             }
        }
        
        if (actionName === 'end-turn') {
            return action.execute(player);
        }

        const result = action.execute(player);
        this.gameState.notifyChange(); // Manually notify for actions that don't change turns
        return result;
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