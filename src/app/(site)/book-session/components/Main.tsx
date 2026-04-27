import type { PageContent } from '../content';
import BookingPane from './BookingPane';
import Sidebar from './Sidebar';

export default function Main({ data }: { data: PageContent['main'] }) {
  return (
    <section className="bk2-main">
      <div className="bk2-wrap">
        <div className="bk2-layout">
          <BookingPane scheduler={data.scheduler} form={data.form} />
          <Sidebar data={data.sidebar} />
        </div>
      </div>
    </section>
  );
}
