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
    await createFile(path, atime.toISOString());
  }
  
  return accessFile(path, atime);
};

const stat = async (path) => {
  if (!fs.existsSync(path)) {
    return null
  }

  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, content) => {
      if (error) {
        return reject(error)
      }
      
      try {
        // Parse the date from the file content
        const date = new Date(content)
        resolve(date)
      } catch (err) {
        reject(new Error('Invalid date format in file'))
      }
    });
  })
}

const createFile = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const accessFile = (path, atime) => {
  return new Promise((resolve, reject) => {
    // First write the new date to the file
    fs.writeFile(path, atime.toISOString(), (writeErr) => {
      if (writeErr) {
        return reject(writeErr);
      }
      
      // Then update the file timestamps
      fs.utimes(path, atime, atime, (err) => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  })
}

module.exports = touch;
