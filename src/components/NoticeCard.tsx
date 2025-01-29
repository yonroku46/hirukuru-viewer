import Link from "next/link";
import Image from "@/components/Image";

interface NoticeCardProps {
  data: ServiceNotice;
}

export default function NoticeCard({ data }: NoticeCardProps) {
  return (
    <Link href={`/service/notice/${data.noticeId}`} className="notice-card">
      <div className="image-wrapper">
        <Image
          className="image"
          src={data.thumbnailImg}
          alt={data.title}
          width={280}
          height={160}
        />
      </div>
      <div className="info-wrapper">
        <div className="type-date-wrapper">
          <div className={`type ${data.type}`}>
            {data.type === 'event' ? 'イベント' : 'お知らせ'}
          </div>
          <div className="date">
            {data.date}
          </div>
        </div>
        <div className="title">
          {data.title}
        </div>
        <div className="description">
          {data.description}
        </div>
      </div>
    </Link>
  );
}