"use client"

import { Separator } from "@/components/ui/separator"
import { CartItemComponent } from "./cart-item"
import type { CartItem } from "@/lib/types"

interface CartItemsListProps {
  items: CartItem[]
  removingItems: Set<string>
  onQuantityChange: (item: CartItem, newQuantity: number) => void
}

export const CartItemsList = ({ items, removingItems, onQuantityChange }: CartItemsListProps) => {
  console.log("CartItemsList - items:", items)
  console.log("CartItemsList - removingItems:", removingItems)

  return (
      <div className="bg-white rounded-lg border border-amber-100 overflow-hidden">
        <div className="p-6">
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-6">Produit</div>
            <div className="col-span-2 text-center">Prix</div>
            <div className="col-span-2 text-center">Quantité</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          <Separator className="mb-6" />

          {items.map((item, index) => {
            console.log(`CartItemsList - rendering item ${index}:`, item)
            return (
                <div key={item.id}>
                  <CartItemComponent
                      item={item}
                      isRemoving={removingItems.has(item.id)}
                      onQuantityChange={onQuantityChange}
                  />
                  {index !== items.length - 1 && <Separator className="my-6" />}
                </div>
            )
          })}
        </div>
      </div>
  )
}
