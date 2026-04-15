type PageContent = import("./types").PageContent;

type TestimonialData = PageContent["testimonial"];

export default function DemoTestimonial({ data }: { data: TestimonialData }) {
  return (
    <section className="testimonial-section">
      <div className="wrap">
        <div className="testimonial-inner" data-r>
          <div
            className="testimonial-quote-mark"
            data-field="testimonial.quoteMark"
            data-style-field="testimonial.editor.nodes.quoteMark.styles"
          >
            {data.quoteMark}
          </div>
          <p
            className="testimonial-quote"
            data-field="testimonial.quote"
            data-style-field="testimonial.editor.nodes.quote.styles"
          >
            {data.quote}
          </p>
          <div className="testimonial-author">
            <div
              className="testimonial-avatar"
              data-field="testimonial.avatar.placeholderIcon"
              data-style-field="testimonial.editor.nodes.avatar.styles"
            >
              {data.avatar.image ? "" : data.avatar.placeholderIcon}
            </div>
            <div>
              <div
                className="testimonial-name"
                data-field="testimonial.name"
                data-style-field="testimonial.editor.nodes.name.styles"
              >
                {data.name}
              </div>
              <div
                className="testimonial-role"
                data-field="testimonial.role"
                data-style-field="testimonial.editor.nodes.role.styles"
              >
                {data.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
