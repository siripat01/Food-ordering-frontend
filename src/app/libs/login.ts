export const login = () => {
    if (localStorage.getItem("authToken")) {
        return true
    }

    window.location.href = `https://dd1a151f79e7.ngrok-free.app/auth/line?origin=web`;
};