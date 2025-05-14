import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton'
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const [token, setToken] = useState(null)
  const [titulo, setTitulo] = useState()
  const [descricao, setDescricao] = useState()
  const [nota, setNota] = useState()
  const [feedbacks, setFeedbacks] = useState([])
  const [roles, setRoles] = useState([])

  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently
  } = useAuth0();

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Email:', payload['https://musica-insper.com/email'])
      console.log('Roles:', payload['https://musica-insper.com/roles'])
      setRoles(payload['https://musica-insper.com/roles'])

      fetch('http://54.94.157.137:8080/api/feedbacks', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(response => { 
        return response.json()
      }).then(data => { 
        setFeedbacks(data)
      }).catch(error => {
        alert(error)
      })
    }
  }, [token])

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (e) {
        console.error('Erro ao buscar token:', e);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  function salvarFeedback() {

    fetch('http://54.94.157.137:8080/api/feedbacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        'titulo': titulo,
        'descricao': descricao,
        'nota': nota
      })
    }).then(response => { 
      return response.json()
    }).catch(error => {
      alert(error)
    })

  }

  function excluirFeedback(id) {

    fetch('http://54.94.157.137:8080/api/feedbacks/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(response => { 
      return response.json()
    }).catch(error => {
      alert(error)
    })

  }

  return (
  <>
  <div>
    <img src={user.picture} alt={user.name} />
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    <LogoutButton />
  </div>

  <h3>Novo Feedback</h3>
  <div>
    <input
      type="text"
      placeholder="Título"
      value={titulo}
      onChange={(e) => setTitulo(e.target.value)}
    />
    <input
      type="text"
      placeholder="Descrição"
      value={descricao}
      onChange={(e) => setDescricao(e.target.value)}
    />
    <input
      type="number"
      min="0"
      max="10"
      placeholder="Nota (0-10)"
      value={nota}
      onChange={(e) => setNota(e.target.value)}
    />
    <button onClick={salvarFeedback}>Salvar Feedback</button>
  </div>

  <h3>Feedbacks</h3>
  <table border="1" style={{ marginTop: '20px' }}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Título</th>
        <th>Descrição</th>
        <th>Nota</th>
        <th>Email Usuario</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {feedbacks.map(feedback => (
        <tr key={feedback.id}>
          <td>{feedback.id}</td>
          <td>{feedback.titulo}</td>
          <td>{feedback.descricao}</td>
          <td>{feedback.nota}</td>
          <td>{feedback.emailUsuario}</td>
          <td>
            <button onClick={() => excluirFeedback(feedback.id)}>Excluir</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </>
  );
}

export default App;
