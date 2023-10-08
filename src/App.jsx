import { useEffect, useState } from "react";
import "./App.css";
import { Modal } from "./components/Modal";
import Parse from 'parse/dist/parse.min.js';

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [clients, setClients] = useState([]);
  const [editingClientIndex, setEditingClientIndex] = useState(null);

  const PARSE_APPLICATION_ID = 'jcJELTa9oGaYid5GP81ChKVjUuwzzcv2uw2Q8nZd';
  const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
  const PARSE_JAVASCRIPT_KEY = '3wLfj9zJEWEKc9d84EPcxib6wrPgR2OtltxnqHDr';
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

  useEffect(() => {

    fetchUsers()
  }, []);

  async function fetchUsers() {
    const query = new Parse.Query("CrudUser")
    const response = await query.find()
    console.log(response)
    setClients(response);
  }

  async function createDbUser() {
    try {
      console.log('entrou')
      const user = new Parse.Object('CrudUser')

      user.set('name', name);
      user.set('email', email);
      user.set('phoneNumber', phoneNumber);
      user.set('city', city);

      const response = await user.save()
      console.log(response)
      setOpenModal(false)
      fetchUsers()
      clearFields()
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteDbUser(user) {
    console.log(user)
    const userToDelete = new Parse.Object('CrudUser');
    userToDelete.set('objectId', user.id)
    const hasConfirmed = window.confirm(
      `Deseja realmente excluir o cliente ${user.attributes.name}`
    );

    if (!hasConfirmed) {
      return;
    }
    await userToDelete.destroy()
    fetchUsers()
  }

  async function updateDbUser(user) {
    const userToUpdate = new Parse.Object("CrudUser");
    userToUpdate.set('objectId', user.id);
    userToUpdate.set("name", name);
    userToUpdate.set("email", email);
    userToUpdate.set("phoneNumber", phoneNumber);
    userToUpdate.set("city", city)
    try {
      await userToUpdate.save();
      clearFields()
      fetchUsers()
      setOpenModal(false)
    } catch (error) {
      console.log(error)
    }
  }

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
      updateDbUser(clients[editingClientIndex]);
      return;
    }
    createDbUser()
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
                  <td>{client.attributes.name}</td>
                  <td>{client.attributes.email}</td>
                  <td>{client.attributes.phoneNumber}</td>
                  <td>{client.attributes.city}</td>
                  <td className="options">
                    <button
                      type="button"
                      className="button green"
                      id="edit-${index}"
                      onClick={() => {
                        setEditingClientIndex(index);
                        handleOpenModal();

                        setCity(client.attributes.city);
                        setName(client.attributes.name);
                        setEmail(client.attributes.email);
                        setPhoneNumber(client.attributes.phoneNumber);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="button red"
                      id="delete-${index}"
                      onClick={() => deleteDbUser(client)}
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
