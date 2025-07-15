export class StorageManager {
    constructor() {
        this.gameKey = 'metamorphosis-game-state';
        this.settingsKey = 'metamorphosis-settings';
    }

    saveGame(gameData) {
        try {
            localStorage.setItem(this.gameKey, gameData);
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    loadGame() {
        try {
            const savedData = localStorage.getItem(this.gameKey);
            return savedData ? savedData : null;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    clearGame() {
        try {
            localStorage.removeItem(this.gameKey);
            return true;
        } catch (error) {
            console.error('Failed to clear game:', error);
            return false;
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem(this.settingsKey);
            return savedSettings ? JSON.parse(savedSettings) : null;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return null;
        }
    }

    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}

