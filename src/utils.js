


export const updateAuthenticationStatus = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

export const checkAndClearStorage = ()=> {
    const lastSavedDate = localStorage.getItem("lastSavedDate");
    if (lastSavedDate) {
      const currentDate = new Date();
      const savedDate = new Date(lastSavedDate);
      const differenceInDays = Math.ceil((currentDate - savedDate) / (1000 * 3600 * 24));
      if (differenceInDays >= 8) {
        // Borrar los datos almacenados
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userType");
        localStorage.removeItem("subscription");
        localStorage.removeItem("subscriptionType");
        localStorage.removeItem("typeReport")
        if (localStorage.getItem('subscription')){
        localStorage.removeItem("subscription_id");
        localStorage.removeItem("statusSubscription");

        }
        localStorage.removeItem("lastSavedDate");
      }
    } else{
      const today = new Date();
      let date = today.toISOString().split('T')[0];
      localStorage.setItem("lastSavedDate", date);

    }
  }
  
