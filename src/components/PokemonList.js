import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'


export default (props) => {
    //current page is stored in state
    //props.location.state is used when navigating from pokemon detail page back to the list, so that you go back to the place on the list that you were before
    const [page, setPage] = useState(props.location.state ? props.location.state.page : 0)

    //list of pokemon is stored in state so that component is rerendered once the page number changes and new pokemon are fetched
    const [pokemonData, setPokemonData] = useState([])

    //runs anytime the page re-renders as long as "page" piece of state has changed
    //async functions need to be wrapped into IIFE's inside useEffect
    useEffect(()=>{
        (async ()=>{
            await fetch('https://graphql-pokeapi.vercel.app/api/graphql', {
                credentials: 'omit',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: gqlQuery,
                    variables: gqlVariables,
                }),
                method: 'POST',
                })
                .then((res) => res.json())
                .then((res) => {
                    setPokemonData(res.data.pokemons.results)
            })
        })()
    },[page])

    //graphQL query
    const gqlQuery = `query pokemons($limit: Int, $offset: Int) {
        pokemons(limit: $limit, offset: $offset) {
            results {
            name
            image
            }

            }
        }`;

    const gqlVariables = {
        limit: 10,
        offset: 10*page,
    }

    //renders the list of 10 pokemon returned from the query, links go to detail page
    const renderList = () => {
        return(
            <ul className="list-group" style={{width:'400px'}}>
                {pokemonData.map((el,ind)=>{
                    return(
                        <li className="list-group-item" key={ind}><Link style={{color:"black", textTransform:'capitalize'}} to={`pokemon/${el.name}`}>
                            <img className='mr-4' style={{height:'4rem'}} src={el.image}/>{ind+1+page*10}. {el.name}</Link></li>
                    )
                })}
            </ul>
        )
        
    }

    //renders the pagination links. onClick handlers won't go below page zero or past page 111 (the last page of pokemon). The 'next' property could also be queried from the api to dyanamically determine if the end of the list has been reached (when next = null)
    const renderPagination = () => {
        return(
            <nav className='mt-3'>
                <ul className="pagination">
                    <li className="page-item page-link" onClick={()=>page === 0 ? null : setPage(page-1)}>Previous</li>
                    <li className="page-item page-link" onClick={()=>page >= 111 ? null: setPage(page+1)}>Next</li>
                </ul>
            </nav>
        )
    }
    
    return(
        <div className='d-flex flex-column align-items-center'>
            {renderList()}
            {renderPagination()}
        </div>
    )
}
