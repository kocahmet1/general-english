# English Master - İngilizce Öğrenme Uygulaması

IELTS ve TOEFL sınavlarına hazırlık için tasarlanmış interaktif İngilizce öğrenme uygulaması.

## Özellikler

- **120 Soruluk Sınavlar**: Başlangıçtan ileri düzeye kadar kapsamlı İngilizce testleri
- **Akıllı Açıklamalar**: Yanlış cevaplarda OpenAI destekli Türkçe açıklamalar
- **Kelime Kasası**: Öğrenmek istediğiniz kelimeleri kaydedin
- **Sınav İçe Aktarma**: Kendi sınavlarınızı ekleyin
- **Koyu/Açık Tema**: Göz yormayan modern tasarım
- **Yerel Depolama**: Firebase olmadan da çalışır

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd english-learning-app
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
copy .env.example .env
```

Ardından `.env` dosyasını düzenleyin:

```env
# Firebase Configuration (İsteğe bağlı - yoksa yerel depolama kullanılır)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# OpenAI Configuration (Açıklamalar için gerekli)
VITE_OPENAI_API_KEY=sk-your-openai-api-key
```

### 3. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine gidin.

## Firebase Kurulumu (İsteğe Bağlı)

Firebase kullanmak isterseniz:

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Yeni bir proje oluşturun
3. Firestore Database'i etkinleştirin
4. Project Settings > General > Your apps bölümünden web uygulaması ekleyin
5. Yapılandırma bilgilerini `.env` dosyasına kopyalayın

### Firestore Güvenlik Kuralları

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /exams/{examId} {
      allow read, write: if true;
    }
    match /vocabVault/{wordId} {
      allow read, write: if true;
    }
  }
}
```

## OpenAI API Kurulumu

Açıklama özelliği için OpenAI API anahtarı gereklidir:

1. [OpenAI Platform](https://platform.openai.com/) adresine gidin
2. API Keys bölümünden yeni bir anahtar oluşturun
3. Anahtarı `.env` dosyasına ekleyin

## Sınav Formatı

Yeni sınav eklerken aşağıdaki formatı kullanın:

### Sorular:
```
1 Hello. My name _________ David.
A am
B is
C are

2 I _________ from Italy.
A come
B am
C do
```

### Cevap Anahtarı:
```
1. B
2. B
3. A
```

## Render.com'a Dağıtım

1. [Render.com](https://render.com) hesabı oluşturun
2. GitHub reponuzu bağlayın
3. "New Web Service" oluşturun
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Environment Variables bölümünden `.env` değişkenlerini ekleyin

## Teknolojiler

- React 18
- TypeScript
- Vite
- Firebase Firestore
- OpenAI API
- Lucide Icons

## Lisans

MIT


