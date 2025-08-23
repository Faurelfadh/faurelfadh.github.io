const express = require('express');
const bodyParser = require('body-parser');
const client = require('./database');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path =  require('path');

app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json())

app.listen(3100, () => {
    console.log('Server running in port 3100')
})

client.connect(err => {
    if (err) {
        console.log('Error Not Connected', err.message)
    } else {
        console.log('Connected')
    }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });
/*
app.get('/api/berita', (req, res) => {
    client.query(`SELECT * FROM berita WHERE status = 1  ORDER BY id DESC LIMIT 10`, (err, result) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal mengambil berita'});
        } else {
            res.send(result.rows)
        }
    })
})*/
/* untuk menampilkan semua data tabel berita yang berstatus = 1 di bagian berita terkini */
app.get('/api/berita', async (req, res) => {
  const { kategori } = req.query;

  let query = `
    SELECT * FROM berita 
    WHERE status = 1
  `;
  const values = [];

  if (kategori) {
    query += ` AND kategori_id = $1`;
    values.push(kategori);
  }

  query += ` ORDER BY id DESC LIMIT 10`;

  try {
    const result = await client.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Gagal mengambil berita:', err);
    res.status(500).json({ error: 'Gagal mengambil berita' });
  }
});

/* untuk menampilkan semua data ditabel berita yang berstatus = 1 di bagian terpopuler  */
app.get('/api/berita-populer', (req, res) => {
    client.query(`SELECT * FROM berita WHERE status = 1  ORDER BY id ASC LIMIT 10`, (err, result) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal mengambil berita'});
        } else {
            res.send(result.rows)
        }
    })
})

/* untuk mengambil data dari tabel, data_wartawan, kategori_berita berdasarkan id dan menampilkannya dihalaman detail */
app.get('/api/berita/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
    SELECT 
    b.id, b.judul, b.tanggal_kejadian, b.waktu_dibuat, 
    b.isi, b.image, b.tags, b.status, w.nama_penulis, k.kategori
    FROM berita b JOIN data_wartawan w ON b.penulis_id = w.id
    JOIN kategori_berita k ON b.kategori_id = k.id
    WHERE b.id = $1`;

    const result = await client.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan'});
    }

     res.json(result.rows[0]);
    } catch (err) {
        console.error('Error saat mengambil detail berita:', err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

/* untuk mengambil dan menampilkan data sebelumnya di bagian halaman edit berdasarkan id */
app.get('/api/berita_edit/:id', (req, res) => {
    const { id } = req.params;

    client.query(`SELECT * FROM berita WHERE id = $1`, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal mengambil detail berita' });
        } else {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Berita tidak ditemukan' });
            } else {
                res.json(result.rows[0]);
            }
        }
    });
});

/* untuk mengambil id dan nama penulis di tabel data_wartawan */
app.get('/api/data_wartawan', (req, res) => {
    const query = 'SELECT id, nama_penulis FROM data_wartawan';
    client.query(query, (err, result) => {
        if (err) {
            console.error("Gagal mengambil data wartawan:", err);
            res.status(500).json({ error: "Gagal mengambil data wartawan" });
        } else {
            res.json(result.rows);
        }
    });
});

/* untuk menambahkan berita baru di tabel berita */
app.post('/api/berita', upload.single('image'), async (req, res) => {
    try {
  const { judul, isi, tanggal_kejadian, tags, penulis_id, kategori_id } = req.body;
  const image = req.file ? req.file.filename : null;

  const result = await client.query(
    `INSERT INTO berita (judul, isi, tanggal_kejadian, penulis_id, kategori_id, tags, image, status, waktu_dibuat) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, NOW()) RETURNING *`, [judul, isi, tanggal_kejadian, penulis_id, kategori_id, tags, image]
  );
  res.json(result.rows[0]);
  } catch (err) {
    console.error("Gagal menambahkan berita", err);
    res.status(500).json({error:"Gagal menambahkan berita"});
  }
});

/* untuk mengupdate data yang sudah ada didalam tabel berita berdasarkan id */
app.put('/api/berita/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { judul, isi, penulis_id, kategori_id, tanggal_kejadian, tags} = req.body;
    const image = req.file ? req.file.filename : null;
    const waktu_diedit = new Date();

    const idInt = parseInt(id);
    if (isNaN(idInt)) {
        return res.status(400).json({ error: "ID berita tidak valid" });
    }

    if (!penulis_id || penulis_id === "null") {
    return res.status(400).json({ error: "Penulis ID tidak boleh kosong" });
    }

    const query = `
        UPDATE berita SET judul=$1, isi=$2, penulis_id=$3, tanggal_kejadian=$4, tags=$5, image=$6, waktu_diedit=$7, kategori_id=$8
        WHERE id=$9 RETURNING *;
    `;
    const values = [judul, isi, penulis_id, tanggal_kejadian, tags, image, waktu_diedit, kategori_id, idInt];

    client.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal memperbarui berita' });
        } else {
            if (result.rowCount === 0) {
                res.status(404).json({ error: 'Berita tidak ditemukan' });
            } else {
                res.json({ message: 'Berita berhasil diperbarui', data: result.rows[0] });
            }
        }
    });
});

/* untuk menghapus yang ada didalam tabel berita */
app.delete('/api/berita/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            "UPDATE berita SET status = 0, waktu_diedit = NOW() WHERE id  = $1 RETURNING *", [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({message: "Berita tidak ditemukan"});
        }
        res.json({ message: "Berita berhasil dihapus"});
    } catch (error) {
    console.error("Error saat soft delete berita:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('Connected to PostgreSQL');