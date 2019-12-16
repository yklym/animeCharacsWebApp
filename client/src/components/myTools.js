import jwtDecode from "jwt-decode"




export function updateAuth(){
    
    if(!localStorage.token) {
        return Promise.reject( {
                role : null,
                _id : null,
                username : null,
        });
    }

    return fetch("/api/v1/auth/checkToken", {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
        },}).then(res=>{
            return res.json()})
        .then(data=>{
            if(data.token){
                localStorage.setItem("token", data.token);
                let res = jwtDecode(localStorage.token);
                return res;
            }else {
                localStorage.removeItem("token");
                return {
                    role : null,
                    _id : null,
                    username : null,
                }
            }
        });

}

export function decodeToken(token){
    return jwtDecode(token);
}

export function getCurrUserObj(){

        if(!localStorage.token){
            return {};
        } else {
            return jwtDecode(localStorage.token);
        }
}

