"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { getLocalizedPath } from "@/lib/localized-path";
import { useState } from "react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    requestType: "",
    trainingMethod: "",
    message: "",
  });

  const phoneValue = t("contact.phoneValue");
  const emailValue = t("contact.emailValue");
  const whatsappNumber = t("contact.whatsappNumber");
  const addressValue = t("contact.addressValue");
  const mapEmbedUrl = t("contact.mapEmbedUrl");
  const hasPhone = !!phoneValue?.trim();
  const hasEmail = !!emailValue?.trim();
  const hasWhatsApp = !!whatsappNumber?.trim();
  const hasAddress = !!addressValue?.trim();
  const hasMap = !!mapEmbedUrl?.trim();

  const whatsappLink = hasWhatsApp
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : "#";
  const telLink = hasPhone ? `tel:${phoneValue}` : "#";
  const mailLink = hasEmail ? `mailto:${emailValue}` : "#";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    // TODO: POST to API / send email
    setStatus("success");
    setForm({ fullName: "", phone: "", email: "", requestType: "", trainingMethod: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative bg-[#0f1b4b] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#701621] rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("contact.pageTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t("contact.heroDesc")}
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="py-16 md:py-20 bg-gray-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f1b4b] text-center mb-4">
            {t("contact.chooseMethod")}
          </h2>
          <div className="h-1 w-16 bg-[#701621] mx-auto mb-12" aria-hidden />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center ${!hasWhatsApp ? "pointer-events-none opacity-70" : "hover:border-[#25D366]/30"}`}
              >
                <div className="w-14 h-14 rounded-xl bg-[#25D366]/10 flex items-center justify-center mb-4 text-[#25D366]">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <h3 className="font-bold text-[#0f1b4b] mb-1">{t("contact.whatsapp")}</h3>
                <p className="text-sm text-gray-500">{t("contact.whatsappDesc")}</p>
                {hasWhatsApp && <span className="text-[#25D366] font-medium text-sm mt-2">{locale === "ar" ? "انقر للمحادثة" : "Click to chat"}</span>}
              </a>
            <a
                href={telLink}
                className={`group p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center ${!hasPhone ? "pointer-events-none opacity-70" : "hover:border-[#701621]/30"}`}
              >
                <div className="w-14 h-14 rounded-xl bg-[#701621]/10 flex items-center justify-center mb-4 text-[#701621]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <h3 className="font-bold text-[#0f1b4b] mb-1">{t("contact.phone")}</h3>
                <p className="text-sm text-gray-500">{t("contact.phoneDesc")}</p>
                <span className="text-[#701621] font-medium text-sm mt-2">{hasPhone ? phoneValue : "—"}</span>
              </a>
            <a
                href={mailLink}
                className={`group p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center ${!hasEmail ? "pointer-events-none opacity-70" : "hover:border-[#701621]/30"}`}
              >
                <div className="w-14 h-14 rounded-xl bg-[#701621]/10 flex items-center justify-center mb-4 text-[#701621]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="font-bold text-[#0f1b4b] mb-1">{t("contact.email")}</h3>
                <p className="text-sm text-gray-500">{t("contact.emailDesc")}</p>
                <span className="text-[#701621] font-medium text-sm mt-2 break-all">{hasEmail ? emailValue : "—"}</span>
              </a>
            <div className="p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-[#0f1b4b]/10 flex items-center justify-center mb-4 text-[#0f1b4b]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="font-bold text-[#0f1b4b] mb-1">{t("contact.address")}</h3>
                <p className="text-sm text-gray-500">{t("contact.addressDesc")}</p>
                <span className="text-gray-700 text-sm mt-2">{hasAddress ? addressValue : "—"}</span>
              </div>
          </div>
          <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-[#0f1b4b]">{t("contact.workingHours")}:</span>{" "}
                {t("contact.workingHoursValue")}
              </p>
            </div>
        </div>
      </section>

      {/* Form + B2B side by side on large, stack on small */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-[#0f1b4b] mb-6">
                {t("contact.formTitle")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.fullName")} <span className="text-[#701621]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0f1b4b] focus:ring-0 outline-none transition-colors"
                    placeholder={t("contact.fullName")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.phoneNumber")} <span className="text-[#701621]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0f1b4b] focus:ring-0 outline-none transition-colors"
                    placeholder={t("contact.phoneNumber")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.emailLabel")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0f1b4b] focus:ring-0 outline-none transition-colors"
                    placeholder={t("contact.emailLabel")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.requestType")} <span className="text-[#701621]">*</span>
                  </label>
                  <select
                    required
                    value={form.requestType}
                    onChange={(e) => setForm((p) => ({ ...p, requestType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0f1b4b] focus:ring-0 outline-none transition-colors bg-white"
                  >
                    <option value="">—</option>
                    <option value="course">{t("contact.requestTypeCourse")}</option>
                    <option value="track">{t("contact.requestTypeTrack")}</option>
                    <option value="corporate">{t("contact.requestTypeCorporate")}</option>
                    <option value="consultation">{t("contact.requestTypeConsultation")}</option>
                    <option value="other">{t("contact.requestTypeOther")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.trainingMethod")}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="trainingMethod"
                        value="inPerson"
                        checked={form.trainingMethod === "inPerson"}
                        onChange={(e) => setForm((p) => ({ ...p, trainingMethod: e.target.value }))}
                        className="text-[#701621] focus:ring-[#701621]"
                      />
                      <span className="text-gray-700">{t("contact.trainingInPerson")}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="trainingMethod"
                        value="online"
                        checked={form.trainingMethod === "online"}
                        onChange={(e) => setForm((p) => ({ ...p, trainingMethod: e.target.value }))}
                        className="text-[#701621] focus:ring-[#701621]"
                      />
                      <span className="text-gray-700">{t("contact.trainingOnline")}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="trainingMethod"
                        value="both"
                        checked={form.trainingMethod === "both"}
                        onChange={(e) => setForm((p) => ({ ...p, trainingMethod: e.target.value }))}
                        className="text-[#701621] focus:ring-[#701621]"
                      />
                      <span className="text-gray-700">{t("contact.trainingBoth")}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.message")} <span className="text-[#701621]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0f1b4b] focus:ring-0 outline-none transition-colors resize-y"
                    placeholder={t("contact.message")}
                  />
                </div>
                {status === "success" && (
                  <p className="text-green-600 font-medium">{t("contact.successMessage")}</p>
                )}
                {status === "error" && (
                  <p className="text-[#701621] font-medium">{t("contact.errorMessage")}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#701621] text-white py-3.5 rounded-lg font-semibold hover:bg-[#701621]/90 transition-colors"
                >
                  {t("contact.send")}
                </button>
                <p className="text-xs text-gray-500">
                  {t("contact.privacyNote")}
                </p>
              </form>
            </div>

            {/* B2B CTA */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-2xl bg-[#0f1b4b] text-white h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">{t("contact.b2bTitle")}</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-6">
                  {t("contact.b2bText")}
                </p>
                <Link
                  href={mailLink}
                  className="inline-flex items-center justify-center gap-2 bg-[#701621] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#701621]/90 transition-colors text-center"
                >
                  {t("contact.b2bButton")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      {hasMap && (
        <section className="py-16 bg-gray-50/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-200">
              <iframe
                src={mapEmbedUrl}
                title={t("contact.address")}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {hasAddress && (
              <p className="mt-4 text-center text-gray-600 font-medium">{addressValue}</p>
            )}
          </div>
        </section>
      )}

      {/* Trust row */}
      <section className="py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm">
            <p className="text-gray-600">
              <span className="font-medium text-[#0f1b4b]">•</span> {t("contact.responseTime")}
            </p>
            <Link
              href={getLocalizedPath("/faq", locale)}
              className="text-[#701621] font-medium hover:underline"
            >
              {t("contact.faq")}
            </Link>
            <Link
              href={getLocalizedPath("/privacy", locale)}
              className="text-[#701621] font-medium hover:underline"
            >
              {t("contact.privacyPolicy")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
