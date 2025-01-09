interface NoticeBoardProps {
  title: string;
  contents: string[];
}

export default function NoticeBoard({ title, contents }: NoticeBoardProps) {
  return (
    <div className="notice-board">
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