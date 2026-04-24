import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Quote Anime",
  description:
    "Términos y condiciones de uso de Quote Anime. Conoce las reglas y condiciones para usar la app.",
};

export default function TermsAndConditions() {
  return (
    <>
      <main className="min-h-screen bg-bgDark">
        {/* Header */}
        <header className="border-b border-accent/10 bg-surface/30 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-bgDark border border-accent/20 group-hover:border-accent/40 flex items-center justify-center transition-colors duration-200">
                <Image
                  src="/images/logo_white.png"
                  alt="Quote Anime Logo"
                  width={140}
                  height={56}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
              <span className="font-semibold text-textPrimary group-hover:text-accent transition-colors duration-200">
                Frases Anime
              </span>
            </Link>
            <Link
              href="/"
              className="text-textSecondary hover:text-accent text-sm transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="mb-12">
            <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Legal
            </span>
            <h1 className="text-4xl font-bold text-textPrimary mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-textSecondary">
              Última actualización: abril de 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-10">
            <Section title="1. Aceptación de los términos">
              <p>
                Al descargar, instalar o usar Frases Anime (&ldquo;la
                Aplicación&rdquo;), desarrollada por{" "}
                <strong className="text-textPrimary">NekoDojo</strong>, aceptas
                quedar vinculado por estos Términos y Condiciones. Si no estás
                de acuerdo con alguna parte de estos términos, te pedimos que no
                uses la Aplicación.
              </p>
              <p>
                Estos términos se aplican a todas las versiones de la Aplicación
                disponibles en Google Play y App Store.
              </p>
            </Section>

            <Section title="2. Descripción del servicio">
              <p>
                Frases Anime es una aplicación gratuita que ofrece una
                colección de frases y citas del universo anime. Las
                funcionalidades principales incluyen:
              </p>
              <ul className="space-y-2 mt-3 text-textSecondary list-disc list-inside">
                <li>Exploración de frases organizadas por personaje y serie.</li>
                <li>Guardado de frases favoritas de forma local en el dispositivo.</li>
                <li>Notificaciones diarias con frases motivacionales (opcional).</li>
                <li>Compartir frases en redes sociales.</li>
              </ul>
              <p className="mt-3">
                La Aplicación es gratuita y se financia mediante publicidad a
                través de Google AdMob.
              </p>
            </Section>

            <Section title="3. Uso aceptable">
              <p>
                Al usar Frases Anime, te comprometes a no realizar ninguna de
                las siguientes acciones:
              </p>
              <ul className="space-y-2 mt-3 text-textSecondary list-disc list-inside">
                <li>
                  Usar la Aplicación con fines ilegales o no autorizados.
                </li>
                <li>
                  Intentar descompilar, hacer ingeniería inversa o extraer el
                  código fuente de la Aplicación.
                </li>
                <li>
                  Interferir con el funcionamiento normal de la Aplicación o
                  sus servidores.
                </li>
                <li>
                  Usar herramientas automatizadas para acceder o extraer
                  contenido de la Aplicación.
                </li>
              </ul>
            </Section>

            <Section title="4. Propiedad intelectual">
              <p>
                El diseño, código fuente, gráficos e interfaz de la Aplicación
                son propiedad de{" "}
                <strong className="text-textPrimary">NekoDojo</strong> y están
                protegidos por las leyes de propiedad intelectual aplicables.
              </p>
              <p>
                Las frases y citas incluidas en la Aplicación pertenecen a sus
                respectivos autores, creadores y titulares de derechos. Frases
                Anime no reclama propiedad sobre el contenido original de las
                series o personajes anime.
              </p>
              <p>
                Esta aplicación no está afiliada, patrocinada ni respaldada por
                ningún estudio de animación o licenciante de anime.
              </p>
            </Section>

            <Section title="5. Publicidad">
              <p>
                La Aplicación incluye anuncios proporcionados por{" "}
                <strong className="text-textPrimary">Google AdMob</strong>. Al
                usar la Aplicación, aceptas que se muestren anuncios durante su
                uso. La experiencia publicitaria está sujeta a las políticas de
                Google AdMob.
              </p>
              <p>
                NekoDojo no es responsable del contenido de los anuncios
                mostrados por terceros a través de AdMob.
              </p>
            </Section>

            <Section title="6. Exoneración de garantías">
              <p>
                La Aplicación se proporciona{" "}
                <strong className="text-textPrimary">
                  &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;
                </strong>
                , sin garantías de ningún tipo, expresas o implícitas. No
                garantizamos que la Aplicación esté libre de errores, sea
                ininterrumpida o cumpla con tus requisitos específicos.
              </p>
              <p>
                El contenido del catálogo de frases puede actualizarse o
                modificarse en cualquier momento sin previo aviso.
              </p>
            </Section>

            <Section title="7. Limitación de responsabilidad">
              <p>
                En la medida permitida por la ley aplicable, NekoDojo no será
                responsable de ningún daño indirecto, incidental, especial o
                consecuente que surja del uso o la imposibilidad de usar la
                Aplicación, incluyendo la pérdida de datos almacenados
                localmente en el dispositivo.
              </p>
            </Section>

            <Section title="8. Suspensión o modificación del servicio">
              <p>
                NekoDojo se reserva el derecho de suspender, modificar o
                descontinuar la Aplicación o cualquiera de sus funcionalidades
                en cualquier momento, con o sin previo aviso, sin que ello
                genere responsabilidad alguna frente al usuario.
              </p>
            </Section>

            <Section title="9. Cambios en estos términos">
              <p>
                Podemos actualizar estos Términos y Condiciones ocasionalmente.
                Te notificaremos sobre cambios significativos publicando la
                nueva versión en esta página con la fecha de actualización. El
                uso continuado de la Aplicación tras la publicación de los
                nuevos términos implica la aceptación de los mismos.
              </p>
            </Section>

            <Section title="10. Contacto">
              <p>
                Si tienes preguntas, comentarios o solicitudes sobre estos
                Términos y Condiciones, puedes contactarnos:
              </p>
              <div className="mt-4 bg-surface border border-accent/10 rounded-xl p-5">
                <p className="text-textPrimary font-semibold mb-1">NekoDojo</p>
                <p className="text-textSecondary text-sm">
                  Desarrollador de Frases Anime
                </p>
                <a
                  href="mailto:contacto@gondroid.dev"
                  className="text-accent hover:underline text-sm mt-2 block"
                >
                  contacto@gondroid.dev
                </a>
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-textPrimary mb-4 pb-2 border-b border-accent/10">
        {title}
      </h2>
      <div className="text-textSecondary leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
