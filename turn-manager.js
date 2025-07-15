export class TurnManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.transitionDuration = 500;
        this.isTransitioning = false;
    }

    endCurrentTurn() {
        if (this.isTransitioning) return false;
        
        this.gameState.nextTurn();
        return true;
    }

    transitionToNextTurn(callback) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const overlay = document.getElementById('transition-overlay');
        const message = document.getElementById('transition-message');
        
        // Show transition overlay
        overlay.classList.add('active');
        message.textContent = 'Transitioning to next turn...';
        
        // Disable all game actions
        this.disableGameActions();
        
        setTimeout(() => {
            // Update the transition message
            const nextPlayer = this.gameState.getCurrentPlayer();
            message.textContent = `Player ${nextPlayer.id}'s Turn`;
            
            setTimeout(() => {
                // Hide overlay and re-enable actions
                overlay.classList.remove('active');
                this.enableGameActions();
                this.isTransitioning = false;
                
                if (callback) callback();
            }, this.transitionDuration);
        }, this.transitionDuration);
    }

    disableGameActions() {
        document.querySelectorAll('.game-action-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    enableGameActions() {
        document.querySelectorAll('.game-action-btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    getCurrentTurnInfo() {
        return {
            currentPlayer: this.gameState.getCurrentPlayer(),
            turnNumber: this.gameState.getTurnNumber(),
            isTransitioning: this.isTransitioning
        };
    }
}

