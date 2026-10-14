import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import catalogue from JSON or build it
// We can compute the vectors and save server/catalogueEmbeddings.json directly
