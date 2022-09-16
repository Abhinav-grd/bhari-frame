import { BrowserWindow, dialog, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { setIsAppQuitting, setIsUpdateAvailable } from '../main';
import { buildContextMenu } from '../utils/menu';

class AppUpdater {
    constructor() {
        log.transports.file.level = 'debug';
        autoUpdater.logger = log;
    }

    async checkForUpdate(tray: Tray, mainWindow: BrowserWindow) {
        await autoUpdater.checkForUpdatesAndNotify();
        autoUpdater.on('update-downloaded', () => {
            showUpdateDialog();
            setIsUpdateAvailable(true);
            tray.setContextMenu(buildContextMenu(mainWindow));
        });
    }
}

export default new AppUpdater();

export const showUpdateDialog = (): void => {
    dialog
        .showMessageBox({
            type: 'info',
            title: 'Install update',
            message: 'Restart to update to the latest version of ente',
            buttons: ['Later', 'Restart now'],
        })
        .then((buttonIndex) => {
            if (buttonIndex.response === 1) {
                setIsAppQuitting(true);
                autoUpdater.quitAndInstall();
            }
        });
};
