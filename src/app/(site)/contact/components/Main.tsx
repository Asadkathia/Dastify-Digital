import type { PageContent } from '../content';
import Form from './Form';
import Info from './Info';

export default function Main({ data }: { data: PageContent['main'] }) {
  return (
    <section className="ct2-main">
      <div className="ct2-wrap">
        <div className="ct2-layout">
          <Form data={data} />
          <Info data={data} />
        </div>
      </div>
    </section>
  );
}
