const fs = require('fs');

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
    const lsFiles = []
    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err)
      }

      files.forEach(file => {
        lsFiles.push(file)
      });

      resolve(lsFiles)
    });
  })
}

module.exports = lsDir;
