import path from "path";
import { promises as fsPromises } from "fs";

export default async function sassCreattion(directory, folder) {
    const fullpath = path.join(directory, folder, 'globals.css');
    const newPath = path.join(directory, folder, 'globals.scss');

    await fsPromises.rename(fullpath, newPath);
}