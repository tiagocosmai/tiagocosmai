/**
 * Imprime o HTML num iframe invisível (sem pop-up) → diálogo «Guardar como PDF».
 */
export function generateResumePdf(
  htmlDocument: string,
  filename: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("title", filename.replace(/\.pdf$/i, "") || "CV");
    iframe.style.cssText =
      "position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none";

    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      document.body.removeChild(iframe);
      reject(new Error("iframe_unavailable"));
      return;
    }

    doc.open();
    doc.write(htmlDocument);
    doc.close();

    const cleanup = () => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      resolve();
    };

    const doPrint = () => {
      try {
        win.focus();
        win.print();
      } catch {
        /* ignore */
      }
      setTimeout(cleanup, 500);
    };

    let printed = false;
    const schedulePrint = () => {
      if (printed) return;
      printed = true;
      requestAnimationFrame(() => requestAnimationFrame(doPrint));
    };

    if (doc.readyState === "complete") {
      schedulePrint();
    } else {
      iframe.onload = () => schedulePrint();
      setTimeout(() => schedulePrint(), 500);
    }
  });
}
