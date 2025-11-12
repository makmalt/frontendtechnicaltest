const Form = ({
  handleSubmit,
  children,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>{children}</form>
    </div>
  );
};

export default Form;
