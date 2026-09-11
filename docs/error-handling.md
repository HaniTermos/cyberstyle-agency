# CYBERSTYLE LLC — Standardized Error Handling Architecture

## 1. Unified JSON Error Response Format

All REST API error responses return a standardized JSON structure:

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Human-readable summary of the issue.",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

---

## 2. Standard Error Code Taxonomy

| HTTP Status | Error Code (`code`) | Trigger Condition |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request payload fails Zod schema validation. |
| `401` | `UNAUTHORIZED` | Missing or invalid authentication session/token. |
| `403` | `FORBIDDEN` | Authenticated user lacks required role/permission. |
| `404` | `NOT_FOUND` | Requested entity does not exist or user has no access. |
| `409` | `CONFLICT` | Resource collision (e.g. duplicate email registration). |
| `429` | `RATE_LIMIT_EXCEEDED` | Request threshold exceeded. |
| `500` | `INTERNAL_SERVER_ERROR`| Uncaught backend exception. In production, raw stack traces are never exposed. |

---

## 3. Client UI Error Handling Guidelines

1. **Inline Field Errors**: Map `errors` array directly to form inputs under their respective label.
2. **Global Toast Alerts**: For `429`, `500`, and network failures, render an electric-blue / charcoal error toast.
3. **Optimistic Error Rollbacks**: In client portal interactions, rollback UI changes immediately if server returns an error.
