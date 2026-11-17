// ─────────────────────────────────────────────────────────────
// Smart Choice API Services - Main Export
// ─────────────────────────────────────────────────────────────

export {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  formatApiError,
  productsApi,
  categoriesApi,
  cartApi,
  ordersApi,
  paymentsApi,
  authApi,
  adminApi,
  type ApiResponse,
  type ProductFilters,
  type ProductSearchParams,
} from './api';
export { default as api } from './api';