export const formData = (dateString) =>{
    
    if(dateString) return "N/A";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US",{
        month:"short",
        day:"numeric",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
    }).format(date)
};

export const timeAgo = (dateString) =>{
    if(dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const sec = Math.floor((now-date) / 1000);
    if(sec < 60) return `${sec}s ago`;

    const min = Math.floor(sec/60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}