import { SocialLinksRow } from "./SocialLinksRow";
import ResumeDownload from "./ResumeDownload";

export default function Footer() {
  return (
    <footer
      id="resume"
      className="scroll-mt-20 border-t border-black/10 py-10 dark:border-white/10"
    >
      <div className="px-[5%] md:px-[10%]">
        <ResumeDownload />
      </div>
      <div className="mb-6 px-[5%] md:px-[10%]">
        <SocialLinksRow variant="footer" className="mx-auto max-w-3xl" />
      </div>
    </footer>
  );
}
