import { CertificatesData } from "./Ui/certs";

const Certifications = () => {
  const certificates = Object.values(CertificatesData);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-800 lg:grid-cols-4 gap-5 py-6   flex-col items-center mt-19 pb-25">
        {certificates.map((cert) => (
          <div key={cert.name} className="rounded-xl border overflow-hidden">
            
            {/* Preview */}
            <div className="h-48 bg-gray-50">
              <img
                src={cert.image}
                alt={cert.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="p-4">
             <div className="flex justify-between">
              <h3 className="font-semibold">
                {cert.name}
              </h3>
          by
              <p className="text-sm text-gray-500">
                {cert.provider}
              </p>
              </div>

            
              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm mt-3 inline-block"
              >
                View Certificate →
              </a>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;