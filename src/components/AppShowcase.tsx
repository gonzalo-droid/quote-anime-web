import Image from "next/image";

function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative flex justify-center py-4">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10"
        aria-hidden="true"
      />
      <Image
        src={src}
        alt={alt}
        width={260}
        height={549}
        sizes="(min-width: 640px) 250px, 220px"
        className="relative h-auto w-[220px] sm:w-[250px] drop-shadow-[0_24px_30px_rgb(var(--accent)/0.25)]"
      />
    </div>
  );
}

function ShareCards() {
  const card =
    "overflow-hidden rounded-2xl shadow-xl shadow-accent/20 ring-1 ring-accent/15";
  return (
    <div className="relative flex items-start justify-center gap-4 py-4">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-heart/10"
        aria-hidden="true"
      />
      <div className={`relative ${card}`}>
        <Image
          src="/images/quote_01.png"
          alt="Tarjeta con una frase de Satoru Gojo sobre el amor, de Jujutsu Kaisen"
          width={210}
          height={263}
          sizes="(min-width: 640px) 190px, 150px"
          className="h-auto w-[150px] sm:w-[190px]"
        />
      </div>
      <div className={`relative mt-12 ${card}`}>
        <Image
          src="/images/quote_02.png"
          alt="Tarjeta con una frase de Wasuke Itadori sobre ayudar, de Jujutsu Kaisen"
          width={210}
          height={263}
          sizes="(min-width: 640px) 190px, 150px"
          className="h-auto w-[150px] sm:w-[190px]"
        />
      </div>
    </div>
  );
}

function Row({
  title,
  children,
  media,
  mediaFirst = false,
}: {
  title: string;
  children: React.ReactNode;
  media: React.ReactNode;
  mediaFirst?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={mediaFirst ? "md:order-2" : undefined}>
        <h3 className="font-playfair text-3xl font-semibold leading-tight tracking-tight text-textPrimary md:text-4xl">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-textSecondary">
          {children}
        </p>
      </div>
      <div className={mediaFirst ? "md:order-1" : undefined}>{media}</div>
    </div>
  );
}

const BASICS = [
  {
    title: "Favoritos sin conexión",
    text: "Guarda una frase con un toque y vuelve a leerla cuando quieras, sin internet.",
  },
  {
    title: "Explora por emoción",
    text: "Motivación, lucha, amor, esperanza… o mira todas las frases en una lista.",
  },
  {
    title: "Frases nuevas cada semana",
    text: "Actualizamos el catálogo con frases de más animes.",
  },
];

export default function AppShowcase() {
  return (
    <section id="app" className="scroll-mt-20 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-playfair text-4xl font-semibold leading-[1.1] tracking-tight text-textPrimary text-balance md:text-5xl">
          Cada frase, donde la necesites
        </h2>

        <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
          <Row
            title="Compártela como imagen"
            mediaFirst
            media={<ShareCards />}
          >
            Genera una tarjeta vertical con la frase, el autor y el anime. Lista
            para WhatsApp, Instagram o donde quieras, sin editores externos.
          </Row>

          <Row
            title="Notificaciones en tu horario"
            media={
              <Phone
                src="/images/setting_app.png"
                alt="Pantalla Personalización de Quote Anime con el horario permitido y la frecuencia de notificaciones"
              />
            }
          >
            Elige de 1 a 10 frases al día y el rango de horas en que quieres
            recibirlas. Fuera de ese horario, la app no te molesta.
          </Row>

          <Row
            title="Un widget con frase nueva"
            mediaFirst
            media={
              <Phone
                src="/images/widget_app.png"
                alt="Widget de Quote Anime en la pantalla de inicio mostrando una frase de Natsu Dragneel, de Fairy Tail"
              />
            }
          >
            Ponlo en tu pantalla de inicio y ajusta su tamaño. Puede mostrar una
            frase nueva hasta 8 veces al día, o la cambias tú con un toque.
          </Row>
        </div>

        <div className="mt-20 grid gap-8 md:mt-28 md:grid-cols-3 md:gap-10">
          {BASICS.map((item) => (
            <div key={item.title} className="border-t border-accent/25 pt-5">
              <h3 className="font-semibold text-textPrimary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-textSecondary">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
