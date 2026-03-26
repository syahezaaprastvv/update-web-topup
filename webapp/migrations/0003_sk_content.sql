-- ============================================
-- MIGRATION 0003: Syarat & Ketentuan editable
-- ============================================

-- Insert default S&K content (HTML) ke settings
INSERT OR IGNORE INTO settings (key, value) VALUES (
  'sk_content',
  '<h3 style="color:var(--text-primary);margin-bottom:12px">1. Ketentuan Umum</h3>
<p>Dengan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku. Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">2. Layanan yang Tersedia</h3>
<p>Kami menyediakan layanan top up game, voucher, pulsa, dan paket data. Semua transaksi dilakukan melalui WhatsApp admin setelah form pembelian diisi oleh pelanggan. Kami melayani berbagai metode pembayaran yang tertera di website.</p>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">3. Pembelian &amp; Pembayaran</h3>
<ul style="margin-left:20px;margin-top:8px">
  <li style="margin-bottom:8px">Semua harga yang tertera sudah termasuk pajak dan biaya layanan.</li>
  <li style="margin-bottom:8px">Pembayaran dapat dilakukan melalui transfer bank, dompet digital (GoPay, OVO, Dana, ShopeePay), Indomaret, Alfamart, atau metode lain yang tersedia.</li>
  <li style="margin-bottom:8px">Pesanan akan diproses setelah bukti pembayaran diterima dan diverifikasi oleh admin.</li>
  <li style="margin-bottom:8px">Proses top up umumnya selesai dalam 1–15 menit setelah pembayaran dikonfirmasi.</li>
</ul>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">4. Keamanan Data Akun Game</h3>
<ul style="margin-left:20px;margin-top:8px">
  <li style="margin-bottom:8px">Pastikan <strong>ID Game</strong> dan <strong>Nickname</strong> yang Anda masukkan sudah benar sebelum melakukan pembayaran.</li>
  <li style="margin-bottom:8px">Kami tidak bertanggung jawab atas kesalahan input data yang dilakukan oleh pelanggan.</li>
  <li style="margin-bottom:8px">Kami tidak pernah meminta username dan password akun game Anda.</li>
</ul>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">5. Kebijakan Refund &amp; Pembatalan</h3>
<ul style="margin-left:20px;margin-top:8px">
  <li style="margin-bottom:8px">Refund atau pengembalian dana <strong>hanya dapat dilakukan</strong> jika terjadi kesalahan yang disebabkan oleh pihak kami.</li>
  <li style="margin-bottom:8px">Tidak ada refund untuk kesalahan input data dari pelanggan (ID Game salah, server salah, dll.).</li>
  <li style="margin-bottom:8px">Permintaan refund harus disertai bukti transaksi yang valid dan diajukan dalam waktu 1×24 jam setelah transaksi.</li>
</ul>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">6. Privasi &amp; Kerahasiaan Data</h3>
<ul style="margin-left:20px;margin-top:8px">
  <li style="margin-bottom:8px">Kami berkomitmen menjaga kerahasiaan data pribadi Anda.</li>
  <li style="margin-bottom:8px">Data yang Anda berikan (ID Game, Nickname, nomor telepon) hanya digunakan untuk keperluan transaksi.</li>
  <li style="margin-bottom:8px">Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin.</li>
</ul>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">7. Larangan Penggunaan</h3>
<ul style="margin-left:20px;margin-top:8px">
  <li style="margin-bottom:8px">Dilarang menggunakan layanan ini untuk aktivitas yang melanggar hukum.</li>
  <li style="margin-bottom:8px">Dilarang melakukan penipuan, pemalsuan bukti transaksi, atau tindakan merugikan pihak lain.</li>
  <li style="margin-bottom:8px">Pelanggar akan dilaporkan kepada pihak berwajib.</li>
</ul>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">8. Batasan Tanggung Jawab</h3>
<p>Kami tidak bertanggung jawab atas kerugian yang timbul akibat gangguan server game, kesalahan data oleh pelanggan, atau kejadian di luar kendali kami.</p>

<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">9. Hubungi Kami</h3>
<p>Jika ada pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami melalui halaman <a href="/bantuan" style="color:var(--primary)">Bantuan</a> atau langsung via WhatsApp admin.</p>'
);
