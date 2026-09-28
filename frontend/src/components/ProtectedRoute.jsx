import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const location = useLocation();

    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch (error) {
        console.error(
            "Gagal membaca data user:",
            error
        );
    }

    const role = String(
        user?.role ||
            user?.data?.role ||
            localStorage.getItem("role") ||
            ""
    )
        .trim()
        .toLowerCase();

    if (
        allowedRoles &&
        allowedRoles.length > 0
    ) {
        const roles = allowedRoles.map((item) =>
            String(item).trim().toLowerCase()
        );

        if (!roles.includes(role)) {
            return (
                <Navigate
                    to="/dashboard"
                    replace
                />
            );
        }
    }

    return <Outlet />;
}

export default ProtectedRoute;