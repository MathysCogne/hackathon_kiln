import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = Router();
const KILN_API_BASE_URL = 'https://api.kiln.fi/v1';
const KILN_API_TOKEN = process.env.KILN_API_KEY;

// 'call' du script Python vers les endpoints
const CALL_TO_ENDPOINT = {
  'ks': 'eth/kiln-stats',         // Kiln stats
  'ns': 'eth/network-stats',      // Network stats
  'rd': 'eth/rewards',            // Rewards
  'st': 'eth/stakes',             // Stakes
  'ts': 'eth/transaction/status', // Transaction status thx 
};

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


router.post('/kiln', async (req, res) => {
  try {
    const { call, start_date, end_date, addr } = req.body;

    console.log('📝 Received request:', { call, start_date, end_date, addr }); 


    if (!call) {
      return res.status(400).json({ error: 'Missing required fields: call' });
    }

    if ((call === 'rd' || call === 'ts') && (!start_date || !end_date)) {
      return res.status(400).json({ error: 'Missing required fields: start_date and end_date for rewards/transaction calls' });
    }


    const endpoint = CALL_TO_ENDPOINT[call];
    if (!endpoint) {
      return res.status(400).json({ error: 'Invalid "call" value, cannot map to an endpoint' });
    }

    console.log(` Fetching Kiln API: ${endpoint}`); 

    const params = (() => {
      switch (call) {
        case 'rd': // Rewards
          return { wallets: addr, start_date, end_date, include_usd: true };
        case 'st': // Stakes
          return { wallets: addr };
        case 'ts': // Transaction Status
          return { tx_hash: "0x43244f90814b31dec250de24df5bb023a338790c1d5a39244cf1064cf6d98c94" }; // Ici, 'addr' contient le tx_hash
        default:
          return {}; //  'ks'  'ns' call
      }
    })();

    console.log(`Fetching Kiln API: ${endpoint} with params`, params);

    const kilnData = await fetchKilnData(endpoint, params);

    res.json(kilnData);

  } catch (error) {
    console.error(' Error in /kiln route:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
