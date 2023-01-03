import path from "path";
import fs from "fs";
import getConfig from "next/config";

export default function handler(req, res) {
    const { serverRuntimeConfig } = getConfig();
    const object = {};
    const folder = "zkp"
    const dir = path.join(serverRuntimeConfig.PROJECT_ROOT, "./public", folder);
    const fileNames = fs.readdirSync(dir);
    fileNames.forEach(fileName => {
        let key = fileName.split(".")[0].toLowerCase();
        object[key] = object[key] || []
        object[key].push(path.join("/", folder, fileName));
    })
    res.status(200).json(object);
}