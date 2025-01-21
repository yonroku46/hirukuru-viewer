interface NoticeBoardProps {
  title: string;
  contents: string[];
  simple?: boolean;
}

export default function NoticeBoard({ title, contents, simple }: NoticeBoardProps) {
  return (
    <div className={`notice-board ${simple ? 'simple' : ''}`}>
      <h2 className="title">
        {title}
      </h2>
      <ul className="contents-list">
        {contents.map((content, index) => (
          <li className="contents" key={index}>
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};