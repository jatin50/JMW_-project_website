import multer from "multer"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)

  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, or WEBP images are allowed"))
  }
  cb(null, true)
}

export const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})