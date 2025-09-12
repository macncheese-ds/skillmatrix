import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'empleado-' + uniqueSuffix + extension);
  }
});

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: fileFilter
});

// Endpoint para subir imagen
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se seleccionó ningún archivo' });
    }

    // Retornar la URL relativa del archivo
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'Imagen subida exitosamente',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
});

// Endpoint para eliminar imagen
router.delete('/delete/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'Imagen eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Imagen no encontrada' });
    }
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ message: 'Error al eliminar la imagen' });
  }
});

export default router;
