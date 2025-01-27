import { Databases, Client, Query, ID } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID

const client = new Client()
 .setEndpoint('https://cloud.appwrite.io/v1')
 .setProject(PROJECT_ID)

const database = new Databases(client);

export const UpdSearchCount = async(searchTerm, movie)=>{
    
    //---------using the appwrite sdk to chack if the searh term exists or not
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm',searchTerm)
        ])
        
        //----------if it exists update the count 
        if(result.documents.length > 0){
            const Doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, Doc.$id, {
                count: Doc.count + 1,
            })
        //----------if it dosent then create a new document with a search term and its count as 1
        }else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_ID: movie.id,
                poster_URL:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            } )
        }

    } catch (error) {
        console.log(error);
    }

}

export const getTreandingMovies = async ()=>{
    try {
        const result  = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])

        return result.documents
    } catch (error) {
        console.log(error)
    }
}