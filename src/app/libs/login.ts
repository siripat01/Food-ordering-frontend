export const login = () => {
    if (localStorage.getItem("authToken")) {
        return true
    }

    window.location.href = `https://e74f1c92b188.ngrok-free.app/api/ai/auth/line?origin=web`;
};