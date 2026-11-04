export const getcurrentUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching current user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};