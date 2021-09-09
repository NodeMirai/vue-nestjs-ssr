const path = require('path');


const manifestName = 'client-manifest.json';
const serverBundleName = 'server-bundle.json';


const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isPre = process.env.NODE_ENV === 'preonline';


const sourceDir = path.join(__dirname, '../views');
const clientEntry = {
    app: path.join(sourceDir,'entry-client.ts'),
};

const serverEntry = {
    app: path.join(sourceDir,'entry-server.ts'),

};

module.exports = {
    isDevelopment,
    isProduction,
    sourceDir,
    clientEntry,
    serverEntry,
    manifestName,
    serverBundleName,
    isPre
};
