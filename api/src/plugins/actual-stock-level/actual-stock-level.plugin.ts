import { VendurePlugin, PluginCommonModule } from "@vendure/core";
import gql from "graphql-tag";
import { ActualStockLevelResolver } from "./actual-stock-level.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: gql`
      extend type ProductVariant {
        actualStockLevel: Int!
      }
    `,
    resolvers: [ActualStockLevelResolver],
  },
})
export class ActualStockLevelPlugin {}
