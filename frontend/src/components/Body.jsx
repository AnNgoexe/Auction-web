const Body = ({ children, className }) => {
  return (
    <p
      className={`${className} text-base font-normal text-[rgb(107, 113, 119)]`}
    >
      {children}
    </p>
  );
};

export default Body;
