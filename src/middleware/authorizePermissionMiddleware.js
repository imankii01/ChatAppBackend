const { verifyToken } = require("../helper/token");
const dbassignPermission = require("../models/assignRolePermission");
const dbPermissions = require("../models/permissionSchema");

const permissionAuthorize = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const { success, data, error } = verifyToken(token);

      if (!success) {
        return res.status(401).json({ error });
      }
      const { user_id, user_type } = data;
      if (user_type !== "master_administrator") {
        const assignPermission = await dbassignPermission.findOne({ user_id });
        if (!assignPermission || !assignPermission.permissions) {
          return res
            .status(403)
            .json({ error: "User has no assigned permissions" });
        }
        const permissionIds = assignPermission.permissions;
        const permissionData = await dbPermissions.find({
          permission_id: { $in: permissionIds },
        });

        const hasRequiredPermissions = permissionData.some((permission) =>
          requiredPermissions.includes(permission?.permission_value)
        );

        if (!hasRequiredPermissions) {
          return res.status(403).json({ error: "Unauthorized access" });
        }
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = { permissionAuthorize };
