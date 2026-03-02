export const checkPermission = (permissionKey) => {
  return (req, res, next) => {

    if (req.user.role === "superadmin") {
      return next();
    }

    if (
      req.user.role === "admin" &&
      req.user.permissions?.get(permissionKey)
    ) {
      return next();
    }

    return res.status(403).json({
      message: "Access denied"
    });
  };
};