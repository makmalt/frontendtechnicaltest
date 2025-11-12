const Form = ({ handleSubmit, children }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>{children}</form>
    </div>
  );
};

export default Form;
