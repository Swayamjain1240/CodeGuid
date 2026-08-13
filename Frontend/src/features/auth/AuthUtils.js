import { authApi } from "../../api/authApi.js"

export const redirectToGitHub = ()=>{
    authApi.loginWithGitHub();
}