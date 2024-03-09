


export const updateAuthenticationStatus = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };