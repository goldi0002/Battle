var SessionHandler = {
    setSession: function(key, value) {
        sessionStorage.setItem(key, value);
    },
    getSession: function(key) {
        return sessionStorage.getItem(key);
    },
    removeSession: function(key) {
        sessionStorage.removeItem(key);
    },
    clearSession: function() {
        sessionStorage.clear();
    },
};
// var IsLoggedIn=SessionHandler.getSession("IsLoggedIn");
// var IsAdmin=SessionHandler.getSession("IsAdmin");
// var S_a_battle_user_seq=SessionHandler.getSession("SessionUserSeq");