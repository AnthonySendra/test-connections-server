const fs = require('fs');

const touch = async (query) => {
  try {
    const filePath = process.env.TOUCH
    
    if (!query || !query.touch) {
      console.log("ignore touch")
      return {ignore: true, atime: await stat(filePath)}
    }

    let atime = new Date();
    if (query.touch !== "1" && query.touch !== "true") {
      atime = new Date(query.touch)
    }

    await touchFile(filePath, atime)

    return {atime}
  } catch (err) {
    return {error: err.toString()}
  }
};

const touchFile = async (path, atime) => {
  if (!fs.existsSync(path)) {
    await createFile(path)
  }
  
  return accessFile(path, atime)
}

const stat = async (path) => {
  if (!fs.existsSync(path)) {
    return null
  }

  return new Promise((resolve, reject) => {
    fs.stat(path, (error, stats) => {
      if (error) {
        return reject(error)
      }
    
      resolve(stats.atime)
    });
  })
}

const createFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.open(path, 'w', (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

const accessFile = (path, atime) => {
  return new Promise((resolve, reject) => {
    fs.utimes(path, atime, atime, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

module.exports = touch;
