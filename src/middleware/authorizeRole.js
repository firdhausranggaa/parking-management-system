const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses ditolak: Anda tidak memiliki izin operasi ini' });
        }
        next();
    };
};

module.exports = authorizeRole;