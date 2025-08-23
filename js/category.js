const terkiniList = document.getElementById("terkini-list");
const terpopulerList = document.getElementById("terpopuler-list");

fetch("http://localhost:3100/api/berita")
.then(response => response.json())
.then(data => {
  renderTerkini(data);
})
.catch(err => {
  console.error('Gagal mengambil data berita:', err);
});

function loadKategoriBerita() {//menampilkan data berita dari database dan menampilkannya dari pada bagian terkini-list
  const params = new URLSearchParams(window.location.search);// mengambil parameter kategori dari url
  const kategori =  params.get("kategori");

  fetch(`http://localhost:3100/api/berita?kategori=${kategori}`)//mengambil data berita dari database berita berdasarkan kategori dan jika gagal akan menampilkan pesan error/gagal
  .then(response => response.json())
  .then(data => {
    renderTerkini(data);
  })
  .catch(err => {
    console.error('Gagal mengambil data berita:', err);// pesan akan muncul berbentuk pop up 
    terkiniList.innerHTML = "<p>Gagal memuat berita.</p>";// pesan akan muncul dihalaman
  });
}

function renderTerkini(beritaArray) {
  terkiniList.innerHTML = "";

  beritaArray.forEach(item => {
    const div = document.createElement("div");
    div.className = "terkini-item";
    div.innerHTML =`
    <a href="../detail.html?id=${item.id}">
    <img src="${item.image ? `http://localhost:3100/uploads/${item.image}` : 'default-image.jpg'}" alt="Gambar Berita" style="width:50px ; height:auto;"/>
    <div class="content">
    <h3>${item.judul}</h3>
    <div class="date">${item.tanggal_kejadian}</div>
    </div>
    </a>
    `;
    terkiniList.appendChild(div);
  });

  if (beritaArray.length === 0) {
    terkiniList.innerHTML = "<p>Tidak ada berita untuk kategori ini</p>";// jika kategori yang kita pilih tidak ada, maka akan menampilkan tersebut 
  };
};

fetch("http://localhost:3100/api/berita-populer")
.then(response => response.json())
.then(data => {
  renderTerpopuler(data);
})
.catch(err => {
  console.error('Gagal mengambil data berita:', err);
});

function renderTerpopuler(populerArray) {
  terpopulerList.innerHTML = "";

  populerArray.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML =`
    <a href="../detail.html?id=${item.id}">
    ${item.judul}
    </a>
    `;
    terpopulerList.appendChild(li);
  });
}