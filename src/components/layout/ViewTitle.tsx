interface ViewTitleProps {
  title: string;
  description: string;
}

export default function ViewTitle({ title, description }: ViewTitleProps) {
  return (
    <div className="view-title-layer">
      <span className="view-description">
        {description}
      </span>
      <h2 className="view-title">
        {title}
      </h2>
    </div>
  );
};