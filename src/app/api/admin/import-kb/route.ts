// src/app/api/admin/import-kb/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    // Proses sinkronisasi ETL ke PostgreSQL via Prisma
    for (const row of data) {
      const disease = await prisma.disease.findUnique({ where: { code: row.disease_code } });
      const symptom = await prisma.symptom.findUnique({ where: { code: row.symptom_code } });

      if (disease && symptom) {
        await prisma.diseaseSymptom.upsert({
          where: { disease_id_symptom_id: { disease_id: disease.id, symptom_id: symptom.id } },
          update: { cf_expert: parseFloat(row.cf_expert) },
          create: {
            disease_id: disease.id,
            symptom_id: symptom.id,
            cf_expert: parseFloat(row.cf_expert)
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: "Knowledge Base Berhasil Diupdate!" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses file Excel" }, { status: 500 });
  }
}