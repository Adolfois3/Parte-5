import { createContext, useContext } from "react";


const BlogsContext = createContext()

export const useBlogs = ()=>{
    return useContext(BlogsContext)
}

export const BlogsProvider = ({children, handleVote})=>{
    const value = {
        handleVote,
    }


    return (
        <BlogsContext.Provider value={value}>
            {children}
        </BlogsContext.Provider>
    )
}