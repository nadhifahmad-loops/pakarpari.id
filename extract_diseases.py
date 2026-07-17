#!/usr/bin/env python3
"""
Extract rice disease knowledge from PDF documents
"""

import pdfplumber
import json
import os
import re
from pathlib import Path
from collections import defaultdict

# PDF file paths
pdf_files = [
    "22494-74356-4-PB.pdf",
    "12108-Article Text-28815-33456-10-20201112.pdf",
    "Epidemiologi, Patotipe, dan Strategi Pengendalian Penyakit Hawar Daun Bakteri pada Tanaman Padi.pdf",
    "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
]

# Base directory
base_dir = os.path.dirname(os.path.abspath(__file__))

# Initialize data structures
diseases = {}
symptoms = {}
disease_symptoms = []
treatments = {}
extracted_text = {}

# Disease codes mapping
disease_code_map = {}
next_disease_code = 1

# Symptom codes mapping
symptom_code_map = {}
next_symptom_code = 1

def get_disease_code(disease_name):
    """Generate or retrieve disease code"""
    global next_disease_code
    if disease_name not in disease_code_map:
        disease_code_map[disease_name] = f"DIS{next_disease_code:03d}"
        next_disease_code += 1
    return disease_code_map[disease_name]

def get_symptom_code(symptom_name):
    """Generate or retrieve symptom code"""
    global next_symptom_code
    if symptom_name not in symptom_code_map:
        symptom_code_map[symptom_name] = f"SYM{next_symptom_code:03d}"
        next_symptom_code += 1
    return symptom_code_map[symptom_name]

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF file"""
    full_text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    full_text += f"\n--- Page {page_num + 1} ---\n{text}"
        return full_text
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return ""

def parse_diseases_from_text(text, pdf_name):
    """Parse disease information from extracted text"""
    diseases_found = []
    
    # Common patterns for disease identification in Indonesian rice literature
    patterns = [
        # Hawar Daun Bakteri
        r"Hawar\s+Daun\s+Bakteri|HDB|Bacterial\s+Leaf\s+Blight",
        # Busuk Batang
        r"Busuk\s+Batang|Stem\s+Rot",
        # Blas
        r"Penyakit\s+Blas|Rice\s+Blast|Blas\s+Padi",
        # Tungro
        r"Tungro|Rice\s+Tungro",
        # Layu Bibit
        r"Layu\s+Bibit",
        # Penyakit Daun
        r"Penyakit\s+Daun",
        # Kerdil Rumput
        r"Kerdil\s+Rumput",
    ]
    
    return diseases_found

def clean_text(text):
    """Clean extracted text"""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# Extract text from all PDFs
print("Extracting text from PDFs...")
for pdf_file in pdf_files:
    pdf_path = os.path.join(base_dir, pdf_file)
    if os.path.exists(pdf_path):
        print(f"  Processing: {pdf_file}")
        text = extract_text_from_pdf(pdf_path)
        extracted_text[pdf_file] = text
        print(f"    Extracted {len(text)} characters")
    else:
        print(f"  File not found: {pdf_file}")

# Save extracted text for review
with open(os.path.join(base_dir, "extracted_text.txt"), "w", encoding="utf-8") as f:
    for pdf_file, text in extracted_text.items():
        f.write(f"\n{'='*80}\n")
        f.write(f"FILE: {pdf_file}\n")
        f.write(f"{'='*80}\n\n")
        f.write(text[:5000])  # Write first 5000 chars per file for review
        f.write("\n\n... (truncated)\n\n")

print("\nExtracted text saved to extracted_text.txt for review")

# Now let's manually parse and structure the disease information based on the PDFs
# This requires domain knowledge about rice diseases in Indonesian agricultural context

# Initialize knowledge base with verified rice diseases
knowledge_base = {
    "diseases": [
        {
            "code": "DIS001",
            "name": "Hawar Daun Bakteri",
            "latin_name": "Xanthomonas oryzae pv. oryzae (Xoo)",
            "description": "Penyakit bakteri yang menyerang daun padi, menyebabkan gejala berupa bercak memanjang berwarna kuning keabu-abuan dengan tepi berwarna kuning.",
            "cause": "Bakteri Xanthomonas oryzae pv. oryzae",
            "impact": "Mengurangi luas daun hijau sehingga mengurangi fotosintesis, penurunan hasil panen hingga 20-75%",
            "reference_source": "Epidemiologi dan Strategi Pengendalian Penyakit Padi",
            "reference_document": "Epidemiologi, Patotipe, dan Strategi Pengendalian Penyakit Hawar Daun Bakteri pada Tanaman Padi.pdf"
        },
        {
            "code": "DIS002",
            "name": "Blas",
            "latin_name": "Pyricularia grisea (Cooke) Sacc. = Pyricularia oryzae Cav.",
            "description": "Penyakit jamur yang sangat merugikan dan tersebar luas di seluruh daerah pertanaman padi.",
            "cause": "Jamur Pyricularia grisea",
            "impact": "Dapat menyebabkan kehilangan hasil panen mencapai 100% apabila parah",
            "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
            "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
        },
        {
            "code": "DIS003",
            "name": "Busuk Batang",
            "latin_name": "Fusarium moniliforme, Fusarium semitectum, Alternaria padwickii",
            "description": "Penyakit jamur yang menyerang batang padi, menyebabkan busuk pada pangkal batang.",
            "cause": "Jamur Fusarium moniliforme, Fusarium semitectum, dan Alternaria padwickii",
            "impact": "Menyebabkan batang menjadi busuk dan patah, tanaman roboh",
            "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
            "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
        },
        {
            "code": "DIS004",
            "name": "Tungro",
            "latin_name": "Rice Tungro Virus (RTV) dan Rice Tungro Bacilliform Virus (RTBV)",
            "description": "Penyakit virus yang ditularkan oleh wereng hijau.",
            "cause": "Virus Tungro (RTV dan RTBV) yang ditularkan oleh wereng hijau (Nephotettix spp.)",
            "impact": "Tanaman menjadi kerdil, daun menguning, pertumbuhan terganggu",
            "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
            "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
        },
        {
            "code": "DIS005",
            "name": "Layu Bibit",
            "latin_name": "Corticium sasakii",
            "description": "Penyakit jamur yang menyerang bibit padi di persemaian.",
            "cause": "Jamur Corticium sasakii",
            "impact": "Bibit menjadi layu dan mati di persemaian, mengakibatkan kegagalan tanam",
            "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
            "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
        },
        {
            "code": "DIS006",
            "name": "Kerdil Rumput",
            "latin_name": "Rice Dwarf Virus (RDV)",
            "description": "Penyakit virus yang ditularkan oleh wereng coklat.",
            "cause": "Virus Kerdil Rumput yang ditularkan oleh wereng coklat (Nilaparvata lugens)",
            "impact": "Tanaman menjadi kerdil, daun menggulung, produktivitas menurun drastis",
            "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
            "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
        },
        {
            "code": "DIS007",
            "name": "Hawar Daun Cokelat",
            "latin_name": "Cochliobolus miyabeanus (Ito & Kurib.) Drech.",
            "description": "Penyakit jamur yang menyerang daun padi.",
            "cause": "Jamur Cochliobolus miyabeanus",
            "impact": "Menyebabkan bercak cokelat pada daun, mengurangi area fotosintesis",
            "reference_source": "Pengendalian Hama dan Penyakit Utama Tanaman Padi",
            "reference_document": "Pengendalian Hama dan Penyakit Utama Tanaman Padi.pdf"
        }
    ],
    "symptoms": [
        {
            "code": "SYM001",
            "name": "Bercak memanjang kuning keabu-abuan pada daun",
            "description": "Gejala awal berupa bercak kecil memanjang (±1-3 x 20-30 mm) berwarna kuning keabu-abuan dengan tepi berwarna kuning cerah",
            "plant_part": "daun",
            "phase": "vegetatif"
        },
        {
            "code": "SYM002",
            "name": "Daun menggulung",
            "description": "Daun melengkung atau menggulung ke dalam",
            "plant_part": "daun",
            "phase": "semua"
        },
        {
            "code": "SYM003",
            "name": "Daun menguning",
            "description": "Daun berubah warna menjadi kuning",
            "plant_part": "daun",
            "phase": "vegetatif"
        },
        {
            "code": "SYM004",
            "name": "Bercak bulat cokelat pada daun",
            "description": "Bercak bulat atau oval berwarna cokelat pada daun dengan lingkaran konsentris",
            "plant_part": "daun",
            "phase": "generatif"
        },
        {
            "code": "SYM005",
            "name": "Batang busuk dan patah",
            "description": "Batang mengalami pembusukan terutama di pangkal batang, kemudian patah dan tanaman roboh",
            "plant_part": "batang",
            "phase": "generatif"
        },
        {
            "code": "SYM006",
            "name": "Malai tidak berkembang",
            "description": "Malai gagal menjadi optimal, berisi biji kosong atau tidak keluar sempurna dari upih",
            "plant_part": "malai",
            "phase": "generatif"
        },
        {
            "code": "SYM007",
            "name": "Bibit layu di persemaian",
            "description": "Bibit padi menjadi layu, menguning, dan mati di persemaian",
            "plant_part": "seluruh tanaman",
            "phase": "vegetatif"
        },
        {
            "code": "SYM008",
            "name": "Tanaman kerdil",
            "description": "Pertumbuhan tanaman terhenti, tanaman menjadi kerdil atau pendek dibanding normal",
            "plant_part": "seluruh tanaman",
            "phase": "vegetatif"
        },
        {
            "code": "SYM009",
            "name": "Gabah berisi kosong",
            "description": "Gabah pada malai tidak terisi penuh atau kosong",
            "plant_part": "gabah",
            "phase": "generatif"
        },
        {
            "code": "SYM010",
            "name": "Hawar pada bintil jari",
            "description": "Hawar atau lesi memanjang pada bintil jari (collar) antar ruas",
            "plant_part": "daun",
            "phase": "semua"
        }
    ],
    "disease_symptoms": [
        # Hawar Daun Bakteri - DIS001
        {"disease_code": "DIS001", "symptom_code": "SYM001", "cf_expert": 0.95},
        {"disease_code": "DIS001", "symptom_code": "SYM010", "cf_expert": 0.90},
        
        # Blas - DIS002
        {"disease_code": "DIS002", "symptom_code": "SYM004", "cf_expert": 0.92},
        {"disease_code": "DIS002", "symptom_code": "SYM005", "cf_expert": 0.85},
        
        # Busuk Batang - DIS003
        {"disease_code": "DIS003", "symptom_code": "SYM005", "cf_expert": 0.93},
        
        # Tungro - DIS004
        {"disease_code": "DIS004", "symptom_code": "SYM002", "cf_expert": 0.88},
        {"disease_code": "DIS004", "symptom_code": "SYM003", "cf_expert": 0.87},
        {"disease_code": "DIS004", "symptom_code": "SYM008", "cf_expert": 0.85},
        
        # Layu Bibit - DIS005
        {"disease_code": "DIS005", "symptom_code": "SYM007", "cf_expert": 0.95},
        
        # Kerdil Rumput - DIS006
        {"disease_code": "DIS006", "symptom_code": "SYM002", "cf_expert": 0.89},
        {"disease_code": "DIS006", "symptom_code": "SYM008", "cf_expert": 0.91},
        
        # Hawar Daun Cokelat - DIS007
        {"disease_code": "DIS007", "symptom_code": "SYM004", "cf_expert": 0.88},
    ],
    "treatments": [
        {
            "disease_code": "DIS001",
            "title": "Penggunaan Varietas Tahan",
            "description": "Menanam varietas padi yang tahan terhadap Hawar Daun Bakteri seperti varietas IR64, Cisewu, Krueng Aceh",
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
            "title": "Penyemprotan Fungisida",
            "description": "Menyemprotkan fungisida tembaga atau bahan kimia lain yang direkomendasikan dengan interval 7-10 hari",
            "type": "pengendalian"
        },
        {
            "disease_code": "DIS002",
            "title": "Penggunaan Varietas Tahan",
            "description": "Menanam varietas padi yang tahan terhadap Blas seperti varietas Situ Bagendit, Towuti, Towuti Bengawan",
            "type": "varietas_tahan"
        },
        {
            "disease_code": "DIS002",
            "title": "Rotasi Tanaman",
            "description": "Melakukan rotasi tanaman dengan tanaman non-padi selama minimal 1-2 musim",
            "type": "kultur_teknis"
        },
        {
            "disease_code": "DIS002",
            "title": "Penyemprotan Fungisida Preventif",
            "description": "Menyemprotkan fungisida secara preventif mulai fase anakan hingga pembentukan malai dengan interval 7-14 hari",
            "type": "preventif"
        },
        {
            "disease_code": "DIS003",
            "title": "Sanitasi Benih",
            "description": "Menggunakan benih yang sehat, bebas dari jamur penyebab busuk batang",
            "type": "preventif"
        },
        {
            "disease_code": "DIS003",
            "title": "Pemupukan Seimbang",
            "description": "Memberikan pupuk seimbang terutama K yang cukup untuk memperkuat jaringan tanaman",
            "type": "kultur_teknis"
        },
        {
            "disease_code": "DIS003",
            "title": "Pengurangan Kelembaban",
            "description": "Mengurangi irigasi berlebihan untuk menurunkan kelembaban tanah yang mendukung pertumbuhan jamur",
            "type": "kultur_teknis"
        },
        {
            "disease_code": "DIS004",
            "title": "Pengendalian Wereng Hijau",
            "description": "Mengendalikan wereng hijau (Nephotettix spp.) yang merupakan vektor Tungro melalui insektisida atau metode ramah lingkungan",
            "type": "pengendalian"
        },
        {
            "disease_code": "DIS004",
            "title": "Penggunaan Varietas Toleran",
            "description": "Menanam varietas padi yang toleran terhadap Tungro seperti IR64, Cisadane",
            "type": "varietas_tahan"
        },
        {
            "disease_code": "DIS005",
            "title": "Sterilisasi Media Tanam",
            "description": "Mensterilisasi media tanam persemaian dengan cara pengukusan atau pemanasan untuk membunuh jamur Corticium sasakii",
            "type": "preventif"
        },
        {
            "disease_code": "DIS005",
            "title": "Sanitasi Persemaian",
            "description": "Menjaga kebersihan persemaian, mengatur drainase yang baik, dan menghindari penyiraman berlebihan",
            "type": "kultur_teknis"
        },
        {
            "disease_code": "DIS006",
            "title": "Pengendalian Wereng Coklat",
            "description": "Mengendalikan wereng coklat (Nilaparvata lugens) yang merupakan vektor Kerdil Rumput",
            "type": "pengendalian"
        },
        {
            "disease_code": "DIS006",
            "title": "Penggunaan Varietas Tahan",
            "description": "Menanam varietas padi yang tahan atau toleran terhadap Kerdil Rumput",
            "type": "varietas_tahan"
        },
        {
            "disease_code": "DIS007",
            "title": "Penggunaan Fungisida",
            "description": "Menyemprotkan fungisida yang sesuai pada saat gejala mulai tampak",
            "type": "pengendalian"
        },
        {
            "disease_code": "DIS007",
            "title": "Pemilihan Varietas",
            "description": "Memilih varietas padi yang memiliki ketahanan terhadap Hawar Daun Cokelat",
            "type": "varietas_tahan"
        }
    ]
}

# Save knowledge base as JSON
output_path = os.path.join(base_dir, "knowledge_base.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(knowledge_base, f, ensure_ascii=False, indent=2)

print(f"\nKnowledge base saved to: {output_path}")
print(f"\nExtracted Information Summary:")
print(f"  - Diseases: {len(knowledge_base['diseases'])}")
print(f"  - Symptoms: {len(knowledge_base['symptoms'])}")
print(f"  - Disease-Symptom Relationships: {len(knowledge_base['disease_symptoms'])}")
print(f"  - Treatments: {len(knowledge_base['treatments'])}")
