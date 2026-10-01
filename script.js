(function(){
  "use strict";
  const API = "https://jsonplaceholder.typicode.com/posts";
  const grid = document.getElementById("card-grid");
  const countTag = document.getElementById("count-tag");
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");
  const filterUser = document.getElementById("filter-user");
  const searchInput = document.getElementById("search-input");
  const refreshBtn = document.getElementById("refresh-btn");
  const createForm = document.getElementById("create-form");
  const editDialog = document.getElementById("edit-dialog");
  const editForm = document.getElementById("edit-form");
  const cancelEdit = document.getElementById("cancel-edit");
  const toastStack = document.getElementById("toast-stack");

  let posts = [];
  let localIdCounter = 5000; // avoid colliding with real ids for new posts
  const editedIds = new Set();
  const deletedIds = new Set();

  // JSONPlaceholder menyediakan teks contoh berbahasa Inggris yang tidak bermakna.
  // Ganti 30 kiriman awal dengan contoh berbahasa Indonesia untuk tampilan kartu.
  const localizedPosts = {
    1: ["Catatan tentang rencana yang matang", "Rencana yang baik dimulai dari tujuan yang jelas. Catat setiap langkah, tinjau kembali kebutuhan, lalu susun tindakan yang paling sesuai."],
    2: ["Waktu dan pengalaman", "Waktu memberi kita kesempatan untuk belajar dari pengalaman. Dengan memahami apa yang sudah terjadi, kita dapat menentukan langkah berikutnya dengan lebih bijak."],
    3: ["Belajar dari kesalahan", "Kesalahan dapat menjadi pelajaran yang berharga. Amati penyebabnya, tentukan cara memperbaikinya, dan gunakan pengalaman itu untuk membuat keputusan yang lebih baik."],
    4: ["Menjaga kebiasaan baik", "Kebiasaan baik tumbuh melalui latihan yang konsisten. Mulailah dari hal sederhana, lakukan secara rutin, lalu sesuaikan cara yang digunakan ketika diperlukan."],
    5: ["Memilih kata dengan bijak", "Sampaikan pendapat dengan jelas dan tetap menghargai orang lain. Kata-kata yang tepat membantu percakapan berjalan lebih baik dan mengurangi kesalahpahaman."],
    6: ["Melihat persoalan dari berbagai sisi", "Sebelum mengambil keputusan, kumpulkan informasi yang relevan dan pertimbangkan dampaknya. Sudut pandang yang beragam membantu kita memahami persoalan dengan lebih utuh."],
    7: ["Memulai dengan langkah sederhana", "Pekerjaan besar terasa lebih mudah ketika dibagi menjadi beberapa langkah kecil. Tentukan prioritas, mulai dari yang paling penting, lalu lanjutkan secara bertahap."],
    8: ["Menyusun ide dengan rapi", "Tuliskan gagasan utama terlebih dahulu, kemudian tambahkan rincian yang mendukungnya. Susunan yang teratur membuat ide lebih mudah dipahami dan dikembangkan."],
    9: ["Memeriksa informasi sebelum bertindak", "Pastikan informasi yang diterima berasal dari sumber yang dapat dipercaya. Periksa kembali rinciannya agar keputusan yang diambil sesuai dengan keadaan sebenarnya."],
    10: ["Menentukan pilihan yang tepat", "Bandingkan pilihan yang tersedia berdasarkan kebutuhan dan manfaatnya. Setelah mempertimbangkan risikonya, pilih langkah yang paling sesuai dengan tujuan."],
    11: ["Menghargai pendapat orang lain", "Setiap orang dapat memiliki pandangan yang berbeda. Dengarkan penjelasannya dengan saksama, ajukan pertanyaan dengan sopan, dan sampaikan tanggapan secara terbuka."],
    12: ["Menggunakan waktu secara teratur", "Buat daftar kegiatan dan tentukan waktu untuk menyelesaikannya. Jadwal yang realistis membantu pekerjaan berjalan lancar tanpa melupakan waktu istirahat."],
    13: ["Membangun kerja sama", "Kerja sama berjalan baik ketika setiap orang memahami tanggung jawabnya. Saling berbagi informasi dan membantu saat dibutuhkan akan mendukung hasil bersama."],
    14: ["Memilih cara yang sesuai", "Tidak semua cara cocok untuk setiap keadaan. Pahami kebutuhan yang ada, bandingkan beberapa pilihan, lalu gunakan cara yang paling bermanfaat."],
    15: ["Menghargai setiap proses", "Hasil yang baik sering membutuhkan waktu dan usaha. Tetaplah tekun, tinjau perkembangan secara berkala, dan rayakan kemajuan kecil yang sudah dicapai."],
    16: ["Mendengarkan dengan penuh perhatian", "Berikan perhatian saat orang lain berbicara dan pahami maksudnya sebelum menjawab. Kebiasaan ini membuat komunikasi lebih jelas dan saling menghormati."],
    17: ["Menghadapi perubahan dengan tenang", "Perubahan dapat membawa tantangan sekaligus peluang. Kenali hal yang dapat kita kendalikan, susun rencana, dan sesuaikan langkah ketika situasi berubah."],
    18: ["Menjaga keseimbangan kegiatan", "Atur waktu untuk bekerja, belajar, beristirahat, dan berkumpul bersama orang terdekat. Keseimbangan membantu kita tetap sehat dan menjalani kegiatan dengan baik."],
    19: ["Membuka diri terhadap gagasan baru", "Gagasan baru dapat membantu kita menemukan cara yang lebih baik. Pertimbangkan manfaatnya dengan saksama dan cobalah jika sesuai dengan kebutuhan."],
    20: ["Menyelesaikan tugas dengan cermat", "Pahami tujuan tugas sebelum mulai mengerjakannya. Periksa hasilnya setelah selesai agar informasi yang disampaikan tepat dan mudah dimengerti."],
    21: ["Menjaga rasa ingin tahu", "Ajukan pertanyaan dan cari penjelasan dari sumber yang tepercaya. Rasa ingin tahu mendorong kita untuk terus belajar dan memahami hal baru."],
    22: ["Menjelaskan sesuatu dengan jelas", "Sampaikan inti pembahasan terlebih dahulu, lalu berikan contoh yang relevan. Penjelasan yang terstruktur memudahkan orang lain mengikuti maksud kita."],
    23: ["Menghargai hal-hal sederhana", "Luangkan waktu untuk memperhatikan hal baik yang terjadi setiap hari. Sikap bersyukur membantu kita melihat pengalaman dengan lebih positif."],
    24: ["Mengenali penyebab masalah", "Kumpulkan fakta sebelum menentukan penyebab suatu masalah. Setelah memahami sumbernya, pilih tindakan yang dapat mengurangi dampak dan mencegahnya terulang."],
    25: ["Menyampaikan pesan secara teratur", "Susun pesan dengan urutan yang mudah diikuti. Gunakan kata-kata yang sederhana dan sertakan informasi penting agar penerima memahami maksudnya."],
    26: ["Meninjau kembali pekerjaan", "Luangkan waktu untuk memeriksa hasil pekerjaan. Perbaiki bagian yang kurang tepat dan pastikan seluruh kebutuhan sudah terpenuhi sebelum membagikannya."],
    27: ["Meminta bantuan saat diperlukan", "Kita tidak harus menyelesaikan semuanya sendiri. Jelaskan kesulitan yang dihadapi dan mintalah bantuan kepada orang yang memiliki pengetahuan atau pengalaman terkait."],
    28: ["Mengelola sumber daya dengan baik", "Gunakan waktu, tenaga, dan bahan yang tersedia secara bijaksana. Perencanaan sederhana dapat mengurangi pemborosan dan membantu pekerjaan selesai sesuai kebutuhan."],
    29: ["Bertanggung jawab atas pilihan", "Setiap keputusan memiliki konsekuensi. Pertimbangkan dampaknya sejak awal, lalu bertanggung jawablah atas pilihan dan tindakan yang telah diambil."],
    30: ["Menyampaikan gagasan secara meyakinkan", "Dukung gagasan dengan alasan dan contoh yang relevan. Sampaikan dengan tenang serta berikan ruang bagi orang lain untuk bertanya atau menanggapi."]
  };

  function setStatus(kind, label){
    statusDot.className = "status-dot" + (kind ? " " + kind : "");
    statusText.textContent = label;
  }

  function toast(message, kind){
    const el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.textContent = message;
    toastStack.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function populateUserFilter(){
    const users = Array.from(new Set(posts.map(p => p.userId))).sort((a,b) => a-b);
    filterUser.innerHTML = '<option value="">Semua user</option>' +
      users.map(u => `<option value="${u}">User ${u}</option>`).join("");
  }

  function render(){
    const query = searchInput.value.trim().toLowerCase();
    const uid = filterUser.value;
    const visible = posts.filter(p => {
      if (deletedIds.has(p.id)) return false;
      if (uid && String(p.userId) !== uid) return false;
      if (query && !(p.title.toLowerCase().includes(query) || p.body.toLowerCase().includes(query))) return false;
      return true;
    });

    countTag.textContent = visible.length + " kiriman";
    const overviewCount = document.getElementById("overview-count");
    if (overviewCount) overviewCount.textContent = posts.filter(post => !deletedIds.has(post.id)).length;

    if (visible.length === 0){
      grid.innerHTML = '<div class="empty-state">Tidak ada post yang cocok. Coba ubah pencarian atau filter.</div>';
      return;
    }

    grid.innerHTML = visible.map(p => `
      <article class="card${editedIds.has(p.id) ? " edited" : ""}" data-id="${p.id}">
        <div class="meta-row">
          <span class="pill">#${p.id}</span>
      <span class="pill">pengguna ${p.userId}</span>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.body)}</p>
        <div class="card-actions">
          <button class="btn ghost" data-action="edit" data-id="${p.id}" type="button">Ubah</button>
          <button class="btn danger" data-action="delete" data-id="${p.id}" type="button">Hapus</button>
        </div>
      </article>
    `).join("");
  }

  async function loadPosts(){
    setStatus("busy", "memuat…");
    grid.innerHTML = '<div class="loading-state">Memuat data…</div>';
    try{
      const res = await fetch(API + "?_limit=30");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      posts = data.map(post => {
        const translation = localizedPosts[post.id];
        return translation ? { ...post, title: translation[0], body: translation[1] } : post;
      });
      editedIds.clear();
      deletedIds.clear();
      populateUserFilter();
      render();
      setStatus("live", "terhubung — " + posts.length + " post dimuat");
    }catch(err){
      setStatus("error", "gagal memuat data");
      grid.innerHTML = '<div class="empty-state">Gagal mengambil data dari API. Periksa koneksi lalu klik Muat Ulang.</div>';
      toast("Gagal memuat: " + err.message, "err");
    }
  }

  createForm.addEventListener("submit", async function(e){
    e.preventDefault();
    const title = document.getElementById("new-title").value.trim();
    const body = document.getElementById("new-body").value.trim();
    const userId = Number(document.getElementById("new-user").value) || 1;
    const submitBtn = createForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try{
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ title, body, userId })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      await res.json();
      const newPost = { id: ++localIdCounter, title, body, userId };
      posts.unshift(newPost);
      populateUserFilter();
      render();
      createForm.reset();
      document.getElementById("new-user").value = 1;
      toast("Post berhasil dibuat (POST 201)", "ok");
    }catch(err){
      toast("Gagal membuat post: " + err.message, "err");
    }finally{
      submitBtn.disabled = false;
    }
  });

  grid.addEventListener("click", async function(e){
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const post = posts.find(p => p.id === id);
    if (!post) return;

    if (btn.dataset.action === "edit"){
      document.getElementById("edit-id").value = id;
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-body").value = post.body;
      editDialog.showModal();
    }

    if (btn.dataset.action === "delete"){
      const confirmed = window.confirm('Hapus post "' + post.title + '"?');
      if (!confirmed) return;
      btn.disabled = true;
      try{
        const res = await fetch(API + "/" + id, { method: "DELETE" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        deletedIds.add(id);
        render();
        toast("Post #" + id + " dihapus (DELETE 200)", "ok");
      }catch(err){
        toast("Gagal menghapus: " + err.message, "err");
        btn.disabled = false;
      }
    }
  });

  editForm.addEventListener("submit", async function(e){
    e.preventDefault();
    const id = Number(document.getElementById("edit-id").value);
    const title = document.getElementById("edit-title").value.trim();
    const body = document.getElementById("edit-body").value.trim();
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const submitBtn = editForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try{
      // Mock JSONPlaceholder hanya memiliki database untuk ID 1-100.
      // Untuk post baru (ID > 100), gunakan API/1 agar server tetap merespons 200 OK.
      const endpoint = id <= 100 ? `${API}/${id}` : `${API}/1`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ id, title, body, userId: post.userId })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      await res.json();
      post.title = title;
      post.body = body;
      editedIds.add(id);
      render();
      editDialog.close();
      toast("Post #" + id + " diperbarui (PUT 200)", "ok");
    }catch(err){
      toast("Gagal memperbarui: " + err.message, "err");
    }finally{
      submitBtn.disabled = false;
    }
  });

  cancelEdit.addEventListener("click", () => editDialog.close());
  filterUser.addEventListener("change", render);
  searchInput.addEventListener("input", render);
  refreshBtn.addEventListener("click", loadPosts);
  const viewElements = {
    overview: document.getElementById("overview"),
    create: document.getElementById("create-view"),
    posts: document.getElementById("posts-view")
  };
  const workspace = document.getElementById("workspace");

  function showView(view){
    if (!Object.hasOwn(viewElements, view)) view = "overview";
    viewElements.overview.hidden = view !== "overview";
    workspace.hidden = view === "overview";
    viewElements.create.hidden = view !== "create";
    viewElements.posts.hidden = view !== "posts";
    workspace.dataset.view = view;

    document.querySelectorAll(".nav-link").forEach(link => {
      const active = link.dataset.view === view;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-view]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const view = link.dataset.view;
      if (window.location.hash !== "#" + view) history.pushState(null, "", "#" + view);
      showView(view);
    });
  });
  window.addEventListener("popstate", () => showView(window.location.hash.slice(1)));
  showView(window.location.hash.slice(1) || "overview");

  loadPosts();
})();
