document.getElementById("form-tambah").addEventListener("submit", function (e) {
  e.preventDefault();//mengambil elemen html dan ketika ditekan akan mengirim data baru

  const form = e.target;
  const formData = new FormData(form);//mengambil semua input form 

  fetch("http://localhost:3100/api/berita", {//mengirim data baru ke endpoint tambah berdasarkan id
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Berhasil menambahkan berita baru!");
      window.location.href = "index.html";//jika berhasil akan menampilkan pesan berhasil dan langsung pindah ke halaman utama
    })
    .catch((err) => {
      console.error(err);
      alert("Gagal menambahkan berita baru!");//jika gagal akan menampilkan pesan gagal
    });
});