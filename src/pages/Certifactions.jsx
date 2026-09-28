import { CertificatesData } from "./Ui/certs";

const Certifications = () => {
  const certificates = Object.values(CertificatesData);

  return (
    <section>
      <div
        data-aos="zoom-in"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 py-6 mt-19 pb-25"
      >
        {certificates.map((cert) => (
          <div
            key={cert.name}
            className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:border-gray-400 transition-colors duration-200"
          >
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
              <div className="flex items-baseline justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-900 truncate">
                  {cert.name}
                </h3>
                <p className="text-xs text-gray-500 shrink-0">
                  by {cert.provider}
                </p>
              </div>

              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-black hover:underline underline-offset-4 transition-all"
              >
                View Certificate
               </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;