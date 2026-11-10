import { useEffect, useRef } from 'react';

const widgetId = '525ca088-5442-49b0-a544-4fec6751f5d6';

export default function WeWidgetReviews() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = container.current;
    if (!host) return;

    const script = document.createElement('script');
    script.src = 'https://app.wewidget.app/widget.js';
    script.dataset.widgetId = widgetId;
    script.async = true;
    let brandingObserver: MutationObserver | undefined;
    let brandingStyle: HTMLStyleElement | undefined;

    const hideBranding = () => {
      const shadow = host.querySelector('[data-review-widget]')?.shadowRoot;
      if (!shadow || brandingObserver) return;

      // Page styles cannot cross the widget's shadow DOM boundary.
      brandingStyle = document.createElement('style');
      brandingStyle.textContent = '.rw-branding { display: none !important; }';
      const applyStyle = () => {
        if (brandingStyle && !shadow.contains(brandingStyle)) shadow.appendChild(brandingStyle);
      };
      brandingObserver = new MutationObserver(applyStyle);
      brandingObserver.observe(shadow, { childList: true });
      applyStyle();
    };
    script.addEventListener('load', hideBranding);
    document.addEventListener('DOMContentLoaded', hideBranding);
    hideBranding();
    const timer = window.setTimeout(() => host.appendChild(script), 0);

    return () => {
      window.clearTimeout(timer);
      script.removeEventListener('load', hideBranding);
      document.removeEventListener('DOMContentLoaded', hideBranding);
      brandingObserver?.disconnect();
      brandingStyle?.remove();
      script.remove();
    };
  }, []);

  return <section id="testimonials" className="section page-shell">
    <div className="section-heading"><div><p className="eyebrow text-ocean-600">FROM OUR TRAVELLERS</p><h2>Stories from our Travellers</h2></div></div>
    <div ref={container}><div data-review-widget={widgetId}/></div>
  </section>;
}
