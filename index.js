const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 4001;

app.use(cors());
app.use(express.json());


app.get('/artworks', async (req,res) => {
    try{
        const result = await pool.query(
            'SELECT id, name, artist, image_url FROM artworks ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Sunucu hatası'});
    }
});


app.get('/artworks/:id', async (req, res) => {
    try {
        const {id} = req.params;
        
        if(!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json({error: 'Geçersiz id'});
        }
        const artwork = await pool.query(
            'SELECT id, name, artist, image_url FROM artworks WHERE id = $1',
            [id]
        );

        if(artwork.rows.length === 0) {
            return res.status(404).json({ error: 'Eser bulunamadı'});
        }

        const stops = await pool.query(
            `SELECT id, stop_order, description , zoom_scale, zoom_position
             FROM artwork_stops
             WHERE artwork_id = $1
             ORDER BY stop_order`,
             [id]
        );

        res.json({...artwork.rows[0], stops: stops.rows});
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sunucu hatası'});
    }
});

app.listen(PORT, () => {
    console.log(`art-api ${PORT} portunda çalışıyor`);
});