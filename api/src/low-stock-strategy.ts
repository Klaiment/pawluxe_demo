import {
  ProductVariant,
  RequestContext,
  StockDisplayStrategy,
} from "@vendure/core";

export class CustomStockDisplayStrategy implements StockDisplayStrategy {
  getStockLevel(
    ctx: RequestContext,
    productVariant: ProductVariant,
    saleableStockLevel: number,
  ): string | Promise<string> {
    const available = saleableStockLevel;

    if (available <= 0) {
      return "OUT_OF_STOCK";
    }
    if (available <= 10) {
      return "LOW_STOCK";
    }
    return "IN_STOCK";
  }
}
