const Heading = ({ title, subtitle }) => {
  return (
    <>
      <Title level={4}>{title}</Title>
      <div className="w-1/2">
        <Caption>{subtitle}</Caption>
      </div>
    </>
  );
};

export default Heading;
