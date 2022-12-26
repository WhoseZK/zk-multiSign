import path from "path";
import fs from "fs";
import getConfig from "next/config";

export default function handler(req, res) {
    const { serverRuntimeConfig } = getConfig();
    const folder = "zkp"
    const dir = path.join(serverRuntimeConfig.PROJECT_ROOT, "./public", folder);
    //const dir = path.join(process.cwd(), folder);
    const fileNames = fs.readdirSync(dir);
    const object = {};
    fileNames.map(name => object[name.split(".")[1]] = path.join("/", folder, name));
    res.status(200).json(object);
}