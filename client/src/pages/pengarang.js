import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useLocation } from "react-router-dom";

const Pengarang = () => {
  const [dataPengarang, setDataPengarang] = useState([]);
  const location = useLocation();

  const getDataPengarang = async (id_pengarang) => {
    const body = id_pengarang;
    try {
      const response = await fetch("http://localhost:4000/pengarang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const results = await response.json();
      console.log(results);
      setDataPengarang(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDataPengarang(location.state);
    console.log(location.state);
  }, []);

  //page content

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Signika:wght@700&display=swap"
        rel="stylesheet"
      />
      <Navbar />
      <div className="flex items-center justify-center">
        <h1 className={`font-poppins text-7xl bg-red-200 mb-16 mt-16`}>
          Data Pengarang
        </h1>
      </div>

      <div className="container flex justify-center mx-auto">
        <div className="flex flex-col">
          <div className="w-full">
            <div className="border-b border-gray-200 shadow">
              <table className="divide-y divide-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      ID
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Nama Pengarang
                    </th>
                    <th className="px-6 py-2 text-xs text-gray-500 font-poppins">
                      Tanggal Lahir
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {dataPengarang.map((pengarang) => (
                    <tr className="whitespace-nowrap">
                      <td className="px-6 py-4 text-sm text-gray-500 font-poppins">
                        {pengarang.id_pengarang}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-poppins">
                          {pengarang.nama_pengarang}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-poppins">
                          {new Date(
                            pengarang.tanggal_lahir
                          ).toLocaleDateString()}
                        </div>
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
        <span class="font-semibold text-xl tracking-tight ml-4">DiG - Lib</span>
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

export default Pengarang;
