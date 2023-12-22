from dataclasses import dataclass
from pathlib import Path
from typing import List
from secrets import token_hex

from libs.brand_parser import BrandParser
from libs.category_parser import CategoryParser
from libs.sales_catgory_parser import SalesCategoryParser
from libs.serializer import Serializer
from libs.specification_parser import SpecificationParser
from helpers.get_keys import Product, RawProduct


@dataclass(frozen=True)
class InstallFields:
    raw_path: Path

    def install(self, serializer: Serializer[List[RawProduct]]) -> List[Product]:
        raw = serializer.serialize(self.raw_path)

        result: List[Product] = []
        print(raw[0])

        for product in raw:
            brand = BrandParser().parse(product)
            categories = CategoryParser().parse(product)
            sales_categories = SalesCategoryParser().parse(product)
            specifications = SpecificationParser().parse(product)

            data = Product(
                id = token_hex(24 // 2),
                status = "Pending",
                title = product.get("title", "exportted product"),
                type = product.get("type", "").title(),
                price = product.get("price", 0),
                overview = product["overview"],
                features = product["features"],
                marketPrice = product.get("market_price", 0),
                categories = "\n".join(i["name"] for i in categories),
                priceUnit = product["price_unit"],
                images = "\n".join(product["image"]),
                warranty = 0,
                description = product["desc"],
                salesCategory = "\n".join(i["name"] for i in sales_categories),
                quantity = 1,
                specification = "\n".join(f"{i['name']}: {i['value']}" for i in specifications),
                discount = product["discount"],
                instockStatus = "AskForStock",
                dealerPrice = product.get("dealer_price", 0),
                colors = "\n".join(product["color"]),
                brandName = brand["name"]
            )

            result.append(data)

        return result
