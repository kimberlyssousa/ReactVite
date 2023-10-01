import "./styles.css";

export function Modal({
  closeModal,
  save,
  handleInputValue,
  handleOnChangeInputValue,
}) {
  return (
    <div className="modal" id="modal">
      <div className="modal-content">
        <header className="modal-header">
          <h2>Novo Cliente</h2>
          <span
            onClick={() => closeModal()}
            className="modal-close"
            id="modalClose"
          >
            &#10006;
          </span>
        </header>
        <form
          onSubmit={(e) => {
            console.log(e);
            save(e);
          }}
          id="form"
          className="modal-form"
        >
          <input
            type="text"
            id="nome"
            data-index="new"
            className="modal-field"
            placeholder="Nome"
            value={handleInputValue("name")}
            onChange={(e) => handleOnChangeInputValue("name", e.target.value)}
            required
          />
          <input
            type="email"
            id="email"
            className="modal-field"
            placeholder="e-mail"
            value={handleInputValue("email")}
            onChange={(e) => handleOnChangeInputValue("email", e.target.value)}
            required
          />
          <input
            type="text"
            id="celular"
            className="modal-field"
            placeholder="Telefone"
            value={handleInputValue("phoneNumber")}
            onChange={(e) =>
              handleOnChangeInputValue("phoneNumber", e.target.value)
            }
            required
          />
          <input
            type="text"
            id="cidade"
            className="modal-field"
            placeholder="Cidade"
            value={handleInputValue("city")}
            onChange={(e) => handleOnChangeInputValue("city", e.target.value)}
            required
          />
          <footer className="modal-footer">
            <button type="submit" id="salvar" className="button green">
              Salvar
            </button>
            <button
              onClick={() => closeModal()}
              id="cancelar"
              className="button blue"
            >
              Cancelar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
