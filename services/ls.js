const fs = require('fs');
const path = require('path');

const lsDir = async () => {
  try {
    const directory = process.env.LS_DIR
    
    const files = await listFiles(directory)

    return {directory, files}
  } catch (err) {
    return {error: err.toString()}
  }
};

const listFiles = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, async (err, files) => {
      if (err) {
        return reject(err)
      }

      const lsFiles = await Promise.all(files.map(async (file) => {
        const filePath = path.join(dir, file)
        try {
          const stats = await fs.promises.stat(filePath)
          return {
            name: file,
            uid: stats.uid,
            gid: stats.gid,
            chmod: (stats.mode & 0o777).toString(8).padStart(3, '0')
          }
        } catch (statErr) {
          // If stat fails, return file name with null values
          return {
            name: file,
            uid: null,
            gid: null,
            chmod: null
          }
        }
      }))

      resolve(lsFiles)
    });
  })
}

module.exports = lsDir;
