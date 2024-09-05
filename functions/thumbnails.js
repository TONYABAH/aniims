const { getStorage } = require("firebase-admin/storage");
const sp = require("child-process-promise");
const path = require("path");
const os = require("os");
const fs = require("fs");

const spawn = sp.spawn;

exports.generatethumb = async (event, app) => {
  {
    // [END v2storageGenerateThumbnailTrigger]
    // [START v2storageEventAttributes]
    const fileBucket = event.data.bucket; // Storage bucket containing the file.
    const filePath = event.data.name; // File path in the bucket.
    const contentType = event.data.contentType; // File content type.
    // console.log({ filePath, fileBucket, event });
    // [END v2storageEventAttributes]
    // [START v2storageStopConditions]
    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith("image/")) {
      return; // logger.log("This is not an image.");
    }
    // Exit if the image is already a thumbnail.
    const fileName = path.basename(filePath);
    if (fileName.startsWith("thumb_")) {
      return; //logger.log("Already a Thumbnail.");
    }
    // [END v2storageStopConditions]

    // [START v2storageThumbnailGeneration]
    // Download file from bucket.
    const bucket = getStorage(app).bucket(fileBucket);
    const tempPath = path.join(os.tmpdir(), fileName);
    await bucket.file(filePath).download({ destination: tempPath });
    //logger.log("Image downloaded locally to", tempPath);

    // Generate a thumbnail using ImageMagick.
    await spawn("convert", [tempPath, "-thumbnail", "200x200", tempPath]);
    //logger.log("Thumbnail created at", tempPath);

    // Prefix 'thumb_' to file name.
    const thumbFileName = `thumb_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Uploading the thumbnail.
    const metadata = { contentType: contentType };
    await bucket
      .upload(tempPath, {
        destination: path.dirname(filePath) + "/" + thumbFileName,
        metadata: metadata,
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        // Once the thumbnail has been uploaded,
        // delete the local file to free up disk space.
        return fs.unlinkSync(tempPath);
        // [END v2storageThumbnailGeneration]
      });
  }
};

