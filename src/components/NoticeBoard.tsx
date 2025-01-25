interface NoticeBoardProps {
  title: string;
  contents: string[];
  numbering?: boolean;
  simple?: boolean;
}

export default function NoticeBoard({ title, contents, numbering, simple }: NoticeBoardProps) {
  return (
    <div className={`notice-board ${simple ? 'simple' : ''}`}>
      <h2 className="notice-board-title">
        {title}
      </h2>
      <ul className="contents-list">
        {contents.map((content, index) => (
          <li className={`contents ${numbering ? 'numbering' : ''}`} key={index}>
            {numbering &&
              <p>{`${index + 1}.`}</p>
            }
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};