export const requireInternalService = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  const expected = process.env.INTERNAL_SERVICE_TOKEN;
  const provided = req.get("x-internal-service-token");

  if (
    !expected ||
    !provided ||
    provided.length !== expected.length ||
    provided !== expected
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized service request",
    });
  }

  next();
};
