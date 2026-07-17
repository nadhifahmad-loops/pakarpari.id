import DiagnosisWizard from "@/components/expert/diagnosis-wizard";

export const metadata = {
  title: "Mulai Diagnosa - PakarPari.id",
  description: "Sistem Pakar Diagnosa Penyakit Padi",
};

export default function DiagnosaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PakarPari.id</h1>
          <p className="text-lg text-gray-600">Sistem Pakar Diagnosa Penyakit Tanaman Padi</p>
        </div>
        
        <DiagnosisWizard />
        
      </div>
    </main>
  );
}