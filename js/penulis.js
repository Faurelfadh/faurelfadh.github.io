const params = new URLSearchParams(window.location.search); //mengambil parameter id dari url
const id = params.get("id");
const terkiniList = document.getElementById("terkini-list"); // untuk mengambil elemen html dengan id
const terpopulerList = document.getElementById("terpopuler-list");

if (!id) {
  //jika id tidak ditemukan akan menampilkan pesan error dan akan langsung pindah ke halaman utama
  alert("ID berita tidak ditemukan");
  window.location.href = "index.html";
}

fetch(`http://localhost:3100/api/penulis/${id}`) //untuk mengambil data berita dari database berita berdasarkan id dan jika gagal akan menampilkan pesan error
  .then((response) => response.json())
  .then((data) => {
    if (!data) {
      alert("Data tidak ditemukan");
      window.location.href = "index.html"; // pesan error
    } else {
      const penulis = document.getElementById("penulis_id");
      penulis.innerText = data.nama_penulis;
      penulis.href = `penulis.html?id=${data.penulis_id}`;
    }
  })
  .catch((err) => {
    console.error(err);
    alert("Gagal mengambil data detail berita");
    window.location.href = "index.html";
  }); //jika gagal mengambil data berita akan menampilkan pesar error dan akan langsung pindah ke halaman utama

fetch("http://localhost:3100/api/berita-populer") //mengambil data berita terpopuler dari database dan menampilkannya dalam bentuk list
  .then((response) => response.json())
  .then((data) => {
    renderTerpopuler(data);
  })
  .catch((err) => {
    console.error("Gagal mengambil data berita:", err);
  });

function renderTerpopuler(populerArray) {
  terpopulerList.innerHTML = "";

  populerArray.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <a href="detail.html?id=${item.id}">
        ${item.judul}
        </a>
        `;
    terpopulerList.appendChild(li);
  });
}

fetch("http://localhost:3100/api/berita") // untuk mengambil data dari database berita utama, dan jika error akan menampilkan pesan error
  .then((response) => response.json())
  .then((data) => {
    renderTerkini(data);
  })
  .catch((err) => {
    console.error("Gagal mengambil data berita:", err); // menampilkan pesan error
  });

function renderTerkini(beritaArray) {
  // untuk menampilkan data berita dari database di bagian terkini-list pada halaman utama
  terkiniList.innerHTML = "";

  beritaArray.forEach((item) => {
    // untuk menampilkan data berita dari database dalam bentuk kotak-kotak dan jika ditekan akan langsung pindah ke halaman detail berita
    const div = document.createElement("div"); // untuk membuat elemen div baru bernama terkini-item
    div.className = "terkini-item";
    div.innerHTML = `
        <a href="detail.html?id=${item.id}">
        <img src="${
          item.image
            ? `http://localhost:3100/uploads/${item.image}`
            : "default-image.jpg"
        }" alt="Gambar Berita" style="width:50px ; height=auto;"/>
        <div class="content">
        <h3>${item.judul}</h3>
        <div class="date">${item.tanggal_kejadian}</div>
        </div>
        </a>
        `;
    terkiniList.appendChild(div); // untuk menambahkan elemen div kedalam elemen yanng disimpan di variabel terkiniList
  });
}
