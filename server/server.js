//import packages
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

//initialize the app as an express app
const app = express();
const router = express.Router();
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST,PUT,DELETE,OPTIONS,GET");
  next();
});

//Insiasi koneksi ke database
const db = new Client({
  host: "ivan-sbd.postgres.database.azure.com",
  port: 5432,
  user: "ivan_sbd",
  password: "Rahasia90",
  database: "website_perpustakaan",
  ssl: true,
});

//Melakukan koneksi dan menunjukkan indikasi database terhubung

//jalankan koneksi ke database
db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Database berhasil terkoneksi");
});

//middleware (session)
app.use(
  session({
    secret: "ini contoh secret",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var temp;

//ROUTERS

// //Router 1: Post anggota baru (register)
router.post("/register", (req, res) => {
  temp = req.session;
  temp.username = req.body.username_anggota;
  temp.password = req.body.password;

  //melakukan registrasi user baru ke dalam database
  //melakukan konfigurasi bycrpty di sini
  bcrypt.hash(temp.password, 10, function (err, hash) {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const query = `INSERT INTO anggota (nama_anggota, alamat_anggota, no_hp_anggota, username_anggota, password) 
		VALUES ('${req.body.nama_anggota}','${req.body.alamat_anggota}','${req.body.no_hp_anggota}','${req.body.username_anggota}', '${hash}')`;
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          res.json({ username_anggota: req.body.username_anggota });
          console.log("Registrasi berhasil!");
        }
      });
    }
  });
});

// //Router 2: Ngambil data anggota (login)
router.post("/login", (req, res) => {
  temp = req.session;
  temp.username = req.body.username_anggota;
  temp.password = req.body.password;

  //mengecek informasi yang dimasukkan user apakah terdaftar pada database

  const query = `SELECT password FROM anggota WHERE username_anggota LIKE '${req.body.username_anggota}'`; //query ambil data user untuk login

  db.query(query, (err, results) => {
    //tambahkan konfigurasi login di sini
    if (err) {
      console.error(err);
      res.send("Username tidak ditemukan!");
      return;
    } else {
      bcrypt.compare(
        temp.password,
        results.rows[0].password,
        (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          }
          console.log(`is match = ${isMatch}`);
          if (isMatch) {
            res.json({ username_anggota: req.body.username_anggota });
          } else {
            res.json({ error: "password salah!" });
          }
        }
      );
    }
  });
});

//router 3: Get semua informasi buku
app.get("/buku", (req, res) => {
  db.query(`SELECT * FROM buku`, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(results.rows);
  });
});

//router 4: Post tabel peminjaman buat minjam nentuin tanggal (seminggu)
app.post("/pinjam", (req, res) => {
  db.query(
    `INSERT INTO peminjaman(id_buku, id_anggota) VALUES('${req.body.id_buku}', '${req.body.id_anggota}' )`,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(
        `Data :'${req.body.id_buku}', '${req.body.id_anggota}' berhasil ditambahkan`
      );
    }
  );
});

// //router 5: Update status udah diambil
app.put("/ambil", (req, res) => {
  db.query(
    `UPDATE peminjaman SET status_pengembalian = 'Belum Dikembalikan' WHERE id_peminjaman = '${req.body.id_pinjam}'`,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(
        `Data dengan id_peminjaman ${req.body.id_pinjam} telah mengambil buku`
      );
    }
  );
});

// Router 6: Update status udah dikembaliin
app.put("/kembali", (req, res) => {
  db.query(
    `UPDATE peminjaman SET status_pengembalian = 'Sudah Dikembalikan' WHERE id_peminjaman = '${req.body.id_pinjam}'`,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(
        `Data dengan id_peminjaman ${req.body.id_pinjam} telah mengembalikan buku`
      );
    }
  );
});

//Router 7: Delete jika tidak jadi
app.delete("/hapus", (req, res) => {
  db.query(
    `DELETE FROM peminjaman WHERE id_peminjaman = '${req.body.id_pinjam}'`,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(
        `Data dengan id_peminjaman ${req.body.id_pinjam} berhasil dihapus`
      );
    }
  );
});

app.use("/", router);

app.listen(4000, () => console.log("listening on port 4000"));
