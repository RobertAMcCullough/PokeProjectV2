import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

export default (props) => {
    //pokemon details are stored in state so that component is rerendered once the fetch promise returns and pokemonDetail is updated
    const [pokemonDetail, setPokemonDetail] = useState(null)

    //empty array as second argument only runs useEffect function once
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
                    setPokemonDetail(res.data.pokemon)
            })
        })()
    },[])


    //id param comes from react router
    const name = props.match.params.name

    //pokemon ids jump from 898 to 10001, this will cause issues if someone tries to manually navigate to pokemon 950 for instance
    //page to redirect to on "back" button - there will be issues above pokemon 898, so it will redirect to page 89 in that case
    const redirectPage = !pokemonDetail ? 0 : (pokemonDetail.id >=898 ? 89 : Math.floor((pokemonDetail.id - 1)/10))

    //graphQL query
    const gqlQuery = `query pokemon($name: String!) {
        pokemon(name: $name) {
          id
          name
          sprites {
            front_default
          }
          moves {
            move {
              name
            }
          }
          types {
            type {
              name
            }
          }
        }
      }`;
      
      const gqlVariables = {
        "name": name
      }


    //renders a pokemon detail card using Bootstrap classes
    const renderDetails = () => {
        //creates a string of first 3 "moves" that pokemon possesses
        let moves = pokemonDetail.moves.slice(0,3)
        const renderMoves = () => {
            let str = ''
            moves.forEach((el,ind)=>{
                if(el.move.name !== undefined){
                    ind === 0 ? str = el.move.name : str = str + `, ${el.move.name}`
                }
            })
            return str
        }

        //renders the card
        return(
            <div className='card' style={{width:'20rem'}}>
                <div className='card-body'>
                    <img className="card-img-top" src={pokemonDetail.sprites.front_default} alt="Card image cap"/>
                    <h5 className="card-title pb-2" style={{textTransform:'capitalize'}}>{pokemonDetail.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted" style={{textTransform:'capitalize'}}>Type: {pokemonDetail.types[0].type.name}</h6>
                    <p className="card-text" style={{textTransform:'capitalize'}}>Moves: {renderMoves()}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='d-flex flex-column align-items-center mt-5'>
            {pokemonDetail ? renderDetails() : null}
            <Link className='mt-3 page-item page-link' to={{pathname: '/pokemon',state: {page: redirectPage}}}>Back</Link>
        </div>
    )
}
