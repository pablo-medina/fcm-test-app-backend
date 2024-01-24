const { accessSync, constants, readFileSync } = require('fs');

const readJSONFile = path => {
    let fullPath;
    let path1 = `./${path}`;
    let path2 = `/etc/secrets/${path}`;
    if (fileExists(path1)) {
        fullPath = path1;
    } else if (fileExists(path2)) {
        fullPath = path2;
    } else {
        throw new Error(`No se puede encontrar archivo de configuración: ${path}`);
    }

    const rawFileContents = readFileSync(fullPath);
    let json;
    try {
        json = JSON.parse(rawFileContents);
    } catch (error) {
        throw new Error(`El archivo ${path} no está en un formato JSON válido`);
    }
    return json;
}

const fileExists = filePath => {
    try {
        accessSync(filePath, constants.F_OK);
        return true;
    } catch (_err) {
        return false;
    }
}

module.exports = {
    fileExists,
    readJSONFile
}
