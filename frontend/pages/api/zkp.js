import path from "path";
import fs from "fs";

export default function handler(req, res) {
    const folder = "zkp"
    const dir = path.join(process.cwd(), folder);
    const fileNames = fs.readdirSync(dir);
    const object = {};
    fileNames.map(name => object[name.split(".")[1]] = path.join(process.cwd(), folder, name));
    console.log(object);
    res.status(200).json(object);
}