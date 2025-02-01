import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';

// Obtenir le chemin absolu du répertoire actuel (remplace __dirname)
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const router = Router();

router.post('/execute-script', (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Résolution dynamique du chemin du script Python et de l'environnement virtuel
    const scriptPath = path.resolve(__dirname, '../scripts/better_call.py');
    const venvPythonPath = path.resolve(__dirname, '../scripts/venv/bin/python3'); // Interpréteur Python dans l'environnement virtuel

    // Lancer directement le script Python avec l'interpréteur virtuel
    const pythonProcess = spawn(venvPythonPath, [scriptPath, userPrompt]);

    let scriptOutput = '';
    let scriptError = '';

    pythonProcess.stdout.on('data', (data) => {
      scriptOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      scriptError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (scriptError) {
        console.error('Python script error:', scriptError);
        return res.status(500).json({ error: 'Python script execution error', details: scriptError.trim() });
      }

      if (code !== 0) {
        return res.status(500).json({ error: 'Python script exited with error', code });
      }

      try {
        const jsonResponse = JSON.parse(scriptOutput.trim());
        res.json(jsonResponse);
      } catch (error) {
        console.error('Error parsing Python script output:', error);
        res.status(500).json({ error: 'Failed to parse script output' });
      }
    });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
