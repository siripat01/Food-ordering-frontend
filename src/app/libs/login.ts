export const login = () => {
    if (localStorage.getItem("authToken")) {
        return true
    }

    window.location.href = `https://20569a98bd05.ngrok-free.app/api/ai/auth/line?origin=web`;
};