export const filterRepositories = (repos = [], searchQuery = "") =>{
    
    if(!searchQuery.trim()) return repos;

    const query = searchQuery.toLowerCase();

    return repos.filter(
        (repo) => repo.name?.toLowerCase().includes(query) ||
        repo.fullName?.toLowerCase().includes(query)
    );
};