const multer = require('multer');
const path = require('path');
// Get the file name and extension with multer
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split('.').pop();
    const filename = `${new Date().getTime()}.${fileExt}`;
    cb(null, filename);
  },
});
// Filter the file to validate if it meets the required video extension
const videoFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(
      {
        message: 'Unsupported File Format',
      },
      false
    );
  }
};
// Filter the file to validate if it meets the required image extension
const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(
      {
        message: 'Unsupported File Format',
      },
      false
    );
  }
};
module.exports.video = multer({
  storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 30 * 1024 * 1024,
  },
  videoFilter,
});
module.exports.image = multer({
  storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 30 * 1024 * 1024,
  },
  imageFilter,
});
module.exports.fileName = function () {
  return (uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9));
};
