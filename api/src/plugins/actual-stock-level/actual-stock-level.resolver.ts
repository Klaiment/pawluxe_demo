import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import {Ctx, ProductVariant, ProductVariantService, RequestContext} from "@vendure/core";

@Resolver(() => ProductVariant)
export class ActualStockLevelResolver {
    constructor(private productVariantService: ProductVariantService) {}

    @ResolveField()
    async actualStockLevel(
        @Ctx() ctx: RequestContext,
        @Parent() variant: ProductVariant,
    ): Promise<number> {
        return this.productVariantService.getSaleableStockLevel(ctx, variant);
    }
}
