import fs from 'fs';

/**
 * Function for handling and saving file.
 * @param {Request} req
 * @returns {string} File extension of uploaded file
 */
export function handleFileSave(req) {
    const { originalname: filename, path } = req.file;
    const parts = filename.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    return ext;
}
