const params = new URLSearchParams(window.location.search);//mengambil parameter id dari url
const id = params.get('id');

const terpopulerList = document.getElementById("terpopuler-list");

if (!id) {//jika id tidak ditemukan akan menampilkan pesan error dan akan langsung pindah ke halaman utama 
    alert("ID berita tidak ditemukan");
    window.location.href = "index.html";
}

fetch(`http://localhost:3100/api/berita/${id}`)//untuk mengambil data berita dari database berita berdasarkan id dan jika gagal akan menampilkan pesan error
    .then(response => response.json())
    .then(data => {
        if (!data) {
            alert("Data tidak ditemukan");
            window.location.href = "index.html";// pesan error
        } else {
            document.getElementById('judul').textContent = data.judul;//mengambil data dari tabel berita
            document.getElementById('tanggal_kejadian').textContent = formatTanggal(data.tanggal_kejadian);//mengambil data dari tabel berita
            document.getElementById('kategori_id').textContent = data.kategori;//mengambil data dari tabel kategori berita
            document.getElementById('penulis_id').textContent = data.nama_penulis;//mengambil data dari tabel data wartawan
            document.getElementById('tags').textContent = data.tags;//mengambil data dari tabel berita
            document.getElementById('image').src = `http://localhost:3100/uploads/${data.image}`;//mengambil gambar yang sudah diupload dan disimpan di folder uploads
            document.getElementById('isi').textContent = data.isi;//mengambil data dari tabel berita
            
            const deleteButton = document.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                hapusBerita(data.id);
            });//untuk memanggil fungsi hapusBerita dan akan menghapus berita yang sedang ditampilkkan
        }
    })
    .catch(err => {
        console.error(err);
        alert("Gagal mengambil data detail berita");
        window.location.href = "index.html";
    });//jika gagal mengambil data berita akan menampilkan pesar error dan akan langsung pindah ke halaman utama

    function formatTanggal(tanggal) {
    const d = new Date(tanggal);
    return d.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    };// untuk mengubah format penanggalan saat menampilkannya di detail

    function hapusBerita(id) {//untuk menghapus berita berdasarkan id
        if (confirm("Yakin ingin menghapus berita ini?")) {//menampilkan konfirmasi sebelum menghapus berita
            fetch(`http://localhost:3100/api/berita/${id}`, {//mengirim endpoint hapus untuk menghapus data berdasarkan parameter id
                method: "DELETE",
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = "index.html";//jika berhasil akan langsung pindah ke halaman utama 
            })
            .catch(err => {
                console.error("Gagal menghapus berita", err);//jika gagal akan menampilkan pesan error/gagal
            });
        }
    };

    fetch("http://localhost:3100/api/berita-populer")//mengambil data berita terpopuler dari database dan menampilkannya dalam bentuk list
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
        <a href="detail.html?id=${item.id}">
        ${item.judul}
        </a>
        `;
        terpopulerList.appendChild(li);
    });
    }