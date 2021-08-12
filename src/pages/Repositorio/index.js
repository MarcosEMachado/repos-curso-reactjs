import React, { useEffect, useState } from 'react';
import { Container, Owner, Loading, BacButton } from './styles.js';
import api from '../../services/api';
import { FaArrowLeft } from 'react-icons/fa';



//{decodeURIComponent(match.params.repositorio)}
export default function Repositorio({ match }) {

  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ]);

      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);

      setLoading(false);

    }

    load();
  }, [match]);

  if (loading) {
    return (
      <Loading>
        <h1>Carregando....</h1>
      </Loading>
    );
  }


  return (
    <Container>
      <BacButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BacButton>
      <Owner>
        <img
          src={repositorio.owner.avatar_url}
          alt={repositorio.owner.login}
        />
        <h1>{repositorio.name}</h1>
        <p>{repositorio.description}</p>
      </Owner>
    </Container>
  )
}