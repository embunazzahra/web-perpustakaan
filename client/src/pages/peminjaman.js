import React, { useState, useEffect } from "react";

const PeminjamanPage = () => {
  const [listPeminjaman, setListPeminjaman] = useState([]);
  const id_anggota = localStorage.getItem("id_anggota");
  console.log(localStorage.getItem("id_anggota"));

  const getListPeminjaman = async () => {
    const body = { id_anggota: id_anggota };
    try {
      const response = await fetch("http://localhost:4000/ListPeminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const results = await response.json();
      console.log(results);
      setListPeminjaman(results);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePeminjaman = async (id_pinjam) => {
    const body = { id_peminjaman: id_pinjam };
    console.log(id_pinjam);
    try {
      const response = await fetch(`http://localhost:4000/hapus/${id_pinjam}`, {
        method: "DELETE",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(body),
      });
      const results = await response.json();
      console.log(results);
      if (results.message === `Data berhasil dihapus`) {
        setListPeminjaman(
          listPeminjaman.filter(
            (pinjam) => pinjam.pinjam.id_peminjaman !== id_pinjam
          )
        );
      } else {
        alert("Gagal dihapus");
      }
    } catch (error) {}
  };

  useEffect(() => {
    getListPeminjaman();
  }, [listPeminjaman]);

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Signika:wght@700&display=swap"
        rel="stylesheet"
      />
      <div className="flex items-center justify-center">
        <h1 className={`font-poppins text-7xl bg-red-200 mb-16 mt-16`}>
          Peminjamanku
        </h1>
      </div>
      <div className="container flex justify-center mx-auto">
        <div className="flex flex-col">
          <div className="w-full">
            <div className="border-b border-gray-200 shadow">
              <table className="divide-y divide-gray-300 ">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-2 text-xs text-gray-600 font-poppins">
                      ID Peminjaman
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-600 font-poppins">
                      Judul Buku
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-600 font-poppins">
                      Status Pengembalian
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-600 font-poppins">
                      Tanggal Peminjaman
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-600 font-poppins">
                      Tanggal Akhir Peminjaman
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-600 font-poppins">
                      Ganti Status
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-600 font-poppins">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {listPeminjaman.map((pinjam) => (
                    <tr className="whitespace-nowrap">
                      <td className="px-6 py-4 text-sm text-gray-500 font-poppins">
                        {pinjam.id_peminjaman}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-poppins">
                          {pinjam.id_buku}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {pinjam.status_pengembalian}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {pinjam.tanggal_peminjaman}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {pinjam.tanggal_akhir_peminjaman}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          key={pinjam.id_peminjaman}
                          href=""
                          //   onClick={(e) => pinjamBuku(e, buku.id_buku)}
                          className="px-4 py-1 text-sm text-black bg-yellow-300 rounded-full font-poppins"
                        >
                          edit
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          key={pinjam.id_peminjaman}
                          href=""
                          onClick={() => deletePeminjaman(pinjam.id_peminjaman)}
                          className="px-4 py-1 text-sm text-white bg-red-500 rounded-full font-poppins"
                        >
                          hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeminjamanPage;
