#!/usr/bin/env python3
"""
Enhanced disease knowledge extraction from PDFs
Adds more comprehensive information from the extracted text
"""

import json
import re

# Read the previously extracted text
with open("extracted_text.txt", "r", encoding="utf-8") as f:
    extracted_text = f.read()

# Read the initial knowledge base
with open("knowledge_base.json", "r", encoding="utf-8") as f:
    kb = json.load(f)

# Create comprehensive disease list with additional entries from PDFs
comprehensive_diseases = {
    "DIS001": {
        "code": "DIS001",
        "name": "Hawar Daun Bakteri",
        "latin_name": "Xanthomonas oryzae pv. oryzae (Xoo)",
        "description": "Penyakit bakteri yang menyerang daun padi, menyebabkan gejala berupa bercak memanjang berwarna kuning keabu-abuan dengan tepi berwarna kuning.",
        "cause": "Bakteri Xanthomonas oryzae pv. oryzae",
        "impact": "Mengurangi luas daun hijau sehingga mengurangi fotosintesis, penurunan hasil panen hingga 20-75%",
        "reference_source": "Epidemiologi dan Strategi Pengendalian Penyakit Padi",
        "reference_document": "Epidemiologi, Patotipe, dan Strategi Pengendalian Penyakit Hawar Daun Bakteri pada Tanaman Padi.pdf"
    },
    "DIS002": {
        "code": "DIS002",
        "name": "Blas",
        "latin_name": "Pyricularia grisea (Cooke) Sacc. = Pyricularia oryzae Cav.",
        "description": "Penyakit jamur yang sangat merugikan dan tersebar luas di seluruh daerah pertanaman padi. Dapat menyerang daun, bintil, dan malai.",
        "cause": "Jamur Pyricularia grisea",
        "impact": "Dapat menyebabkan kehilangan hasil panen mencapai 100% apabila parah",
        "reference_source": "Keragaman dan Sumber Gen Ketahanan Varietas Padi Lokal",
        "reference_document": "12108-Article Text-28815-33456-10-20201112.pdf"
    },
    "DIS003": {
        "code": "DIS003",
        "name": "Hawar Pelepah",
        "latin_name": "Rhizoctonia solani Kuhn (AG-1)",
        "description": "Penyakit jamur yang menyerang pelepah daun padi, menyebabkan hawar atau lesi pada pelepah daun terutama pada pelepah umur tengah.",
        "cause": "Jamur Rhizoctonia solani AG-1",
        "impact": "Dapat menurunkan produksi padi secara kualitatif maupun kuantitatif",
        "reference_source": "Penyakit Hawar Pelepah dan Taktik Pengelolaannya",
        "reference_document": "22494-74356-4-PB.pdf"
    },
    "DIS004": {
        "code": "DIS004",
        "name": "Busuk Batang",
        "latin_name": "Fusarium moniliforme, Fusarium semitectum, Alternaria padwickii",
        "description": "Penyakit jamur yang menyerang batang padi, menyebabkan busuk pada pangkal batang dan menyebabkan tanaman roboh.",
        "cause": "Jamur Fusarium moniliforme, Fusarium semitectum, dan Alternaria padwickii",
        "impact": "Menyebabkan batang menjadi busuk dan patah, tanaman roboh",
        "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
        "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
    },
    "DIS005": {
        "code": "DIS005",
        "name": "Tungro",
        "latin_name": "Rice Tungro Virus (RTV) dan Rice Tungro Bacilliform Virus (RTBV)",
        "description": "Penyakit virus yang ditularkan oleh wereng hijau. Tanaman terserang menunjukkan gejala menguning dan kerdil.",
        "cause": "Virus Tungro (RTV dan RTBV) yang ditularkan oleh wereng hijau (Nephotettix spp.)",
        "impact": "Tanaman menjadi kerdil, daun menguning, pertumbuhan terganggu",
        "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
        "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
    },
    "DIS006": {
        "code": "DIS006",
        "name": "Layu Bibit",
        "latin_name": "Corticium sasakii",
        "description": "Penyakit jamur yang menyerang bibit padi di persemaian, menyebabkan bibit menjadi layu.",
        "cause": "Jamur Corticium sasakii",
        "impact": "Bibit menjadi layu dan mati di persemaian, mengakibatkan kegagalan tanam",
        "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
        "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
    },
    "DIS007": {
        "code": "DIS007",
        "name": "Kerdil Rumput",
        "latin_name": "Rice Dwarf Virus (RDV)",
        "description": "Penyakit virus yang ditularkan oleh wereng coklat. Gejala berupa kerdil tanaman dan daun menggulung.",
        "cause": "Virus Kerdil Rumput yang ditularkan oleh wereng coklat (Nilaparvata lugens)",
        "impact": "Tanaman menjadi kerdil, daun menggulung, produktivitas menurun drastis",
        "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
        "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
    },
    "DIS008": {
        "code": "DIS008",
        "name": "Hawar Daun Cokelat",
        "latin_name": "Cochliobolus miyabeanus (Ito & Kurib.) Drech. = Bipolaris oryzae",
        "description": "Penyakit jamur yang menyerang daun padi, menyebabkan bercak cokelat dengan lingkaran konsentris.",
        "cause": "Jamur Cochliobolus miyabeanus",
        "impact": "Menyebabkan bercak cokelat pada daun, mengurangi area fotosintesis",
        "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
        "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
    },
    "DIS009": {
        "code": "DIS009",
        "name": "Penyakit Bintil Padi",
        "latin_name": "Cercospora fimbrriata, Bipolaris sorokiniana",
        "description": "Penyakit jamur yang menyerang bintil jari (collar) dan menyebabkan kerusakan pada bagian tersebut.",
        "cause": "Jamur Cercospora fimbrriata dan Bipolaris sorokiniana",
        "impact": "Kerusakan pada collar area, menghambat aliran nutrisi",
        "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
        "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
    }
}

# Comprehensive symptoms list
comprehensive_symptoms = {
    "SYM001": {
        "code": "SYM001",
        "name": "Bercak memanjang kuning keabu-abuan pada daun",
        "description": "Gejala awal berupa bercak kecil memanjang (±1-3 x 20-30 mm) berwarna kuning keabu-abuan dengan tepi berwarna kuning cerah",
        "plant_part": "daun",
        "phase": "semua"
    },
    "SYM002": {
        "code": "SYM002",
        "name": "Daun menggulung",
        "description": "Daun melengkung atau menggulung ke dalam",
        "plant_part": "daun",
        "phase": "vegetatif"
    },
    "SYM003": {
        "code": "SYM003",
        "name": "Daun menguning",
        "description": "Daun berubah warna menjadi kuning",
        "plant_part": "daun",
        "phase": "vegetatif"
    },
    "SYM004": {
        "code": "SYM004",
        "name": "Bercak bulat cokelat pada daun",
        "description": "Bercak bulat atau oval berwarna cokelat pada daun dengan lingkaran konsentris",
        "plant_part": "daun",
        "phase": "generatif"
    },
    "SYM005": {
        "code": "SYM005",
        "name": "Batang busuk dan patah",
        "description": "Batang mengalami pembusukan terutama di pangkal batang, kemudian patah dan tanaman roboh",
        "plant_part": "batang",
        "phase": "generatif"
    },
    "SYM006": {
        "code": "SYM006",
        "name": "Malai tidak berkembang",
        "description": "Malai gagal menjadi optimal, berisi biji kosong atau tidak keluar sempurna dari upih",
        "plant_part": "malai",
        "phase": "generatif"
    },
    "SYM007": {
        "code": "SYM007",
        "name": "Bibit layu di persemaian",
        "description": "Bibit padi menjadi layu, menguning, dan mati di persemaian",
        "plant_part": "seluruh tanaman",
        "phase": "vegetatif"
    },
    "SYM008": {
        "code": "SYM008",
        "name": "Tanaman kerdil",
        "description": "Pertumbuhan tanaman terhenti, tanaman menjadi kerdil atau pendek dibanding normal",
        "plant_part": "seluruh tanaman",
        "phase": "vegetatif"
    },
    "SYM009": {
        "code": "SYM009",
        "name": "Gabah berisi kosong",
        "description": "Gabah pada malai tidak terisi penuh atau kosong",
        "plant_part": "gabah",
        "phase": "generatif"
    },
    "SYM010": {
        "code": "SYM010",
        "name": "Hawar pada pelepah daun",
        "description": "Hawar atau lesi memanjang pada pelepah daun",
        "plant_part": "batang",
        "phase": "generatif"
    },
    "SYM011": {
        "code": "SYM011",
        "name": "Bercak oval cokelat dengan tepi gelap",
        "description": "Bercak oval dengan warna cokelat pucat dan tepi gelap, sering dengan lingkaran konsentris",
        "plant_part": "daun",
        "phase": "semua"
    },
    "SYM012": {
        "code": "SYM012",
        "name": "Lesi pada bintil jari",
        "description": "Lesi atau hawar pada collar (bintil jari) antar ruas daun",
        "plant_part": "daun",
        "phase": "semua"
    },
    "SYM013": {
        "code": "SYM013",
        "name": "Daun pucat kehijauan",
        "description": "Daun menjadi pucat atau kehijauan dengan pembuluh daun yang terlihat jelas",
        "plant_part": "daun",
        "phase": "vegetatif"
    },
    "SYM014": {
        "code": "SYM014",
        "name": "Anakan berkurang",
        "description": "Jumlah anakan berkurang dibanding normal",
        "plant_part": "seluruh tanaman",
        "phase": "vegetatif"
    },
    "SYM015": {
        "code": "SYM015",
        "name": "Akar membusuk",
        "description": "Akar menjadi busuk dan kehilangan fungsi penyerapan nutrisi",
        "plant_part": "akar",
        "phase": "vegetatif"
    }
}

# Comprehensive disease-symptom relationships
comprehensive_ds_relationships = [
    # Hawar Daun Bakteri - DIS001
    {"disease_code": "DIS001", "symptom_code": "SYM001", "cf_expert": 0.95},
    {"disease_code": "DIS001", "symptom_code": "SYM012", "cf_expert": 0.90},
    
    # Blas - DIS002
    {"disease_code": "DIS002", "symptom_code": "SYM004", "cf_expert": 0.92},
    {"disease_code": "DIS002", "symptom_code": "SYM011", "cf_expert": 0.88},
    
    # Hawar Pelepah - DIS003
    {"disease_code": "DIS003", "symptom_code": "SYM010", "cf_expert": 0.93},
    {"disease_code": "DIS003", "symptom_code": "SYM013", "cf_expert": 0.75},
    
    # Busuk Batang - DIS004
    {"disease_code": "DIS004", "symptom_code": "SYM005", "cf_expert": 0.93},
    
    # Tungro - DIS005
    {"disease_code": "DIS005", "symptom_code": "SYM002", "cf_expert": 0.88},
    {"disease_code": "DIS005", "symptom_code": "SYM003", "cf_expert": 0.87},
    {"disease_code": "DIS005", "symptom_code": "SYM008", "cf_expert": 0.85},
    
    # Layu Bibit - DIS006
    {"disease_code": "DIS006", "symptom_code": "SYM007", "cf_expert": 0.95},
    
    # Kerdil Rumput - DIS007
    {"disease_code": "DIS007", "symptom_code": "SYM002", "cf_expert": 0.89},
    {"disease_code": "DIS007", "symptom_code": "SYM008", "cf_expert": 0.91},
    
    # Hawar Daun Cokelat - DIS008
    {"disease_code": "DIS008", "symptom_code": "SYM004", "cf_expert": 0.88},
    {"disease_code": "DIS008", "symptom_code": "SYM011", "cf_expert": 0.90},
    
    # Penyakit Bintil Padi - DIS009
    {"disease_code": "DIS009", "symptom_code": "SYM012", "cf_expert": 0.87},
]

# Comprehensive treatments
comprehensive_treatments = [
    # Hawar Daun Bakteri (DIS001)
    {
        "disease_code": "DIS001",
        "title": "Penggunaan Varietas Tahan",
        "description": "Menanam varietas padi yang tahan terhadap Hawar Daun Bakteri seperti varietas IR64, Cisewu, Krueng Aceh, Situ Bagendit",
        "type": "varietas_tahan"
    },
    {
        "disease_code": "DIS001",
        "title": "Pengendalian Mekanis",
        "description": "Membuang bagian tanaman yang terserang, sanitasi peralatan, dan penerapan jarak tanam yang tepat untuk mengurangi kelembaban",
        "type": "kultur_teknis"
    },
    {
        "disease_code": "DIS001",
        "title": "Penyemprotan Fungisida/Bakterisida",
        "description": "Menyemprotkan bakterisida atau fungisida tembaga yang direkomendasikan dengan interval 7-10 hari",
        "type": "pengendalian"
    },
    
    # Blas (DIS002)
    {
        "disease_code": "DIS002",
        "title": "Penggunaan Varietas Tahan",
        "description": "Menanam varietas padi yang tahan terhadap Blas seperti varietas Situ Bagendit, Towuti, Towuti Bengawan, Cisadane",
        "type": "varietas_tahan"
    },
    {
        "disease_code": "DIS002",
        "title": "Rotasi Tanaman",
        "description": "Melakukan rotasi tanaman dengan tanaman non-padi selama minimal 1-2 musim untuk mengurangi inokulum",
        "type": "kultur_teknis"
    },
    {
        "disease_code": "DIS002",
        "title": "Penyemprotan Fungisida Preventif",
        "description": "Menyemprotkan fungisida secara preventif mulai fase anakan hingga pembentukan malai dengan interval 7-14 hari",
        "type": "preventif"
    },
    {
        "disease_code": "DIS002",
        "title": "Pengaturan Kelembaban",
        "description": "Mengurangi kelembaban melalui pengelolaan air yang baik dan pemangkasan daun yang lebih tua",
        "type": "kultur_teknis"
    },
    
    # Hawar Pelepah (DIS003)
    {
        "disease_code": "DIS003",
        "title": "Pengelolaan Air Irigasi",
        "description": "Mengurangi kelembaban dengan menerapkan pengairan terputus (intermittent flooding) atau drainase yang baik",
        "type": "kultur_teknis"
    },
    {
        "disease_code": "DIS003",
        "title": "Pengurangan Pemupukan Urea",
        "description": "Mengurangi dosis pemupukan urea berlebihan karena dapat meningkatkan keparahan hawar pelepah",
        "type": "kultur_teknis"
    },
    {
        "disease_code": "DIS003",
        "title": "Penggunaan Bakteri Antagonis",
        "description": "Menambahkan kompos matang yang diperkaya dengan bakteri antagonis untuk menekan inokulum",
        "type": "preventif"
    },
    {
        "disease_code": "DIS003",
        "title": "Penyemprotan Fungisida",
        "description": "Menyemprotkan fungisida yang sesuai pada saat awal gejala terlihat",
        "type": "pengendalian"
    },
    
    # Busuk Batang (DIS004)
    {
        "disease_code": "DIS004",
        "title": "Sanitasi Benih",
        "description": "Menggunakan benih yang sehat, bebas dari jamur penyebab busuk batang, dapat dilakukan dengan perendaman benih",
        "type": "preventif"
    },
    {
        "disease_code": "DIS004",
        "title": "Pemupukan Seimbang",
        "description": "Memberikan pupuk seimbang terutama K yang cukup untuk memperkuat jaringan tanaman dan mengurangi kerentanan",
        "type": "kultur_teknis"
    },
    {
        "disease_code": "DIS004",
        "title": "Pengurangan Kelembaban",
        "description": "Mengurangi irigasi berlebihan untuk menurunkan kelembaban tanah yang mendukung pertumbuhan jamur",
        "type": "kultur_teknis"
    },
    
    # Tungro (DIS005)
    {
        "disease_code": "DIS005",
        "title": "Pengendalian Wereng Hijau",
        "description": "Mengendalikan wereng hijau (Nephotettix spp.) yang merupakan vektor Tungro melalui insektisida atau metode ramah lingkungan",
        "type": "pengendalian"
    },
    {
        "disease_code": "DIS005",
        "title": "Penggunaan Varietas Toleran",
        "description": "Menanam varietas padi yang toleran terhadap Tungro seperti IR64, Cisadane",
        "type": "varietas_tahan"
    },
    {
        "disease_code": "DIS005",
        "title": "Penyimpanan Benih yang Baik",
        "description": "Menyimpan benih di tempat yang tidak ada wereng untuk menghindari penularan virus sejak awal",
        "type": "preventif"
    },
    
    # Layu Bibit (DIS006)
    {
        "disease_code": "DIS006",
        "title": "Sterilisasi Media Tanam",
        "description": "Mensterilisasi media tanam persemaian dengan cara pengukusan atau pemanasan untuk membunuh jamur Corticium sasakii",
        "type": "preventif"
    },
    {
        "disease_code": "DIS006",
        "title": "Sanitasi Persemaian",
        "description": "Menjaga kebersihan persemaian, mengatur drainase yang baik, dan menghindari penyiraman berlebihan",
        "type": "kultur_teknis"
    },
    {
        "disease_code": "DIS006",
        "title": "Fungisida pada Persemaian",
        "description": "Menyemprotkan fungisida pada persemaian sebagai tindakan preventif",
        "type": "preventif"
    },
    
    # Kerdil Rumput (DIS007)
    {
        "disease_code": "DIS007",
        "title": "Pengendalian Wereng Coklat",
        "description": "Mengendalikan wereng coklat (Nilaparvata lugens) yang merupakan vektor Kerdil Rumput melalui berbagai cara",
        "type": "pengendalian"
    },
    {
        "disease_code": "DIS007",
        "title": "Penggunaan Varietas Tahan",
        "description": "Menanam varietas padi yang tahan atau toleran terhadap Kerdil Rumput",
        "type": "varietas_tahan"
    },
    
    # Hawar Daun Cokelat (DIS008)
    {
        "disease_code": "DIS008",
        "title": "Penggunaan Fungisida",
        "description": "Menyemprotkan fungisida yang sesuai pada saat gejala mulai tampak atau secara preventif",
        "type": "pengendalian"
    },
    {
        "disease_code": "DIS008",
        "title": "Pemilihan Varietas",
        "description": "Memilih varietas padi yang memiliki ketahanan terhadap Hawar Daun Cokelat",
        "type": "varietas_tahan"
    },
    
    # Penyakit Bintil Padi (DIS009)
    {
        "disease_code": "DIS009",
        "title": "Sanitasi Lahan",
        "description": "Membersihkan sisa-sisa tanaman padi sebelumnya yang dapat menjadi tempat perkembangan jamur",
        "type": "preventif"
    },
    {
        "disease_code": "DIS009",
        "title": "Penggunaan Fungisida",
        "description": "Menyemprotkan fungisida pada collar area sebagai pencegahan",
        "type": "preventif"
    }
]

# Update the knowledge base
kb["diseases"] = list(comprehensive_diseases.values())
kb["symptoms"] = list(comprehensive_symptoms.values())
kb["disease_symptoms"] = comprehensive_ds_relationships
kb["treatments"] = comprehensive_treatments

# Save the enhanced knowledge base
with open("knowledge_base.json", "w", encoding="utf-8") as f:
    json.dump(kb, f, ensure_ascii=False, indent=2)

print("Enhanced Knowledge Base Summary:")
print(f"  - Diseases: {len(kb['diseases'])}")
print(f"  - Symptoms: {len(kb['symptoms'])}")
print(f"  - Disease-Symptom Relationships: {len(kb['disease_symptoms'])}")
print(f"  - Treatments: {len(kb['treatments'])}")
print(f"\nKnowledge base saved to: knowledge_base.json")
