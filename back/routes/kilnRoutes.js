import { Router } from 'express';
import axios from 'axios';

const router = Router();
const KILN_API_BASE_URL = 'https://api.kiln.fi/v1';
const KILN_API_TOKEN = "kiln_DBmNa8Y4Eu7O1ZCx9QMdTS4fQckBnWOEuwEqw9IM"; 

// Mappage des 'call' du script Python vers les endpoints Kiln
const CALL_TO_ENDPOINT = {
  'ks': 'eth/kiln-stats',         // Kiln stats
  'ns': 'eth/network-stats',      // Network stats
  'rd': 'eth/rewards',            // Rewards
  'st': 'eth/stakes',             // Stakes
  'ts': 'eth/transaction/status', // Transaction status
};

// Liste des endpoints autorisés
const ALLOWED_ENDPOINTS = new Set(Object.values(CALL_TO_ENDPOINT));

/**
 * Fonction pour interroger l'API Kiln
 * @param {string} endpoint - Endpoint Kiln
 * @param {Object} params - Paramètres de la requête
 * @returns {Promise<Object>} - Données récupérées
 */
const fetchKilnData = async (endpoint, params = {}) => {
	try {
    if (!ALLOWED_ENDPOINTS.has(endpoint)) {
      throw new Error(`Unauthorized endpoint: ${endpoint}`);
    }

    const response = await axios.get(`${KILN_API_BASE_URL}/${endpoint}`, {
      headers: { 'Authorization': `Bearer ${KILN_API_TOKEN}` },
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching Kiln API:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch data from Kiln API');
  }
};

/**
 * Route pour interroger Kiln en fonction des données du script Python
 */
router.post('/kiln', async (req, res) => {
  try {
    const { call, start_date, end_date, addr } = req.body;

    console.log('📝 Received request:', { call, start_date, end_date, addr }); // Debug log

    // ✅ Vérification des paramètres requis
    if (!call || !addr) {
      return res.status(400).json({ error: 'Missing required fields: call or addr' });
    }

    if ((call === 'rd' || call === 'ts') && (!start_date || !end_date)) {
      return res.status(400).json({ error: 'Missing required fields: start_date and end_date for rewards/transaction calls' });
    }

    // ✅ Vérification de l'endpoint
    const endpoint = CALL_TO_ENDPOINT[call];
    if (!endpoint) {
      return res.status(400).json({ error: 'Invalid "call" value, cannot map to an endpoint' });
    }

    console.log(`📡 Fetching Kiln API: ${endpoint}`); // Correct debug log

    // ✅ Préparer dynamiquement les paramètres en fonction du type de requête
    const params = (() => {
      switch (call) {
        case 'rd': // Rewards
          return { wallets: addr, start_date, end_date, include_usd: true };
        case 'st': // Stakes
          return { wallets: addr };
        case 'ts': // Transaction Status
          return { tx_hash: addr }; // Ici, 'addr' contient le tx_hash
        default:
          return {}; // Autres cas (comme 'ks' ou 'ns' sans paramètres spécifiques)
      }
    })();

    console.log(`📡 Fetching Kiln API: ${endpoint} with params`, params);

    // ✅ Récupération des données de Kiln
    const kilnData = await fetchKilnData(endpoint, params);

    // ✅ Envoi de la réponse
    res.json(kilnData);

  } catch (error) {
    console.error('❌ Error in /kiln route:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
