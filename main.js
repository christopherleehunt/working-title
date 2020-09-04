const { app, BrowserWindow, Menu, ipcMain } = require("electron");
//For logging
// on Linux: ~/.config/{app name}/logs/{process type}.log
// on macOS: ~/Library/Logs/{app name}/{process type}.log
// on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
const log = require("electron-log");
//converts windows backslash \\ to universal forward slash /
const slash = require("slash");

//Set environment
process.env.NODE_ENV = "development";
//process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: isDev ? 800 : 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: `${__dirname}/assets/icons/astroPng2.png`,
  });

  // and load the index.html of the app
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// About Window (for MacOS)
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About workingtitle",
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/astroPng.png`,
    resizable: false,
    backgroundColor: "white",
  });

  // Loading files / URls. Either / or for files.
  aboutWindow.loadURL(`file://${__dirname}/app/about.html`);
  //mainWindow.loadFile(".app/index.html");
}

// Once initialization is done, open window
app.on("ready", () => {
  createMainWindow();

  // Build custom menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("ready", () => (mainWindow = null));
});

const menu = [
  //For MacOS menu bars only, creating 'About' page
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  // Creating developer options when in 'Developer' mode
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
  // Creating 'About' window for Windows and Linux
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

// Close for windows
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

// Close for mac
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
