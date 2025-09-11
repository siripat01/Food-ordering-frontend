export const login = () => {
    if (localStorage.getItem("authToken")) {
        return true
    }

    window.location.href = `https://d19b55b1af62.ngrok-free.app/api/ai/auth/line?origin=web`;
};