export const cartItemCount = (items) => items.reduce((total, item) => total + item.quantity, 0);
export const cartTotal = (items) => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

export function addCartItem(items, incoming) {
  const existing = items.find((item) => item.key === incoming.key);
  return existing
    ? items.map((item) => item.key === incoming.key ? { ...item, quantity: item.quantity + 1 } : item)
    : [...items, { ...incoming, quantity: 1 }];
}

export function changeCartQuantity(items, key, change) {
  return items
    .map((item) => item.key === key ? { ...item, quantity: item.quantity + change } : item)
    .filter((item) => item.quantity > 0);
}

export const removeCartItem = (items, key) => items.filter((item) => item.key !== key);

export function buildOrderMessage(items) {
  const formatMoney = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
  const lines = items.map((item) => {
    const detail = item.details ? `\n   ${item.details}` : '';
    return `• ${item.quantity}x ${item.name}${detail}\n   Unitário: ${formatMoney(item.unitPrice)} | Subtotal: ${formatMoney(item.unitPrice * item.quantity)}`;
  });
  return `Olá, Guizão! Quero fazer este pedido:\n\n${lines.join('\n\n')}\n\nTotal: ${formatMoney(cartTotal(items))}`;
}
