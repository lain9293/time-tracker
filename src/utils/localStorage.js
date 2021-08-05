const localStore = {
  getItem: (key, type) => { 
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    switch (type) {
      case 'Array':
        return [];
      case 'Object':
        return {};
      default:
        return ''
    }
  },

  setItem: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  removeItem: (key) => {
    window.localStorage.removeItem(key);
  },

  clear: () => {
    window.localStorage.clear();
  },
};

export default localStore;