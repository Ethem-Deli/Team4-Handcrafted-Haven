import ProductUploadForm from "@/components/ProductUploadForm";

export default function UploadPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Upload a New Product</h1>
      <ProductUploadForm />
    </div>
  );
}