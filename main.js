const {app, BrowserWindow, Menu, shell} = require('electron')
const fs = require('fs')
const playerService = require('./src/services/playerService.js')
const syncService = require('./src/services/syncService.js')

let win

if (!fs.existsSync(app.getPath('documents')+'/xscreen')){
    fs.mkdirSync(app.getPath('documents')+'/xscreen');
    fs.mkdirSync(app.getPath('documents')+'/xscreen/contents');
    fs.createReadStream('.env').pipe(fs.createWriteStream(app.getPath('documents') + '/xscreen/.env'));
}

function createWindow () {

    var menu = Menu.buildFromTemplate([
        {
            label: 'Xscreen',
            submenu: [
                {label:'Edit settings', click() {
                    openSettings()
                }},
                {
                    label:'Exit',
                    click() {
                        app.quit()
                    },
                     accelerator: 'CmdOrCtrl+Q'
                }
            ]
        }
    ])

    Menu.setApplicationMenu(menu); 
    win = new BrowserWindow({width: 800, height: 600})
    win.loadFile('index.html')

    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

function openSettings() {
    shell.openItem(app.getPath('documents') + '/xscreen/.env');
}

