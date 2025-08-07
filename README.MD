# Harcama Takip Uygulaması

Bu proje, kullanıcıların günlük harcamalarını takip edebilecekleri, kategorizasyon yapabilecekleri ve harcama analizlerini görüntüleyebilecekleri bir web uygulamasıdır.

## Ekran Görüntüleri

### Giriş Sayfası
![Giriş Sayfası](frontend-gorselleri/1.png)

### Kayıt Sayfası
![Kayıt Sayfası](frontend-gorselleri/2.png)

### Ana Sayfa - Dashboard
![Ana Sayfa](frontend-gorselleri/3.png)

### Harcama Listesi ve Filtreleme
![Harcama Listesi](frontend-gorselleri/4.png)

### Harcama Ekleme Formu
![Harcama Ekleme](frontend-gorselleri/5.png)

### Harcama Düzenleme Formu
![Harcama Düzenleme](frontend-gorselleri/6.png)

## Teknolojiler

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Hook Form & Zod (Form Yönetimi ve Validasyon)
- Axios (HTTP İstekleri)

### Backend
- NestJS
- TypeScript
- MongoDB
- JWT Authentication
- Mongoose

## Başlangıç

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

Frontend uygulaması varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

#### Ortam Değişkenleri

Frontend için `.env` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXTAUTH_DEBUG=true
```

### Backend Kurulumu

```bash
cd backend
npm install
npm run start:dev
```

Backend API varsayılan olarak `http://localhost:8001` adresinde çalışacaktır.

#### Ortam Değişkenleri

Backend için `.env` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
PORT=8001
MONGO_URI=mongodb+srv://Cluster94392:Wl18TlBPYFV3@cluster94392.x5ko797.mongodb.net/nestdb
JWT_SECRET=supersecretkey
JWT_REFRESH_SECRET=supersecretkey123
```

## Özellikler

### Kullanıcı İşlemleri
- Kayıt
- Giriş
- Beni hatırla özelliği
- JWT tabanlı kimlik doğrulama

### Harcama İşlemleri
- Harcama ekleme
- Harcama düzenleme
- Harcama silme
- Kategori bazlı filtreleme | Tarih aralığı seçerek filtreleme | Açıklama ve Tutara görede ekstra filtreleme özelliği
- Harcamaları csv olarak dışarı aktarabilme | Filtreleme ile entegre çalışıyor.

### Analitik
- Haftalık harcama toplamı
- Aylık harcama toplamı
- Kategori bazlı dağılım
- En çok harcama yapılan kategori

## API Endpoints & Swagger
- Api endpointleri için Swaggerin üzerinden kontrol gerçekleştirebilirsiniz. 
- http://localhost:8001/docs#/
