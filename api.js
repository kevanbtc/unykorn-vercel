import express from "express";
import dotenv from "dotenv";
import { XummSdk } from "xumm-sdk";

dotenv.config();
const app = express();
app.use(express.json());

const sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

app.get("/", (req, res) => res.json({ status: "🦄 UnyKorn Genesis API active" }));

app.get("/ping", async (req, res) => {
  try {
    const pong = await sdk.ping();
    res.json({ pong });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/mint", async (req, res) => {
  try {
    const { uri, soulbound } = req.body;
    const payload = {
      txjson: {
        TransactionType: "NFTokenMint",
        URI: Buffer.from(uri).toString("hex").toUpperCase(),
        Flags: soulbound ? 8 : 9,
        TransferFee: 0,
        NFTokenTaxon: 7,
      },
      custom_meta: {
        instruction: "Mint a Soulbound NFT via UnyKorn Genesis",
      },
      options: {
        submit: false,
        expire: 300,
      },
    };
    const r = await sdk.payload.create(payload);
    res.json({
      uuid: r.uuid,
      open: r.next?.always,
      qr: r.refs?.qr_png,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(4001, () =>
  console.log("🦄 UnyKorn Genesis API running on port 4001")
);
