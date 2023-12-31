import { OrderStatus } from "@/components/content/orders/forms"
import { PriceUnit, ProductStatus, ProductStockStatus } from "@/components/content/products/forms"


export type Role =
  | "Admin"
  | "User"
  | "Shopowner"
  | "*"


export type UserProvider =
  | "Local"
  | "Google"
  | "Facebook"


export type Coupon = {
  id: string
  points: number
  dolla: number
  expiredDate: string | Date
  isUsed: boolean
  image: string
  label: string

  // relationship
  product?: Product
  productId?: string
  review?: Review
  reviewId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type Reward = {
  id: string
  points: number

  // relationship
  coupons?: Coupon[]

  createdAt: string | Date
  updatedAt: string | Date
}


export type AccessLog = {
  id: string
  browser: string
  ip: string
  platform: string
  date: string | Date

  // relationship
  user?: User
  userId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type Order = {
  id: string

  // relationship
  userId?: string
  user?: User
  // orderItems?: OrderItem[]
  status?: OrderStatus

  createdAt: string | Date
  updatedAt: string | Date
}


export type User = {
  id: string
  name: string
  email: string
  password: string
  username: string
  role: Role
  image: string
  coverImage: string
  verified: boolean
  provider: UserProvider
  verificationCode?: string

  // relationship
  review?: Review
  reviewId?: string
  createdProducts?: Product[]
  reviews?: Review
  accessLogs?: AccessLog[]
  addresses?: Address[]
  order?: Order[]

  createdAt: string | Date
  updatedAt: string | Date
}


export type ProductSpecification = {
  id: string
  name: string
  value: string

  // relationship
  product?: Product
  productId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type ProductRecommendations = {
  id: string
  images: string[]
  totalPrice: number
  description: string

  // relationship
  product?: Product
  productId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type ProductSet = {
  id: string
  images: string[]
  totalPrice: number
  description: string

  // relationship (MM)
  products?: {
    productId: string
    productSetId: string
    product: Product
  }[]

  createdAt: string | Date
  updatedAt: string | Date
}


export type Product = {
  id: string
  title: string
  price: number
  images: string[]
  overview: string
  instockStatus: ProductStockStatus
  description: string
  dealerPrice: number
  marketPrice: number
  status: ProductStatus
  priceUnit: PriceUnit
  quantity: number
  itemCode?: string
  discount: number


  // relationship
  brandId?: string
  brand?: Brand
  specification?: ProductSpecification[]
  coupons: Coupon[]
  creator?: User
  creatorId?: string

  // relationship (MM)
  categories?: {
    productId: string
    categoryId: string
    category: Category
  }[]
  salesCategory?: {
    id: string
    productId: string
    discount: number
    salesCategoryId: string
    salesCategory: SalesCategory
  }[]
  availableSets?: {
    productId: string
    productSetId: string
    productSet: ProductSet
  }[]

  _count: {
    specification: number
    categories: number
    likedUsers: number
    orders: number
    salesCategory: number
    reviews: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type Brand = {
  id: string,
  name: string

  // relationship
  products?: Product[]

  _count: {
    products: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type Exchange = {
  id: string,
  from: PriceUnit
  to: PriceUnit
  rate: number
  date: Date | string

  createdAt: string | Date
  updatedAt: string | Date
}


export type SalesCategory = {
  id: string,
  name: string
  startDate: string | Date
  endDate: string | Date
  isActive: boolean
  description?: string

  // relationship (MM)
  products?: {
    productId: string
    salesCategoryId: string
    product: Product
  }[]

  _count: {
    products: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type Category = {
  id: string,
  name: string

  // relationship (MM)
  products?: {
    productId: string
    categoryId: string
    product: Product
  }[]

  _count: {
    products: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type CityFees = {
  id: string,
  city: string,
  fees: number, // float

  // relationship
  region?: Region,
  regionId?: string,
  
  createdAt: string | Date
  updatedAt: string | Date
}


export type Region = {
  id: string,
  name: string

  // relationship
  cities?: CityFees[]

  createdAt: string | Date
  updatedAt: string | Date
}


export type PermissionsResponse = {
  status: number,
  permissions: {
    createAllowedRoles: Role[],
    readAllowedRoles: Role[],
    updateAllowedRoles: Role[],
    deleteAllowedRoles: Role[]
  }
  label: string
}


export type Address = {
  id: string,
  isDefault: boolean
  name: string
  phone: string
  state: string
  township: string
  fullAddress: string

  // relationship
  userId?: string
  user?: User

  createdAt: string | Date
  updatedAt: string | Date
}

export type Review = {
  id: string,
  comment: string

  // relationship
  userId?: string
  user?: User
  productId?: string
  product?: Product

  createdAt: string | Date
  updatedAt: string | Date
}


// TODO: User profile
export type UserProfile = User & {
  order: Order[],
  favorites: Product[],
  addresses: Address[],
  reviews: Review[],
  _count: {
    favorites: number,
    order: number,
    createdProducts: number
    reviews: number,
    accessLogs: number,
    addresses: number
  }
}


export type Settings = {
  theme:
  | "light"
  | "dark",
  local:
  | "my"
  | "en"
}


export type HttpResponse = {
  status: number,
  error?: string | string[],
  message: string
}

export type HttpListResponse<T> = {
  status: number,
  results: Array<T>,
  count: number,
  error?: string | string[],
}


export type QueryOptionArgs = {
  queryKey: any
  signal: AbortSignal,
  meta: Record<string, unknown> | undefined
}
export type LoginResponse = Omit<HttpResponse, "message"> & { accessToken: string };

export type UserResponse = Omit<HttpResponse, "message"> & { user: User, redirectUrl: string | undefined };

export type UserProfileResponse = Omit<HttpResponse, "message"> & {
  user: UserProfile
};

export type CategoryResponse = Omit<HttpResponse, "message"> & { category: Category };

export type CouponResponse = Omit<HttpResponse, "message"> & { coupon: Coupon };

export type SalesCategoryResponse = Omit<HttpResponse, "message"> & { salesCategory: SalesCategory };

export type ProductResponse = Omit<HttpResponse, "message"> & { product: Product };

export type ProductSalesCategoriesResponse = { id: string, salesCategoryId: string,  productId: string, discount: number, salesCategory: SalesCategory };

export type BrandResponse = Omit<HttpResponse, "message"> & { brand: Brand };

export type CityResponse = Omit<HttpResponse, "message"> & { city: CityFees };

export type RegionResponse = Omit<HttpResponse, "message"> & { region: Region };

export type ExchangeResponse = Omit<HttpResponse, "message"> & { exchange: Exchange };
