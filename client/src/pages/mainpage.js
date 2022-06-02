import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

const MainPage = () => {
  const [listBuku, setListBuku] = useState([]);
  const id_anggota = localStorage.getItem("id_anggota");
  console.log(localStorage.getItem("id_anggota"));

  const navigate = useNavigate();

  const Search = () => {
    const [judulBuku, setJudulBuku] = useState("");

    const getJudulBuku = async (e) => {
      e.preventDefault();
      const body = {
        judul_buku: judulBuku,
      };

      try {
        const response = await fetch("http://localhost:4000/cari", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        setListBuku(data);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div class="container flex justify-center items-center mb-7">
        <div class="relative">
          <div class="absolute top-4 left-3">
            <i class="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
          </div>
          <input
            type="text"
            class="h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none"
            placeholder="Cari judul buku..."
            onChange={(e) => setJudulBuku(e.target.value)}
          />
          <div class="absolute top-2 right-2">
            <button
              class="h-10 w-20 text-purple-700 rounded-lg bg-purple-200 hover:bg-purple-300"
              onClick={(e) => {
                if (judulBuku !== "") {
                  getJudulBuku(e);
                } else {
                  window.location = "/MainPage";
                }
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Navbar = () => {
    const logOut = () => {
      localStorage.clear();
      navigate("/");
    };
    return (
      <nav class="flex items-center justify-between flex-wrap bg-teal p-6 sticky top-0 z-50">
        <div class="flex items-center flex-no-shrink text-white mr-6">
          <MenuBookOutlinedIcon sx={{ fontSize: 40 }} />
          <span class="font-semibold text-xl tracking-tight ml-4">
            DiG - Lib
          </span>
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

  const getListBuku = async () => {
    try {
      const response = await fetch("http://localhost:4000/buku");
      const data = await response.json();

      setListBuku(data);
    } catch (error) {
      console.error(error);
    }
  };

  const pinjamBuku = async (e, id_buku) => {
    e.preventDefault();
    const body = {
      id_buku: id_buku,
      id_anggota: id_anggota,
    };
    try {
      const response = await fetch("http://localhost:4000/pinjam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.message === `Data berhasil ditambahkan`) {
        window.location = "/Peminjaman";
      } else {
        alert("something wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getListBuku();
  }, []);

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Signika:wght@700&display=swap"
        rel="stylesheet"
      />
      <Navbar />
      <div className="flex items-center justify-center">
        <h1 className={`font-poppins text-7xl bg-red-200 mb-16 mt-16`}>
          DiG - Lib
        </h1>
      </div>

      <Search />

      <div className="container flex justify-center mx-auto">
        <div className="flex flex-col justify-center w-full">
          <div className="">
            <div className="flex justify-center border-b border-gray-200 shadow">
              <table className="divide-y divide-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-xs text-gray-500 font-poppins">
                      ID
                    </th>
                    <th className="px-3 py-2 text-xs text-gray-500 font-poppins">
                      Judul Buku
                    </th>
                    <th className="px-3 py-2 text-xs text-gray-500 font-poppins">
                      Kategori
                    </th>
                    <th className="px-3 py-2 text-xs text-gray-500 font-poppins">
                      Pengarang
                    </th>
                    <th className="px-3 py-2 text-xs text-gray-500 font-poppins">
                      Penerbit
                    </th>
                    <th className="px-3 py-2 text-xs text-gray-500 font-poppins">
                      Tahun Terbit
                    </th>
                    <th className="px-3 py-2 text-xs text-gray-500 font-poppins">
                      Pinjam
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {listBuku.map((buku) => (
                    <tr className="whitespace-nowrap">
                      <td className="px-3 py-4 text-sm text-gray-500 font-poppins">
                        {buku.id_buku}
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900 font-poppins">
                          {buku.judul_buku}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {buku.nama_kategori_buku}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <a
                          key={`id'${buku.id_buku}'`}
                          href=""
                          onClick={() => {
                            navigate("/Pengarang", {
                              state: {
                                id_pengarang: buku.id_pengarang,
                              },
                            });
                          }}
                          className={`text-orange-700 bg-orange-200 px-4 py-1 text-sm rounded-full font-poppins`}
                        >
                          {buku.nama_pengarang}
                        </a>
                      </td>
                      <td className="px-3 py-4">
                        <a
                          key={`id-'${buku.id_buku}'`}
                          href=""
                          onClick={() => {
                            navigate("/Penerbit", {
                              state: {
                                id_penerbit: buku.id_penerbit,
                              },
                            });
                          }}
                          className={`text-lime-800 bg-lime-200 px-4 py-1 text-sm rounded-full font-poppins`}
                        >
                          {buku.nama_penerbit}
                        </a>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 font-poppins">
                        {new Date(buku.tahun_terbit).getFullYear()}
                      </td>
                      <td className="px-3 py-4">
                        <a
                          key={buku.id_buku}
                          href=""
                          onClick={(e) => pinjamBuku(e, buku.id_buku)}
                          className="px-4 py-1 text-sm text-blue-600 bg-blue-200 rounded-full font-poppins"
                        >
                          Pinjam
                        </a>
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

export default MainPage;
