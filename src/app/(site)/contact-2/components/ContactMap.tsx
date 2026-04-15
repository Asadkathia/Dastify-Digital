import Image from "next/image";
import type { PageContent } from "./types";

type Props = {
  data: PageContent["map"];
};

export default function ContactMap({ data }: Props) {
  return (
    <section className="map-section">
      <div className="map-container">
        {data.embedHtml ? (
          <div dangerouslySetInnerHTML={{ __html: data.embedHtml }} />
        ) : data.image ? (
          <div className="contact2-map-image-wrap">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="contact2-map-image"
              sizes="100vw"
            />
          </div>
        ) : (
          <div
            className="iph contact2-map-placeholder"
            data-field="map.placeholder.label"
            style={{
              aspectRatio: data.placeholder.dimensions || "3 / 1",
              borderRadius: data.placeholder.preservePlaceholderChrome ? data.placeholder.placeholderRadius : "0",
              border: data.placeholder.preservePlaceholderChrome
                ? `${data.placeholder.placeholderBorderWidth} ${data.placeholder.placeholderBorderStyle} ${data.placeholder.placeholderBorderColor}`
                : "none",
              background: data.placeholder.placeholderBackground,
              padding: data.placeholder.placeholderPadding,
              gap: data.placeholder.placeholderGap,
            }}
          >
            <div className="iph-ic" data-field="map.placeholder.icon">{data.placeholder.icon}</div>
            <div className="iph-lbl" data-field="map.placeholder.label">{data.placeholder.label}</div>
            <div className="iph-dim" data-field="map.placeholder.dimText">{data.placeholder.dimText}</div>
          </div>
        )}
      </div>
    </section>
  );
}
