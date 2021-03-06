import React, { useEffect, useState } from 'react';
import { Container, Owner, Loading, BacButton, IssuesList, PageActions, StateFilter } from './styles.js';
import api from '../../services/api';
import { FaArrowLeft } from 'react-icons/fa';



//{decodeURIComponent(match.params.repositorio)}
export default function Repositorio({ match }) {

  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [state, setState] = useState('open');

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state,
            page,
            per_page: 5
          }
        })
      ]);

      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);

      setLoading(false);

    }

    load();
  }, [match.params.repositorio, page, state]);


  function handlePage(action){
    setPage(action === 'back' ? page -1 : page + 1);
  }


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
      <h3>Filtros das Issues: </h3>
      <StateFilter>
          <button type="button"
          onClick={()=> setState('open') }
          disabled={state === 'open'}>
            Abertas
          </button>
          <button type="button"
          onClick={()=> setState('closed') }
          disabled={state === 'closed'}>
            Fechadas
          </button>
          <button type="button"
          onClick={()=> setState('all') }
          disabled={state === 'all'}>
            Todas
          </button>
      </StateFilter>
      <IssuesList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a> <br /><br />

                {issue.labels.map(label => (
                  <span key={String(label.id)} >{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>
      <PageActions>
        <button type="button" 
          onClick={()=> handlePage('back') }
          disabled={page < 2}>
            Voltar
          </button>
        <button type="button" onClick={()=> handlePage('next')}>
            Proxima
          </button>
      </PageActions>
    </Container>
  )
}