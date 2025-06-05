# Panduan Setup Google OAuth untuk Aplikasi Mobile Expo

## Langkah 1: Akses Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Login dengan akun Google Anda
3. Pilih atau buat project baru

## Langkah 2: Mengaktifkan Google+ API

1. Di sidebar kiri, pilih **APIs & Services** > **Library**
2. Cari "Google+ API" atau "Google Identity"
3. Klik dan pilih **Enable**

## Langkah 3: Membuat OAuth 2.0 Credentials

1. Di sidebar kiri, pilih **APIs & Services** > **Credentials**
2. Klik **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Jika diminta, konfigurasikan OAuth consent screen terlebih dahulu

### Konfigurasi OAuth Consent Screen (jika belum ada):
1. Pilih **External** untuk user type
2. Isi informasi aplikasi:
   - **App name**: "Pejuangkorea"
   - **User support email**: email Anda
   - **App domain**: (opsional)
   - **Developer contact information**: email Anda
3. Tambahkan scopes yang dibutuhkan:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
4. Save dan continue

## Langkah 4: Membuat Client ID untuk Mobile

### Untuk Android:
1. Pilih **Application type**: **Android**
2. **Name**: "Pejuangkorea Android"
3. **Package name**: `com.rorez.pejuangkorea`
4. **SHA-1 certificate fingerprint**: 
   - Untuk development, gunakan debug keystore
   - Jalankan command: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - Copy SHA-1 fingerprint

### Untuk iOS:
1. Pilih **Application type**: **iOS**
2. **Name**: "Pejuangkorea iOS"
3. **Bundle ID**: `com.rorez.pejuangkorea`

### Untuk Web (opsional - untuk testing):
1. Pilih **Application type**: **Web application**
2. **Name**: "Pejuangkorea Web"
3. **Authorized redirect URIs**: 
   - `https://auth.expo.io/@your-username/z-type`
   - `https://localhost:19006`

## Langkah 5: Konfigurasi Redirect URIs

Untuk mobile app dengan Expo, tambahkan redirect URIs berikut:

### Current Configuration:
- **Scheme**: `com.googleusercontent.apps.1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol`
- **Redirect URI**: `com.googleusercontent.apps.1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol:/oauth2redirect/google`

### Langkah Konfigurasi:
1. Buka client ID yang sudah dibuat
2. Di bagian **Authorized redirect URIs**, tambahkan:
   ```
   com.googleusercontent.apps.1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol:/oauth2redirect/google
   ```
3. Untuk development dengan Expo, tambahkan juga:
   ```
   https://auth.expo.io/@your-expo-username/z-type
   ```

## Langkah 6: Mendapatkan Client ID

1. Setelah membuat credentials, copy **Client ID**
2. Format akan seperti: `1085407842332-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
3. Pastikan ini sesuai dengan yang ada di kode aplikasi

## Langkah 7: Update Konfigurasi Aplikasi

Pastikan file `app.json` sudah dikonfigurasi dengan benar:

```json
{
  "expo": {
    "scheme": "com.googleusercontent.apps.1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol",
    "extra": {
      "googleOAuth": {
        "clientId": "1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol.apps.googleusercontent.com",
        "redirectScheme": "com.googleusercontent.apps.1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol"
      }
    }
  }
}
```

## Langkah 8: Testing OAuth Flow

1. Build aplikasi untuk testing:
   ```bash
   npx expo run:android
   # atau
   npx expo run:ios
   ```

2. Test Google Sign-In di aplikasi
3. Periksa logs untuk memastikan flow berjalan dengan benar

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Pastikan redirect URI di Google Console sama persis dengan yang digunakan di aplikasi
- Check spacing dan typos

### Error: "invalid_client"
- Pastikan Client ID benar
- Pastikan package name/bundle ID sesuai

### Error: "access_denied"
- User membatalkan login
- Atau ada masalah dengan OAuth consent screen

## Catatan Keamanan

1. **Jangan commit Client Secret** ke repository public
2. Gunakan environment variables untuk production
3. Untuk production, gunakan proper signing certificate, bukan debug keystore
4. Verifikasi domain yang digunakan untuk redirect URIs

## File yang Perlu Diupdate

Setelah setup Google OAuth, pastikan file berikut sudah benar:
- `app.json` - konfigurasi scheme dan redirect
- `lib/hooks/useGoogleAuth.ts` - implementasi OAuth flow
- Backend API endpoint untuk handle callback

## Production Deployment

Untuk deployment production:
1. Generate production signing certificate
2. Update SHA-1 fingerprint di Google Console
3. Update redirect URIs untuk production domain
4. Test thoroughly sebelum release