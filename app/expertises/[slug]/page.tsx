import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { company } from "@/data/company";
import { serviceCategories } from "@/data/services";
import { galleryItems } from "@/data/gallery";
import {
  getServiceDetail,
  serviceSlugs,
  serviceDetailsList,
} from "@/data/service-details";
import { whatsappLink } from "@/lib/whatsapp";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import Reveal from "@/components/ui/Reveal";
import Carousel from "@/components/ui/Carousel";
import Accordion from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

/** Pré-génère les 4 pages d'expertise au build (SSG) */
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  if (!detail) return {};
  const category = serviceCategories.find((c) => c.id === detail.slug);
  const path = `/expertises/${detail.slug}`;
  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${category?.title ?? detail.metaTitle} — ${company.name}`,
      description: detail.metaDescription,
      images: [{ url: detail.heroImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ExpertisePage({ params }: Params) {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  if (!detail) notFound();

  const category = serviceCategories.find((c) => c.id === detail.slug)!;
  const photos = galleryItems.filter((g) => g.category === detail.slug);
  const others = serviceDetailsList.filter((d) => d.slug !== detail.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.title,
    serviceType: category.shortTitle,
    description: detail.metaDescription,
    provider: { "@type": "LocalBusiness", name: company.name, url: company.siteUrl },
    areaServed: company.serviceArea,
    url: `${company.siteUrl}/expertises/${detail.slug}`,
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ————— HERO ————— */}
        <section className="relative flex min-h-[78dvh] items-end overflow-hidden border-b border-smoke-950/10">
          <div className="absolute inset-0">
            <Image
              src={detail.heroImage}
              alt={detail.heroImageAlt}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover"
            />
            {/* Voile porcelaine — même direction lumineuse que la home */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-porcelain-50 via-porcelain-50/85 to-porcelain-50/25 lg:bg-gradient-to-r lg:from-porcelain-50/95 lg:via-porcelain-50/55 lg:via-45% lg:to-transparent lg:to-75%"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-porcelain-50/80 to-transparent"
            />
          </div>

          <div className="container-site relative w-full pt-[72px]">
            <div className="max-w-2xl pt-10 pb-14 lg:py-20">
              {/* Fil d'ariane */}
              <nav aria-label="Fil d'ariane" className="mb-8">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-smoke-500">
                  <li>
                    <Link href="/" className="transition-colors hover:text-brass-700">
                      Accueil
                    </Link>
                  </li>
                  <li aria-hidden className="text-smoke-300">/</li>
                  <li>
                    <Link href="/#expertises" className="transition-colors hover:text-brass-700">
                      Nos expertises
                    </Link>
                  </li>
                  <li aria-hidden className="text-smoke-300">/</li>
                  <li aria-current="page" className="font-medium text-smoke-700">
                    {category.shortTitle}
                  </li>
                </ol>
              </nav>

              <p className="section-label">{detail.index}</p>
              <h1 className="heading-display mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl lg:leading-[1.03]">
                {category.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-smoke-700">
                {detail.heroSubtitle}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <ButtonLink href="/#devis" variant="primary" arrow>
                  Demander un devis
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink()}
                  variant="ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                  Discuter sur WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* ————— INTRO PÉDAGOGIQUE ————— */}
        <section className="bg-porcelain-50 py-24 sm:py-32" aria-labelledby="intro-titre">
          <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="section-label">Comprendre</p>
              <h2
                id="intro-titre"
                className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              >
                {detail.intro.heading}
              </h2>
              <div
                aria-hidden
                className="fluted mt-8 hidden h-40 rounded-2xl border border-smoke-950/10 bg-porcelain-100 lg:block"
              />
            </Reveal>
            <Reveal delay={0.1} className="space-y-5">
              {detail.intro.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-lg leading-relaxed text-smoke-800"
                      : "leading-relaxed text-smoke-600"
                  }
                >
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ————— BÉNÉFICES ————— */}
        <section className="border-y border-smoke-950/5 bg-porcelain-100 py-24 sm:py-32" aria-labelledby="benefices-titre">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="section-label">Pourquoi ce choix</p>
              <h2
                id="benefices-titre"
                className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              >
                Ce que cette expertise vous apporte
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {detail.benefits.map((b, i) => (
                <Reveal key={b.title} delay={(i % 2) * 0.1}>
                  <article className="pane flex h-full gap-5 rounded-2xl p-7">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass-600/25 bg-brass-500/10 text-brass-700">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-medium text-smoke-950">
                        {b.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-smoke-600">
                        {b.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ————— PROCESSUS (carrousel numéroté) ————— */}
        <section className="bg-porcelain-50 py-24 sm:py-32" aria-labelledby="process-titre">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="section-label">Étape par étape</p>
              <h2
                id="process-titre"
                className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              >
                Comment se fabrique votre projet
              </h2>
              <p className="mt-5 leading-relaxed text-smoke-600">
                Du premier relevé à la pose, chaque étape est réalisée dans notre
                atelier. Faites défiler pour suivre le parcours.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12">
              <Carousel
                ariaLabel={`Étapes de fabrication — ${category.shortTitle}`}
                slideClassName="w-[80%] sm:w-[45%] lg:w-[30%]"
              >
                {detail.process.map((step, i) => (
                  <article
                    key={step.title}
                    className="flex h-full flex-col rounded-2xl border border-smoke-950/10 bg-white p-7 shadow-pane"
                  >
                    <span className="font-display text-5xl font-medium text-brass-500/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="mt-4 h-px w-full bg-gradient-to-r from-brass-600/40 to-transparent"
                    />
                    <h3 className="mt-5 font-display text-xl font-medium text-smoke-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-smoke-600">
                      {step.description}
                    </p>
                  </article>
                ))}
              </Carousel>
            </Reveal>
          </div>
        </section>

        {/* ————— APPLICATIONS (carrousel de cartes) ————— */}
        <section className="border-y border-smoke-950/5 bg-porcelain-100 py-24 sm:py-32" aria-labelledby="applications-titre">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="section-label">Cas d'usage</p>
              <h2
                id="applications-titre"
                className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              >
                Où l'employer chez vous
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="mt-12">
              <Carousel
                ariaLabel={`Applications — ${category.shortTitle}`}
                slideClassName="w-[82%] sm:w-[46%] lg:w-[31%]"
              >
                {detail.applications.map((app) => (
                  <article
                    key={app.title}
                    className="flex h-full flex-col rounded-2xl border border-brass-600/20 bg-brass-500/[0.06] p-7"
                  >
                    <span
                      aria-hidden
                      className="mb-5 h-px w-10 bg-brass-600"
                    />
                    <h3 className="font-display text-2xl font-medium text-smoke-950">
                      {app.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-smoke-600">
                      {app.description}
                    </p>
                  </article>
                ))}
              </Carousel>
            </Reveal>
          </div>
        </section>

        {/* ————— RÉALISATIONS (carrousel photo) ————— */}
        {photos.length > 0 && (
          <section className="bg-porcelain-50 py-24 sm:py-32" aria-labelledby="realisations-titre">
            <div className="container-site">
              <Reveal className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="section-label">En images</p>
                  <h2
                    id="realisations-titre"
                    className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
                  >
                    Nos réalisations
                  </h2>
                </div>
                <Link
                  href="/#galerie"
                  className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brass-700 transition-colors hover:text-brass-600"
                >
                  Voir toute la galerie
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Reveal>

              <Reveal delay={0.1} className="mt-12">
                <Carousel
                  ariaLabel={`Réalisations — ${category.shortTitle}`}
                  slideClassName="w-[85%] sm:w-[60%] lg:w-[42%]"
                >
                  {photos.map((photo) => (
                    <figure
                      key={photo.src}
                      className="overflow-hidden rounded-2xl border border-smoke-950/10"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 42vw, (min-width: 640px) 60vw, 85vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="bg-white px-5 py-4 text-sm font-medium text-smoke-800">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  ))}
                </Carousel>
              </Reveal>
            </div>
          </section>
        )}

        {/* ————— GLOSSAIRE / VOCABULAIRE ————— */}
        <section className="border-y border-smoke-950/5 bg-porcelain-100 py-24 sm:py-32" aria-labelledby="glossaire-titre">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="section-label">Le vocabulaire du métier</p>
              <h2
                id="glossaire-titre"
                className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              >
                Les mots à connaître, expliqués simplement
              </h2>
            </Reveal>
            <dl className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {detail.techniques.map((t, i) => (
                <Reveal key={t.term} delay={(i % 2) * 0.08} as="div">
                  <dt className="flex items-baseline gap-3">
                    <span aria-hidden className="h-px w-4 shrink-0 bg-brass-600" />
                    <span className="font-display text-xl font-medium text-smoke-950">
                      {t.term}
                    </span>
                  </dt>
                  <dd className="mt-2 pl-7 text-sm leading-relaxed text-smoke-600">
                    {t.definition}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ————— FAQ ————— */}
        <section className="bg-porcelain-50 py-24 sm:py-32" aria-labelledby="faq-titre">
          <div className="container-site max-w-3xl">
            <Reveal>
              <p className="section-label">Questions fréquentes</p>
              <h2
                id="faq-titre"
                className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              >
                Vous vous demandez peut-être…
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <Accordion items={detail.faq} idPrefix={`faq-${detail.slug}`} />
            </Reveal>
          </div>
        </section>

        {/* ————— CTA ————— */}
        <section className="border-t border-smoke-950/10 bg-porcelain-100 py-20 sm:py-24">
          <div className="container-site">
            <Reveal className="pane mx-auto max-w-3xl rounded-2xl p-10 text-center sm:p-14">
              <h2 className="heading-display text-3xl sm:text-4xl">
                Un projet en {category.shortTitle.toLowerCase()} ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-smoke-600">
                Décrivez-nous votre besoin : nous revenons vers vous rapidement
                avec une estimation et, si besoin, une prise de mesure à domicile.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <ButtonLink href="/#devis" variant="primary" arrow>
                  Demander un devis gratuit
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink()}
                  variant="ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                  WhatsApp
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ————— AUTRES EXPERTISES ————— */}
        <section className="bg-porcelain-50 py-24 sm:py-32" aria-labelledby="autres-titre">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="section-label">Poursuivre la visite</p>
              <h2
                id="autres-titre"
                className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              >
                Nos autres expertises
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {others.map((o, i) => {
                const cat = serviceCategories.find((c) => c.id === o.slug)!;
                return (
                  <Reveal key={o.slug} delay={i * 0.1}>
                    <Link
                      href={`/expertises/${o.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-smoke-950/10 bg-white shadow-pane transition-all duration-300 hover:-translate-y-1 hover:border-brass-600/30"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={o.heroImage}
                          alt={o.heroImageAlt}
                          fill
                          sizes="(min-width: 640px) 30vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <span className="section-label">{o.index}</span>
                        <h3 className="mt-2 font-display text-xl font-medium text-smoke-950">
                          {cat.title}
                        </h3>
                        <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold text-brass-700">
                          Découvrir
                          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-12">
              <Link
                href="/#expertises"
                className="inline-flex items-center gap-2 text-sm font-medium text-smoke-600 transition-colors hover:text-smoke-950"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
