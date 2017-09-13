const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipc = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appIcon = null;
function createWindow () {
    // Create the browser window.
    //mainWindow = new BrowserWindow({width: 800, height: 600})
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        fullscreen:true
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/client/index.html`);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    try{
        appIcon = new Tray('icon/icon.ico');
    }catch (e){
        mainWindow.close();
    }

    var contextMenu = Menu.buildFromTemplate([
        { label: '显示程序', type: 'radio', click: iconMenu_show },
        { label: '隐藏程序', type: 'radio', click: iconMenu_hide },
        { label: '全屏模式', type: 'radio', click: iconMenu_full },
        { label: '窗口模式', type: 'radio', click: iconMenu_win },
        { label: '调试模式', type: 'radio', click: iconMenu_debug },
        { label: '刷新程序', type: 'radio', click: iconMenu_reload },
        { label: '关闭程序', type: 'radio', click: iconMenu_close }
    ]);
    appIcon.setToolTip('互动多媒体系统-Client');
    appIcon.setContextMenu(contextMenu);

    function iconMenu_show(){
        mainWindow.show();
    }
    function iconMenu_hide(){
        mainWindow.hide();
    }
    function iconMenu_full(){
        mainWindow.hide();
        mainWindow.setFullScreen(true);
        mainWindow.show();
    }
    function iconMenu_win(){
        mainWindow.hide();
        mainWindow.setFullScreen(false);
        mainWindow.show();
    }
    function iconMenu_reload(){
        mainWindow.webContents.reload();
    }
    function iconMenu_debug(){
        mainWindow.hide();
        mainWindow.setFullScreen(false);
        //mainWindow.webContents.reload();
        mainWindow.webContents.openDevTools({detach:true});
        mainWindow.show();
    }
    function iconMenu_close(){
        mainWindow.close()
    }

    ipc.on('pc-reset', function(){
        mainWindow.webContents.reload();
    });
    ipc.on('pc-close', function(){
        mainWindow.close()
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.