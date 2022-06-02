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
const { response } = require("express");

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
  const {
    nama_anggota,
    alamat_anggota,
    no_hp_anggota,
    username_anggota,
    password,
  } = req.body;

  console.log(req.body);
  if (
    nama_anggota == "" ||
    alamat_anggota == "" ||
    no_hp_anggota == "" ||
    username_anggota == "" ||
    password == ""
  ) {
    return res.status(400).json({
      message: "data harus lengkap.",
    });
  }

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
          return res.status(400).json({
            error: err,
          });
        } else {
          db.query(
            `SELECT id_anggota FROM anggota WHERE username_anggota LIKE '${req.body.username_anggota}'`,
            (err, hasil) => {
              if (err) {
                return res.status(500).json({
                  error: err,
                });
              }
              res.json({
                message: "Registrasi berhasil!",
                id_anggota: hasil.rows[0].id_anggota,
              });
            }
          );
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

  const query = `SELECT id_anggota,password FROM anggota WHERE username_anggota LIKE '${req.body.username_anggota}'`; //query ambil data user untuk login

  db.query(query, (err, results) => {
    //tambahkan konfigurasi login di sini
    if (err) {
      console.error(err);
      res.status(500).json({
        error: err,
      });

      return;
    } else {
      if (results.rows.length == 0) {
        res.json({ message: "Username tidak ditemukan!" });
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
              res.json({
                message: "berhasil login",
                id_anggota: results.rows[0].id_anggota,
              });
            } else {
              res.json({ message: "password salah" });
            }
          }
        );
      }
    }
  });
});

//router 3: Get semua informasi buku
app.get("/buku", (req, res) => {
  db.query(
    `SELECT * FROM tabel_buku where id_buku NOT IN (select peminjaman.id_buku from peminjaman where peminjaman.status_pengembalian = 'Belum Dikembalikan' )`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(results.rows);
    }
  );
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
      res.json({ message: `Data berhasil ditambahkan` });
    }
  );
});

// //router 5: Update status udah diambil
app.put("/ambil", (req, res) => {
  db.query(
    `UPDATE peminjaman SET status_pengembalian = 'Belum Dikembalikan' WHERE id_peminjaman = '${req.body.id_peminjaman}'`,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ message: `Data terupdate` });
    }
  );
});

// Router 6: Update status udah dikembaliin
app.put("/kembali", (req, res) => {
  db.query(
    `UPDATE peminjaman SET status_pengembalian = 'Sudah Dikembalikan' WHERE id_peminjaman = '${req.body.id_peminjaman}'`,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ message: `Data terupdate` });
    }
  );
});

//Router 7: Delete jika tidak jadi
app.delete("/hapus/:id", (req, res) => {
  db.query(
    `DELETE FROM peminjaman WHERE id_peminjaman = '${req.params.id}' AND status_pengembalian = 'Belum Diambil'`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results.rowCount == 0) {
        res.json({
          message: `Data tidak berhasil dihapus, buku sudah diambil`,
        });
      } else {
        res.json({ message: `Data berhasil dihapus` });
      }
    }
  );
});

//Router 8: Menampilkan list peminjaman tiap orang
app.post("/ListPeminjaman", (req, res) => {
  db.query(
    `SELECT peminjaman.id_peminjaman, peminjaman.id_buku, buku.judul_buku, peminjaman.id_anggota, anggota.nama_anggota, peminjaman.tanggal_peminjaman, 
	peminjaman.tanggal_akhir_peminjaman, peminjaman.status_pengembalian FROM peminjaman, buku, anggota 
	WHERE peminjaman.id_buku = buku.id_buku AND anggota.id_anggota = '${req.body.id_anggota}' AND anggota.id_anggota = peminjaman.id_anggota`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(results.rows);
    }
  );
});

//Router 9: List penerbit pengarang per id
app.post("/pengarang", (req, res) => {
  db.query(
    `SELECT * FROM pengarang where id_pengarang = '${req.body.id_pengarang}'`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(results.rows);
    }
  );
});

//Router 10: List penerbit penerbit per id
app.post("/penerbit", (req, res) => {
  db.query(
    `SELECT * FROM penerbit where id_penerbit = '${req.body.id_penerbit}'`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(results.rows);
    }
  );
});

//Router 11: cari
app.post("/cari", (req, res) => {
  db.query(
    `SELECT * FROM tabel_buku where UPPER(judul_buku) like UPPER('%${req.body.judul_buku}%') `,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(results.rows);
    }
  );
});

app.use("/", router);

app.listen(4000, () => console.log("listening on port 4000"));
