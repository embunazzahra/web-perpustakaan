import React, { useState, useEffect } from "react";

const MainPage = () => {
  const [listBuku, setListBuku] = useState([]);
  const id_anggota = localStorage.getItem("id_anggota");
  console.log(localStorage.getItem("id_anggota"));

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
      <div className="flex items-center justify-center">
        <h1 className={`font-poppins text-7xl bg-red-200 mb-16 mt-16`}>
          e-Library
        </h1>
      </div>
      <div className="container flex justify-center mx-auto">
        <div className="flex flex-col">
          <div className="w-full">
            <div className="border-b border-gray-200 shadow">
              <table className="divide-y divide-gray-300 ">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      ID
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Judul Buku
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Kategori
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Pengarang
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Penerbit
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Tahun Terbit
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Pinjam
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {listBuku.map((buku) => (
                    <tr className="whitespace-nowrap">
                      <td className="px-6 py-4 text-sm text-gray-500 font-poppins">
                        {buku.id_buku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-poppins">
                          {buku.judul_buku}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {buku.nama_kategori_buku}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {buku.id_pengarang}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {buku.id_penerbit}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-poppins">
                        {new Date(buku.tahun_terbit).getFullYear()}
                      </td>
                      <td className="px-6 py-4">
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
