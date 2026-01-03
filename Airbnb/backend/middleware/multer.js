import multer from "multer"

import multer from "multer"
import os from "os"

// Use /tmp for serverless environments (Netlify/Lambda)
// os.tmpdir() is cross-platform safe
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir())
    },
    filename: (req, file, cb) => {
        // Use unique filenames to avoid collision? 
        // Originalname is fine for temp.
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage })

export default upload

export default upload