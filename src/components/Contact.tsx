import { type FormEvent, useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

type SendState = "idle" | "success" | "error";

export default function Contact() {
  const mode = useThemeMode();
  const { c, t, locale } = useLocale();
  const isDark = mode === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setSendState("idle");
    setSendError(null);
  }, [locale]);

  const labelCls = `mb-1 block text-sm font-medium ${isDark ? "text-white" : "text-[#0d1116]"}`;
  const inputCls = `w-full rounded-lg border px-3 py-2.5 outline-none transition-shadow focus:ring-2 ${
    isDark
      ? "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:ring-[#00FF41]"
      : "border-black/15 bg-white text-[#0d1116] placeholder:text-neutral-500 focus:ring-[#166534]"
  }`;

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSendState("idle");

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();
    setNameError(n === "");
    setEmailError(em === "");
    setMessageError(msg === "");
    if (!n || !em || !msg) return;

    const to = c.main.social.email;
    const subject = encodeURIComponent(`Contact from portfolio: ${n}`);
    const body = encodeURIComponent(
      `Name: ${n}\nEmail: ${em}\n\nMessage:\n${msg}`,
    );
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    setSendState("success");
    setName("");
    setEmail("");
    setMessage("");
  };

  const heading = isDark ? "text-white" : "text-[#0d1116]";
  const sectionTitle = sectionHeadingClass(isDark);
  const muted =
    sendState === "success"
      ? "text-emerald-400"
      : sendState === "error"
        ? "text-red-400"
        : isDark
          ? "text-white/70"
          : "text-neutral-600";

  return (
    <div id="contact">
      <div className="flex flex-col justify-center px-[5%] py-[5%] md:px-[10%]">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            className={`mb-2 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
          >
            <SectionTitleIcon
              name="contact"
              className="h-9 w-9 shrink-0 md:h-10 md:w-10"
            />
            {t("nav_contact")}
          </h1>
          <p className={`mb-6 ${heading}`}>{c.contact.subtitle}</p>

          {sendState === "success" ? (
            <p
              className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-300"
              role="status"
            >
              {t("contact_opens_mail")}
            </p>
          ) : null}
          {sendState === "error" && sendError ? (
            <p
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300"
              role="alert"
            >
              {sendError}
            </p>
          ) : null}

          <form
            ref={formRef}
            className="w-full pt-5"
            noValidate
            autoComplete="off"
            onSubmit={sendEmail}
          >
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label htmlFor="contact-name" className={labelCls}>
                  {t("contact_name_label")}{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t("contact_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  aria-invalid={nameError}
                  aria-describedby={nameError ? "name-err" : undefined}
                />
                {nameError ? (
                  <p id="name-err" className="mt-1 text-sm text-red-400">
                    {t("contact_name_error")}
                  </p>
                ) : null}
              </div>
              <div className="flex-1">
                <label htmlFor="contact-email" className={labelCls}>
                  {t("contact_email_label")}{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="text"
                  placeholder={t("contact_email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  aria-invalid={emailError}
                  aria-describedby={emailError ? "email-err" : undefined}
                />
                {emailError ? (
                  <p id="email-err" className="mt-1 text-sm text-red-400">
                    {t("contact_email_error")}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="contact-message" className={labelCls}>
                {t("contact_message_label")}{" "}
                <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={10}
                placeholder={t("contact_message_placeholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={inputCls}
                aria-invalid={messageError}
                aria-describedby={messageError ? "msg-err" : undefined}
              />
              {messageError ? (
                <p id="msg-err" className="mt-1 text-sm text-red-400">
                  {t("contact_message_error")}
                </p>
              ) : null}
            </div>
            <p className={`mb-3 text-sm ${muted}`}>
              {sendState === "idle" ? t("contact_secure_note") : null}
            </p>
            <button
              type="submit"
              className={`float-right inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                isDark
                  ? "border border-[#00FF41]/50 bg-[#00FF41]/10 text-[#00FF41] hover:bg-[#00FF41] hover:text-[#030806]"
                  : "bg-emerald-900 text-white hover:bg-[#00FF41] hover:text-[#030806]"
              }`}
            >
              {t("contact_send")}
              <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
