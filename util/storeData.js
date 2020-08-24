export const storeDataToStoreage = (type, key, data) => {
    if (typeof Storage !== "undefined") {
      if (!key) return;
      //process data
      const pathConfig = key.split("/");
      let rootConfig = key;
      if (pathConfig.length === 1) {
        rootConfig = pathConfig[0];
      }
      //save to storegae
      data = JSON.stringify(data);
      if (type === "SESSION_STOREAGE") {
        sessionStorage.setItem(rootConfig, data);
        return;
      }
  
      if (type === "LOCAL_STOREAGE") {
        localStorage.setItem(rootConfig, data);
        return;
      }
    }
    console.log("This Browser dont supported storeage");
  };
  
  export const getDataFromStoreage = (type, key) => {
    if (typeof Storage !== "undefined") {
      let value = "";
      let data = "";
      if (type === "SESSION_STOREAGE") {
        value = sessionStorage.getItem(key);
      }
      if (type === "LOCAL_STOREAGE") {
        value = localStorage.getItem(key);
      }
      try {
        data = JSON.parse(value) || null;
      } catch (err) {
        data = value;
      }
      return data;
    }
    console.log("This browser does not support local storage");
  };
  