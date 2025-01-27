

const Search = ({ seacrhTerm, setSeacrhTerm }) => {
  return (
    <div className='search'>
        <div>
            <img src='search.svg' alt='search'/>
            <input  
               type="text" 
               placeholder='Search your Entertainment...'
               value={seacrhTerm}
               onChange={(e)=> setSeacrhTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search