interface TitleProps {
  title: string;
  count?: number;
  countUnit?: string;
}

export default function Title({ title, count, countUnit }: TitleProps) {
  return (
    <div className="title-layer">
      <h2 className="title">
        {title}
      </h2>
      {count !== undefined && countUnit !== undefined && (
        <span className="title-count">
          {count}
          {countUnit}
        </span>
      )}
    </div>
  );
};