# Course Rich Content Examples

This document contains real examples of rich content from the courses API, including both JSON and HTML formats.

## API Response Structure

The courses API returns three types of descriptions:
- `description`: Plain text description
- `jsonDescription`: Structured ProseMirror document format
- `htmlDescription`: Ready-to-render HTML content

## Example Course Data

**Course ID:** 37  
**Title:** Program G to G ( Goverment to Goverment )  
**Author:** Aizeu Kim  

### 1. Plain Description
```
Ini dia jalan pintas menuju karir di Negeri Gingseng !
```

### 2. JSON Description (ProseMirror Format)
```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": {
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "textStyle",
              "attrs": {
                "color": "#EAB308"
              }
            },
            {
              "type": "bold"
            }
          ],
          "text": "Halo, sobat Pejuangkorea Academy "
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Udah pernah denger tentang program G to G ? atau masih penasaran dengan apa sih sebenernya program ini ?! Yuk simak pembahasan ini ✨"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Apa itu Program G to G ? 🤔"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "G to G ( Goverment to Goverment ). Program ini merupakan hasil kerja sama resmi antara pemerintah Indonesia  dan pemerintah Korea Selatan, untuk siapa aja yang punya mimpi kerja di Korea secara legal dan aman. Dalam program ini, pemerintah langsung jadi penghubung antara pencari kerja dengan perusahaan - perusahaan Korea. Jadi, gak pakai calo atau agen - agen swasta ya !"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Kenapa pilih G to G ?❓"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Ada beberapa alasan kenapa program ini jadi favorit calon Pekerja Migran Indonesia ( PMI ) yang mau terbang ke Korea :"
        }
      ]
    },
    {
      "type": "bulletList",
      "attrs": {
        "tight": true
      },
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Biaya Lebih Terjangkau 💸"
                }
              ]
            },
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Karena prosesnya resmi dan diawasi pemerintah, kita gak perlu keluar biaya besar yang gak masuk akal. Pemerintah bantu banget untuk urusan biaya, jadi lebih hemat deh !"
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Aman dan Legal 🛡️"
                }
              ]
            },
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Semua prosesnya legal dan terjamin. Gak perlu takut kena tipu atau disuruh bayar hal - hal yang gak jelas."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Gaji dan Hak Pekerja Terjamin 💰"
                }
              ]
            },
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Karena udah ada perjanjian bilateral antara kedua negara, jadi kita akan mendapat hak yang sesuai dan gaji yang standar sesuai aturan di Korea. Pokonya aman banget deh "
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "heading",
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Proses dan Syarat Daftar Program G to G 📝"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Prosesnya udah terstruktur, kita cuma perlu ikuti semua langkah dengan teliti biar lancar. Berikut beberapa tahapan yang perlu kita siapin :"
        }
      ]
    },
    {
      "type": "bulletList",
      "attrs": {
        "tight": true
      },
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Belajar Bahasa Korea 📚"
                }
              ]
            },
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Karena komunikasi itu penting, jadi pastikan kita belajar bahasa Korea dulu. Minimal harus punya TOPIK Level 1 atau lulus ujian EPS - TOPIK."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Daftar ke Disnaker 📩"
                }
              ]
            },
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "KIta bisa mulai proses pendaftaran lewat Disnaker atau kantor ketenagakerjaan di daerah masing - masing. Ini langkah penting banget supaya terdata secara resmi."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Tes Kesehatan 💪"
                }
              ]
            },
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Sebelum berangkat, harus cek kesehatan dulu untuk memastikan kita fit dan siap bekerja di Korea."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Pelatihan Pra Keberangkatan ( PAP ) 👩‍🏫"
                }
              ]
            },
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Disini kita akan dapetin pembekalan tentang budaya kerja, aturan, serta tips hidup di Korea."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "heading",
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Bidang Kerja di Korea Melalui Program G to G ⚙️"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Gak semua bidang bisa dimasukin melalui G to G ya ! Beberapa bidang yang sering dibuka untuk PMI lewat program ini antara lain :"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Manufaktur : Industri pengolahan produk"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Fishery : Bekerja di sektor perikanan"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Shipbuilding : Galangan kapal"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Service : Bekerja di bagian pelayanan"
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "heading",
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Keuntungan Program G to G 🔥"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Selain gaji yang cukup besar, PMi di korea lewat program ini juga punya kesempatan untuk dapat asuransi dan dana pensiun yang bisa dicairkan saat kita pulang nanti loh ! Jadi gak cuma kerja untuk hari ini, tapi juga ada persiapan untuk masa depan."
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "heading",
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Gimana ? Tertarik kerja ke Korea melalui program G to G ?? 💡"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Program ini adalah solusi keren buat kita yang pengen kerja di luar negeri secara aman dan terjamin. Sambil belajar bahasa Korea dan persiapkan diri, ingat bahwa program G to G ini bisa jadi gerbang emas menuju masa depan di Korea !"
        }
      ]
    }
  ]
}
```

### 3. HTML Description
```html
<html xmlns="http://www.w3.org/1999/xhtml">
<head></head>
<body>
  <h2><span style="color: #EAB308"><strong>Halo, sobat Pejuangkorea Academy </strong></span></h2>
  <p>Udah pernah denger tentang program G to G ? atau masih penasaran dengan apa sih sebenernya program ini ?! Yuk simak pembahasan ini ✨</p>
  <h3>Apa itu Program G to G ? 🤔</h3>
  <p>G to G ( Goverment to Goverment ). Program ini merupakan hasil kerja sama resmi antara pemerintah Indonesia  dan pemerintah Korea Selatan, untuk siapa aja yang punya mimpi kerja di Korea secara legal dan aman. Dalam program ini, pemerintah langsung jadi penghubung antara pencari kerja dengan perusahaan - perusahaan Korea. Jadi, gak pakai calo atau agen - agen swasta ya !</p>
  <h3>Kenapa pilih G to G ?❓</h3>
  <p>Ada beberapa alasan kenapa program ini jadi favorit calon Pekerja Migran Indonesia ( PMI ) yang mau terbang ke Korea :</p>
  <ul class="list-disc list-outside leading-3 -mt-2 tight" data-tight="true">
    <li class="leading-normal -mb-2">
      <p>Biaya Lebih Terjangkau 💸</p>
      <p>Karena prosesnya resmi dan diawasi pemerintah, kita gak perlu keluar biaya besar yang gak masuk akal. Pemerintah bantu banget untuk urusan biaya, jadi lebih hemat deh !</p>
    </li>
    <li class="leading-normal -mb-2">
      <p>Aman dan Legal 🛡️</p>
      <p>Semua prosesnya legal dan terjamin. Gak perlu takut kena tipu atau disuruh bayar hal - hal yang gak jelas.</p>
    </li>
    <li class="leading-normal -mb-2">
      <p>Gaji dan Hak Pekerja Terjamin 💰</p>
      <p>Karena udah ada perjanjian bilateral antara kedua negara, jadi kita akan mendapat hak yang sesuai dan gaji yang standar sesuai aturan di Korea. Pokonya aman banget deh </p>
    </li>
  </ul>
  <p></p>
  <h3>Proses dan Syarat Daftar Program G to G 📝</h3>
  <p>Prosesnya udah terstruktur, kita cuma perlu ikuti semua langkah dengan teliti biar lancar. Berikut beberapa tahapan yang perlu kita siapin :</p>
  <ul class="list-disc list-outside leading-3 -mt-2 tight" data-tight="true">
    <li class="leading-normal -mb-2">
      <p>Belajar Bahasa Korea 📚</p>
      <p>Karena komunikasi itu penting, jadi pastikan kita belajar bahasa Korea dulu. Minimal harus punya TOPIK Level 1 atau lulus ujian EPS - TOPIK.</p>
    </li>
    <li class="leading-normal -mb-2">
      <p>Daftar ke Disnaker 📩</p>
      <p>KIta bisa mulai proses pendaftaran lewat Disnaker atau kantor ketenagakerjaan di daerah masing - masing. Ini langkah penting banget supaya terdata secara resmi.</p>
    </li>
    <li class="leading-normal -mb-2">
      <p>Tes Kesehatan 💪</p>
      <p>Sebelum berangkat, harus cek kesehatan dulu untuk memastikan kita fit dan siap bekerja di Korea.</p>
    </li>
    <li class="leading-normal -mb-2">
      <p>Pelatihan Pra Keberangkatan ( PAP ) 👩‍🏫</p>
      <p>Disini kita akan dapetin pembekalan tentang budaya kerja, aturan, serta tips hidup di Korea.</p>
    </li>
  </ul>
  <p></p>
  <h3>Bidang Kerja di Korea Melalui Program G to G ⚙️</h3>
  <p>Gak semua bidang bisa dimasukin melalui G to G ya ! Beberapa bidang yang sering dibuka untuk PMI lewat program ini antara lain :</p>
  <p>Manufaktur : Industri pengolahan produk</p>
  <p>Fishery : Bekerja di sektor perikanan</p>
  <p>Shipbuilding : Galangan kapal</p>
  <p>Service : Bekerja di bagian pelayanan</p>
  <p></p>
  <h3>Keuntungan Program G to G 🔥</h3>
  <p>Selain gaji yang cukup besar, PMi di korea lewat program ini juga punya kesempatan untuk dapat asuransi dan dana pensiun yang bisa dicairkan saat kita pulang nanti loh ! Jadi gak cuma kerja untuk hari ini, tapi juga ada persiapan untuk masa depan.</p>
  <p></p>
  <h3>Gimana ? Tertarik kerja ke Korea melalui program G to G ?? 💡</h3>
  <p>Program ini adalah solusi keren buat kita yang pengen kerja di luar negeri secara aman dan terjamin. Sambil belajar bahasa Korea dan persiapkan diri, ingat bahwa program G to G ini bisa jadi gerbang emas menuju masa depan di Korea !</p>
</body>
</html>
```

## Implementation Notes

### JSON Format (ProseMirror)
- Structured document format
- Supports rich text with marks (bold, colors, etc.)
- Hierarchical content with headings, paragraphs, lists
- Can be rendered using React Native rich text components

### HTML Format
- Ready-to-render HTML with styling
- Uses Tailwind CSS classes for styling
- Can be displayed in WebView component
- Supports emojis and complex formatting

## Usage in Mobile App
1. **WebView Approach**: Use `htmlDescription` with WebView component
2. **Native Components**: Parse `jsonDescription` and render with native React Native components
3. **Fallback**: Use plain `description` for simple text display
