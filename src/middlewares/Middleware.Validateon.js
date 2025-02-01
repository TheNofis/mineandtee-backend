import { validationResult } from "express-validator";

export default function (req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next(); // If there are no errors, continue
  res.status(400).json({ errors: errors.array() });
}
