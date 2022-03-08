const multer = require('multer');
type FileFilterCallback = (error: Error | null, fileType: boolean) => void;
// Multer config

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
    if (!file.mimetype.startsWith('image')) {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
