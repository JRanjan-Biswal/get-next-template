import path from "path";
import fs, { promises as fsPromises } from "fs";

const predefined = {
    sassOptions: `{\n\t\tincludePaths: [path.join(__dirname, 'styles')],\n\t},`,
    lastBit: `\n\n}\n\nmodule.exports = nextConfig;`
}

export function firstBitHandler(projectpath, file) {
    try {
        let fullpath = path.join(projectpath, file);
        fs.readFile(fullpath, 'utf8', (err, data) => {
            if (err) throw err;
            let newData = data.replace(/};\r\n\r\nmodule.exports = nextConfig;/g, '');
            fs.writeFile(fullpath, newData, 'utf8', (err) => err && console.log(err));
        })
    }
    catch (err) {
        return err
    }
}


export function readWriteFile(projectpath, file, packageOptions) {
    let fullpath = path.join(projectpath, file);

    try {
        fs.appendFile(fullpath, `\t${packageOptions}: ${predefined[packageOptions]}`, (err, result) => err && console.log(err))
    }
    catch (err) {
        return new Error(err);
    }

}

export function lastBitHanlder(projectpath, file = 'next.config.js', packageOptions) {
    let fullpath = path.join(projectpath, file);

    try {
        fs.appendFile(fullpath, predefined[packageOptions], (err, result) => err && console.log(err))
    }
    catch (err) {
        return new Error(err);
    }
}

export default {
    firstBitHandler,
    readWriteFile,
    lastBitHanlder
}