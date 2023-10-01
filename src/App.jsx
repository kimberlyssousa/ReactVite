import { useEffect, useState } from "react";
import "./App.css";
import { Modal } from "./components/Modal";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [clients, setClients] = useState([]);
  const [editingClientIndex, setEditingClientIndex] = useState(null);

  useEffect(() => {
    setClients(getLocalStorage());
  }, []);

  function handleOpenModal() {
    setOpenModal((prev) => !prev);
  }

  function handleCloseModal() {
    setOpenModal(false);
    clearFields();
    setEditingClientIndex(null);
  }

  function clearFields() {
    setCity("");
    setName("");
    setEmail("");
    setPhoneNumber("");
  }

  function handleInputValue(type) {
    switch (type) {
      case "name":
        return name;
      case "email":
        return email;
      case "phoneNumber":
        return phoneNumber;
      case "city":
        return city;
      default:
        break;
    }
  }

  function handleOnChangeInputValue(type, value) {
    switch (type) {
      case "name":
        return setName(value);
      case "email":
        return setEmail(value);
      case "phoneNumber":
        return setPhoneNumber(value);
      case "city":
        return setCity(value);
      default:
        break;
    }
  }

  const getLocalStorage = () =>
    JSON.parse(localStorage.getItem("db_client")) ?? [];
  const setLocalStorage = (dbClient) =>
    localStorage.setItem("db_client", JSON.stringify(dbClient));

  const createClient = (e) => {
    e.preventDefault();
    const dbClient = getLocalStorage();

    if (!e.target.reportValidity()) {
      return;
    }

    const emailExists = dbClient.find((item) => {
      return email === item.email;
    });

    if (emailExists) {
      window.alert(
        `O email ${emailExists.email} já está cadastrado, tente outro email.`,
      );

      return;
    }

    const client = {
      name,
      email,
      phoneNumber,
      city,
    };

    console.log(client);
    dbClient.push(client);
    setLocalStorage(dbClient);
    setClients(dbClient);
    clearFields();

    handleCloseModal();
  };

  const deleteClient = (index) => {
    const dbClient = getLocalStorage();

    const hasConfirmed = window.confirm(
      `Deseja realmente excluir o cliente ${dbClient[index].name}`,
    );

    if (!hasConfirmed) {
      return;
    }

    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
    setClients(getLocalStorage());
  };

  const updateClient = () => {
    const dbClient = getLocalStorage();
    dbClient[editingClientIndex] = {
      name,
      email,
      phoneNumber,
      city,
    };
    setLocalStorage(dbClient);
    setClients(getLocalStorage());
    setEditingClientIndex(null);
    clearFields();
  };

  const submitForm = (e) => {
    if (typeof editingClientIndex === "number") {
      updateClient();
      return;
    }

    createClient(e);
  };

  return (
    <>
      <header>
        <h1 className="header-title">CADASTRO DE CLIENTES</h1>
      </header>
      <main>
        <button
          type="button"
          className="button blue mobile"
          id="cadastrarCliente"
          onClick={handleOpenModal}
        >
          Cadastrar
        </button>
        <table id="tableClient" className="records">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {clients &&
              clients.map((client, index) => (
                <tr key={index}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phoneNumber}</td>
                  <td>{client.city}</td>
                  <td className="options">
                    <button
                      type="button"
                      className="button green"
                      id="edit-${index}"
                      onClick={() => {
                        setEditingClientIndex(index);
                        handleOpenModal();

                        setCity(client.city);
                        setName(client.name);
                        setEmail(client.email);
                        setPhoneNumber(client.phoneNumber);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="button red"
                      id="delete-${index}"
                      onClick={() => deleteClient(index)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {openModal && (
          <Modal
            closeModal={handleCloseModal}
            handleInputValue={handleInputValue}
            handleOnChangeInputValue={handleOnChangeInputValue}
            save={submitForm}
          />
        )}
      </main>
      <footer>
        <a></a>
      </footer>
    </>
  );
}

export default App;
