const AWS = require("aws-sdk");

AWS.config.update({ maxRetries: 5 });

if (process.env.S3_REGION) {
  AWS.config.update({ region: process.env.S3_REGION });
}

const test = async () => {
  const status = {
    bucket: process.env.S3_BUCKET_NAME,
    ok: true
  };

  try {
    const s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      maxRetries: 3
    });
    const filename = `test-connections-server-${new Date().getTime()}`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: "test"
    };
    await s3.upload(uploadParams).promise();
    console.log("upload-after");
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename
      })
      .promise();
    console.log("delete-after");
  } catch (error) {
    console.log("error", error);
    status.ok = false;
    status.error = error;
  }

  return status;
};

module.exports = test;
