import app from "../Backend/api-app.js";

export default function handler(request, response) {
  return app(request, response);
}
