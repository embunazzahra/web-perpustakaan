import React, { useState, useEffect } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useNavigate } from "react-router-dom";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

const Navbar = () => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <nav class="flex items-center justify-between flex-wrap bg-teal p-6 sticky top-0 z-50">
      <div class="flex items-center flex-no-shrink text-white mr-6">
        <MenuBookOutlinedIcon sx={{ fontSize: 40 }} />
        <span class="font-semibold text-xl tracking-tight ml-4">e-Library</span>
      </div>
      <div class="block lg:hidden">
        <button class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
          <svg
            class="h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <a
            href="/MainPage"
            class="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4"
          >
            List Buku
          </a>
          <a
            href="/Peminjaman"
            class="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4"
          >
            Peminjamanku
          </a>
        </div>
        <div>
          <a
            href="#"
            onClick={logOut}
            class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-white mt-4 lg:mt-0"
          >
            Log Out
          </a>
        </div>
      </div>
    </nav>
  );
};

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
      <Navbar />
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
