const terkiniList = document.getElementById("terkini-list"); // untuk mengambil elemen html dengan id
const terpopulerList = document.getElementById("terpopuler-list");

fetch("http://localhost:3100/api/berita")// untuk mengambil data dari database berita utama, dan jika error akan menampilkan pesan error
.then(response => response.json())
.then(data => {
  renderTerkini(data);
})
.catch(err => {
  console.error('Gagal mengambil data berita:', err);// menampilkan pesan error
});

function renderTerkini(beritaArray) {// untuk menampilkan data berita dari database di bagian terkini-list pada halaman utama 
  terkiniList.innerHTML = "";

  beritaArray.forEach(item => {// untuk menampilkan data berita dari database dalam bentuk kotak-kotak dan jika ditekan akan langsung pindah ke halaman detail berita
    const div = document.createElement("div");// untuk membuat elemen div baru bernama terkini-item
    div.className = "terkini-item";
    div.innerHTML =`
    <a href="detail.html?id=${item.id}">
    <img src="${item.image ? `http://localhost:3100/uploads/${item.image}` : 'default-image.jpg'}" alt="Gambar Berita" style="width:50px ; height=auto;"/>
    <div class="content">
    <h3>${item.judul}</h3>
    <div class="date">${item.tanggal_kejadian}</div> 
    </div>
    </a>
    `;
    terkiniList.appendChild(div);// untuk menambahkan elemen div kedalam elemen yanng disimpan di variabel terkiniList
  });
}

fetch("http://localhost:3100/api/berita-populer")// mengambil data berita terpopuler dari database, dan jika error akan menampilkan pesan error
.then(response => response.json())
.then(data => {
  renderTerpopuler(data);
})
.catch(err => {
  console.error('Gagal mengambil data berita:', err);// menampilkan pesan error
});

function renderTerpopuler(populerArray) {// untuk menampilkan data dari database di bagian terpopuler-list pada halaman utama
  terpopulerList.innerHTML = "";

  populerArray.forEach(item => {//untuk menampilkan data berita populer dalam bentuk list dan jika saslah satu ditekan akan langsung pindah ke halaman detail berita   
    const li = document.createElement("li");// untuk membuat elemen li baru 
    li.innerHTML =`
    <a href="detail.html?id=${item.id}">
    ${item.judul}
    </a>
    `;
    terpopulerList.appendChild(li);// untuk menambahkan elemen li kedalam elemen yang disimpan di variabel terpopulerList
  });
}

document.getElementById('btnLogout').addEventListener('click', function (e) {
  e.preventDefault();

  const yakin = confirm('Yakin ingin logout?');
  if (yakin) {
    window.location.href = 'login.html';
  }
})