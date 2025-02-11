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
          alt={data.noticeTitle}
          width={280}
          height={160}
        />
      </div>
      <div className="info-wrapper">
        <div className="type-date-wrapper">
          <div className={`type ${data.noticeType}`}>
            {data.noticeType === 'EVENT' ? 'イベント' : 'お知らせ'}
          </div>
          <div className="date">
            {data.createTime}
          </div>
        </div>
        <div className="title">
          {data.noticeTitle}
        </div>
        <div className="description">
          {data.noticeDetail}
        </div>
      </div>
    </Link>
  );
}