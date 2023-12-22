from typing import List, Dict, Literal, TypedDict

from libs.serializer import JSONSerializer, Path


"""
from: {'desc', 'image', 'dealer_price', 'price_unit', 'color', 'brand', 'specification', 'price', '_id', 'instock', 'market_price', 'updatedAt', 
       'discount_item', 'category', 'warranty', 'title', 'createdAt', 'discount', '__v', 'features', 'overview', 'display', 'type', 'sales_category'}
to: ['status', 'title', 'type', 'price', 'overview', 'features', 'marketPrice', 'categories', 'priceUnit', 'images', 'id', 'warranty', 'description', 
     'salesCategory', 'quantity', 'createdAt', 'specification', 'discount', 'instockStatus', 'dealerPrice', 'colors', 'updatedAt', 'brand', 'brandId']
"""
class RawProduct(TypedDict):
    desc: str
    image: List[str]
    dealer_price: int
    price_unit: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    color: List[str]
    brand: str
    specification: Dict
    price: int
    _id: Dict
    instock: str
    market_price: int
    discount_item: bool
    category: List[str]
    warranty: str
    title: str
    discount: int
    features: str
    overview: str
    display: bool  #  status
    type: str # product type
    sales_category: List[str]
    itemCode: List[str]  #  important


class Product(TypedDict):
    id: str
    status: Literal["Draft", "Pending", "Published"]
    title: str
    type: str
    price: float
    overview: str
    features: str
    marketPrice: float
    categories: str  # splitted by "\n"
    priceUnit: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    images: str  #  splitted by "\n"
    warranty: int  # by year
    description: str
    salesCategory: str  #  splitted by "\n"
    quantity: int
    specification: str  # splitted by "\n" and ": "
    discount: int
    instockStatus: Literal["InStock", "OutOfStock", "AskForStock"]
    dealerPrice: int
    colors: str
    brandName: str


def get_json_keys(path: Path) -> List:
    serializer = JSONSerializer[List[Dict]]()
    products = serializer.serialize(path)

    keys = []

    for product in products:
        for k, _ in product.items():
            keys.append(k)

    keys = set(keys)

    return list(keys)
