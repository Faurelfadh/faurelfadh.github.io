const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`http://localhost:3100/api/berita_edit/${id}`)//mengambil data berita sebelumnya 
    .then(response => response.json())
    .then(data => {
        if (!data) {
            alert("Data tidak ditemukan");
            window.location.href = "../index.html";//jika data tidak ditemukan akan menampilkan pesan error dan langsung pindah ke halaman utama
        } else {//menampilkan detail berita sebelumnya
            document.getElementById('judul').value = data.judul;
            document.getElementById('penulis_id').value = data.penulis_id;
            document.getElementById('tanggal_kejadian').value = data.tanggal_kejadian.slice(0, 10);
            document.getElementById('kategori_id').value = data.kategori_id;
            document.getElementById('isi').value = data.isi;
            document.getElementById('tags').value = data.tags;
            document.getElementById('preview-image').src = `http://localhost:3100/uploads/${data.image}`;//langsung menampilkan gambar karena pada input file tidak bisa langsung mengisi karena alasan keamanan 
        }
    })
    .catch(err => {
        console.error(err);
        alert("Gagal mengambil data detail berita");
        window.location.href = "../index.html";//jika gagal mengambil detail berita akan menampilan pesan error dan langsung pindah ke halaman utama
    });  

document.getElementById("form-edit").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form); 

  fetch(`http://localhost:3100/api/berita/${id}`, {//mengirim data baru ke endpoint update berdasarkan id
    method: "PUT",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Update berhasil!");
      window.location.href = "index.html";//jika berhasil akan menampilkan pesan berhasil dan langsung pindah ke halaman utama
    })
    .catch((err) => {
      console.error(err);
      alert("Gagal update!");//jika gagal akan menampilkan pesan gagal
    });
});