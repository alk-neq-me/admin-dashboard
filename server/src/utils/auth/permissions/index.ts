import { Role } from '../../../schemas/user.schema'
import { createRoleBasedAccess } from '../rbac'

export * from './brand.permission'
export * from './category.permission'
export * from './dashboard.permission'
export * from './exchange.permission'
export * from './order.permission'
export * from './product.permission'
export * from './salesCategory.permission'
export * from './user.permission'
export * from './region.permission'
export * from './city.permission'
export * from './userAddress.permission'

const roleBasedAccess = createRoleBasedAccess<Role>()

export default roleBasedAccess
