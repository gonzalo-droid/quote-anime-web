import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Política de Privacidad — Quote Anime",
  description:
    "Política de privacidad de Quote Anime. Información sobre el tratamiento de datos en la app.",
};

export default function PrivacyPolicy() {
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
              Política de Privacidad
            </h1>
            <p className="text-textSecondary">
              Última actualización: abril de 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-10">
            <Section title="1. Información general">
              <p>
                Frases Anime (&ldquo;la Aplicación&rdquo;) es desarrollada por{" "}
                <strong className="text-textPrimary">NekoDojo</strong>. Esta
                Política de Privacidad describe cómo recopilamos, usamos y
                protegemos la información cuando usas nuestra aplicación para
                Android.
              </p>
              <p>
                Al usar Frases Anime, aceptas las prácticas descritas en esta
                política. Si tienes alguna duda, puedes contactarnos en{" "}
                <a
                  href="mailto:contacto@gondroid.dev"
                  className="text-accent hover:underline"
                >
                  contacto@gondroid.dev
                </a>
                .
              </p>
            </Section>

            <Section title="2. Información que recopilamos">
              <SubSection title="2.1 Firebase (frases remotas)">
                <p>
                  Utilizamos{" "}
                  <strong className="text-textPrimary">Firebase</strong> de
                  Google para gestionar y actualizar el catálogo de frases de
                  forma remota. Firebase puede recopilar datos técnicos anónimos
                  como el identificador de instalación de la app, la versión del
                  sistema operativo y el modelo del dispositivo, con el único
                  fin de entregar el contenido correctamente.
                </p>
                <p>
                  No recopilamos información personal identificable a través de
                  Firebase. Los datos se procesan conforme a la{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Política de Privacidad de Google
                  </a>
                  .
                </p>
              </SubSection>

              <SubSection title="2.2 Google AdMob (anuncios)">
                <p>
                  La aplicación muestra anuncios a través de{" "}
                  <strong className="text-textPrimary">Google AdMob</strong>.
                  AdMob puede usar identificadores de publicidad (como el
                  Android Advertising ID) para mostrar anuncios personalizados
                  basados en tus intereses.
                </p>
                <p>
                  Puedes optar por no recibir anuncios personalizados a través
                  de la configuración de tu dispositivo Android en:{" "}
                  <em>
                    Ajustes → Google → Anuncios → Inhabilitar personalización de
                    anuncios
                  </em>
                  .
                </p>
                <p>
                  AdMob opera bajo la{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Política de Privacidad de Google
                  </a>
                  .
                </p>
              </SubSection>

              <SubSection title="2.3 Datos locales (Room / SQLite)">
                <p>
                  Las frases que marques como favoritas se almacenan{" "}
                  <strong className="text-textPrimary">
                    exclusivamente en tu dispositivo
                  </strong>{" "}
                  mediante la base de datos local Room (SQLite). Estos datos
                  nunca se transmiten a servidores externos ni son accesibles
                  por terceros.
                </p>
              </SubSection>
            </Section>

            <Section title="3. Permisos solicitados">
              <p>Frases Anime solicita los siguientes permisos en Android:</p>
              <ul className="space-y-3 mt-4">
                <PermissionItem
                  permission="POST_NOTIFICATIONS"
                  description="Necesario para enviar notificaciones diarias con frases motivacionales. Solo se usa si activas las notificaciones en la configuración de la app."
                />
                <PermissionItem
                  permission="RECEIVE_BOOT_COMPLETED"
                  description="Necesario para restaurar las alarmas de notificación después de que el dispositivo se reinicie, garantizando que recibas tus frases en el horario configurado."
                />
              </ul>
              <p className="mt-4">
                No solicitamos acceso a la cámara, micrófono, contactos,
                ubicación ni ningún otro dato sensible.
              </p>
            </Section>

            <Section title="4. Uso de la información">
              <p>La información recopilada se usa exclusivamente para:</p>
              <ul className="space-y-2 mt-3 text-textSecondary list-disc list-inside">
                <li>
                  Mostrar y actualizar el catálogo de frases del universo anime.
                </li>
                <li>Personalizar y mostrar anuncios a través de AdMob.</li>
                <li>
                  Enviar notificaciones de frases en el horario configurado por
                  el usuario.
                </li>
                <li>
                  Mantener la lista de frases favoritas del usuario de forma
                  local.
                </li>
              </ul>
            </Section>

            <Section title="5. Compartición de datos con terceros">
              <p>
                <strong className="text-textPrimary">
                  No vendemos, alquilamos ni compartimos datos personales con
                  terceros
                </strong>{" "}
                con fines comerciales. Los únicos servicios de terceros
                integrados son:
              </p>
              <ul className="space-y-2 mt-3 text-textSecondary list-disc list-inside">
                <li>Google Firebase — gestión de contenido remoto</li>
                <li>Google AdMob — publicidad</li>
              </ul>
              <p className="mt-3">
                Ambos servicios son operados por Google LLC y están sujetos a
                sus propias políticas de privacidad.
              </p>
            </Section>

            <Section title="6. Seguridad">
              <p>
                Implementamos medidas técnicas razonables para proteger la
                información almacenada en el dispositivo. Sin embargo, ningún
                método de almacenamiento electrónico es 100% seguro. Los datos
                de favoritos almacenados localmente están protegidos por los
                mecanismos de seguridad del propio sistema Android.
              </p>
            </Section>

            <Section title="7. Privacidad de menores">
              <p>
                Frases Anime no está dirigida a menores de 13 años. No
                recopilamos intencionalmente información personal de menores de
                13 años. Si descubrimos que hemos recopilado datos de un menor,
                los eliminaremos de inmediato.
              </p>
            </Section>

            <Section title="8. Cambios en esta política">
              <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente.
                Te notificaremos sobre cambios significativos publicando la
                nueva versión en esta página con la fecha de actualización. Te
                recomendamos revisar esta política periódicamente.
              </p>
            </Section>

            <Section title="9. Contacto">
              <p>
                Si tienes preguntas, comentarios o solicitudes sobre esta
                Política de Privacidad, puedes contactarnos:
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

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pl-4 border-l-2 border-accent/20 mt-4">
      <h3 className="text-base font-semibold text-textPrimary/90 mb-2">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PermissionItem({
  permission,
  description,
}: {
  permission: string;
  description: string;
}) {
  return (
    <li className="flex flex-col gap-1">
      <code className="text-accent text-sm font-mono bg-surface px-2 py-0.5 rounded w-fit">
        {permission}
      </code>
      <span className="text-textSecondary text-sm pl-1">{description}</span>
    </li>
  );
}
