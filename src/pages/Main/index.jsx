import React, {useState, useCallback, useEffect} from "react";
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import {Container, Form, SubmitButton, List, DeleteButton} from './style'
import api from '../../services/api'
import { Link } from "react-router-dom";

export default function Main(){

  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositrios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //Buscar
  useEffect(()=>{
    const repoStorage = localStorage.getItem('repos')

    if(repoStorage){
      setRepositrios(JSON.parse(repoStorage))
    }
  }, [])

  // Salvar alterações

  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositorios))
  }, [repositorios])

  const handleSumit = useCallback((e) => {

    e.preventDefault();
    
    async function submit(){

      setLoading(true)
      setAlert(null)

      try{
        
      if(newRepo === ''){
        throw new Error('Você precisa inserir um repositório...')
      }
      const response = await api.get(`repos/${newRepo}`)

      const hasRepo = repositorios.find(repo => repo.name === newRepo)

      if(hasRepo){
        throw new Error('Repositório Duplivado')
      }

      const data = {
        name: response.data.full_name,
      }
      setRepositrios([...repositorios, data])
      
      setNewRepo('')

      }catch(error){
        setAlert(true)
        console.log(error)
      }finally{
        setLoading(false)
      }

    }

    submit()

    
  }, [newRepo, repositorios])
    
    
  
  function handleInputChange(e){
    setNewRepo(e.target.value);
    setAlert(null)
  }

  const handleDelete = useCallback((repo) => {
    const find = repositorios.filter(r => r.name !== repo)
    setRepositrios(find)
  }, [repositorios])

  return (
    <Container>
      <h1>
        <FaGithub size={25}/>
        Meu Repositório
      </h1>

      <Form onSubmit={handleSumit} error={alert}>
        <input 
          type="text" 
          placeholder="Adicionar Repositório" 
          value={newRepo}
          onChange={handleInputChange}
        />
        
        <SubmitButton Loading={loading ? 1 : 0}>

          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : 
            
            <FaPlus color="#fff" size={14} />
        
          } 
        </SubmitButton>
      </Form>

      <List>
          {repositorios.map(repo => (
            <li key={repo.name}>
              <span>
                <DeleteButton onClick={() => handleDelete(repo.name)}>
                  <FaTrash size={14}/>
                </DeleteButton>
                  {repo.name}
                </span>
              <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                <FaBars size={20} />
              </Link>

            </li>
          ))}
      </List>
      
    </Container>
  )
}