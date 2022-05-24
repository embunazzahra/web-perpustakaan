import React, { useState, useEffect } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

const PeminjamanPage = () => {
  const [listPeminjaman, setListPeminjaman] = useState([]);
  const [ambil, setAmbil] = useState("");
  const [kembali, setKembali] = useState("");

  const id_anggota = localStorage.getItem("id_anggota");
  //   console.log(localStorage.getItem("id_anggota"));

  const getListPeminjaman = async () => {
    const body = { id_anggota: id_anggota };
    try {
      const response = await fetch("http://localhost:4000/ListPeminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const results = await response.json();
      //   console.log(results);
      setListPeminjaman(results);
    } catch (error) {
      console.error(error);
    }
  };

  const setStatusMengambil = async (id_pinjam) => {
    const body = { id_peminjaman: id_pinjam };
    try {
      const response = await fetch("http://localhost:4000/ambil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const results = await response.json();
      if (results.message === `Data terupdate`) {
        setAmbil("Belum Dikembalikan");
      } else {
        alert("something wrong..");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setStatusKembali = async (id_pinjam) => {
    const body = { id_peminjaman: id_pinjam };
    try {
      const response = await fetch("http://localhost:4000/kembali", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const results = await response.json();
      if (results.message === `Data terupdate`) {
        setKembali("Sudah Dikembalikan");
      } else {
        alert("something wrong..");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePeminjaman = async (id_pinjam) => {
    console.log(id_pinjam);
    try {
      const response = await fetch(`http://localhost:4000/hapus/${id_pinjam}`, {
        method: "DELETE",
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
  }, [listPeminjaman, ambil, kembali]);

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
                          {new Date(pinjam.tanggal_peminjaman).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {new Date(
                            pinjam.tanggal_akhir_peminjaman
                          ).toLocaleString()}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          class="bg-yellow-300 dropdown:block relative px-3 py-2 text-sm font-semibold leading-relaxed text-gray-800 transition-colors duration-150  border border-gray-300 rounded-lg focus:outline-none hover:border-gray-600 focus:shadow-outline focus:border-gray-900"
                          role="navigation"
                          aria-haspopup="true"
                        >
                          <div class="flex items-center">
                            <ArrowBackIosRoundedIcon sx={{ fontSize: 15 }} />
                            <span class="px-2 text-gray-700">Edit</span>
                            <EditRoundedIcon sx={{ fontSize: 15 }} />
                          </div>
                          <ul
                            class="bg-yellow-300 absolute -top-3 right-28 hidden w-auto p-2 mt-3 space-y-2 text-sm border border-gray-100 rounded-lg shadow-lg"
                            aria-label="submenu"
                          >
                            <li>
                              <a
                                class="inline-block w-full px-2 py-1 font-medium text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
                                href="#"
                                onClick={() =>
                                  setStatusMengambil(pinjam.id_peminjaman)
                                }
                                key={pinjam.id_peminjaman}
                              >
                                Belum Dikembalikan
                              </a>
                            </li>
                            <li>
                              <a
                                class="inline-block w-full px-2 py-1 font-medium text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
                                href="#"
                                onClick={() =>
                                  setStatusKembali(pinjam.id_peminjaman)
                                }
                              >
                                Sudah Dikembalikan
                              </a>
                            </li>
                          </ul>
                        </button>
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
