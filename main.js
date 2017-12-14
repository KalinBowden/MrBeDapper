/*
    Desc:   The main js for the Electron app.
    Dev:    Kalin Bowden.
    Date: 11.29.2017.
*/

// Constants for the instance of the Electron window
const electron = require('electron');
const url = require('url');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;

//
let mainMenu;
let addWindow;
let mainWindow;

//


//  Create the main GUI window for the app
app.on('ready', _=>{
    // Starting-up notification
    console.log('TaskList has started');

    // Create the window
    mainWindow = new BrowserWindow({ width:775, height:475, transparent: true, frame: true, toolbar: true});

    //
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    //
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Destroy window
    mainWindow.on('closed', _=>{mainWindow = null; console.log('TaskList has closed');})


})


//



//
//mainWindow.on('closed', _=>{app.quit();});

// Garbage Collection
//addWindow.on('closed', _=>{addWindow = null;});


// Instanciate a new window
function createAddWindow()
{
    // Starting-up notification
    console.log('AddWindow has started');

    // Create the window
    addWindow = new BrowserWindow({ width:250, height:190, transparent: false, frame: false});

    //
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    //
    addWindow.loadURL(`file://${__dirname}/addWindow.html`);

    // Destroy window
    addWindow.on('closed', _=>{addWindow = null; console.log('AddWindow has closed');})
}

// catch item add
ipc.on('item:add', function(e, item)
{
    console.log(item);
    mainWindow.webContents.send('item:add', item)
    addWindow.close();
})


const template =
[
    {label: electron.app.getName(), submenu: 
        [
            {label: 'Save As', click: _=>{mainWindow.webContents.send('task:upload')}},
            {label: 'Open', click: _=>{mainWindow.webContents.send('task:download')}},
            {type: 'separator'},
            {label: 'Add Item', click: _=>{createAddWindow()}},
            {label: 'Clear Items', click(){mainWindow.webContents.send('item:clear')}},
            {type: 'separator'}, 
            {label: 'Quit', click: _=>{app.quit()},accelerator: 'Ctrl+Q'}
        ]}
]


// Add developer tools when developing
if (process.env.NODE_ENV !== 'production')
{
    template.push({
        label: 'Developer Tools',
        submenu:
        [
            {label: 'Toggle DevTools', click(item, focusedWindow)
            {
                focusedWindow.toggleDevTools();
            }},
            {
                role: 'reload'
            }
        ]
    })
}

ipc.on('addTask', (ent, arg) =>{
    createAddWindow();
});


ipc.on('item:clear', (ent, arg) =>{
    mainWindow.webContents.send('item:clear');
});

ipc.on('app:close', (ent, arg) => {
    app.quit();
});

ipc.on('app:account', (ent, arg) => {
    mainWindow.webContents.send('app:account');
});

ipc.on('task:download', (ent, arg) => {
    mainWindow.webContents.send('task:download');
});

ipc.on('task:upload', (ent, arg) => {
    mainWindow.webContents.send('task:upload');
});

ipc.on('app:voice', (ent, arg) =>{
    mainWindow.webContents.send('app:voice');
});

ipc.on('app:refresh', (ent, arg) =>{
    mainWindow.webContents.send('app:refresh');
});