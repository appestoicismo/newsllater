import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { isValidFileType } from '../services/fileProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + extension);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  if (isValidFileType(file.mimetype, file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use PDF, DOCX, TXT ou MD.'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB padrão
  }
});

export default upload;
