const { Web3 } = require('web3');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const contractABI = require('./ABINFT.json');
// Configura Web3
const web3 = new Web3('https://bsc-dataseed1.binance.org');

// Sostituisci questi valori con quelli del tuo contratto
const contractAddress = '0xF126a62fC8Ec4548006D49EAF6CF58cc3f5eb018';


const contract = new web3.eth.Contract(contractABI, contractAddress);

const app = express();
const port = 3002;

app.use(cors());
// Middleware per analizzare il body delle richieste
app.use(bodyParser.json());

// Funzione replacer per JSON.stringify che gestisce BigInt
function replacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  } else {
    return value;
  }
}

// Endpoint per leggere i token posseduti da un indirizzo
app.post('/isApprovedForAll', async (req, res) => {
  // Estrae il wallet e l'operatore dal body della richiesta
  const { wallet, operator } = req.body;

  // Verifica se sia il wallet che l'operatore sono forniti
  if (!wallet || !operator) {
      return res.status(400).send('Wallet o operatore mancante');
  }

  try {
      // Chiama il metodo isApprovedForAll del contratto passando wallet e operatore
      const isApproved = await contract.methods.isApprovedForAll(wallet, operator).call();

      // Risponde con il valore booleano restituito
      res.json({ isApproved });
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore nella verifica di isApprovedForAll');
  }
});
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
