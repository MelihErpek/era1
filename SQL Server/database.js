const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Geçici dizinde veritabanını kullan
const dbPath = process.env.NODE_ENV === 'production'
  ? '/tmp/database.db' 
  : path.resolve(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanına bağlanırken hata oluştu:', err.message);
  } else {
    console.log('SQLite veritabanına başarıyla bağlanıldı.');
  }
});

// Tablo oluşturma
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL UNIQUE
    )
  `);
});

module.exports = db;
